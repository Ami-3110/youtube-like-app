// frontend/lib/api/auth.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(";").shift()!);
  }

  return "";
}

export async function getCsrfCookie() {
  await fetch(`${BACKEND_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
}

export async function login(email: string, password: string) {
  await getCsrfCookie();

  const token = getCookie("XSRF-TOKEN");

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("ログインに失敗しました");
  }

  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/user`, {
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  });
  
  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function logout() {
  await getCsrfCookie();

  const token = getCookie("XSRF-TOKEN");

  const res = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("ログアウトに失敗しました");
  }
  
  return res.json();
}