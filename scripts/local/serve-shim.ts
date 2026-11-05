// Local-only stand-in for Supabase's `serve`, so the edge function runs under plain Deno on :54321.
export function serve(handler: (req: Request) => Response | Promise<Response>) {
  return Deno.serve({ port: 54321, hostname: "127.0.0.1" }, handler);
}
