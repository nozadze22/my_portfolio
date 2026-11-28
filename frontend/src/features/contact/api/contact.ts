import {
  type ContactMessage,
  type SendContactInput,
} from "../schema/conatct.schema";
import { contactListResponseSchema } from "../schema/contact-list.schema";
import { api } from "@/lib/api";

export type ContactListQuery = {
  page?: number;
  limit?: number;
};

export type ContactListResponse = {
  data: ContactMessage[];
  meta: {
    total: number;
    unread: number;
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

  const raw = await api<unknown>(`/contact/list?${params.toString()}`);
  return contactListResponseSchema.parse(raw);
}

export async function markContactRead(id: string) {
  return api<ContactMessage>(`/contact/${id}/read`, {
    method: "PATCH",
  });
}