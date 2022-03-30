import { ColorSwatch } from "@mantine/core";
import { clinicalTracks, dataTypesTrack, ColorMap } from "./trackConfig";
import Gradient from "./Gradient";

interface TrackLegendProps {
  readonly track: string;
  readonly colorMap: ColorMap;
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
    age: Math.ceil(maxAge / 365.25),
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
                  <Gradient color={colorMap[track.fieldName] as string} />
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
              <ColorSwatch color={colorMap[track.name] as string}></ColorSwatch>
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
            <ColorSwatch color={colorMap["cgc"] as string}></ColorSwatch>
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
            <Gradient color={colorMap["totalDonors"] as string} />
            {maxDonors}
          </div>
        </div>
      );
  }
};

export default TrackLegend;
