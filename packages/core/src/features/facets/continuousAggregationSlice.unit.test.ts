import { buildContinuousAggregationRangeOnlyQuery } from "./continuousAggregationSlice";

describe("continuous aggregation query tests", () => {
  test("should return default cases aggregations query with no alias", () => {
    const casesAggregations = buildContinuousAggregationRangeOnlyQuery(
      "cases.myCases",
      "cases",
      "explore",
      undefined,
    );
    const casesQueryString =
      /query\s+ContinuousAggregationQuery\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument,\s*\$filters2:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*explore\s*{\s*cases\s*{\s*aggregations\(case_filters:\s*\$caseFilters,\s*filters:\s*\$filters\)\s*{\s*cases__myCases\s*{\s*stats\s*{\s*Min\s*:\s*min\s*Max\s*:\s*max\s*Mean\s*:\s*avg\s*SD\s*:\s*std_deviation\s*count\s*}\s*range\(ranges:\s*\$filters2\)\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
    expect(casesAggregations).toMatch(casesQueryString);
  });
  test("should return repository cases aggregations query with no alias", () => {
    const casesRepoAggregations = buildContinuousAggregationRangeOnlyQuery(
      "cases.myCases",
      "cases",
      "repository",
      undefined,
    );
    const casesRepoQueryString =
      /query\s+ContinuousAggregationQuery\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument,\s*\$filters2:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*repository\s*{\s*cases\s*{\s*aggregations\(case_filters:\s*\$caseFilters,\s*filters:\s*\$filters\)\s*{\s*cases__myCases\s*{\s*stats\s*{\s*Min\s*:\s*min\s*Max\s*:\s*max\s*Mean\s*:\s*avg\s*SD\s*:\s*std_deviation\s*count\s*}\s*range\(ranges:\s*\$filters2\)\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
    expect(casesRepoAggregations).toMatch(casesRepoQueryString);
  });
  test("should return default files aggregations query with no alias", () => {
    const filesAggregations = buildContinuousAggregationRangeOnlyQuery(
      "files.myFiles",
      "files",
      "explore",
      undefined,
    );
    const filesQueryString =
      /query\s+ContinuousAggregationQuery\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument,\s*\$filters2:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*explore\s*{\s*files\s*{\s*aggregations\(case_filters:\s*\$caseFilters,\s*filters:\s*\$filters\)\s*{\s*files__myFiles\s*{\s*stats\s*{\s*Min\s*:\s*min\s*Max\s*:\s*max\s*Mean\s*:\s*avg\s*SD\s*:\s*std_deviation\s*count\s*}\s*range\(ranges:\s*\$filters2\)\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
    expect(filesAggregations).toMatch(filesQueryString);
  });
  test("should return repository files aggregations query with no alias", () => {
    const filesRepoAggregations = buildContinuousAggregationRangeOnlyQuery(
      "files.myFiles",
      "files",
      "repository",
      undefined,
    );
    const filesRepoQueryString =
      /query\s+ContinuousAggregationQuery\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument,\s*\$filters2:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*repository\s*{\s*files\s*{\s*aggregations\(case_filters:\s*\$caseFilters,\s*filters:\s*\$filters\)\s*{\s*files__myFiles\s*{\s*stats\s*{\s*Min\s*:\s*min\s*Max\s*:\s*max\s*Mean\s*:\s*avg\s*SD\s*:\s*std_deviation\s*count\s*}\s*range\(ranges:\s*\$filters2\)\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
    expect(filesRepoAggregations).toMatch(filesRepoQueryString);
  });
  test("should return default projects aggregations query with no alias", () => {
    const projectsAggregations = buildContinuousAggregationRangeOnlyQuery(
      "projects.myProjects",
      "projects",
      "explore",
      undefined,
    );
    const projectsQueryString =
      /query\s+ContinuousAggregationQuery\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument,\s*\$filters2:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*explore\s*{\s*projects\s*{\s*aggregations\(case_filters:\s*\$caseFilters,\s*filters:\s*\$filters\)\s*{\s*projects__myProjects\s*{\s*stats\s*{\s*Min\s*:\s*min\s*Max\s*:\s*max\s*Mean\s*:\s*avg\s*SD\s*:\s*std_deviation\s*count\s*}\s*range\(ranges:\s*\$filters2\)\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
    expect(projectsAggregations).toMatch(projectsQueryString);
  });
  test("should return repository projects aggregations query with no alias", () => {
    const projectsRepoAggregations = buildContinuousAggregationRangeOnlyQuery(
      "projects.myProjects",
      "projects",
      "repository",
      undefined,
    );
    const projectsRepoQueryString =
      /query\s+ContinuousAggregationQuery\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument,\s*\$filters2:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*repository\s*{\s*projects\s*{\s*aggregations\(case_filters:\s*\$caseFilters,\s*filters:\s*\$filters\)\s*{\s*projects__myProjects\s*{\s*stats\s*{\s*Min\s*:\s*min\s*Max\s*:\s*max\s*Mean\s*:\s*avg\s*SD\s*:\s*std_deviation\s*count\s*}\s*range\(ranges:\s*\$filters2\)\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
    expect(projectsRepoAggregations).toMatch(projectsRepoQueryString);
  });
  // with alias
  test("should return default cases aggregations query with alias", () => {
    const casesAliasAggregations = buildContinuousAggregationRangeOnlyQuery(
      "cases.myCases",
      "cases",
      "explore",
      "myCases1",
    );
    const casesAliasQueryString =
      /query\s+ContinuousAggregationQuery\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument,\s*\$filters2:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*explore\s*{\s*cases\s*{\s*aggregations\(case_filters:\s*\$caseFilters,\s*filters:\s*\$filters\)\s*{\s*myCases1\s*:\s*cases__myCases\s*{\s*stats\s*{\s*Min\s*:\s*min\s*Max\s*:\s*max\s*Mean\s*:\s*avg\s*SD\s*:\s*std_deviation\s*count\s*}\s*range\(ranges:\s*\$filters2\)\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
    expect(casesAliasAggregations).toMatch(casesAliasQueryString);
  });
  test("should return repository cases aggregations query with alias", () => {
    const casesAliasRepoAggregations = buildContinuousAggregationRangeOnlyQuery(
      "cases.myCases",
      "cases",
      "repository",
      "myCases2",
    );
    const casesAliasRepoQueryString =
      /query\s+ContinuousAggregationQuery\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument,\s*\$filters2:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*repository\s*{\s*cases\s*{\s*aggregations\(case_filters:\s*\$caseFilters,\s*filters:\s*\$filters\)\s*{\s*myCases2\s*:\s*cases__myCases\s*{\s*stats\s*{\s*Min\s*:\s*min\s*Max\s*:\s*max\s*Mean\s*:\s*avg\s*SD\s*:\s*std_deviation\s*count\s*}\s*range\(ranges:\s*\$filters2\)\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
    expect(casesAliasRepoAggregations).toMatch(casesAliasRepoQueryString);
  });
  test("should return default files aggregations query with alias", () => {
    const filesAliasAggregations = buildContinuousAggregationRangeOnlyQuery(
      "files.myFiles",
      "files",
      "explore",
      "myFiles1",
    );
    const filesAliasQueryString =
      /query\s+ContinuousAggregationQuery\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument,\s*\$filters2:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*explore\s*{\s*files\s*{\s*aggregations\(case_filters:\s*\$caseFilters,\s*filters:\s*\$filters\)\s*{\s*myFiles1\s*:\s*files__myFiles\s*{\s*stats\s*{\s*Min\s*:\s*min\s*Max\s*:\s*max\s*Mean\s*:\s*avg\s*SD\s*:\s*std_deviation\s*count\s*}\s*range\(ranges:\s*\$filters2\)\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
    expect(filesAliasAggregations).toMatch(filesAliasQueryString);
  });
  test("should return repository files aggregations query with alias", () => {
    const filesAliasRepoAggregations = buildContinuousAggregationRangeOnlyQuery(
      "files.myFiles",
      "files",
      "repository",
      "myFiles2",
    );
    const filesAliasRepoQueryString =
      /query\s+ContinuousAggregationQuery\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument,\s*\$filters2:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*repository\s*{\s*files\s*{\s*aggregations\(case_filters:\s*\$caseFilters,\s*filters:\s*\$filters\)\s*{\s*myFiles2\s*:\s*files__myFiles\s*{\s*stats\s*{\s*Min\s*:\s*min\s*Max\s*:\s*max\s*Mean\s*:\s*avg\s*SD\s*:\s*std_deviation\s*count\s*}\s*range\(ranges:\s*\$filters2\)\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
    expect(filesAliasRepoAggregations).toMatch(filesAliasRepoQueryString);
  });
  test("should return default projects aggregations query with alias", () => {
    const projectsAliasAggregations = buildContinuousAggregationRangeOnlyQuery(
      "projects.myProjects",
      "projects",
      "explore",
      "myProjects1",
    );
    const projectsAliasQueryString =
      /query\s+ContinuousAggregationQuery\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument,\s*\$filters2:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*explore\s*{\s*projects\s*{\s*aggregations\(case_filters:\s*\$caseFilters,\s*filters:\s*\$filters\)\s*{\s*myProjects1\s*:\s*projects__myProjects\s*{\s*stats\s*{\s*Min\s*:\s*min\s*Max\s*:\s*max\s*Mean\s*:\s*avg\s*SD\s*:\s*std_deviation\s*count\s*}\s*range\(ranges:\s*\$filters2\)\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
    expect(projectsAliasAggregations).toMatch(projectsAliasQueryString);
  });
  test("should return repository projects aggregations query with alias", () => {
    const projectsAliasRepoAggregations =
      buildContinuousAggregationRangeOnlyQuery(
        "projects.myProjects",
        "projects",
        "repository",
        "myProjects2",
      );
    const projectsAliasRepoQueryString =
      /query\s+ContinuousAggregationQuery\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument,\s*\$filters2:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*repository\s*{\s*projects\s*{\s*aggregations\(case_filters:\s*\$caseFilters,\s*filters:\s*\$filters\)\s*{\s*myProjects2\s*:\s*projects__myProjects\s*{\s*stats\s*{\s*Min\s*:\s*min\s*Max\s*:\s*max\s*Mean\s*:\s*avg\s*SD\s*:\s*std_deviation\s*count\s*}\s*range\(ranges:\s*\$filters2\)\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
    expect(projectsAliasRepoAggregations).toMatch(projectsAliasRepoQueryString);
  });
});
