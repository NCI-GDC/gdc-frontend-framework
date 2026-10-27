import { ContextBar } from "@/features/cohortBuilder/ContextBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GDC Analysis Center",
  openGraph: {
    title: "GDC Analysis Center",
  },
};

const AnalysisLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ContextBar />
      <main
        className="flex grow flex-col overflow-x-clip overflow-y-clip"
        id="main"
      >
        {children}
      </main>
    </>
  );
};

export default AnalysisLayout;
