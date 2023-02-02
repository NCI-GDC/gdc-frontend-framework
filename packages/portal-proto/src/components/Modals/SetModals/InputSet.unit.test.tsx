import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as core from "@gff/core";
import InputSet from "./InputSet";
import { MantineProvider } from "@mantine/core";
import tailwindConfig from "tailwind.config";
import { UserInputContext } from "../GenericInputModal";

jest.spyOn(core, "useCoreDispatch").mockReturnValue(jest.fn());
jest.spyOn(core, "useCoreSelector").mockReturnValue(jest.fn());

describe("<InputSet />", () => {
  it("create set with matched ids", async () => {
    const createSet = jest.fn();
    const createSetHook = jest.fn().mockReturnValue([createSet, {}]);

    const { getByRole, getByPlaceholderText } = render(
      <MantineProvider
        theme={{
          colors: {
            ...(Object.fromEntries(
              Object.entries(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                tailwindConfig.plugins.slice(-1)[0].__options.defaultTheme
                  .extend.colors,
              ).map(([key, values]) => [key, Object.values(values)]),
            ) as any),
          },
        }}
      >
        <UserInputContext.Provider value={[false, jest.fn()]}>
          <InputSet
            inputInstructions="do stuff to have stuff happen"
            identifierToolTip="ids"
            textInputPlaceholder="ex. TCGA"
            setType="ssms"
            setTypeLabel="mutation"
            hooks={{
              query: jest.fn().mockReturnValue({
                data: [
                  { ssm_id: "7890-123", genomic_dna_change: "crg1:6" },
                  { ssm_id: "6013-009", genomic_dna_change: "crg7:0" },
                ],
                isSuccess: true,
              }),
              updateFilters: jest.fn(),
              createSet: createSetHook,
              getExistingFilters: jest.fn(),
            }}
            useAddNewFilterGroups={jest.fn().mockReturnValue(jest.fn())}
          />
          ,
        </UserInputContext.Provider>
      </MantineProvider>,
    );

    await userEvent.type(getByPlaceholderText("ex. TCGA"), "7890-123");
    await userEvent.click(getByRole("button", { name: "Save Set" }));
    await userEvent.type(getByPlaceholderText("New Set Name"), "my set");
    await userEvent.click(
      getByRole("button", { name: "Save button to add a set" }),
    );

    expect(createSet).toBeCalledWith({ values: ["7890-123"] });
  }, 10000);
});
