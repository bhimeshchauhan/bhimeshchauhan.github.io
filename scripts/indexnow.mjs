// Tells Bing (and other IndexNow engines) about every URL in the live sitemap. Run after a deploy:  node scripts/indexnow.mjs
const HOST = "bhimeshchauhan.com";
const KEY = "d5dd60f59d3265768e27c37d066135e4"; // public by design: the same key is served at /<key>.txt for verification
const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList })
});
console.log(res.status, res.statusText, urlList.length + " urls"); // 200/202 = accepted
