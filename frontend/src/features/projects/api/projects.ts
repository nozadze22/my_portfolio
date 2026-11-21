
import { api } from "@/lib/api";
import { ProjectListSchema } from "../schema/pagination.schema";
import { ProjectSchema } from "../schema/project_schema";


export async function getProjects(query: ProjectListSchema) {
    try {
        const params = new URLSearchParams();
        params.set("page", query.meta.page.toString());
        params.set("limit", query.meta.limit.toString());
        const response = api<ProjectListSchema>(`/projects?${params.toString()}`);
        return response;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to get projects");
    }
}

export async function getProjectDetail(id: string) {
try {
    const response = api<ProjectSchema>(`/projects/${id}`);
    return response;
} catch (error) {
    console.error(error);
    throw new Error("Failed to get project detail");
}
}

export async function createProject(data: ProjectSchema) {
    try {
        const response = api<ProjectSchema>("/projects", {
            method: "PUT",
            body: JSON.stringify(data),
        });
        return response;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to create project");
    }
}

export async function updateProject(id: string, data: ProjectSchema) {
    try {
        const response = api<ProjectSchema>(`/projects/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
        return response;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to update project");
    }
}


export async function deleteProject(id: string) {
    try {
        const response = api<ProjectSchema>(`/projects/${id}`, {
            method: "DELETE",
        });
        return response;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to delete project");
    }
}