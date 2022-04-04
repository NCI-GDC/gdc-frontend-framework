import { consequenceTypes, cnvTypes, heatMapColor, ColorMapType } from "./constants";
import Gradient from "./Gradient";

interface MutationFiltersProps {
  readonly heatmapMode: boolean;
  readonly consequenceTypeFilters: string[];
  readonly setConsequenceTypeFilters: (filters: string[]) => void;
  readonly cnvFilters: string[];
  readonly setCnvFilters: (filters: string[]) => void;
  readonly colorMap: ColorMapType;
}

const MutationFilters: React.FC<MutationFiltersProps> = ({
  heatmapMode,
  consequenceTypeFilters,
  setConsequenceTypeFilters,
  cnvFilters,
  setCnvFilters,
  colorMap,
}: MutationFiltersProps) => {
  const updateConsequenceTypeFilters = (value : string) => {
    if (consequenceTypeFilters.includes(value)) {
      setConsequenceTypeFilters(
        consequenceTypeFilters.filter((v) => v !== value),
      );
    } else {
      setConsequenceTypeFilters([...consequenceTypeFilters, value]);
    }
  };

  const updateCnvFilters = (value : string) => {
    if (cnvFilters.includes(value)) {
      setCnvFilters(cnvFilters.filter((v) => v !== value));
    } else {
      setCnvFilters([...cnvFilters, value]);
    }
  };

  const selectDeselectconsequenceTypeType = () => {
    if (consequenceTypeFilters.length === 0) {
      setConsequenceTypeFilters(Object.keys(consequenceTypes));
    } else {
      setConsequenceTypeFilters([]);
    }
  };

  const selectDeselectCnv = () => {
    if (cnvFilters.length === 0) {
      setCnvFilters(Object.keys(cnvTypes));
    } else {
      setCnvFilters([]);
    }
  };

  return (
    <div className="flex justify-evenly mb-4">
      <div>
        <h2 className="text-lg mb-1">Mutations</h2>
        <div className="border p-3 rounded min-h-[120px]">
          <div className="flex justify-between">
            <div>
              <input
                type="checkbox"
                checked={consequenceTypeFilters.length !== 0}
                onChange={() => selectDeselectconsequenceTypeType()}
                className={"text-nci-gray"}
                id={"consequence_filter_all"}
              ></input>
              <label
                className="px-2 align-middle"
                htmlFor={"consequence_filter_all"}
              >
                Show Mutations
              </label>
            </div>
            {heatmapMode && (
              <div className="flex">
                {"Less"}
                <Gradient color={heatMapColor} />
                {"More"}
              </div>
            )}
          </div>
          <hr className="m-1" />
          <div className="grid grid-cols-3">
            {Object.entries(consequenceTypes).map(([value, label]) => (
              <div key={`consequence_filter_${value}`}>
                <input
                  type="checkbox"
                  value={value}
                  id={`consequence_filter_${value}`}
                  checked={consequenceTypeFilters.includes(value)}
                  onChange={(event) =>
                    updateConsequenceTypeFilters(event.target.value)
                  }
                  style={{
                    color: heatmapMode
                      ? heatMapColor
                      : colorMap.mutation[value],
                  }}
                ></input>
                <label
                  className="px-2 align-middle"
                  htmlFor={`consequence_filter_${value}`}
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
      {!heatmapMode && (
        <div>
          <h2 className="text-lg mb-1">CNV Changes</h2>
          <div className="border p-3 rounded min-h-[120px]">
            <input
              type="checkbox"
              checked={cnvFilters.length !== 0}
              onChange={() => selectDeselectCnv()}
              className={"text-nci-gray"}
              id={"cnv_filter_all"}
            ></input>
            <label className="px-2 align-middle" htmlFor={"cnv_filter_all"}>
              Show Copy Number Variations
            </label>
            <hr className="m-1" />
            {Object.entries(cnvTypes).map(([value, label]) => (
              <div key={`cnv_filter_${value}`}>
                <input
                  type="checkbox"
                  value={value}
                  id={`cnv_filter_${value}`}
                  checked={cnvFilters.includes(value)}
                  onChange={(event) => updateCnvFilters(event.target.value)}
                  style={{ color: colorMap.cnv[value] }}
                ></input>
                <label
                  className="px-2 align-middle"
                  htmlFor={`cnv_filter_${value}`}
                >
                  {label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MutationFilters;
