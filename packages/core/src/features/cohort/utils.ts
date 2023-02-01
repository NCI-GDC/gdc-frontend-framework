export const defaultCohortNameGenerator = (): string =>
  `Custom cohort ${new Date()
    .toLocaleString("en-CA", {
      timeZone: "America/Chicago",
      hour12: false,
    })
    .replace(",", "")}`;
