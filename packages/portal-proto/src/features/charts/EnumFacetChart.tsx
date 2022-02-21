import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader } from "@mantine/core";
import { FacetDataHooks } from "../facets/hooks";

const BarChart = dynamic(() => import("./BarChart"), {
  ssr: false,
});

const DownloadOptions = dynamic(() => import("./DownloadOptions"), {
  ssr: false,
});

const maxValuesToDisplay = 7;

interface FacetChartProps {
  readonly field: string;
  readonly type: string;
  readonly showXLabels?: boolean;
  readonly height?: number;
  readonly marginBottom?: number;
  readonly marginTop?: number;
  readonly padding?: number;
  readonly showTitle?: boolean;
  readonly maxBins?: number;
  readonly orientation?: string;
  readonly valueLabel?: string;
}

// from https://stackoverflow.com/questions/33053310/remove-value-from-object-without-mutation
const removeKey = (key, { [key]: _, ...rest }) => rest;

const processChartData = (facetData: Record<string, any>,
                          field: string,
                          maxBins = 100,
                          showXLabels = true,
                          valueLabel = "Cases") => {
  const data = removeKey("_missing", facetData);
  const xvals = Object.keys(data).slice(0, maxBins).map(x => x);
  const xlabels = Object.keys(data).slice(0, maxBins).map(x => processLabel(x, 12));
  const results: Record<string, any> = {
    x: xvals,
    y: Object.values(data).slice(0, maxBins),
    tickvals: showXLabels ? xvals : [],
    ticktext: showXLabels ? xlabels : [],
    label_text: Object.keys(data).slice(0, maxBins).map(x => processLabel(x, 100)),
    title: convertFieldToName(field),
    filename: field,
    yAxisTitle: `# of ${valueLabel}`,
  };
  return results;
};

const processJSONData = (facetData: Record<string, any>) => {
  return Object.entries(facetData).map(e => ({ label: e[0], value: e[1] }));
};

export const EnumFacetChart: React.FC<FacetChartProps> = ({
                                                     field,
                                                     type,
                                                     height,
                                                     marginBottom,
                                                     marginTop = 30, padding = 4,
                                                     showTitle = true,
                                                     maxBins = maxValuesToDisplay,
                                                     showXLabels = true,
                                                     valueLabel = "Cases",
                                                     orientation = "v",
                                                   }: FacetChartProps) => {
  const { data, isSuccess } = FacetDataHooks[type](field);
  const [chart_data, setChartData] = useState(undefined);

  useEffect(() => {
    if (isSuccess) {
      const cd = processChartData(data, field, maxBins, showXLabels, valueLabel);
      setChartData(cd);
    }
  }, [data, isSuccess]);

  // Create unique ID for this chart
  const chartDivId = `${field}_${Math.floor(Math.random() * 100)}`;

  return <>
    {showTitle ?
      <div className="flex items-center justify-between flex-wrap bg-gray-100 p-1.5">
        {convertFieldToName(field)}
        {chart_data && isSuccess ?
          <DownloadOptions chartDivId={chartDivId} chartName={field} jsonData={processJSONData(data)} /> : null
        }
      </div> : null
    }

    {chart_data && isSuccess ?

      <BarChart data={chart_data}
                         height={height}
                         marginBottom={marginBottom}
                         marginTop={marginTop}
                         padding={padding}
                         orientation={orientation}
                         divId={chartDivId}/>
      :
      <div className="flex flex-row items-center justify-center w-100">
        <Loader color="gray" size={height ? height : 24} />
      </div>
    }
  </>;
};

const capitalize = (s) =>
  s.length > 0  ? s[0].toUpperCase() + s.slice(1) : "";


const convertFieldToName = (field: string): string => {
  const property = field.split(".").pop();
  const tokens = property.split("_");
  const capitalizedTokens = tokens.map((s) => capitalize(s));
  return capitalizedTokens.join(" ");
};


function truncateString(str, n) {
  if (str.length > n) {
    return str.substring(0, n) + "...";
  } else {
    return str;
  }
}

export const processLabel = (label: string, shorten = 100): string => {
  const tokens = label.split(" ");
  const capitalizedTokens = tokens.map((s) => capitalize(s));
  return truncateString(capitalizedTokens.join(" "), shorten);
};
