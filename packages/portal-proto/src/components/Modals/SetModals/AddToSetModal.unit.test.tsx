import { render } from "@testing-library/react";
import * as core from "@gff/core";
import AddToSetModal from "./AddToSetModal";

jest.spyOn(core, "useCoreDispatch").mockReturnValue(jest.fn());
jest.spyOn(core, "useCoreSelector").mockReturnValue(jest.fn());

describe("<AddToSetModal />", () => {
  it("shows 'only top X will be added to set' warning", () => {
    const { getByText } = render(
      <AddToSetModal
        filters={undefined}
        setType="genes"
        addToCount={40000}
        setTypeLabel="gene"
        field="genes.gene_id"
        closeModal={jest.fn()}
        appendSetHook={jest
          .fn()
          .mockImplementation(() => [
            jest.fn(),
            { isSuccess: false, isError: false, data: "" },
          ])}
        countHook={jest
          .fn()
          .mockImplementation(() => ({ data: 35000, isSuccess: true }))}
      />,
    );

    expect(
      getByText(
        "The set cannot exceed 50,000 genes. Only the top 15,000 will be added",
      ),
    ).toBeInTheDocument();
  });
});
