import React from "react";
import { Pagination } from "@mantine/core";

interface PageStepperProps {
  page: number;
  totalPages: number;
  handlePage: (page: number) => any;
}

const PageStepperMantine: React.FC<PageStepperProps> = ({
  page,
  totalPages,
  handlePage,
}: PageStepperProps) => {
  const pageChanged = (idx: number) => {
    handlePage(idx - 1);
  };

  return (
    <div className={`flex flex-row w-max m-auto`}>
      <Pagination
        color="accent"
        boundaries={0}
        total={totalPages}
        page={page + 1}
        siblings={2}
        onChange={pageChanged}
        size="sm"
        radius="xs"
        withEdges
        classNames={{ item: "border-0" }}
      />
    </div>
  );
};

export default PageStepperMantine;
