import { render, within } from "@testing-library/react";
import * as core from "@gff/core";
import AnnotationSummary from "./AnnotationSummary";

describe("<AnnotationSummary />", () => {
  test("Entity link should go to cases", () => {
    jest.spyOn(core, "useAnnotations").mockReturnValue({
      data: { list: [{ entity_type: "case", entity_id: "45" }], count: 2 },
    } as any);
    jest.spyOn(core, "useQuickSearch").mockReturnValue({
      data: { searchList: [{ id: btoa("Case:111") }] },
    } as any);
    const { getByRole } = render(<AnnotationSummary annotationId="2" />);

    expect(
      within(getByRole("row", { name: "Entity UUID 45" })).getByRole("link"),
    ).toHaveAttribute("href", "/cases/45");
  });

  test("Entity link should go to files", () => {
    jest.spyOn(core, "useAnnotations").mockReturnValue({
      data: {
        list: [{ entity_type: "aggregated_somatic_mutation", entity_id: "45" }],
        count: 2,
      },
    } as any);
    jest.spyOn(core, "useQuickSearch").mockReturnValue({
      data: { searchList: [{ id: btoa("File:111") }] },
    } as any);
    const { getByRole } = render(<AnnotationSummary annotationId="2" />);

    expect(
      within(getByRole("row", { name: "Entity UUID 45" })).getByRole("link"),
    ).toHaveAttribute("href", "/files/45");
  });

  test("Entity link should go to biospecimen browser", () => {
    jest.spyOn(core, "useAnnotations").mockReturnValue({
      data: {
        list: [{ entity_type: "slide", entity_id: "45", case_id: "390" }],
        count: 2,
      },
    } as any);
    jest.spyOn(core, "useQuickSearch").mockReturnValue({
      data: { searchList: [{ id: btoa("Case:111") }] },
    } as any);
    const { getByRole } = render(<AnnotationSummary annotationId="2" />);

    expect(
      within(getByRole("row", { name: "Entity UUID 45" })).getByRole("link"),
    ).toHaveAttribute("href", "/cases/390?bioId=45");
  });

  test("Entity is gone, no link should be displayed", () => {
    jest.spyOn(core, "useAnnotations").mockReturnValue({
      data: { list: [{ entity_type: "case", entity_id: "45" }], count: 2 },
    } as any);
    jest
      .spyOn(core, "useQuickSearch")
      .mockReturnValue({ data: { searchList: [] } } as any);
    const { getByRole } = render(<AnnotationSummary annotationId="2" />);

    expect(
      within(getByRole("row", { name: "Entity UUID 45" })).queryByRole("link"),
    ).toBeNull();
  });

  test("Annotation doesn't exist", () => {
    jest.spyOn(core, "useAnnotations").mockReturnValue({
      data: { list: [], count: 0 },
      isSuccess: true,
      isFetching: false,
    } as any);
    jest
      .spyOn(core, "useQuickSearch")
      .mockReturnValue({ data: { searchList: [] } } as any);

    const { getByText } = render(<AnnotationSummary annotationId="2" />);

    expect(getByText("Annotation Not Found")).toBeInTheDocument();
  });
});
