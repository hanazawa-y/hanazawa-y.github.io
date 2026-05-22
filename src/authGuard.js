const baseUrl = import.meta.env?.BASE_URL ?? "/";
const authPage = new URL(
  `${baseUrl}auth.html`,
  window.location.origin
);
const currentUrl = new URL(window.location.href);

if (currentUrl.pathname !== authPage.pathname) {
  addAuthChromeStyles();
  document.documentElement.classList.add("auth-protected-pending");

  const overlay = document.createElement("div");
  overlay.className = "auth-checking";
  overlay.textContent = "認証状態を確認しています...";
  appendToBody(overlay);

  try {
    const { supabase } = await import("./supabaseClient.js");
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      redirectToAuth();
    } else {
      document.documentElement.classList.remove("auth-protected-pending");
      overlay.remove();
      addSignOutButton(supabase);
    }
  } catch (error) {
    console.error("Failed to check auth state.", error);
    redirectToAuth("1");
  }
}

function appendToBody(element) {
  if (document.body) {
    document.body.appendChild(element);
    return;
  }

  document.addEventListener(
    "DOMContentLoaded",
    () => {
      document.body.appendChild(element);
    },
    { once: true }
  );
}

function redirectToAuth(authError) {
  const destination = new URL(authPage.href);
  destination.searchParams.set(
    "redirect",
    currentUrl.pathname + currentUrl.search + currentUrl.hash
  );

  if (authError) {
    destination.searchParams.set("auth_error", authError);
  }

  window.location.replace(destination.href);
}

function addAuthChromeStyles() {
  if (document.getElementById("authChromeStyles")) {
    return;
  }

  const style = document.createElement("style");
  style.id = "authChromeStyles";
  style.textContent = `
    .auth-protected-pending body > :not(.auth-checking) {
      visibility: hidden;
    }

    .auth-checking {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: grid;
      place-items: center;
      background: #0f172a;
      color: #fff;
      font-family: sans-serif;
    }

    .auth-sign-out {
      position: fixed;
      right: 16px;
      bottom: 16px;
      z-index: 1000;
      padding: 10px 16px;
      border: 0;
      border-radius: 999px;
      color: #fff;
      background: rgba(15, 23, 42, 0.8);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);
}

function addSignOutButton(supabase) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "auth-sign-out";
  button.textContent = "ログアウト";
  button.addEventListener("click", async () => {
    await supabase.auth.signOut();
    window.location.assign(authPage.href);
  });

  appendToBody(button);
}
