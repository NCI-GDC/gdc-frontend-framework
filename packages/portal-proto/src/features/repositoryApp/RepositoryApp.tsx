import {
  buildCohortGqlOperator,
  CART_LIMIT,
  FilterSet,
  GdcFile,
  GqlOperation,
  joinFilters,
  selectCart,
  selectCurrentCohortFilters,
  stringifyJSONParam,
  useCoreDispatch,
  useCoreSelector,
  useGetAllFilesMutation,
  useGetFilesQuery,
} from "@gff/core";
import { useEffect, useState } from "react";
import { AppStore, useAppSelector } from "./appApi";
import {
  MdShoppingCart as CartIcon,
  MdDownload as DownloadIcon,
} from "react-icons/md";
import { VscTrash } from "react-icons/vsc";
import {
  addToCart,
  removeFromCart,
  showCartOverLimitNotification,
} from "@/features/cart/updateCart";
import { FileFacetPanel } from "./FileFacetPanel";
import { mapGdcFileToCartFile } from "../files/utils";
import { selectFilters } from "@/features/repositoryApp/repositoryFiltersSlice";
import FunctionButton from "@/components/FunctionButton";
import { DownloadButton } from "@/components/DownloadButtons";
import FunctionButtonRemove from "@/components/FunctionButtonRemove";
import {
  useClearLocalFilterWhenCohortChanges,
  useClearAllRepositoryFilters,
} from "@/features/repositoryApp/hooks";
import { useImageCounts } from "@/features/repositoryApp/slideCountSlice";
import { Tooltip, Menu, Button } from "@mantine/core";
import FilesTables from "../repositoryApp/FilesTable";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { useRouter } from "next/router";
import { IoMdArrowDropdown as Dropdown } from "react-icons/io";
import { TableXPositionContext } from "@/components/Table/VerticalTable";

export const persistor = persistStore(AppStore);

const useCohortCentricFiles = () => {
  const repositoryFilters = useAppSelector((state) =>
    selectFilters(state),
  ) as FilterSet;
  const cohortFilters = useCoreSelector((state) =>
    selectCurrentCohortFilters(state),
  );

  const allFilters = joinFilters(cohortFilters, repositoryFilters);
  const { data: fileData, isFetching: fileDataFetching } = useGetFilesQuery({
    case_filters: buildCohortGqlOperator(cohortFilters),
    filters: buildCohortGqlOperator(repositoryFilters),
    expand: [
      "annotations", //annotations
      "cases.project", //project_id
      "cases",
    ],
    size: 20,
  });

  const { data: imagesCount } = useImageCounts(allFilters);

  return {
    caseFilters: cohortFilters,
    localFilters: repositoryFilters,
    pagination: fileData?.pagination,
    fileDataFetching,
    repositoryFilters,
    imagesCount,
  };
};

export const RepositoryApp = (): JSX.Element => {
  const currentCart = useCoreSelector((state) => selectCart(state));
  const dispatch = useCoreDispatch();
  const router = useRouter();
  const {
    caseFilters,
    localFilters,
    pagination,
    repositoryFilters,
    imagesCount,
    fileDataFetching,
  } = useCohortCentricFiles();
  const [
    getFileSizeSliceData, // This is the mutation trigger
    { isLoading: allFilesLoading }, // This is the destructured mutation result
  ] = useGetAllFilesMutation();

  const getAllSelectedFiles = (callback, caseFilters, localFilters) => {
    getFileSizeSliceData({ caseFilters: caseFilters, filters: localFilters })
      .unwrap()
      .then((data: GdcFile[]) => {
        return mapGdcFileToCartFile(data);
      })
      .then((cartFiles) => {
        callback(cartFiles, currentCart, dispatch);
      });
  };
  const buildCohortGqlOperatorWithCart = (): GqlOperation => {
    // create filter with current cart file ids
    const cartFilterSet: FilterSet = {
      root: {
        "files.file_id": {
          operator: "includes",
          field: "files.file_id",
          operands: currentCart.map((obj) => obj.file_id),
        },
      },
      mode: "and",
    };
    return buildCohortGqlOperator(joinFilters(localFilters, cartFilterSet));
  };
  const [active, setActive] = useState(false);

  const clearAllFilters = useClearAllRepositoryFilters();
  useEffect(() => {
    return () => clearAllFilters();
  }, [clearAllFilters]);

  useClearLocalFilterWhenCohortChanges();

  const [metadataDownloadActive, setMetadataDownloadActive] = useState(false);
  const [sampleSheetDownloadActive, setSampleSheetDownloadActive] =
    useState(false);
  const [tableXPosition, setTableXPosition] = useState<number>(undefined);

  const viewImageDisabled =
    imagesCount.slidesCount <= 0 && imagesCount.casesWithImagesCount <= 0;
  return (
    <>
      <PersistGate persistor={persistor}>
        <TableXPositionContext.Provider
          value={{ xPosition: tableXPosition, setXPosition: setTableXPosition }}
        >
          <div className="flex m-4 gap-0.5">
            <FileFacetPanel />
            <div
              className="overflow-hidden h-full w-full"
              data-testid="table-repository"
            >
              <div className="flex flex-wrap Custom-Repo-Width:justify-end gap-2 mt-8 mb-4">
                <Menu width="target">
                  <Menu.Target>
                    <Button
                      data-testid="button-download-associated-data-files-table"
                      rightSection={
                        <Dropdown
                          size="1.25em"
                          aria-hidden="true"
                          data-testid="dropdown-icon"
                          className="border-l pl-1 -mr-2"
                        />
                      }
                      leftSection={
                        <DownloadIcon
                          aria-hidden="true"
                          size="1rem"
                          className="hidden xl:block"
                        />
                      }
                      variant="outline"
                    >
                      Download Associated Data
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown data-testid="dropdown-menu-options">
                    <Menu.Item
                      component={DownloadButton}
                      classNames={{ item: "font-normal" }}
                      displayVariant="subtle"
                      activeText="Processing"
                      inactiveText="Sample Sheet"
                      setActive={setSampleSheetDownloadActive}
                      active={sampleSheetDownloadActive}
                      preventClickEvent
                      showIcon={true}
                      endpoint="files"
                      filename={`gdc_sample_sheet.${new Date()
                        .toISOString()
                        .slice(0, 10)}.tsv`}
                      format="tsv"
                      method="POST"
                      fields={[
                        "file_id",
                        "file_name",
                        "data_category",
                        "data_type",
                        "cases.project.project_id",
                        "cases.submitter_id",
                        "cases.samples.submitter_id",
                        "cases.samples.sample_type",
                      ]}
                      caseFilters={buildCohortGqlOperator(caseFilters)}
                      filters={buildCohortGqlOperator(localFilters)}
                      extraParams={{
                        tsv_format: "sample-sheet",
                      }}
                    />
                    <Menu.Item
                      component={DownloadButton}
                      classNames={{ item: "font-normal" }}
                      activeText="Processing"
                      inactiveText="Metadata"
                      setActive={setMetadataDownloadActive}
                      active={metadataDownloadActive}
                      showIcon={true}
                      displayVariant="subtle"
                      preventClickEvent
                      endpoint="files"
                      filename={`metadata.repository.${new Date()
                        .toISOString()
                        .slice(0, 10)}.json`}
                      method="POST"
                      caseFilters={buildCohortGqlOperator(caseFilters)}
                      filters={buildCohortGqlOperator(localFilters)}
                      fields={[
                        "state",
                        "access",
                        "md5sum",
                        "data_format",
                        "data_type",
                        "data_category",
                        "file_name",
                        "file_size",
                        "file_id",
                        "platform",
                        "experimental_strategy",
                        "center.short_name",
                        "annotations.annotation_id",
                        "annotations.entity_id",
                        "tags",
                        "submitter_id",
                        "archive.archive_id",
                        "archive.submitter_id",
                        "archive.revision",
                        "associated_entities.entity_id",
                        "associated_entities.entity_type",
                        "associated_entities.case_id",
                        "analysis.analysis_id",
                        "analysis.workflow_type",
                        "analysis.updated_datetime",
                        "analysis.input_files.file_id",
                        "analysis.metadata.read_groups.read_group_id",
                        "analysis.metadata.read_groups.is_paired_end",
                        "analysis.metadata.read_groups.read_length",
                        "analysis.metadata.read_groups.library_name",
                        "analysis.metadata.read_groups.sequencing_center",
                        "analysis.metadata.read_groups.sequencing_date",
                        "downstream_analyses.output_files.access",
                        "downstream_analyses.output_files.file_id",
                        "downstream_analyses.output_files.file_name",
                        "downstream_analyses.output_files.data_category",
                        "downstream_analyses.output_files.data_type",
                        "downstream_analyses.output_files.data_format",
                        "downstream_analyses.workflow_type",
                        "downstream_analyses.output_files.file_size",
                        "index_files.file_id",
                      ]}
                      extraParams={{
                        expand: [
                          "metadata_files",
                          "annotations",
                          "archive",
                          "associated_entities",
                          "center",
                          "analysis",
                          "analysis.input_files",
                          "analysis.metadata",
                          "analysis.metadata_files",
                          "analysis.downstream_analyses",
                          "analysis.downstream_analyses.output_files",
                          "reference_genome",
                          "index_file",
                        ].join(","),
                      }}
                    />
                  </Menu.Dropdown>
                </Menu>
                <DownloadButton
                  data-testid="button-manifest-files-table"
                  activeText="Processing"
                  inactiveText="Manifest"
                  toolTip="Download a manifest for use with the GDC Data Transfer Tool. The GDC Data Transfer Tool is recommended for transferring large volumes of data."
                  multilineToolTip
                  endpoint="files"
                  method="POST"
                  extraParams={{
                    return_type: "manifest",
                  }}
                  caseFilters={buildCohortGqlOperator(caseFilters)}
                  filters={buildCohortGqlOperator(localFilters)}
                  setActive={setActive}
                  active={active}
                />
                <Tooltip
                  label={"No images available to be viewed"}
                  disabled={!viewImageDisabled}
                >
                  <span>
                    <FunctionButton
                      onClick={() =>
                        router.push(
                          `/image-viewer/MultipleImageViewerPage?isCohortCentric=true&additionalFilters=${encodeURIComponent(
                            stringifyJSONParam(repositoryFilters),
                          )}`,
                        )
                      }
                      disabled={viewImageDisabled}
                      data-testid="button-view-images-files-table"
                    >
                      View Images
                    </FunctionButton>
                  </span>
                </Tooltip>

                <FunctionButton
                  data-testid="button-add-all-files-table"
                  leftSection={
                    <CartIcon aria-hidden="true" className="hidden xl:block" />
                  }
                  loading={allFilesLoading}
                  variant="outline"
                  disabled={fileDataFetching}
                  onClick={() => {
                    // check number of files selected before making call
                    if (
                      pagination?.total &&
                      pagination.total + currentCart.length > CART_LIMIT
                    ) {
                      showCartOverLimitNotification(currentCart.length);
                    } else {
                      getAllSelectedFiles(
                        addToCart,
                        buildCohortGqlOperator(caseFilters),
                        buildCohortGqlOperator(localFilters),
                      );
                    }
                  }}
                  classNames={{ section: "mr-0 xl:mr-2" }}
                >
                  Add All Files to Cart
                </FunctionButton>
                <FunctionButtonRemove
                  data-testid="button-remove-all-files-table"
                  leftSection={
                    <VscTrash aria-hidden="true" className="hidden xl:block" />
                  }
                  classNames={{ section: "mr-0 xl:mr-2" }}
                  loading={allFilesLoading}
                  onClick={() => {
                    getAllSelectedFiles(
                      removeFromCart,
                      buildCohortGqlOperator(caseFilters),
                      buildCohortGqlOperatorWithCart(),
                    );
                  }}
                >
                  Remove All From Cart
                </FunctionButtonRemove>
              </div>

              <FilesTables />
            </div>
          </div>
        </TableXPositionContext.Provider>
      </PersistGate>
    </>
  );
};
