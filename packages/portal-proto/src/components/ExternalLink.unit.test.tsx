import { render, screen } from "@testing-library/react";
import { ExternalLink } from "@/components/ExternalLink";

describe("<ExternalLink />", () => {
  const mockData = {
    href: "https://google.com",
    title: "External Link",
    separator: "<span> ? </span>",
    dataTestId: "test-externalLink",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the correct link title if one is provided", () => {
    const testElem = (
      <ExternalLink
        dataTestId={mockData.dataTestId}
        href={mockData.href}
        title={mockData.title}
      >
        Click Here
      </ExternalLink>
    );

    render(testElem);
    const el = screen.getByTestId(mockData.dataTestId);
    expect(el.getAttribute("title")).toBe(mockData.title);
  });

  it("renders the href as link title if none is provided", () => {
    const testElem = (
      <ExternalLink dataTestId={mockData.dataTestId} href={mockData.href}>
        Click Here
      </ExternalLink>
    );

    render(testElem);
    const el = screen.getByTestId(mockData.dataTestId);
    expect(el.getAttribute("title")).toBe(mockData.href);
  });

  it("renders the correct href", () => {
    const testElem = (
      <ExternalLink dataTestId={mockData.dataTestId} href={mockData.href}>
        Click Here
      </ExternalLink>
    );

    render(testElem);
    const el = screen.getByTestId(mockData.dataTestId);
    expect(el.getAttribute("href")).toBe(mockData.href);
  });

  it("renders the default separator", () => {
    const testElem = (
      <ExternalLink dataTestId={mockData.dataTestId} href={mockData.href}>
        Click Here
      </ExternalLink>
    );

    const { container } = render(testElem);
    const el = container.getElementsByTagName("span");
    expect(el[0].textContent).toBe(" | ");
  });

  it("renders the provided separator", () => {
    const testElem = (
      <ExternalLink
        dataTestId={mockData.dataTestId}
        href={mockData.href}
        separator={<span>xyz</span>}
      >
        Click Here
      </ExternalLink>
    );

    const { container } = render(testElem);
    const el = container.getElementsByTagName("span");
    expect(el[0].textContent).toBe("xyz");
  });

  it("renders no separator if value set to false", () => {
    const testElem = (
      <ExternalLink
        dataTestId={mockData.dataTestId}
        href={mockData.href}
        separator={false}
      >
        Click Here
      </ExternalLink>
    );

    const { container } = render(testElem);
    const el = container.getElementsByTagName("span");
    expect(el.length).toBe(0);
  });
});
