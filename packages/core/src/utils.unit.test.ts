import { fieldNameToTitle } from "./utils";

describe("fieldNameToTitle", () => {
  test("should return the name of the field", () => {
    const name = fieldNameToTitle("analysis.input_files.experimental_strategy");
    expect(name).toEqual("Experimental Strategy");
  });

  test("should return two parts of the field", () => {
    const name = fieldNameToTitle(
      "analysis.input_files.experimental_strategy",
      2,
    );
    expect(name).toEqual("Input Files Experimental Strategy");
  });

  test("should return a Project special case", () => {
    const name = fieldNameToTitle("cases.project.project_id");
    expect(name).toEqual("Project");
  });

  test("should return Analysis", () => {
    const name = fieldNameToTitle("analysis", 2);
    expect(name).toEqual("Analysis");
  });

  test("should use capitalization exceptions", () => {
    const name = fieldNameToTitle(
      "samples.portions.analytes.dna_integrity_number",
    );
    expect(name).toEqual("DNA Integrity Number");
  });

  test("should not capitalize prepositions", () => {
    const name = fieldNameToTitle("demographic.cause_of_death");
    expect(name).toEqual("Cause of Death");
  });
});
