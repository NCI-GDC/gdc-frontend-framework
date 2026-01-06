import { render } from "@testing-library/react";
import IDCViewerWrapper from "./IDCViewerWrapper";
import { MantineProvider } from "@mantine/core";

test("IDCViewerWrapper render test", () => {
  const { unmount } = render(
    <MantineProvider
      theme={{
        colors: {
          primary: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          base: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },
      }}
    >
      <IDCViewerWrapper />
    </MantineProvider>,
  );
  expect(1).not.toEqual(2);
  unmount();
});
