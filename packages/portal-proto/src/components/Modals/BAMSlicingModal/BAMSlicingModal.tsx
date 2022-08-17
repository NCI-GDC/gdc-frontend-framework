import {
  fetchSlice,
  GdcFile,
  GDC_APP_API_AUTH,
  hideModal,
  useCoreDispatch,
} from "@gff/core";
import { Button, Text, Textarea } from "@mantine/core";
import saveAs from "file-saver";
import { useState } from "react";
import urlJoin from "url-join";
import { BaseModal } from "../BaseModal";
import download from "./utils";

export const processBAMSliceInput = (userInput: string): Object => {
  if (userInput) {
    const lines = userInput.split("\n").filter((v) => v.length);
    return {
      regions: lines.map((line) => {
        const region = line.split("\t");
        const regionTemplates = [
          (r) => `${r[0]}`,
          (r) => `${r[0]}:${r[1]}`,
          (r) => `${r[0]}:${r[1]}-${r[2]}`,
        ];
        return regionTemplates[region.length - 1](region);
      }),
    };
  }
  return {};
};

const setPos = (element: any, caretPos: number): void => {
  if (element.createTextRange) {
    const range = element.createTextRange();
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

    // current caret pos
    const start = event.target.selectionStart;
    const end = event.target.selectionEnd;
    const oldValue = event.target.value;
    setValue(`${oldValue.substring(0, start)}\t${oldValue.substring(end)}`);

    // put caret in correct place
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
        <label htmlFor="bed">
          Please enter one or more slices' genome coordinates below in one of
          the following formats:
        </label>
        <pre className="p-3 border-separate border-1 rounded bg-nci-gray-lighter text-gdc-indigo-darkest mb-2">
          chr7:140505783-140511649
          <br />
          {"chr1	150505782	150511648"}
        </pre>
        <label htmlFor="bed" className="mb-2">
          Alternatively, enter "unmapped" to retrieve unmapped reads on this
          file.
        </label>
        <textarea
          id="bed"
          // required
          //minRows={4}
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
            if (coordinates) {
              const params = {
                ...processBAMSliceInput(coordinates),
                attachment: true,
              };

              setActive(true);
              download({
                params,
                url: urlJoin(GDC_APP_API_AUTH, `slicing/view/${file.fileId}`),
                method: "POST",
              })(
                (value) => {
                  console.log(value);
                },
                () => {
                  console.log("reached here");
                  return setActive(false);
                },
              );
            }
            dispatch(hideModal());
          }}
          className="!bg-nci-blue hover:!bg-nci-blue-darker"
        >
          Download
        </Button>
      </div>
    </BaseModal>
  );
};
