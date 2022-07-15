import { SummaryCard } from "@/components/Summary/SummaryCard";
import SummaryCount from "@/components/Summary/SummaryCount";
import { SummaryHeader } from "@/components/Summary/SummaryHeader";
import {
  useCaseSummary,
  useCoreDispatch,
  useCoreSelector,
  selectCart,
  CartFile,
} from "@gff/core";
import { Button, LoadingOverlay, Tooltip } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { orderBy, replace, sortBy } from "lodash";
import Link from "next/link";
import { useContext, useEffect } from "react";
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

export const CaseSummaryNew = ({
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
      "files.submitter_id",
      "files.access",
      "files.acl",
      "files.created_datetime",
      "files.updated_datetime",
      "files.data_category",
      "files.data_format",
      "files.data_type",
      "files.file_name",
      "files.file_size",
      "files.file_id",
      "files.md5sum",
      "files.platform",
      "files.state",
      "files.type",
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

  console.log("data: ", data);
  const { prevPath } = useContext(URLContext);
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    offset: 60,
  });

  useEffect(() => {
    if (prevPath?.includes("MultipleImageViewerPage")) {
      scrollIntoView();
    }
  }, [prevPath, scrollIntoView]);

  const slideCountFromCaseSummary = (
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

  const filesInCart = (carts: CartFile[], files: CartFile[]) =>
    files?.every((file) => carts.some((cart) => cart.fileId === file.fileId));

  const isAllFilesInCart = data?.files
    ? filesInCart(currentCart, mapFilesFromCasesToCartFile(data?.files))
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

    const slideCount = slideCountFromCaseSummary(experimental_strategies);

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

    const isAllImagesFilesInCart = filesInCart(
      currentCart,
      mapFilesFromCasesToCartFile(imageFiles),
    );

    if (!!slideCount && imageFiles.length > 0) {
      const images = (
        <div className="flex">
          <Tooltip label="View Slide Image">
            <Link
              href={`/user-flow/workbench/MultipleImageViewerPage?caseId=${case_id}`}
            >
              <a className="flex gap-1 cursor-pointer">
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
              className={
                isAllImagesFilesInCart ? "text-nci-green mt-0.5" : "mt-0.5"
              }
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

  const calculatePercentage = (count: number, total: number) =>
    ((count / total) * 100).toFixed(2);

  const formatDataForDataCateogryTable = () => {
    const sortedDataCategories = sortBy(data.summary.data_categories, [
      (d) => replace(d.data_category, /[^a-zA-Z]/g, "").toLocaleLowerCase(),
    ]);

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
    const sortedExpCategories = sortBy(data.summary.experimental_strategies, [
      (e) =>
        replace(e.experimental_strategy, /[^a-zA-Z]/g, "").toLocaleLowerCase(),
    ]);

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
          <div className="flex flex-col mx-auto mt-5 w-9/12">
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
