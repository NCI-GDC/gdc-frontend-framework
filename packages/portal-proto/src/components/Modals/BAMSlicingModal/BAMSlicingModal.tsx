import React from "react";
import { GdcFile, hideModal, Modals, useCoreDispatch } from "@gff/core";
import { Button, Text, Textarea } from "@mantine/core";
import { BaseModal } from "../BaseModal";
import { useForm } from "@mantine/form";
import download from "src/utils/download";
import { validateBamInput } from "./validate";

export const processBAMSliceInput = (
  userInput: string,
):
  | {
      regions: string[];
    }
  | {
      regions?: undefined;
    } => {
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
      coordinates: (value) => validateBamInput(value),
    },
  });

  const allowTab = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Tab") {
      event.preventDefault();

      if (event.target instanceof HTMLTextAreaElement) {
        const start = event.target.selectionStart;
        const end = event.target.selectionEnd;
        const oldValue = event.target.value;
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
      <div className="border-y border-y-base py-4 px-2">
        <Text size="lg" className="mb-2">
          File name: <Text className="inline font-medium">{file.fileName}</Text>
        </Text>
        <label htmlFor="textarea" className="text-sm">
          Please enter one or more slices&apos; genome coordinates below in one
          of the following formats:
        </label>

        <pre className="p-3 border-separate border-1 rounded bg-base-lighter text-primary-darkest mb-2 text-sm">
          chr7:140505783-140511649
          <br />
          {"chr7  140505783   140511649"}
        </pre>
        <label htmlFor="textarea" className="text-sm block">
          Note that the second example above is a tab-delimited format.
        </label>
        <label htmlFor="textarea" className="mb-2 text-sm">
          Alternatively, enter &quot;unmapped&quot; to retrieve unmapped reads
          on this file.
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
          className="!bg-primary hover:!bg-primary-darker"
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
                endpoint: `v0/slicing/view/${file.fileId}`,
                method: "POST",
                done: () => setActive(false),
                dispatch,
                queryParams,
                Modal400: Modals.BAMSlicingErrorModal,
                Modal403: Modals.NoAccessModal,
              });
            }

            dispatch(hideModal());
          }}
          className="!bg-primary hover:!bg-primary-darker"
        >
          Download
        </Button>
      </div>
    </BaseModal>
  );
};
