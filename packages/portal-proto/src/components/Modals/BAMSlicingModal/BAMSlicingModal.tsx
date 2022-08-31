import React from "react";
import { GdcFile, hideModal, useCoreDispatch } from "@gff/core";
import { Button, Text, Textarea } from "@mantine/core";
import { BaseModal } from "../BaseModal";
import { useForm } from "@mantine/form";
import download from "src/utils/download";

export const processBAMSliceInput = (userInput: string) => {
  if (userInput) {
    const lines = userInput.split("\n").filter((v) => v.length);
    return {
      regions: lines.map((line) => {
        const region = line.split("\t");
        if (region.length > 3) return null;
        const regionTemplates = [
          (r: string[]) => `${r[0]}`,
          (r: string[]) => `${r[0]}:${r[1]}`,
          (r: string[]) => `${r[0]}:${r[1]}-${r[2]}`,
        ];
        return regionTemplates[region.length - 1](region);
      }),
    };
  }
  return {};
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

  const {
    validate,
    values: { coordinates },
    getInputProps,
    setValues,
  } = useForm({
    initialValues: {
      coordinates: "",
    },

    validate: {
      coordinates: (value) => {
        if (!value)
          return "You have not entered any coordinates. Please try again.";
        const processedValue = processBAMSliceInput(value);
        if (!processedValue)
          return "You have entered invalid coordinates. Please try again.";

        // const reader = new FileReader()
        // reader.readAsText('./GRCh38.d1.vd1.seqlist')
        // const res = await fetch('./GRCh38.d1.vd1.seqlist')
        // const text = await res.text()
        // console.log(text)

        const flag = processedValue.regions.some((region) => {
          if (!region) return true;
          if (!/^[a-zA-Z0-9]+(:([0-9]+)?(-[0-9]+)?)?$/.test(region))
            return true;

          const splittedRegion = region.split(":");

          const referenceSequenceName = splittedRegion[0];
          const numVals =
            splittedRegion.length > 1 && splittedRegion[1].split("-");
          if (numVals.length > 2) return true;
          if (numVals.length === 2 && Number(numVals[0]) > Number(numVals[1]))
            return true;
        });

        if (flag)
          return "You have entered invalid coordinates. Please try again.";

        return null;
      },
    },
  });

  const allowTab = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Tab") {
      event.preventDefault();

      if (event.target instanceof HTMLTextAreaElement) {
        const start = event.target.selectionStart;
        const end = event.target.selectionEnd;
        const oldValue = event.target.value;
        console.log(start, end, oldValue);
        setValues({
          coordinates: `${oldValue.substring(0, start)}\t${oldValue.substring(
            end,
          )}`,
        });
        event.target.selectionStart = start + 1;
      }
    }
  };

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
        <label htmlFor="textarea" className="mb-2 text-sm">
          Alternatively, enter "unmapped" to retrieve unmapped reads on this
          file.
        </label>
        <Textarea
          id="textarea"
          required
          minRows={4}
          autosize
          className="m-0 p-0"
          style={{
            tabSize: 4,
            fontFamily: "'Courier New', Courier, monospace",
            width: "100%",
          }}
          onKeyDown={(e) => allowTab(e)}
          {...getInputProps("coordinates")}
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
            if (validate().hasErrors) {
              return;
            }

            if (coordinates) {
              setActive(true);
              const processedInput = processBAMSliceInput(coordinates);
              const params = {
                ...processedInput,
                attachment: true,
              };

              const queryParams =
                processedInput.regions.length > 1 &&
                processedInput.regions
                  .map((key) => `region` + "=" + key)
                  .join("&");

              download({
                params,
                endpoint: `slicing/view/${file.fileId}`,
                method: "POST",
                done: () => setActive(false),
                dispatch,
                queryParams,
              });
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
