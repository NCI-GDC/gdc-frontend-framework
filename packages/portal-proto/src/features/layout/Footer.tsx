import { ExternalLink } from "@/components/ExternalLink";
import Link from "next/link";
import { useEffect } from "react";
import {
  useCoreSelector,
  useCoreDispatch,
  selectVersionInfo,
  fetchVersionInfo,
} from "@gff/core";

export const Footer: React.FC = () => {
  const { status, data } = useCoreSelector((state) => selectVersionInfo(state));
  const dispatch = useCoreDispatch();

  useEffect(() => {
    dispatch(fetchVersionInfo());
  }, [dispatch]);

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
          title: "Legacy Archive",
          url: "https://portal.gdc.cancer.gov/legacy-archive",
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
    <footer className="flex flex-col bg-accent-darkest justify-center text-center p-10 text-accent-contrast-darkest text-xs">
      <div className="flex gap-8 m-auto text-left justify-between w-full max-w-screen-lg flex-wrap pb-5 border-b border-accent-contrast-darkest">
        <div>
          <h3 className="font-bold text-lg">National Cancer Institute</h3>
          <h4 className="font-bold">at the National Institutes of Health</h4>
          {/* TODO: fill in Placeholders */}
          <ul className="py-4 text-sm space-y-1">
            <li>Placeholder UI v1.30.0 @ 9fbb447b</li>
            <li>Placeholder API v3.0.0 @ 4dd36805</li>
            {status === "fulfilled" && (
              <li>
                <ExternalLink
                  dataTestId="ftr-release-notes"
                  href="https://docs.gdc.cancer.gov/Data/Release_Notes/Data_Release_Notes/"
                  separator={false}
                  className="underline"
                >
                  {data.data_release}
                </ExternalLink>
              </li>
            )}
          </ul>
        </div>
        {footerLinkColData.map((colData, colI) => (
          <div className="w-[200px] md:w-auto" key={colI}>
            <h3 className="text-lg uppercase">{colData.header}</h3>
            <ul className="py-3 font-semibold space-y-2">
              {colData.links.map((linkData, linkI) => (
                <li key={linkI}>
                  {linkData.normalLink ? (
                    <Link href={linkData.url}>{linkData.title}</Link>
                  ) : (
                    <ExternalLink href={linkData.url} separator={false}>
                      {linkData.title}
                    </ExternalLink>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div>
        <ul className="divide-x divide-solid p-8">
          {footerLinkCloud.map((linkData, index) => (
            <li className="inline-block px-1 leading-none" key={index}>
              <ExternalLink href={linkData.url} separator={false}>
                {linkData.title}
              </ExternalLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-sm leading-none">
        NIH... Turning Discovery Into Health &reg;
      </div>
    </footer>
  );
};
