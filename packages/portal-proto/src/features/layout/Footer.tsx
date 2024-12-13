import Link from "next/link";
import { useVersionInfoDetails, PUBLIC_APP_INFO } from "@gff/core";
import { Footer as CommonFooter } from "@gff/portal-components";

const footerLinkColData = [
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
        url: "https://gdc.cancer.gov/access-data/gdc-data-transfer-tool",
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
        linkComponent: Link,
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

const footerLinkCloud = [
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

export const Footer: React.FC = () => {
  return (
    <CommonFooter
      useVersionInfoDetailsHook={useVersionInfoDetails}
      linkColData={footerLinkColData}
      linkCloud={footerLinkCloud}
      appInfo={PUBLIC_APP_INFO}
    />
  );
};
