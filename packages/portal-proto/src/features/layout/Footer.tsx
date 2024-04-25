import { ExternalLink } from "@/components/ExternalLink";
import Link from "next/link";
import { useVersionInfoDetails, PUBLIC_APP_INFO } from "@gff/core";

export const Footer: React.FC = () => {
  const { data, isSuccess } = useVersionInfoDetails();

  interface footerLink {
    readonly title: string;
    readonly url: string;
    readonly normalLink?: boolean;
  }
  interface footerColData {
    readonly header: string;
    readonly links: footerLink[];
  }

  const footerLinkColData: ReadonlyArray<footerColData> = [
    {
      header: "Applications",
      links: [
        {
          title: "Data Portal",
          url: "/",
        },
        {
          title: "Website",
          url: "https://gdc.cancer.gov/",
        },
        {
          title: "API",
          url: "https://gdc.cancer.gov/developers/gdc-application-programming-interface-api",
        },
        {
          title: "Data Transfer Tool",
          url: "https://docs.gdc.cancer.gov/Data_Transfer_Tool/Users_Guide/Getting_Started/",
        },
        {
          title: "Documentation",
          url: "https://docs.gdc.cancer.gov/",
        },
        {
          title: "Data Submission Portal",
          url: "https://portal.gdc.cancer.gov/submission",
        },
        {
          title: "Publications",
          url: "https://gdc.cancer.gov/about-data/publications",
        },
      ],
    },
    {
      header: "More Information",
      links: [
        {
          title: "Site Home",
          url: "/",
          normalLink: true,
        },
        {
          title: "Support",
          url: "https://gdc.cancer.gov/support",
        },
        {
          title: "Listserv",
          url: "https://list.nih.gov/cgi-bin/wa.exe?SUBED1=gdc-users-l&A=1",
        },
      ],
    },
    {
      header: "Policies",
      links: [
        {
          title: "Accessibility",
          url: "https://www.cancer.gov/policies/accessibility",
        },
        {
          title: "Disclaimer",
          url: "https://www.cancer.gov/policies/disclaimer",
        },
        {
          title: "FOIA",
          url: "https://www.cancer.gov/policies/foia",
        },
        {
          title: "HHS Vulnerability Disclosure",
          url: "https://www.hhs.gov/vulnerability-disclosure-policy/",
        },
      ],
    },
  ];

  const footerLinkCloud: ReadonlyArray<footerLink> = [
    {
      title: "U.S. Department of Health and Human Services ",
      url: "https://www.hhs.gov/",
    },
    {
      title: "National Institutes of Health ",
      url: "https://www.nih.gov/",
    },
    {
      title: "National Cancer Institute ",
      url: "https://www.cancer.gov/",
    },
    {
      title: "USA.gov",
      url: "https://www.usa.gov/",
    },
  ];

  return (
    <footer className="flex flex-col bg-secondary-darkest justify-center text-center px-4 py-10 text-accent-contrast-darkest text-sm">
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
              UI v{PUBLIC_APP_INFO?.version} @ {PUBLIC_APP_INFO?.hash}
            </li>
            {isSuccess && (
              <>
                <li data-testid="ftr-api-release">
                  API v{data.tag} @ {data.commit?.slice(0, 8)}
                </li>
                <li>
                  <ExternalLink
                    dataTestId="text-footer-release-notes"
                    href="https://docs.gdc.cancer.gov/Data/Release_Notes/Data_Release_Notes/"
                    className="underline"
                  >
                    {data.data_release}
                  </ExternalLink>
                </li>
              </>
            )}
          </ul>
        </div>
        {footerLinkColData.map((colData, colI) => (
          <div key={colI}>
            <h2 className="text-2xl font-medium lg:text-lg uppercase">
              {colData.header}
            </h2>
            <ul className="py-3 text-lg font-bold lg:text-xs space-y-2">
              {colData.links.map((linkData, linkI) => (
                <li key={linkI} className="font-content">
                  {linkData.normalLink ? (
                    <Link href={linkData.url}>{linkData.title}</Link>
                  ) : (
                    <ExternalLink href={linkData.url}>
                      {linkData.title}
                    </ExternalLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <ul className="text-lg lg:text-sm py-8 font-content divide-x divide-solid">
        {footerLinkCloud.map((linkData, index) => (
          <li className="inline-block px-1 leading-none font-bold" key={index}>
            <ExternalLink href={linkData.url}>{linkData.title}</ExternalLink>
          </li>
        ))}
      </ul>

      <div className="text-lg font-medium lg:text-[1rem] xl:text-sm leading-none font-content">
        NIH... Turning Discovery Into Health{" "}
        <span className="text-lg xl:text-[1rem]">&reg;</span>
      </div>
    </footer>
  );
};
