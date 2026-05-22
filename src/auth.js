const form = document.getElementById("authForm");
const loginIdInput = document.getElementById("loginId");
const passwordInput = document.getElementById("password");
const signInButton = document.getElementById("signInButton");
const message = document.getElementById("authMessage");
let supabase;

const loginIdEmailDomain = "users.hanazawa-y.github.io";
const expectedLoginId = import.meta.env.VITE_LOGIN_ID?.trim().toLowerCase();
const loginSuccessId = import.meta.env.VITE_LOGIN_SUCCESS_ID?.trim().toLowerCase();
const params = new URLSearchParams(window.location.search);
const redirectTo = params.get("redirect") || "/";

await init();

async function init() {
  if (params.has("auth_error")) {
    setMessage("認証設定を確認できませんでした。管理者に連絡してください。", true);
  }

  try {
    ({ supabase } = await import("./supabaseClient.js"));
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      window.location.replace(redirectTo);
    }
  } catch (error) {
    console.error("Failed to load auth client.", error);
    setBusy(true);
    setMessage(
      "認証機能を読み込めませんでした。Supabase の環境変数とビルド設定を確認してください。",
      true
    );
  }
}

signInButton.addEventListener("click", () => {
  submitAuth();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  submitAuth();
});

async function submitAuth() {
  if (!supabase) {
    setMessage("認証機能の準備ができていません。", true);
    return;
  }

  const loginId = loginIdInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  if (!loginId || !password) {
    setMessage("ログインIDとパスワードを入力してください。", true);
    return;
  }

  if (!/^[a-z0-9._-]+$/.test(loginId)) {
    setMessage(
      "ログインIDは半角英数字、ドット、ハイフン、アンダースコアで入力してください。",
      true
    );
    return;
  }

  setBusy(true);
  setMessage("処理中です...", false);

  try {
    const response = await supabase.auth.signInWithPassword({
      email: getAuthEmail(loginId),
      password
    });

    if (response.error) {
      throw response.error;
    }

    window.location.assign(redirectTo);
  } catch (error) {
    setMessage(error.message || "認証に失敗しました。", true);
  } finally {
    setBusy(false);
  }
}

function setBusy(isBusy) {
  signInButton.disabled = isBusy;
}

function setMessage(text, isError) {
  message.textContent = text;
  message.classList.toggle("is-error", isError);
}

function getAuthEmail(loginId) {
  const authLoginId = getAuthLoginId(loginId);

  if (authLoginId.includes("@")) {
    return authLoginId;
  }

  return `${authLoginId}@${loginIdEmailDomain}`;
}

function getAuthLoginId(loginId) {
  if (!expectedLoginId && !loginSuccessId) {
    return loginId;
  }

  if (!expectedLoginId || !loginSuccessId) {
    throw new Error("ログインIDの設定が不足しています。");
  }

  if (loginId !== expectedLoginId) {
    throw new Error("ログインIDまたはパスワードが違います。");
  }

  return loginSuccessId;
}
