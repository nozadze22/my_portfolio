import {
  type ContactMessage,
  type SendContactInput,
} from "../schema/conatct.schema";
import { api } from "@/lib/api";

export type ContactListQuery = {
  page?: number;
  limit?: number;
};

export type ContactListResponse = {
  data: ContactMessage[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};

export async function sendContact(data: SendContactInput) {
  return api<ContactMessage>("/contact/send", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getContactList(query: ContactListQuery = {}) {
  const params = new URLSearchParams();
  params.set("page", String(query.page ?? 1));
  params.set("limit", String(query.limit ?? 10));

  return api<ContactListResponse>(`/contact/list?${params.toString()}`);
}