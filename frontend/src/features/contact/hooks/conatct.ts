import { useMutation, useQuery } from "@tanstack/react-query";
import { getContactList, sendContact } from "../api/contact";
import { ContactSchema } from "../schema/conatct.schema";
import { toast } from "sonner";


export function useSendContact() {
    return useMutation({
       mutationKey: ["sendContact"],
       mutationFn: async (data: ContactSchema) => {
        const responce = await sendContact(data);
        return responce;
       },
       onSuccess: () => {
        toast.success("Contact sent successfully");
       },
       onError: () => {
        toast.error("Failed to send contact");
       },
    })
}


export function useGetContactList() {
    return useQuery({
        queryKey: ["contactList"],
        queryFn: async () => {
            const responce = await getContactList(1, 10);
            return responce;
        },
    })
}



