import { Button } from "@mantine/core";
import { forwardRef } from "react";
import { GiMicroscope } from "react-icons/gi";
import tw from "tailwind-styled-components";

const SlideCountsIcon = tw.div<{
  $count?: number;
}>`
  ${(p: { $count?: number }) =>
    p.$count !== undefined && p.$count > 0 ? "bg-accent-vivid" : "bg-base-dark"}
    ${(p: { $count?: number }) =>
      p.$count !== undefined && p.$count > 0
        ? "text-base-lightest"
        : "text-base-contrast-lighter"}
    inline-flex
    items-center
    w-5
    h-4
    justify-center
    font-heading
    rounded-md
  `;

export const ImageSlideCount = forwardRef<
  HTMLButtonElement,
  { slideCount: number; onClick?: () => void }
>(
  ({ slideCount, onClick }, ref): JSX.Element => (
    <Button
      compact
      disabled={slideCount === 0}
      leftIcon={
        <GiMicroscope
          className={`${slideCount === 0 && "text-base-contrast-lightest"}`}
          size={16}
        />
      }
      size="xs"
      variant="outline"
      classNames={{
        rightIcon: "ml-0",
        leftIcon: "mr-1",
      }}
      rightIcon={
        <SlideCountsIcon $count={slideCount}>
          {slideCount === 0 ? "--" : slideCount}
        </SlideCountsIcon>
      }
      ref={ref}
      onClick={onClick}
    />
  ),
);
