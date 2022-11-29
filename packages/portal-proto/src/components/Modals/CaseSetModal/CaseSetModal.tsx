import React, { useState } from "react";
import { Tabs, Textarea, FileInput, Button, Modal } from "@mantine/core";
import { RiFile3Fill as FileIcon } from "react-icons/ri";
import { MdInfo as InfoIcon } from "react-icons/md";
import { hideModal, useCoreDispatch } from "@gff/core";
import FunctionButton from "@/components/FunctionButton";
import DarkFunctionButton from "@/components/StyledComponents/DarkFunctionButton";

interface CaseSetModalProps {
  readonly title: string;
}

const CaseSetModal = ({ title }) => {
  const [file, setFile] = useState<File | null>(null);
  const dispatch = useCoreDispatch();

  return (
    <Modal
      opened
      onClose={() => dispatch(hideModal())}
      size="xl"
      withinPortal={false}
      classNames={{
        modal: "p-0",
        close: "mt-2 mr-4",
      }}
    >
      <Tabs defaultValue="upload">
        <Tabs.List>
          <Tabs.Tab value="upload">Enter Mutations</Tabs.Tab>
          <Tabs.Tab value="saved">Saved Sets</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="upload" className="p-4">
          <p>instruction placeholder</p>
          <Textarea
            label={
              <div className="flex items-center justify-between w-full">
                <b>Type or copy-and-paste a list of mutation identifiers</b>
                <InfoIcon size={16} className="text-primary-darkest" />
              </div>
            }
            minRows={5}
            classNames={{ label: "w-full" }}
          />
          <FileInput
            value={file}
            onChange={setFile}
            icon={file !== null ? <FileIcon /> : undefined}
            label={<b>Or choose a file to upload</b>}
            rightSection={
              <DarkFunctionButton size="xs">Browse</DarkFunctionButton>
            }
            rightSectionWidth={80}
            className="mt-2"
          ></FileInput>
        </Tabs.Panel>
        <Tabs.Panel value="saved" className="p-4">
          {"saved"}
        </Tabs.Panel>
      </Tabs>
      <div className="bg-base-lightest flex p-4 gap-4 justify-end mt-4 rounded-b-lg">
        <DarkFunctionButton className={"mr-auto"}>Save Set</DarkFunctionButton>
        <FunctionButton>Cancel</FunctionButton>
        <DarkFunctionButton>Clear</DarkFunctionButton>
        <DarkFunctionButton>Submit</DarkFunctionButton>
      </div>
    </Modal>
  );
};

export default CaseSetModal;
