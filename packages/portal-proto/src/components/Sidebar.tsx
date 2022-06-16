import React, { PropsWithChildren, useState } from "react";
import { Button } from "@mantine/core";

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
    <>
      {showSidebar ? <Button onClick={() => closeSidebar()}>x</Button> : null}
      <div
        className={`top-0 left-0 w-[50vw] bg-blue-600  p-10 pr-20 text-white fixed h-full z-40  ease-in-out duration-300 ${
          showSidebar ? "translate-x-0 " : "-translate-x-full"
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default Sidebar;
