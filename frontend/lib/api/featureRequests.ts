// frontend/lib/api/comments.ts
import { getCookie, getCsrfCookie } from "@/lib/api/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type FeatureRequestStatus =
  | "pending"
  | "reviewing"
  | "done"
  | "rejected"
  | "withdrawn";

export type FeatureRequest = {
  id: number;
  user_id: number;
  title: string;
  body: string;
  status: FeatureRequestStatus;
  admin_comment: string | null;
  created_at: string;
  updated_at: string;
};

export async function getMyFeatureRequests(): Promise<FeatureRequest[]> {
  const res = await fetch(`${API_URL}/me/feature-requests`, {
    headers: {
      Accept: "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch feature requests");
  }

  return res.json();
}

export async function createFeatureRequest(data: {
  title: string;
  body: string;
}) {
  await getCsrfCookie();

  const token = decodeURIComponent(getCookie("XSRF-TOKEN") ?? "");

  const res = await fetch(`${API_URL}/feature-requests`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": token,
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create feature request");
  }

  return res.json();
}

export async function withdrawFeatureRequest(featureRequestId: number) {
  await getCsrfCookie();

  const token = decodeURIComponent(getCookie("XSRF-TOKEN") ?? "");

  const res = await fetch(
    `${API_URL}/feature-requests/${featureRequestId}/withdraw`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "X-XSRF-TOKEN": token,
      },
      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to withdraw feature request");
  }

  return res.json();
}