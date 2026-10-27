import Homepage from "@/features/homepage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GDC Data Portal Homepage",
  openGraph: {
    title: "GDC Data Portal Homepage",
  },
};

const Page = () => {
  return (
    <main
      className="flex grow flex-col overflow-x-clip overflow-y-clip"
      id="main"
    >
      <Homepage />
    </main>
  );
};

export default Page;
