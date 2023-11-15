import { Card, Divider, Grid, Stack } from "@mantine/core";
import { divider_style } from "./style";

import {
  MdAdd,
  MdAddCircle,
  MdApps,
  MdArrowDropDown,
  MdArrowForward,
  MdChevronRight,
  MdClose,
  MdDelete,
  MdDownload,
  MdEdit,
  MdExpandLess,
  MdExpandMore,
  MdFileDownload,
  MdFileUpload,
  MdFlip,
  MdLock,
  MdLockOpen,
  MdOutlineLogin,
  MdOutlineTour,
  MdRemoveCircle,
  MdRestartAlt,
  MdSave,
  MdSearch,
  MdSettings,
  MdShoppingCart,
  MdSortByAlpha,
  MdViewModule,
} from "react-icons/md";
import { FaCartPlus, FaEdit, FaFile, FaTable, FaUserCog } from "react-icons/fa";
import { BsFillTriangleFill, BsQuestionCircleFill } from "react-icons/bs";
import { SiMicrogenetics } from "react-icons/si";
import { BiLineChartDown } from "react-icons/bi";

const GDC_ICONS = [
  MdAdd,
  MdAddCircle,
  MdArrowDropDown,
  MdClose,
  MdChevronRight,
  MdExpandMore,
  MdRestartAlt,
  MdArrowForward,
  MdShoppingCart,
  MdDelete,
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
  <Grid.Col key={`icon_${x.name}_${idx}`} span={3}>
    <Card shadow="sm">
      <div className={"flex flex-col p-6 items-center"}>
        {x({ size: 32 })}
        <p className="text-sm text-primary-content mx-12"> {x.name}</p>
      </div>
    </Card>
  </Grid.Col>
);

const Icons = () => {
  return (
    <Stack className="prose font-montserrat text-primary-content-dark md:prose-md">
      <p className="prose font-medium text-2xl">Interface Icons</p>
      <Divider label="Interface Icons" classNames={divider_style} />
      <Grid>{GDC_ICONS.map((x, idx) => IconCard(x, idx))}</Grid>
    </Stack>
  );
};

export default Icons;
