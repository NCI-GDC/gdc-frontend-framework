import {
  Modals,
  showModal,
  trimFirstFieldNameToTitle,
  useCoreDispatch,
} from "@gff/core";
import { Button, Tooltip } from "@mantine/core";
import {
  controlsIconStyle,
  FacetHeader,
  FacetIconButton,
  FacetText,
} from "./components";
import { MdClose as CloseIcon } from "react-icons/md";
import { FaUndo as UndoIcon } from "react-icons/fa";

const UploadFacet = ({
  title,
  field,
  description,
  facetName = undefined,
  dismissCallback = undefined,
  width = undefined,
  hooks,
  hideIfEmpty,
}) => {
  const coreDispatch = useCoreDispatch();

  const clearFilters = hooks.useClearFilter();
  const facetTitle = facetName
    ? facetName
    : trimFirstFieldNameToTitle(field, true);
  return (
    <div
      className={`flex flex-col ${
        width ? width : "mx-0"
      } bg-base-max relative shadow-lg border-base-lighter border-1 rounded-b-md text-xs transition`}
    >
      <FacetHeader>
        <Tooltip
          disabled={!description}
          label={description}
          position="bottom-start"
          multiline
          w={220}
          withArrow
          transitionProps={{ duration: 200, transition: "fade" }}
        >
          <FacetText>{facetTitle}</FacetText>
        </Tooltip>
        <div className="flex flex-row">
          <Tooltip label="Clear selection">
            <FacetIconButton
              onClick={() => clearFilters(field)}
              aria-label="clear selection"
            >
              <UndoIcon size="1.15em" className={controlsIconStyle} />
            </FacetIconButton>
          </Tooltip>
          {dismissCallback && (
            <Tooltip label="Remove the facet">
              <FacetIconButton
                onClick={() => {
                  dismissCallback(field);
                }}
                aria-label="Remove the facet"
              >
                <CloseIcon size="1.25em" className={controlsIconStyle} />
              </FacetIconButton>
            </Tooltip>
          )}
        </div>
      </FacetHeader>
      <div className="flex justify-center p-2">
        <Button
          variant="outline"
          onClick={() => {
            if (field.includes("Cases")) {
              coreDispatch(showModal({ modal: Modals.GlobalCaseSetModal }));
            } else if (field.includes("Genes")) {
              coreDispatch(showModal({ modal: Modals.GlobalGeneSetModal }));
            } else {
              coreDispatch(showModal({ modal: Modals.GlobalMutationSetModal }));
            }
          }}
        >
          {field}
        </Button>
        <div></div>
      </div>
    </div>
  );
};

export default UploadFacet;
