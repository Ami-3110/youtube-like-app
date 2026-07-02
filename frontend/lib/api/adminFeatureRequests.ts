// frontend/lib/api/adminFeatureRequests.ts

import { getCookie, getCsrfCookie } from "@/lib/api/auth";
import type {
  FeatureRequest,
  FeatureRequestStatus,
} from "@/lib/api/featureRequests";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type AdminFeatureRequest = FeatureRequest & {
  user: {
    id: number;
    name: string;
    handle: string | null;
  };
};

export type PaginatedAdminFeatureRequests =  {
  data: AdminFeatureRequest[];
  current_page: number;
  last_page: number;
};

export async function getAdminFeatureRequests(
  page = 1,
): Promise<PaginatedAdminFeatureRequests> {
  const res = await fetch(
    `${API_BASE_URL}/admin/feature-requests?page=${page}`,
    {
      headers: {
        Accept: "application/json",
      },

      credentials: "include",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch admin feature requests");
  }

  return res.json();
}

export async function updateAdminFeatureRequest(
  featureRequestId: number,
  data: {
    status: FeatureRequestStatus;
    admin_comment: string | null;
  },
) {
  await getCsrfCookie();

  const token = decodeURIComponent(getCookie("XSRF-TOKEN") ?? "");

  const res = await fetch(
    `${API_BASE_URL}/admin/feature-requests/${featureRequestId}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-XSRF-TOKEN": token,
      },
      credentials: "include",
      body: JSON.stringify(data),
    },
  );

  if (!res.ok) {
    throw new Error("Failed to update admin feature request");
  }

  return res.json();
}