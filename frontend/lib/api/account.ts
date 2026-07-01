// frontend/lib/api/account.ts
import { getCookie, getCsrfCookie } from "@/lib/api/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function updateEmail(email: string) {
  await getCsrfCookie();

  const token = decodeURIComponent(getCookie("XSRF-TOKEN") ?? "");

  const res = await fetch(`${API_URL}/me/email`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    throw new Error("Failed to update email");
  }

  return res.json();
}

export async function updatePassword(
  currentPassword: string,
  password: string,
  passwordConfirmation: string,
) {
  await getCsrfCookie();

  const token = decodeURIComponent(getCookie("XSRF-TOKEN") ?? "");

  const res = await fetch(`${API_URL}/me/password`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
    body: JSON.stringify({
      current_password: currentPassword,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to update password");
  }

  return res.json();
}

export async function deleteAccount() {
  await getCsrfCookie();

  const token = decodeURIComponent(getCookie("XSRF-TOKEN") ?? "");

  const res = await fetch(`${API_URL}/me/account`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to delete account");
  }

  return res.json();
}