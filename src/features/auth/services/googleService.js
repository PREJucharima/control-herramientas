export async function fetchGoogleUserinfo(accessToken) {
  const r = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!r.ok) throw new Error(`userinfo failed (${r.status})`);
  return r.json();
}
