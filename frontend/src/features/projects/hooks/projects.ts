import { useMutation, useQuery } from "@tanstack/react-query";
import { createProject, deleteProject, getProjectDetail, getProjects, updateProject } from "../api/projects";
import { ProjectSchema } from "../schema/project_schema";
import { toast } from "sonner";


export function useGetProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const response = await getProjects({ data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } });
            return response;
        },
    });
}

export function useGetProjectDetail(id: string) {
    return useQuery({
        queryKey: ["project", id],
        queryFn: async () => {
            const response = await getProjectDetail(id);
            return response;
        },
    });
}

export function useCreateProject() {
    return useMutation({
        mutationKey: ["createProject"],
        mutationFn: async (data: ProjectSchema) => {
            const response = await createProject(data);
            return response;
        },
        onSuccess: () => {
            toast.success("Project created successfully");
        },
        onError: () => {
            toast.error("Failed to create project");
        },
    });

}

export function useUpdateProject(id: string) {
    return useMutation({
        mutationKey: ["updateProject", id],
        mutationFn: async (data: ProjectSchema) => {
            const response = await updateProject(id, data);
            return response;
        },
        onSuccess: () => {
            toast.success("Project updated successfully");
        },
        onError: () => {
            toast.error("Failed to update project");
        },
    });
}

export function useDeleteProject(id: string) {
    return useMutation({
        mutationKey: ["deleteProject", id],
        mutationFn: async () => {
            const response = await deleteProject(id);
            return response;
        },
        onSuccess: () => {
            toast.success("Project deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete project");
        },
    });
}