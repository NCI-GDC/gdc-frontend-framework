import React from "react";
import { Select } from "@mantine/core";
import { PageSizeProps } from "@/components/expandableTables/shared/types";

export const PageSizeMantine: React.FC<PageSizeProps> = ({
  pageSize,
  handlePageSize,
}: PageSizeProps) => {
  return (
    <div className="flex flex-row items-center text-content justify-start mb-1">
      <Select
        size="sm"
        radius="md"
        onChange={(value: string) => handlePageSize(parseInt(value))}
        value={pageSize?.toString()}
        data={[
          { value: "10", label: "10" },
          { value: "20", label: "20" },
          { value: "40", label: "40" },
          { value: "100", label: "100" },
        ]}
        classNames={{
          root: "w-20 ",
        }}
      />
    </div>
  );
};
