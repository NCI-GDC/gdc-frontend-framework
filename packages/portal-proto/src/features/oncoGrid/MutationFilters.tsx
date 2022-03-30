import { Checkbox } from "@mantine/core";
import Gradient from "./Gradient";

interface MutationFiltersProps {
  readonly heatmapMode: boolean;
  readonly ssmFilters: string[];
  readonly setSsmFilters: (filters: string[]) => void;
  readonly cnvFilters: string[];
  readonly setCnvFilters: (filters: string[]) => void;
  readonly heatmapColor: string;
  readonly colorMap: any;
}

const MutationFilters: React.FC<MutationFiltersProps> = ({
  heatmapMode,
  ssmFilters,
  setSsmFilters,
  cnvFilters,
  setCnvFilters,
  heatmapColor,
  colorMap,
}: MutationFiltersProps) => {
  const updateSSMFilters = (value) => {
    if (ssmFilters.includes(value)) {
      setSsmFilters(ssmFilters.filter((v) => v !== value));
    } else {
      setSsmFilters([...ssmFilters, value]);
    }
  };

  const updateCnvFilters = (value) => {
    if (cnvFilters.includes(value)) {
      setCnvFilters(cnvFilters.filter((v) => v !== value));
    } else {
      setCnvFilters([...cnvFilters, value]);
    }
  };

  const selectDeselectSSM = () => {
    if (ssmFilters.length === 0) {
      setSsmFilters([
        "missense_variant",
        "frameshift_variant",
        "start_lost",
        "stop_lost",
        "stop_gained",
      ]);
    } else {
      setSsmFilters([]);
    }
  };

  const selectDeselectCnv = () => {
    if (cnvFilters.length === 0) {
      setCnvFilters(["loss", "gain"]);
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
                checked={ssmFilters.length !== 0}
                onChange={() => selectDeselectSSM()}
                className={"text-nci-gray"}
              ></input>
              <label className="px-2 align-middle">Show Mutations</label>
            </div>
            {heatmapMode && (
              <div className="flex">
                {"Less"}
                <Gradient color={heatmapColor} />
                {"More"}
              </div>
            )}
          </div>
          <hr className="m-1" />
          <div className="grid grid-cols-3">
            <div>
              <input
                type="checkbox"
                value="missense_variant"
                checked={ssmFilters.includes("missense_variant")}
                onChange={(event) => updateSSMFilters(event.target.value)}
                style={{
                  color: heatmapMode
                    ? heatmapColor
                    : colorMap.mutation.missense_variant,
                }}
              ></input>
              <label className="px-2 align-middle">Missense</label>
            </div>
            <div>
              <input
                type="checkbox"
                value="start_lost"
                checked={ssmFilters.includes("start_lost")}
                onChange={(event) => updateSSMFilters(event.target.value)}
                style={{
                  color: heatmapMode
                    ? heatmapColor
                    : colorMap.mutation.start_lost,
                }}
              ></input>
              <label className="px-2 align-middle">Start Lost</label>
            </div>
            <div>
              <input
                type="checkbox"
                value="stop_gained"
                checked={ssmFilters.includes("stop_gained")}
                onChange={(event) => updateSSMFilters(event.target.value)}
                style={{
                  color: heatmapMode
                    ? heatmapColor
                    : colorMap.mutation.stop_gained,
                }}
              ></input>
              <label className="px-2 align-middle">Stop Gained</label>
            </div>
            <div>
              <input
                type="checkbox"
                value="frameshift_variant"
                checked={ssmFilters.includes("frameshift_variant")}
                onChange={(event) => updateSSMFilters(event.target.value)}
                style={{
                  color: heatmapMode
                    ? heatmapColor
                    : colorMap.mutation.frameshift_variant,
                }}
              ></input>
              <label className="px-2 align-middle">Frameshift</label>
            </div>
            <div>
              <input
                type="checkbox"
                value="stop_lost"
                checked={ssmFilters.includes("stop_lost")}
                onChange={(event) => updateSSMFilters(event.target.value)}
                style={{
                  color: heatmapMode
                    ? heatmapColor
                    : colorMap.mutation.stop_lost,
                }}
              ></input>
              <label className="px-2 align-middle">Stop Lost</label>
            </div>
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
            ></input>
            <label className="px-2 align-middle">
              Show Copy Number Variations
            </label>
            <hr className="m-1" />
            <div>
              <input
                type="checkbox"
                value="loss"
                checked={cnvFilters.includes("loss")}
                onChange={(event) => updateCnvFilters(event.target.value)}
                style={{ color: colorMap.cnv.Loss }}
              ></input>
              <label className="px-2 align-middle">Loss</label>
            </div>
            <div>
              <input
                type="checkbox"
                value="gain"
                checked={cnvFilters.includes("gain")}
                onChange={(event) => updateCnvFilters(event.target.value)}
                style={{ color: colorMap.cnv.Gain }}
              ></input>
              <label className="px-2 align-middle">Gain</label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MutationFilters;
