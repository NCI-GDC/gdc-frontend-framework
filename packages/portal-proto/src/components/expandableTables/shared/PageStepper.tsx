import React from "react";
import { Pagination } from "@mantine/core";

interface PageStepperProps {
  page: number;
  totalPages: number;
  handlePage: (page: number) => any;
}

const PageStepper: React.FC<PageStepperProps> = ({
  page,
  totalPages,
  handlePage,
}: PageStepperProps) => {
  const pageChanged = (idx: number) => {
    handlePage(idx - 1);
  };

  return (
    <Pagination
      color="accent.5"
      boundaries={0}
      total={totalPages}
      page={page + 1}
      siblings={2}
      onChange={pageChanged}
      size="sm"
      radius="xs"
      withEdges
      classNames={{ item: "border-0" }}
      getItemAriaLabel={(page) => {
        switch (page) {
          case "prev":
            return "previous page button";
          case "next":
            return "next page button";
          case "first":
            return "first page button";
          case "last":
            return "last page button";
          default:
            return `${page} page button`;
        }
      }}
    />
  );
};

export default PageStepper;
