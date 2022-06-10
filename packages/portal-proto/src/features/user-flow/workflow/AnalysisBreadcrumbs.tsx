import { useRouter } from "next/router";
import { MdArrowBack } from "react-icons/md";
import { Button } from "@mantine/core";
import { AppRegistrationEntry } from "./utils";

interface AnalysisBreadcrumbsProps {
  intermediateStep: string;
  currentApp: AppRegistrationEntry;
}

const AnalysisBreadcrumbs: React.FC<AnalysisBreadcrumbsProps> = ({
  currentApp,
}: AnalysisBreadcrumbsProps) => {
  const router = useRouter();
  return (
    <div className="w-full bg-nci-blue-darkest text-white p-2 ">
      <Button
        onClick={() => router.back()}
        className="bg-white text-nci-blue-darkest"
      >
        <MdArrowBack size={20} />
      </Button>
      {currentApp.name}
      &#8226;
    </div>
  );
};

export default AnalysisBreadcrumbs;
