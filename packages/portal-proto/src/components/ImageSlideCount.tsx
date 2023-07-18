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
    ${(p: { $count?: number }) =>
      p.$count !== undefined && p.$count > 0
        ? "text-base-lightest"
        : "text-base-max"}
    inline-flex
    items-center
    w-4
    h-4
    justify-center
    font-heading
    rounded-sm
  `;

export const ImageSlideCount = forwardRef<
  HTMLButtonElement,
  { slideCount: number; onClick?: () => void }
>(
  ({ slideCount, onClick }, ref): JSX.Element => (
    <Tooltip label="No slide images to view" disabled={slideCount !== 0}>
      <span>
        <Button
          compact
          leftIcon={
            slideCount === 0 ? <DisabledMicroscopeIcon /> : <MicroscopeIcon />
          }
          size="xs"
          disabled={slideCount === 0}
          variant="outline"
          className="bg-base-max border-base-lighter"
          classNames={{
            rightIcon: "ml-0",
            leftIcon: "mr-2",
          }}
          rightIcon={
            <SlideCountsIcon $count={slideCount}>
              {slideCount === 0 ? "--" : slideCount}
            </SlideCountsIcon>
          }
          ref={ref}
          onClick={onClick}
        />
      </span>
    </Tooltip>
  ),
);
