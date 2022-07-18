import { useContext, useEffect } from "react";
import Link from "next/link";
import {
  useCaseSummary,
  useCoreDispatch,
  useCoreSelector,
  selectCart,
} from "@gff/core";
import { SummaryCard } from "@/components/Summary/SummaryCard";
import SummaryCount from "@/components/Summary/SummaryCount";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import { Button, LoadingOverlay, Tooltip } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import {
  FaFile,
  FaMicroscope,
  FaShoppingCart,
  FaEdit,
  FaTable,
} from "react-icons/fa";
import { URLContext } from "src/pages/_app";
import { Biospecimen } from "../biospecimen/Biospecimen";
import { humanify } from "../biospecimen/utils";
import { addToCart, removeFromCart } from "../cart/updateCart";
import { TempTable } from "../files/FileView";
import {
  formatDataForHorizontalTable,
  mapFilesFromCasesToCartFile,
} from "../files/utils";
import {
  allFilesInCart,
  calculatePercentage,
  sortByPropertyAsc,
} from "src/utils";

const getAnnotationsLinkParams = (
  annotations?: Array<{ annotation_id: string }>,
) => {
  if (!annotations) return null;

  if (annotations.length === 1) {
    return `https://portal.gdc.cancer.gov/annotations/${annotations[0].annotation_id}`;
  } else {
    return `https://portal.gdc.cancer.gov/annotations?field=annotations.annotation_id`;
  }
};

export const CaseSummary = ({
  case_id,
  bio_id,
}: {
  case_id: string;
  bio_id: string;
}): JSX.Element => {
  const { data, isFetching } = useCaseSummary({
    filters: {
      content: {
        field: "case_id",
        value: case_id,
      },
      op: "=",
    },
    fields: [
      "files.access",
      "files.acl",
      "files.data_type",
      "files.file_name",
      "files.file_size",
      "files.file_id",
      "files.state",
      "case_id",
      "submitter_id",
      "project.name",
      "disease_type",
      "project.project_id",
      "primary_site",
      "project.program.name",
      "summary.file_count",
      "summary.data_categories.file_count",
      "summary.data_categories.data_category",
      "summary.experimental_strategies.experimental_strategy",
      "summary.experimental_strategies.file_count",
      "annotations.annotation_id",
    ],
  });

  const { prevPath } = useContext(URLContext);
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  useEffect(() => {
    if (
      ["MultipleImageViewerPage", "selectedId"].every((term) =>
        prevPath?.includes(term),
      )
    ) {
      scrollIntoView();
    }
  }, [prevPath, scrollIntoView]);

  const getSlideCountFromCaseSummary = (
    experimental_strategies: Array<{
      experimental_strategy: string;
      file_count: number;
    }>,
  ): number => {
    const slideTypes = ["Diagnostic Slide", "Tissue Slide"];
    return (experimental_strategies || []).reduce(
      (slideCount, { file_count, experimental_strategy }) =>
        slideTypes.includes(experimental_strategy)
          ? slideCount + file_count
          : slideCount,
      0,
    );
  };

  const filesCountTotal = data?.files?.length ?? 0;
  const annotationsCountTotal = data?.annotations?.length ?? 0;
  const headerTitle = `${data?.project.project_id} / ${data?.submitter_id}`;

  const isAllFilesInCart = data?.files
    ? allFilesInCart(currentCart, mapFilesFromCasesToCartFile(data?.files))
    : false;

  const formatDataForCaseSummary = () => {
    const {
      case_id,
      submitter_id,
      project: {
        project_id,
        name: project_name,
        program: { name: program_name },
      },
      disease_type,
      primary_site,
      files,
      summary: { experimental_strategies },
    } = data;

    const slideCount = getSlideCountFromCaseSummary(experimental_strategies);

    const imageFiles = files?.filter(
      (file) => file.data_type === "Slide Image",
    );

    let caseSummaryObject: Record<string, any> = {
      case_uuid: case_id,
      case_id: submitter_id,
      project: (
        <Link href={`/projects/${project_id}`}>
          <a className="underline text-nci-blue"> {project_id}</a>
        </Link>
      ),
      project_name,
      disease_type,
      program_name,
      primary_site,
    };

    const isAllImagesFilesInCart = allFilesInCart(
      currentCart,
      mapFilesFromCasesToCartFile(imageFiles),
    );

    if (!!slideCount && imageFiles.length > 0) {
      const images = (
        <div className="flex gap-2">
          <Tooltip label="View Slide Image">
            <Link
              href={`/user-flow/workbench/MultipleImageViewerPage?caseId=${case_id}`}
            >
              <a className="flex gap-1 cursor-pointer text-nci-blue">
                <FaMicroscope className="mt-0.5" />
                <span>({slideCount})</span>
              </a>
            </Link>
          </Tooltip>
          <Tooltip
            label={!isAllImagesFilesInCart ? "Add to Cart" : "Remove from Cart"}
          >
            <FaShoppingCart
              onClick={() => {
                isAllImagesFilesInCart
                  ? removeFromCart(
                      mapFilesFromCasesToCartFile(imageFiles),
                      currentCart,
                      dispatch,
                    )
                  : addToCart(
                      mapFilesFromCasesToCartFile(imageFiles),
                      currentCart,
                      dispatch,
                    );
              }}
              className={`cursor-pointer mt-0.5 ${
                isAllImagesFilesInCart ? "text-nci-green" : "text-nci-blue"
              }`}
            />
          </Tooltip>
        </div>
      );

      caseSummaryObject = {
        ...caseSummaryObject,
        images,
      };
    }
    const headersConfig = Object.keys(caseSummaryObject).map((key) => ({
      field: key,
      name: humanify({ term: key }),
    }));

    return formatDataForHorizontalTable(caseSummaryObject, headersConfig);
  };

  const formatDataForDataCateogryTable = () => {
    const sortedDataCategories = sortByPropertyAsc(
      data.summary.data_categories,
      "data_category",
    );

    const rows = sortedDataCategories.map((data_c) => ({
      data_category: data_c.data_category,
      file_count: `${data_c.file_count} (${calculatePercentage(
        data_c.file_count,
        filesCountTotal,
      )}%)`,
    }));

    return {
      headers: ["Data Category", `Files (n = ${filesCountTotal})`],
      tableRows: rows,
    };
  };

  const formatDataForExpCateogryTable = () => {
    const sortedExpCategories = sortByPropertyAsc(
      data.summary.experimental_strategies,
      "experimental_strategy",
    );

    const rows = sortedExpCategories.map((exp_c) => ({
      experimental_strategy: exp_c.experimental_strategy,
      file_count: `${exp_c.file_count} (${calculatePercentage(
        exp_c.file_count,
        filesCountTotal,
      )}%)`,
    }));

    return {
      headers: ["Experimental Strategy", `Files (n = ${filesCountTotal})`],
      tableRows: rows,
    };
  };

  return (
    <>
      {!data && isFetching ? (
        <LoadingOverlay visible />
      ) : data ? (
        <>
          <SummaryHeader iconText="CA" headerTitle={headerTitle} />
          <div className="flex flex-col mx-auto mt-5 w-10/12">
            <div className="flex flex-col gap-5">
              <Button
                leftIcon={<FaShoppingCart />}
                className="self-end"
                onClick={() =>
                  isAllFilesInCart
                    ? removeFromCart(
                        mapFilesFromCasesToCartFile(data.files),
                        currentCart,
                        dispatch,
                      )
                    : addToCart(
                        mapFilesFromCasesToCartFile(data.files),
                        currentCart,
                        dispatch,
                      )
                }
              >
                {!isAllFilesInCart
                  ? "Add all files to the cart"
                  : "Remove all files from the cart"}
              </Button>
              <div className="flex gap-4">
                <div className="w-10/12">
                  <SummaryCard
                    tableData={formatDataForCaseSummary()}
                    Icon={FaTable}
                  />
                </div>
                <div className="w-2/12">
                  <SummaryCount
                    title="files"
                    count={filesCountTotal?.toLocaleString()}
                    Icon={FaFile}
                  />
                  <SummaryCount
                    title="annotations"
                    count={annotationsCountTotal.toLocaleString()}
                    Icon={FaEdit}
                    href={getAnnotationsLinkParams(data.annotations)}
                    shouldOpenInNewTab
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <div className="flex-1">
                  <div className="bg-white text-nci-gray p-2">
                    <h2 className="text-lg font-medium">
                      File Counts by Data Category
                    </h2>
                    {!data.summary.data_categories && (
                      <span className="block text-center text-sm pt-4">
                        No Results found
                      </span>
                    )}
                  </div>
                  {data.summary.data_categories ? (
                    <TempTable tableData={formatDataForDataCateogryTable()} />
                  ) : null}
                </div>

                <div className="flex-1">
                  <div className="bg-white text-nci-gray p-2">
                    <h2 className="text-lg font-medium">
                      File Counts by Experimental Strategy
                    </h2>
                    {!data.summary.experimental_strategies && (
                      <span className="block text-center text-sm pt-4">
                        No Results found
                      </span>
                    )}
                  </div>
                  {data.summary.experimental_strategies ? (
                    <TempTable tableData={formatDataForExpCateogryTable()} />
                  ) : null}
                </div>
              </div>
            </div>

            <div ref={targetRef} id="biospecimen">
              <Biospecimen caseId={case_id} bioId={bio_id} />
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
