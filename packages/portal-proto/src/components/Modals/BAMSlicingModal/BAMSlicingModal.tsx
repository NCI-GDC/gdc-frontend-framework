import {
  fetchSlice,
  GdcFile,
  GDC_APP_API_AUTH,
  hideModal,
  Modals,
  showModal,
  useCoreDispatch,
} from "@gff/core";
import { Button, Text, Textarea } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { saveAs } from "file-saver";
import Cookies from "js-cookie";
import { assign, includes, isPlainObject, reduce, uniqueId } from "lodash";
import { useState } from "react";
import urlJoin from "url-join";
import { BAMSlicingErrorModal } from "./BAMSlicingErrorModal";
import { BaseModal } from "../BaseModal";
import { NoAccessModal } from "../NoAccessModal";
import download from "./download";

declare global {
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean;
  }
}

export const processBAMSliceInput = (userInput: string): Object => {
  if (userInput) {
    // console.log("userInput: ", userInput);
    const lines = userInput.split("\n").filter((v) => v.length);
    // console.log("lines: ", lines);
    return {
      regions: lines.map((line) => {
        const region = line.split("\t");
        if (region.length > 3) return; //TODO need to show some error validation
        // console.log("region: ", region);
        const regionTemplates = [
          (r) => `${r[0]}`,
          (r) => `${r[0]}:${r[1]}`,
          (r) => `${r[0]}:${r[1]}-${r[2]}`,
        ];
        // console.log("regionTemplates: ", regionTemplates);
        return regionTemplates[region.length - 1](region);
      }),
    };
  }
  return {};
};

const setPos = (element: any, caretPos: number): void => {
  // TODO: probablly need to change these - MIGHT BE OBSOLETE
  if (element.createTextRange) {
    const range = element.createTextRange();
    console.log("range:: ", range);
    range.move("character", caretPos);
    range.select();
  } else {
    element.focus();
    if (element.selectionStart !== undefined) {
      setTimeout(() => element.setSelectionRange(caretPos, caretPos));
    }
  }
};

const allowTab = (event: any, setValue) => {
  if (event.keyCode === 9) {
    event.preventDefault();
    console.log("tab");

    console.log("target: ", event.target);
    // current caret pos
    const start = event.target.selectionStart;
    const end = event.target.selectionEnd;
    const oldValue = event.target.value;
    console.log("start, end, oldValue: ", start, end, oldValue);
    console.log(
      "`${oldValue.substring(0, start)}\t${oldValue.substring(end)}`: ",
      `${oldValue.substring(0, start)}\t${oldValue.substring(end)}`,
    );
    setValue(`${oldValue.substring(0, start)}\t${oldValue.substring(end)}`);

    // put caret in correct place
    console.log("event.target, start + 1: ", event.target, start + 1);
    setPos(event.target, start + 1);
  }
};

export const BAMSlicingModal = ({
  openModal,
  file,
  setActive,
}: {
  openModal: boolean;
  file: GdcFile;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}): JSX.Element => {
  const dispatch = useCoreDispatch();
  const [coordinates, setCoordinates] = useState("");
  return (
    <BaseModal
      title={
        <Text size="xl" className="font-medium">
          BAM Slicing
        </Text>
      }
      size="60%"
      closeButtonLabel="Cancel"
      openModal={openModal}
    >
      <div className="border-y border-y-nci-gray py-4 px-2">
        <Text size="lg" className="mb-2">
          File name: <Text className="inline font-medium">{file.fileName}</Text>
        </Text>
        <label htmlFor="bed" className="text-sm">
          Please enter one or more slices' genome coordinates below in one of
          the following formats:
        </label>
        <pre className="p-3 border-separate border-1 rounded bg-nci-gray-lighter text-gdc-indigo-darkest mb-2 text-sm">
          chr7:140505783-140511649
          <br />
          {"chr1	140505783	140511649"}
        </pre>
        <label htmlFor="bed" className="mb-2 text-sm">
          Alternatively, enter "unmapped" to retrieve unmapped reads on this
          file.
        </label>
        <Textarea
          id="bed"
          required
          minRows={4}
          autosize
          //error={}
          className="m-0 p-0"
          style={{
            tabSize: 4,
            fontFamily: "'Courier New', Courier, monospace",
            width: "100%",
          }}
          value={coordinates}
          onKeyDown={(e) => allowTab(e, setCoordinates)}
          onChange={(e) => {
            setCoordinates(e.target.value);
          }}
        />
      </div>
      <div className="flex justify-end mt-2.5 gap-2">
        <Button
          onClick={() => dispatch(hideModal())}
          className="!bg-nci-blue hover:!bg-nci-blue-darker"
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            dispatch(hideModal());

            if (coordinates) {
              setActive(true);
              const params = {
                ...processBAMSliceInput(coordinates),
                attachment: true,
              };

              download({
                params,
                url: `slicing/view/${file.fileId}`,
                method: "POST",
                done: () => setActive(false),
                dispatch,
              });
            }
          }}
          className="!bg-nci-blue hover:!bg-nci-blue-darker"
        >
          Download
        </Button>
      </div>
    </BaseModal>
  );
};
