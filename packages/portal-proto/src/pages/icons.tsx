import { NextPage } from "next";
import { SimpleLayout } from "../features/layout/Simple";
import { Card, Grid } from "@mantine/core";

import {
  MdAdd,
  MdArrowDropDown,
  MdChevronRight,
  MdExpandMore,
  MdArrowForward,
  MdShoppingCart,
  MdDelete,
  MdAddCircle,
  MdFlip,
  MdSave,
  MdRemoveCircle,
  MdLock,
  MdLockOpen,
  MdDownload,
  MdViewModule,
  MdOutlineTour,
  MdOutlineLogin,
  MdSortByAlpha,
  MdApps,
  MdFileUpload,
  MdFileDownload,
  MdExpandLess,
  MdSettings,
  MdSearch,
  MdClose,
  MdRestartAlt,
  MdEdit,
} from "react-icons/md";

import {
  FaUser,
  FaFile,
  FaEdit,
  FaTable,
  FaUserCog,
  FaCartPlus,
} from "react-icons/fa";
import { BsFillTriangleFill, BsQuestionCircleFill } from "react-icons/bs";

import { SiMicrogenetics } from "react-icons/si";
import { BiLineChartDown } from "react-icons/bi";

const GDC_ICONS = [
  MdAdd,
  MdArrowDropDown,
  MdClose,
  MdChevronRight,
  MdExpandMore,
  MdRestartAlt,
  MdArrowDropDown,
  MdArrowForward,
  MdShoppingCart,
  MdDelete,
  MdAddCircle,
  MdFlip,
  MdSave,
  MdRemoveCircle,
  MdLock,
  MdLockOpen,
  MdDownload,
  MdViewModule,
  MdOutlineTour,
  MdOutlineLogin,
  MdSortByAlpha,
  MdApps,
  MdFileUpload,
  MdFileDownload,
  MdExpandLess,
  MdSearch,
  MdClose,
  MdRestartAlt,
  MdSettings,
  MdEdit,
  FaFile,
  FaEdit,
  FaTable,
  FaUserCog,
  FaCartPlus,
  BsFillTriangleFill,
  BsQuestionCircleFill,
  SiMicrogenetics,
  BiLineChartDown,
];

const IconCard = (x, idx) => (
  <Grid.Col key={`icon_${x.name}_${idx}`} span={2}>
    <Card shadow="md">
      <div className={"flex flex-col p-2 items-center"}>
        {x({ size: 25 })}
        {x.name}
      </div>
    </Card>
  </Grid.Col>
);

const IconsPage: NextPage = () => {
  return (
    <SimpleLayout>
      <Grid>{GDC_ICONS.map((x, idx) => IconCard(x, idx))}</Grid>
    </SimpleLayout>
  );
};

export default IconsPage;
