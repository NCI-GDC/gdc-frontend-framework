import { Badge, Card, Text } from "@mantine/core";

interface SlidesProps {
  readonly file_id: string;
  readonly submitter_id: string;
  setImageViewer: (file_id: string) => void;
  isActive: boolean;
}

export const Slides: React.FC<SlidesProps> = ({
  file_id,
  submitter_id,
  setImageViewer,
  isActive,
}: SlidesProps) => {
  return (
    <div className="flex flex-col mb-4" onClick={() => setImageViewer(file_id)}>
      <Card
        shadow="sm"
        p="sm"
        sx={(theme) => ({
          backgroundColor: isActive ? "#1784ac" : theme.colors.gray[5],
          "&:hover": {
            backgroundColor: !isActive && theme.colors.gray[7],
          },
        })}
      >
        <Badge variant="light" className="mb-1 text-black text-xs">
          {submitter_id}
        </Badge>

        <img
          alt={`thumbnail of ${submitter_id}`}
          src={`https://api.gdc.cancer.gov/tile/${file_id}?level=7&x=0&y=0`}
          className="max-w-[200px] max-h-[90px]"
        />
      </Card>
    </div>
  );
};
