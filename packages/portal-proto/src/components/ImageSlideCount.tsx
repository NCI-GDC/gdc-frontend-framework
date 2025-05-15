import { Badge, Button, Tooltip } from "@mantine/core";
import { forwardRef } from "react";
import MicroscopeIcon from "public/user-flow/icons/Microscope.svg";

interface ImageSlideCountProps {
  slideCount: number;
  onClick?: () => void;
}

export const ImageSlideCount = forwardRef<
  HTMLButtonElement,
  ImageSlideCountProps
>(
  ({ slideCount, onClick }: ImageSlideCountProps, ref): JSX.Element => (
    <Tooltip label="No slide images to view" disabled={slideCount !== 0}>
      <Button
        data-testid="button-view-slide-images"
        leftSection={<MicroscopeIcon />}
        size="compact-xs"
        disabled={slideCount === 0}
        variant="outline"
        className="border-base-lighter bg-base-max text-primary disabled:border disabled:bg-base-lightest disabled:opacity-50 disabled:border-primary"
        classNames={{
          section: "ml-0",
        }}
        rightSection={
          <Badge
            variant="filled"
            className={`px-1 bg-accent-vivid h-4 ${
              slideCount === 0 ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            radius="xs"
          >
            {slideCount === 0 ? "--" : slideCount}
          </Badge>
        }
        ref={ref}
        onClick={onClick}
        aria-label={
          slideCount === 0
            ? "No slide images to view"
            : `View ${slideCount} Slide Image${slideCount > 1 ? "s" : ""}`
        }
      />
    </Tooltip>
  ),
);
