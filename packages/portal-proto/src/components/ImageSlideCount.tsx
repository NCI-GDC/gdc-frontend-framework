import { Button, Tooltip } from "@mantine/core";
import { forwardRef } from "react";
import tw from "tailwind-styled-components";
import MicroscopeIcon from "public/user-flow/icons/Microscope.svg";

const SlideCountsIcon = tw.div<{
  $count?: number;
}>`
    bg-accent-vivid
    text-base-max
    inline-flex
    items-center
    w-4
    h-4
    justify-center
    font-heading
    rounded-sm
  `;
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
          section: "ml-0 mr-2",
        }}
        rightSection={
          <SlideCountsIcon $count={slideCount}>
            {slideCount === 0 ? "--" : slideCount}
          </SlideCountsIcon>
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
