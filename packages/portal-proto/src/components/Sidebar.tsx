import React, { PropsWithChildren, useState } from "react";
import { Button } from "@mantine/core";
import { IoMdArrowRoundBack as BackIcon } from "react-icons/io";

interface SidebarProps {
  readonly showSidebar: boolean;
  readonly closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  showSidebar,
  closeSidebar,
  children,
}: PropsWithChildren<SidebarProps>) => {
  return (
    <div className="relative ">
      <div
        className={`top-10 left-0 w-3/4 !bg-white !border-2 !border-nci-gray-light" !shadow-md p-1 pr-1 absolute z-40  ease-in-out duration-300 ${
          showSidebar ? "translate-x-0 " : "-translate-x-full"
        }`}
      >
        <div className="flex flex-row bg-nci-blue-darkest nci-blue-darkest justify-end py-1 ">
          {" "}
          <Button
            className="bg-white hover:bg-nci-gray-light font-montserrat tracking-widest uppercase rounded-sm shadow-md p-1 px-2 mr-2 py-2"
            onClick={() => closeSidebar()}
          >
            <BackIcon className="text-nci-blue-darkest" size="1.5rem" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
