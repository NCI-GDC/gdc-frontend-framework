import { coreStore, userAuthChanged } from "@gff/core";
import { AppStore } from "./appApi";
import { fetchRepositoryFacetsGQL } from "./repositoryFacetSlice";
import { fetchRepositoryFacetContinuousAggregation } from "./repositoryRangeFacet";
import { fetchImageCounts } from "./slideCountSlice";

const imageCountsArg = {
  cohortFilters: { mode: "and", root: {} },
  repositoryFilters: { mode: "and", root: {} },
};

const slideImages = (doc_count: number) => ({
  data: {
    viewer: {
      repository: {
        files: {
          aggregations: {
            files__data_type: { buckets: [{ key: "Slide Image", doc_count }] },
          },
        },
      },
    },
  },
  errors: {},
});

describe("repository app store when the user changes", () => {
  test("clears fetched facets", () => {
    AppStore.dispatch(
      fetchRepositoryFacetsGQL.pending("facets", { field: "files.access" }),
    );
    AppStore.dispatch(
      fetchRepositoryFacetContinuousAggregation.pending("ranges", {
        field: "files.file_size",
        ranges: [],
      }),
    );

    coreStore.dispatch(userAuthChanged({ username: "alice" }));

    expect(AppStore.getState().facetBuckets).toEqual({});
    expect(AppStore.getState().facetRanges).toEqual({});
  });

  test("keeps the image count on screen while it is refetched", () => {
    AppStore.dispatch(fetchImageCounts.pending("before", imageCountsArg));
    AppStore.dispatch(
      fetchImageCounts.fulfilled(slideImages(12), "before", imageCountsArg),
    );

    coreStore.dispatch(userAuthChanged({ username: "alice" }));

    expect(AppStore.getState().images).toEqual({
      slidesCount: 12,
      status: "uninitialized",
    });
  });

  test("ignores an image count that was requested before the user changed", () => {
    AppStore.dispatch(fetchImageCounts.pending("before", imageCountsArg));
    coreStore.dispatch(userAuthChanged({ username: "bob" }));

    AppStore.dispatch(
      fetchImageCounts.fulfilled(slideImages(99), "before", imageCountsArg),
    );

    expect(AppStore.getState().images.status).toBe("uninitialized");
  });
});
