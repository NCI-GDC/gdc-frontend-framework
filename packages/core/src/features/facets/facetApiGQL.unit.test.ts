import {
  buildGraphGLBucketQuery,
  buildGraphGLBucketsQuery,
} from "./facetApiGQL";

describe("gql facet api", () => {
  describe("gql bucket query", () => {
    describe("single bucket queries", () => {
      test("should return projects facets query", () => {
        const projectsBuckets = buildGraphGLBucketQuery(
          "project.days",
          "projects",
          "explore",
          undefined,
        );
        const projectsQueryString =
          /query\s+QueryBucketCounts\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*projects\s*{\s*aggregations\(\s*case_filters:\s*\$caseFilters\s*filters:\$filters\s*aggregations_filter_themselves:\s*false\s*\)\s*{\s*project__days\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}/s;
        expect(projectsBuckets).toMatch(projectsQueryString);
      });
      test("should return projects facets query with alias", () => {
        const projectsBuckets = buildGraphGLBucketQuery(
          "project.days",
          "projects",
          "explore",
          "projectDay1",
        );
        const projectsAliasQueryString =
          /query\s+QueryBucketCounts\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*projects\s*{\s*aggregations\(\s*case_filters:\s*\$caseFilters\s*filters:\$filters\s*aggregations_filter_themselves:\s*false\s*\)\s*{\s*projectDay1 : project__days\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}/s;
        expect(projectsBuckets).toMatch(projectsAliasQueryString);
      });
      test("should return files facets query", () => {
        const filesBuckets = buildGraphGLBucketQuery(
          "files.file_name",
          "files",
          "explore",
          undefined,
        );
        const filesQueryString =
          /query\s+QueryBucketCounts\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*explore\s*{\s*files\s*{\s*aggregations\(\s*case_filters:\s*\$caseFilters\s*filters:\$filters\s*aggregations_filter_themselves:\s*false\s*\)\s*{\s*files__file_name\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
        expect(filesBuckets).toMatch(filesQueryString);
      });
      test("should return files facets query with alias", () => {
        const filesBuckets = buildGraphGLBucketQuery(
          "files.file_name",
          "files",
          "explore",
          "fileName1",
        );
        const filesAliasQueryString =
          /query\s+QueryBucketCounts\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*explore\s*{\s*files\s*{\s*aggregations\(\s*case_filters:\s*\$caseFilters\s*filters:\$filters\s*aggregations_filter_themselves:\s*false\s*\)\s*{\s*fileName1 : files__file_name\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
        expect(filesBuckets).toMatch(filesAliasQueryString);
      });
      test("should return cases facets query", () => {
        const casesBuckets = buildGraphGLBucketQuery(
          "cases.samples",
          "cases",
          "explore",
          undefined,
        );
        const casesQueryString =
          /query\s+QueryBucketCounts\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*explore\s*{\s*cases\s*{\s*aggregations\(\s*case_filters:\s*\$caseFilters\s*filters:\$filters\s*aggregations_filter_themselves:\s*false\s*\)\s*{\s*cases__samples\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
        expect(casesBuckets).toMatch(casesQueryString);
      });
      test("should return cases facets query with alias", () => {
        const casesBuckets = buildGraphGLBucketQuery(
          "cases.samples",
          "cases",
          "explore",
          "sample1",
        );
        const casesAliasQueryString =
          /query\s+QueryBucketCounts\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*explore\s*{\s*cases\s*{\s*aggregations\(\s*case_filters:\s*\$caseFilters\s*filters:\$filters\s*aggregations_filter_themselves:\s*false\s*\)\s*{\s*sample1 : cases__samples\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
        expect(casesBuckets).toMatch(casesAliasQueryString);
      });
      test("should return genes facets query", () => {
        const genesBuckets = buildGraphGLBucketQuery(
          "genes.my_genes",
          "genes",
          "explore",
          undefined,
        );
        const genesQueryString =
          /query\s+QueryBucketCounts\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*explore\s*{\s*genes\s*{\s*aggregations\(\s*case_filters:\s*\$caseFilters\s*filters:\$filters\s*aggregations_filter_themselves:\s*false\s*\)\s*{\s*genes__my_genes\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
        expect(genesBuckets).toMatch(genesQueryString);
      });
      test("should return genes facets query with alias", () => {
        const genesBuckets = buildGraphGLBucketQuery(
          "genes.my_genes",
          "genes",
          "explore",
          "gene1",
        );
        const genesQueryString =
          /query\s+QueryBucketCounts\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*explore\s*{\s*genes\s*{\s*aggregations\(\s*case_filters:\s*\$caseFilters\s*filters:\$filters\s*aggregations_filter_themselves:\s*false\s*\)\s*{\s*gene1 : genes__my_genes\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
        expect(genesBuckets).toMatch(genesQueryString);
      });
      test("should return ssms facets query", () => {
        const ssmsBuckets = buildGraphGLBucketQuery(
          "ssms.mutations",
          "ssms",
          "explore",
          undefined,
        );
        const ssmsQueryString =
          /query\s+QueryBucketCounts\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*explore\s*{\s*ssms\s*{\s*aggregations\(\s*case_filters:\s*\$caseFilters\s*filters:\$filters\s*aggregations_filter_themselves:\s*false\s*\)\s*{\s*ssms__mutations\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
        expect(ssmsBuckets).toMatch(ssmsQueryString);
      });
      test("should return ssms facets query with alias", () => {
        const ssmsBuckets = buildGraphGLBucketQuery(
          "ssms.mutations",
          "ssms",
          "explore",
          "mutation1",
        );
        const ssmsAliasQueryString =
          /query\s+QueryBucketCounts\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*explore\s*{\s*ssms\s*{\s*aggregations\(\s*case_filters:\s*\$caseFilters\s*filters:\$filters\s*aggregations_filter_themselves:\s*false\s*\)\s*{\s*mutation1 : ssms__mutations\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}\s*}/s;
        expect(ssmsBuckets).toMatch(ssmsAliasQueryString);
      });
    });
    describe("multi bucket queries", () => {
      // projects always uses case filters
      test("should return projects query with 2 facets w/o aliases", () => {
        const projects2Buckets = buildGraphGLBucketsQuery(
          [{ facetName: "project.summary" }, { facetName: "project.program" }],
          "projects",
          "explore",
          false,
        );
        const projects2QueryString =
          /query\s+QueryBucketCounts\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*projects\s*{\s*aggregations\(\s*case_filters:\s*\$caseFilters,\s*filters:\$filters,\s*aggregations_filter_themselves:\s*false\s*\)\s*{\s*project__summary\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*},\s*project__program\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}/s;
        expect(projects2Buckets).toMatch(projects2QueryString);
      });
      test("should return projects query with 2 facets w/ case filters w/o aliases", () => {
        const projects2Buckets = buildGraphGLBucketsQuery(
          [{ facetName: "project.summary" }, { facetName: "project.program" }],
          "projects",
          "explore",
          false,
        );
        const projects2CaseFilterQueryString =
          /query\s+QueryBucketCounts\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*projects\s*{\s*aggregations\(\s*case_filters:\s*\$caseFilters,\s*filters:\$filters,\s*aggregations_filter_themselves:\s*false\s*\)\s*{\s*project__summary\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*},\s*project__program\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}/s;
        expect(projects2Buckets).toMatch(projects2CaseFilterQueryString);
      });
      test("should return projects query with 2 facets w/o case filters w/ aliases", () => {
        const projects2Buckets = buildGraphGLBucketsQuery(
          [
            { facetName: "project.summary", alias: "projectSummary1" },
            { facetName: "project.program", alias: "projectProgram1" },
          ],
          "projects",
          "explore",
          false,
        );
        const projects2AliasQueryString =
          /query\s+QueryBucketCounts\(\s*\$filters:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*explore\s*{\s*projects\s*{\s*aggregations\(\s*filters:\$filters,\s*aggregations_filter_themselves:\s*false\s*\)\s*{\s*projectSummary1 : project__summary\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*},\s*projectProgram1 : project__program\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}/s;
        expect(projects2Buckets).toMatch(projects2AliasQueryString);
      });
      test("should return genes query with 2 facets w/o aliases", () => {
        const genes2Buckets = buildGraphGLBucketsQuery(
          [{ facetName: "genes.my_genes" }, { facetName: "genes.summary" }],
          "genes",
          "explore",
          false,
        );
        const genes2QueryString =
          /query\s+QueryBucketCounts\(\s*\$filters:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*explore\s*{\s*genes\s*{\s*aggregations\(\s*filters:\$filters,\s*aggregations_filter_themselves:\s*false\s*\)\s*{\s*genes__my_genes\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*},\s*genes__summary\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}/s;
        expect(genes2Buckets).toMatch(genes2QueryString);
      });
      test("should return genes query with 2 facets w/ case filters w/o aliases", () => {
        const genes2Buckets = buildGraphGLBucketsQuery(
          [{ facetName: "genes.my_genes" }, { facetName: "genes.summary" }],
          "genes",
          "explore",
          false,
        );
        const genes2CaseFilterQueryString =
          /query\s+QueryBucketCounts\(\s*\$caseFilters:\s*FiltersArgument,\s*\$filters:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*genes\s*{\s*aggregations\(\s*case_filters:\s*\$caseFilters,\s*filters:\$filters,\s*aggregations_filter_themselves:\s*false\s*\)\s*{\s*genes__my_genes\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*},\s*genes__summary\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}/s;
        expect(genes2Buckets).toMatch(genes2CaseFilterQueryString);
      });
      test("should return genes query with 2 facets w/o case filters w/ aliases", () => {
        const genes2Buckets = buildGraphGLBucketsQuery(
          [
            { facetName: "genes.Summary", alias: "genesSummary1" },
            { facetName: "genes.my_genes", alias: "genesMyGenes1" },
          ],
          "genes",
          "explore",
          false,
        );
        const genes2AliasQueryString =
          /query\s+QueryBucketCounts\(\s*\$filters:\s*FiltersArgument\)\s*{\s*viewer\s*{\s*explore\s*{\s*genes\s*{\s*aggregations\(\s*filters:\$filters,\s*aggregations_filter_themselves:\s*false\s*\)\s*{\s*genesMyGenes1 : genes__my_genes\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*},\s*genesSummary1 : genes__summary\s*{\s*buckets\s*{\s*doc_count\s*key\s*}\s*}\s*}\s*}\s*}\s*}/s;
        expect(genes2Buckets).toMatch(genes2AliasQueryString);
      });
    });
  });
});
