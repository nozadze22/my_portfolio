import { useQuery } from "@tanstack/react-query";
import {
  getExperiences,
  type ExperienceListQuery,
} from "../api/experience";

export function useExperiences(query: ExperienceListQuery = {}) {
  return useQuery({
    queryKey: ["experience", query],
    queryFn: () => getExperiences(query),
  });
}