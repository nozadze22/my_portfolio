import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getContactList, markContactRead, sendContact } from "../api/contact";
import { toast } from "sonner";
import type { SendContactInput } from "../schema/conatct.schema";
import type { ContactListQuery } from "../api/contact";

export function useSendContact() {
  return useMutation({
    mutationKey: ["sendContact"],
    mutationFn: (data: SendContactInput) => sendContact(data),
    onSuccess: () => {
      toast.success("Contact sent successfully");
    },
    onError: () => {
      toast.error("Failed to send contact");
    },
  });
}

export function useGetContactList(query: ContactListQuery = {}) {
  return useQuery({
    queryKey: ["contactList", query],
    queryFn: () => getContactList(query),
  });
}

export function useMarkContactRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["markContactRead"],
    mutationFn: (id: string) => markContactRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactList"] });
      toast.success("Marked as read");
    },
    onError: () => {
      toast.error("Could not update message");
    },
  });
}