import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  getProjectDetail,
  getProjects,
  updateProject,
} from "../api/projects";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "../schema/project_schema";
import type { ProjectListQuery } from "../schema/pagination.schema";
import { toast } from "sonner";

export function useGetProjects(query: ProjectListQuery = {}) {
  return useQuery({
    queryKey: ["projects", query],
    queryFn: () => getProjects(query),
  });
}

export function useGetProjectDetail(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectDetail(id),
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createProject"],
    mutationFn: (data: CreateProjectInput) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
    },
    onError: () => {
      toast.error("Failed to create project");
    },
  });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateProject", id],
    mutationFn: (data: UpdateProjectInput) => updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      toast.success("Project updated successfully");
    },
    onError: () => {
      toast.error("Failed to update project");
    },
  });
}

export function useDeleteProject(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteProject", id],
    mutationFn: () => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      toast.success("Project deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete project");
    },
  });
}