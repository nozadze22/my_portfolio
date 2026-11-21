
import { ContactSchema } from "../schema/conatct.schema";
import { api } from "@/lib/api";


export async function sendContact(data: ContactSchema) {
    const  response = api<ContactSchema>("/contact/send", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response;
}
    
export async function getContactList(page: number, limit: number) {
    try {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("limit", limit.toString());
        const response = api<ContactSchema[]>("/contact/list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response;
        
    } catch (error) {
        console.error(error);
        throw new Error("Failed to get contact list");
    }
}