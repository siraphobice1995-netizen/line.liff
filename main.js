const LIFF_ID = "YOUR_LIFF_ID";                 // เอาจาก LINE Developers หลังเพิ่ม LIFF
const SHEET_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL"; // URL ของ Apps Script (Web App)
const ADD_FRIEND_URL = "https://line.me/R/ti/p/@YOUR_LINE_OA_ID"; // ลิงก์เพิ่มเพื่อน OA

async function run() {
  await liff.init({ liffId: LIFF_ID });

  if (!liff.isLoggedIn()) {
    liff.login({ scope: ["profile", "openid", "email"] });
    return;
  }

  const profile = await liff.getProfile();
  const idToken = liff.getDecodedIDToken();
  const data = {
    userId: profile.userId,
    displayName: profile.displayName,
    email: idToken?.email || "",
    consent: true,
    timestamp: new Date().toISOString(),
  };

  document.getElementById("out").textContent = JSON.stringify(data, null, 2);

  if (SHEET_URL) {
    await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }

  if (ADD_FRIEND_URL) {
    location.href = ADD_FRIEND_URL;
  }
}

run().catch(err => {
  document.getElementById("out").textContent = "Error: " + err?.message;
  console.error(err);
});
