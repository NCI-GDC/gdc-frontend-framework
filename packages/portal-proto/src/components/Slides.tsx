import { GDC_API } from "@gff/core";
import { Badge, Card } from "@mantine/core";

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
    <div
      onClick={() => setImageViewer(file_id)}
      onKeyDown={() => setImageViewer(file_id)}
      role="button"
      tabIndex={0}
    >
      <Card
        shadow="sm"
        p="sm"
        style={{
          backgroundColor: isActive
            ? "var(--mantine-color-accent-3)"
            : "var(--mantine-color-gray-3)",
        }}
        className={isActive ? "" : "hover:bg-[var(--mantine-color-gray-7)]"}
      >
        <Badge
          data-testid={submitter_id}
          variant="filled"
          className="mb-1 text-xs text-primary-contrast"
        >
          {submitter_id}
        </Badge>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={`thumbnail of ${submitter_id}`}
          src={`${GDC_API}/tile/${file_id}?level=7&x=0&y=0`}
          className="max-w-[200px] max-h-[90px]"
        />
      </Card>
    </div>
  );
};
