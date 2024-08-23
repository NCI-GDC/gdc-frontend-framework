import { Button, Tooltip } from "@mantine/core";
import { forwardRef } from "react";
import tw from "tailwind-styled-components";
import MicroscopeIcon from "public/user-flow/icons/Microscope.svg";
import DisabledMicroscopeIcon from "public/user-flow/icons/DisabledMicroscope.svg";

const SlideCountsIcon = tw.div<{
  $count?: number;
}>`
  ${(p: { $count?: number }) =>
    p.$count !== undefined && p.$count > 0
      ? "bg-accent-vivid"
      : "bg-base-lighter"}
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
        leftSection={
          slideCount === 0 ? <DisabledMicroscopeIcon /> : <MicroscopeIcon />
        }
        size="compact-xs"
        disabled={slideCount === 0}
        variant="outline"
        className="bg-base-max border-base-lighter"
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
