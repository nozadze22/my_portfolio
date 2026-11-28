import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSkill,
  deleteSkill,
  getSkillOptions,
  getSkills,
  updateSkill,
} from "../api/skills";
import type {
  CreateSkillInput,
  UpdateSkillInput,
} from "../schema/skill.schema";
import type { SkillListQuery } from "../schema/list.schema";
import { toast } from "sonner";

export const SKILLS_ADMIN_PAGE_SIZE = 10;

/** For multi-select: grouped catalog by category */
export function useSkillOptions() {
  return useQuery({
    queryKey: ["skills", "options"],
    queryFn: getSkillOptions,
    staleTime: 60_000,
  });
}

export function useSkills(query: SkillListQuery = {}) {
  return useQuery({
    queryKey: ["skills", query],
    queryFn: () => getSkills(query),
  });
}

/** Admin list: first page + infinite scroll (10 per page). */
export function useInfiniteSkills(
  query: Omit<SkillListQuery, "page"> = {},
  pageSize = SKILLS_ADMIN_PAGE_SIZE,
) {
  return useInfiniteQuery({
    queryKey: ["skills", "infinite", { ...query, limit: pageSize }],
    queryFn: ({ pageParam }) =>
      getSkills({ ...query, page: pageParam, limit: pageSize }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.hasNextPage ? last.meta.page + 1 : undefined,
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSkillInput) => createSkill(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill created");
    },
    onError: () => toast.error("Failed to create skill"),
  });
}

export function useUpdateSkill(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSkillInput) => updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill updated");
    },
    onError: () => toast.error("Failed to update skill"),
  });
}

export function useUpdateSkillEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSkillInput }) =>
      updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill updated");
    },
    onError: () => toast.error("Failed to update skill"),
  });
}

export function useDeleteSkill(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill deleted");
    },
    onError: () => toast.error("Failed to delete skill"),
  });
}

/** List screens: pass id per call */
export function useDeleteSkillEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSkill(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast.success("Skill deleted");
    },
    onError: () => toast.error("Failed to delete skill"),
  });
}