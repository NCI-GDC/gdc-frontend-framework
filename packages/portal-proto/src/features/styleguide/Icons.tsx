
import { Divider, Card, Grid, Stack} from "@mantine/core";

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
  <Grid.Col key={`icon_${x.name}_${idx}`} span={2}>
    <Card shadow="md">
      <div className={"flex flex-col p-2 items-center"}>
        {x({ size: 25 })}
        {x.name}
      </div>
    </Card>
  </Grid.Col>
);

const Icons = () => {
  return (
    <Stack>
      <p className="prose font-montserrat text-xl text-nci-gray-darker">Analysis Tool Icons</p>
      <Divider />
      <p className="prose font-montserrat text-xl text-nci-gray-darker">Interface Icons</p>
      <Divider />
      <Grid>{GDC_ICONS.map((x, idx) => IconCard(x, idx))}</Grid>
    </Stack>
  );
};

export default Icons;
