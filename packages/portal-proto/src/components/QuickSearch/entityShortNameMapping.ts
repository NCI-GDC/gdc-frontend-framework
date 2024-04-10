import ProjectsIcon from "public/user-flow/icons/summary/projects.svg";
import UsersIcon from "public/user-flow/icons/summary/users.svg";
import FilesIcon from "public/user-flow/icons/summary/files.svg";
import GenesIcon from "public/user-flow/icons/summary/genes.svg";
import MutationsIcon from "public/user-flow/icons/summary/gene-mutation.svg";
import { HiOutlinePencilSquare } from "react-icons/hi2";

export type QuickSearchEntities =
  | "case"
  | "file"
  | "project"
  | "annotation"
  | "gene_centric"
  | "ssm_centric"
  | "Case"
  | "File"
  | "Project"
  | "Annotation"
  | "Gene"
  | "Ssm";

export const entityIconMapping: Record<
  QuickSearchEntities,
  { icon: any; category?: string }
> = {
  case: { icon: UsersIcon },
  file: { icon: FilesIcon },
  project: { icon: ProjectsIcon },
  annotation: { icon: HiOutlinePencilSquare },
  gene_centric: { icon: GenesIcon, category: "Gene" },
  ssm_centric: { icon: MutationsIcon, category: "Mutation" },

  Case: { icon: UsersIcon },
  File: { icon: FilesIcon },
  Project: { icon: ProjectsIcon },
  Annotation: { icon: HiOutlinePencilSquare },
  Gene: { icon: GenesIcon },
  Ssm: { icon: MutationsIcon, category: "Mutation" },
};
