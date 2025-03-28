import React from "react";
import { useDeepCompareMemo } from "use-deep-compare";
import { Button, Tooltip } from "@mantine/core";
import CohortBadge from "@/cohort/QueryExpression/CohortBadge";
import { Includes } from "@/cohort/QueryExpression/types";
import { UploadFacetCardProps } from "../types";
import FacetControlsHeader from "./FacetControlsHeader";

const UploadFacet: React.FC<UploadFacetCardProps> = ({
  field,
  fullField,
  facetName,
  uploadLabel,
  facetBtnToolTip,
  width,
  hooks,
  cardScrollMargin,
  queryExpressionHooks,
}) => {
  const hash = window?.location?.hash.split("#")?.[1];
  const cardSelected = hash !== undefined && hash === fullField;
  const openModal = hooks.useOpenUploadModal();

  const filters = hooks.useCohortFacetFilters();
  const noFilters = Object.keys(filters?.root || {}).length === 0;

  const items = useDeepCompareMemo(() => {
    const includeFilters = Object.values(
      filters.root as Record<string, Includes>,
    );
    return includeFilters.find((f) => f.field === field)?.operands || [];
  }, [filters, field]);

  const renderBadges = (items: string[], itemField: string) => {
    return items.map((item, index) => (
      <CohortBadge
        key={index}
        field={itemField}
        value={item}
        customTestid={`query-rep-${itemField}-${item}-${index}`}
        operands={items}
        operator="includes"
        hooks={queryExpressionHooks}
      />
    ));
  };

  return (
    <div
      className={`flex flex-col ${
        width || "mx-0"
      } bg-base-max border-base-lighter border-1 rounded-b-md text-xs transition ${
        cardSelected ? "animate-border-highlight " : undefined
      }`}
      style={{
        scrollMarginTop: (cardScrollMargin || 0) + 10,
      }}
      id={fullField}
    >
      <FacetControlsHeader field={field} hooks={hooks} facetName={facetName} />
      <div className="p-4">
        <div className="flex justify-center">
          <Tooltip
            disabled={!facetBtnToolTip}
            label={facetBtnToolTip}
            multiline
            w={220}
            withArrow
            transitionProps={{ duration: 200, transition: "fade" }}
          >
            <Button
              variant="outline"
              fullWidth
              onClick={() => openModal(field)}
            >
              {uploadLabel}
            </Button>
          </Tooltip>
        </div>
        {/* h-96 is max height for the content of ExactValueFacet, EnumFacet, UploadFacet */}
        <div className="mt-2 max-h-96 overflow-y-auto">
          {noFilters ? null : (
            <div className="flex flex-wrap gap-1">
              {renderBadges(items as string[], field)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFacet;
