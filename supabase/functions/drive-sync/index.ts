import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const DRIVE_FILES_URL = "https://www.googleapis.com/drive/v3/files";
const DRIVE_UPLOAD_URL = "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function getAccessToken(refreshToken: string): Promise<string> {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: Deno.env.get("GOOGLE_CLIENT_ID")!,
      client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET")!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Token exchange failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function ensureDriveFolder(accessToken: string, title: string): Promise<string> {
  const res = await fetch(DRIVE_FILES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: title,
      mimeType: "application/vnd.google-apps.folder",
    }),
  });
  const data = await res.json();
  if (!data.id) throw new Error(`Failed to create Drive folder: ${JSON.stringify(data)}`);
  return data.id;
}

async function uploadToDrive(
  accessToken: string,
  folderId: string,
  filename: string,
  imageBytes: Uint8Array,
): Promise<string> {
  const metadata = JSON.stringify({ name: filename, parents: [folderId] });
  const boundary = "photobooth_boundary";
  const body = [
    `--${boundary}\r\n`,
    `Content-Type: application/json; charset=UTF-8\r\n\r\n`,
    `${metadata}\r\n`,
    `--${boundary}\r\n`,
    `Content-Type: image/jpeg\r\n\r\n`,
  ].join("");

  const bodyBytes = new TextEncoder().encode(body);
  const footer = new TextEncoder().encode(`\r\n--${boundary}--`);
  const combined = new Uint8Array(bodyBytes.length + imageBytes.length + footer.length);
  combined.set(bodyBytes);
  combined.set(imageBytes, bodyBytes.length);
  combined.set(footer, bodyBytes.length + imageBytes.length);

  const res = await fetch(DRIVE_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`,
    },
    body: combined,
  });
  const data = await res.json();
  if (!data.id) throw new Error(`Drive upload failed: ${JSON.stringify(data)}`);
  return data.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const payload = await req.json();
    // Database webhook sends { type, table, record, old_record, schema }
    const photo = payload.record;
    if (!photo?.id) {
      return new Response("no record", { status: 200, headers: corsHeaders });
    }

    // Get event + owner
    const { data: event } = await supabase
      .from("events")
      .select("id, owner_id, title, drive_folder_id, created_at")
      .eq("id", photo.event_id)
      .single();

    if (!event) throw new Error("Event not found");

    // Get owner's Drive refresh token
    const { data: tokenRow } = await supabase
      .from("user_drive_tokens")
      .select("refresh_token")
      .eq("user_id", event.owner_id)
      .single();

    if (!tokenRow?.refresh_token) {
      console.warn("No Drive token for user", event.owner_id);
      return new Response("no drive token", { status: 200, headers: corsHeaders });
    }

    const accessToken = await getAccessToken(tokenRow.refresh_token);

    // Lazily create folder on first upload
    let folderId = event.drive_folder_id;
    if (!folderId) {
      const date = new Date(event.created_at).toISOString().slice(0, 16).replace("T", " ");
      folderId = await ensureDriveFolder(accessToken, `Event Photos — ${date}`);
      await supabase.from("events").update({ drive_folder_id: folderId }).eq("id", event.id);
    }

    // Download photo from Supabase Storage
    const { data: fileData } = await supabase.storage
      .from("photobooth")
      .download(photo.storage_path);

    if (!fileData) throw new Error("Could not download photo from storage");

    const imageBytes = new Uint8Array(await fileData.arrayBuffer());
    const filename = photo.storage_path.split("/").pop() ?? `${photo.id}.jpg`;

    const driveFileId = await uploadToDrive(accessToken, folderId, filename, imageBytes);

    // Mark photo as synced
    await supabase
      .from("photos")
      .update({ drive_file_id: driveFileId, drive_synced_at: new Date().toISOString() })
      .eq("id", photo.id);

    return new Response(JSON.stringify({ ok: true, drive_file_id: driveFileId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("drive-sync error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
