import { Card, Text } from "@mantine/core";

interface SlidesProps {
  readonly file_id: string;
  readonly submitter_id: string;
  setImageViewer: (file_id: string) => void;
}

export const Slides: React.FC<SlidesProps> = ({
  file_id,
  submitter_id,
  setImageViewer,
}: SlidesProps) => {
  return (
    <div className="flex flex-col mb-4" onClick={() => setImageViewer(file_id)}>
      <Card shadow="sm" p="lg">
        <Text size="xs" className="mb-2">{submitter_id}</Text>

        <img
          alt={`thumbnail of ${submitter_id}`}
          src={`https://api.gdc.cancer.gov/tile/${file_id}?level=7&x=0&y=0`}
          className="w-[50px] h-[90px]"
        />
      </Card>
    </div>
  );
};
