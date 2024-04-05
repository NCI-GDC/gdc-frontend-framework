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

export const entityIconMapping: Record<QuickSearchEntities, any> = {
  case: UsersIcon,
  file: FilesIcon,
  project: ProjectsIcon,
  annotation: HiOutlinePencilSquare,
  gene_centric: GenesIcon,
  ssm_centric: MutationsIcon,

  Case: UsersIcon,
  File: FilesIcon,
  Project: ProjectsIcon,
  Annotation: HiOutlinePencilSquare,
  Gene: GenesIcon,
  Ssm: MutationsIcon,
};
