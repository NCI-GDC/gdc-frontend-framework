import { useMantineTheme, ColorSwatch } from "@mantine/core";
import { clinicalTracks, dataTypesTrack } from "./trackConfig";

interface GradientProps {
  readonly fieldName: string;
  readonly colorMap: Record<string, string>;
}

const Gradient: React.FC<GradientProps> = ({
  fieldName,
  colorMap,
}: GradientProps) => {
  const theme = useMantineTheme();
  return (
    <div className="flex flex-row">
      <div className="px-1">
        <ColorSwatch color={theme.fn.lighten(colorMap[fieldName], 0.95)} />
      </div>
      <div className="px-1">
        <ColorSwatch color={theme.fn.lighten(colorMap[fieldName], 0.6)} />
      </div>
      <div className="px-1">
        <ColorSwatch color={theme.fn.lighten(colorMap[fieldName], 0.3)} />
      </div>
      <div className="px-1">
        <ColorSwatch color={colorMap[fieldName]} />
      </div>
    </div>
  );
};

interface TrackLegendProps {
  readonly track: string;
  readonly colorMap: Record<string, string>;
  readonly maxDaysToDeath: number;
  readonly maxAge: number;
  readonly maxDonors: number;
}

const TrackLegend: React.FC<TrackLegendProps> = ({
  track,
  colorMap,
  maxDaysToDeath,
  maxAge,
  maxDonors,
}: TrackLegendProps) => {
  const maxValues = {
    daysToDeath: maxDaysToDeath,
    age: maxAge,
  };

  switch (track) {
    case "Clinical":
      return (
        <div className="p-2 flex flex-col">
          <b>Clinical Data</b>
          {clinicalTracks.map((track) => (
            <div className="flex flex-row p-1" key={track.fieldName}>
              <b>{track.name}: </b>
              {track.type === "continuous" ? (
                <div className="pl-1 flex flex-row">
                  {0}
                  <Gradient colorMap={colorMap} fieldName={track.fieldName} />
                  {maxValues[track.fieldName]}
                </div>
              ) : (
                <div
                  className={
                    Object.keys(colorMap[track.fieldName]).length > 2
                      ? "flex flex-col"
                      : "flex"
                  }
                >
                  {Object.keys(colorMap[track.fieldName]).map((val) => (
                    <div className="flex" key={`${track.fieldName}_${val}`}>
                      <span className="px-1">{val}:</span>
                      <ColorSwatch color={colorMap[track.fieldName][val]} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    case "Data Types":
      return (
        <div className="p-2 flex flex-col">
          <b>Available Data Types:</b>
          {dataTypesTrack.map((track) => (
            <div key={track.name} className={"flex flex-row py-1"}>
              <ColorSwatch color={colorMap[track.name]}></ColorSwatch>
              <div className="pl-1">{track.fieldName}</div>
            </div>
          ))}
        </div>
      );
    case "Gene Sets":
      return (
        <div className="p-2 flex flex-col">
          <b>Gene Sets:</b>
          <div className="flex flex-row">
            <ColorSwatch color={colorMap["cgc"]}></ColorSwatch>
            <div className="w-40 pl-1">
              {"Gene belongs to Cancer Gene Census"}
            </div>
          </div>
        </div>
      );
    case "GDC":
      return (
        <div className="p-2">
          <b># cases Affected:</b>
          <div className="pl-1 flex flex-row">
            {0}
            <Gradient colorMap={colorMap} fieldName={"totalDonors"} />
            {maxDonors}
          </div>
        </div>
      );
  }
};

export default TrackLegend;
