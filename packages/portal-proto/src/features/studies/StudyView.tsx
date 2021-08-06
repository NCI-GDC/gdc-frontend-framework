import Image from "next/image";

export interface StudyViewProps {
  readonly setView: (string) => void;
}

export const StudyView: React.FC<StudyViewProps> = ({
  setView,
}: StudyViewProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row">
        <button className="absolute" onClick={() => setView("appSelector")}>
          &lt; All Apps
        </button>
        <div className="flex-grow text-center">Single Cohort</div>
      </div>
      <div className="flex-grow overflow-y-auto">
        <Image
          src="/user-flow/studies-mock-up.png"
          layout="responsive"
          width="100%"
          height="100%"
        ></Image>
      </div>
    </div>
  );
};
