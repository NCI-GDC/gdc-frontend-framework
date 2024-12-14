import React from "react";
import { MantineProvider } from "@mantine/core";
import { DataFetchingHook } from "src/types";

interface FooterLink {
  readonly title: string;
  readonly url: string;
  readonly LinkComponent?: React.ComponentType<{
    children: string;
    href: string;
  }>;
}
interface FooterColData {
  readonly header: string;
  readonly links: FooterLink[];
}

interface FooterProps {
  readonly useVersionInfoDetailsHook: DataFetchingHook<{
    tag: string;
    data_release: string;
    commit?: string;
  }>;
  readonly linkColData: ReadonlyArray<FooterColData>;
  readonly linkCloud: ReadonlyArray<FooterLink>;
  readonly appInfo: { version?: string; hash?: string };
}

const Footer: React.FC<FooterProps> = ({
  useVersionInfoDetailsHook,
  linkColData,
  linkCloud,
  appInfo,
}: FooterProps) => {
  const { data, isSuccess } = useVersionInfoDetailsHook();

  return (
    <MantineProvider>
      <footer className="flex flex-col bg-primary-darkest justify-center text-center px-4 py-10 text-accent-contrast-darkest text-sm">
        <div className="grid grid-cols-footer-small lg:grid-cols-footer-large lg:gap-6 mx-auto text-left w-full max-w-screen-lg gap-y-7 pb-5 border-b border-[#5D7A8D]">
          <div>
            <div className="font-bold text-2xl lg:text-xl xl:text-lg">
              National Cancer Institute
            </div>
            <div className="font-bold text-[1rem] lg:text-sm">
              at the National Institutes of Health
            </div>
            <ul className="py-4 text-lg lg:text-sm space-y-1 font-content">
              <li>
                UI v{appInfo?.version} @ {appInfo?.hash}
              </li>
              {isSuccess && (
                <>
                  <li data-testid="ftr-api-release">
                    API v{data.tag} @ {data.commit?.slice(0, 8)}
                  </li>
                  <li>
                    <a
                      data-testid="text-footer-release-notes"
                      href="https://docs.gdc.cancer.gov/Data/Release_Notes/Data_Release_Notes/"
                      className="underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {data.data_release}
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
          {linkColData.map((colData, colI) => (
            <div key={colI}>
              <h2 className="text-2xl font-medium lg:text-lg uppercase">
                {colData.header}
              </h2>
              <ul className="py-3 text-lg font-bold lg:text-xs space-y-2">
                {colData.links.map((linkData, linkI) => (
                  <li key={linkI} className="font-content">
                    {linkData.LinkComponent ? (
                      <linkData.LinkComponent href={linkData.url}>
                        {linkData.title}
                      </linkData.LinkComponent>
                    ) : (
                      <a
                        href={linkData.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {linkData.title}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <ul className="text-lg lg:text-sm py-8 font-content divide-x divide-solid">
          {linkCloud.map((linkData, index) => (
            <li
              className="inline-block px-1 leading-none font-bold"
              key={index}
            >
              <a href={linkData.url} target="_blank" rel="noopener noreferrer">
                {linkData.title}
              </a>
            </li>
          ))}
        </ul>

        <div className="text-lg font-medium lg:text-[1rem] xl:text-sm leading-none font-content">
          NIH... Turning Discovery Into Health{" "}
          <span className="text-lg xl:text-[1rem]">&reg;</span>
        </div>
      </footer>
    </MantineProvider>
  );
};

export default Footer;
