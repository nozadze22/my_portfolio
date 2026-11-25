
import { ContactSchema } from "../schema/conatct.schema";
import { api } from "@/lib/api";

export type paginationParams = {
    total: number;
    page: number;
    limit: number;
}

export type contactListResponse = {
    data: ContactSchema[];
    total: number;
    page: number;
    limit: number;
}

export type sendContactResponse = {
    message: string;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
}


export async function sendContact(data: ContactSchema) {
    const  response = api<sendContactResponse>("/contact/send", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response;
}
    
export async function getContactList(query: paginationParams) {
    try {
        const params = new URLSearchParams();
        params.set("page", query.page.toString());
        params.set("limit", query.limit.toString());
        const response = api<contactListResponse[]>("/contact/list", {
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