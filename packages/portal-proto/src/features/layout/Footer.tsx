import { ExternalLink } from "@/components/ExternalLink";
import Link from "next/link";

export const Footer: React.FC = () => {
  //TODO: retrieve these values from state (?)

  const uiVersion = "1.30.0";
  const uiCommitHash = "9fbb447b";
  const apiVersion = "3.0.0";
  const apiCommitHash = "4dd36805";
  const dataRelease = "Data Release 34.0 - July 27, 2022";

  return (
    <div className="flex flex-col bg-primary-darker justify-center text-center p-4 text-primary-contrast-darker">
      <div>
        <Link title="Site Home" href="/">
          Site Home
        </Link>{" "}
        <span> | </span>
        <ExternalLink href="https://www.cancer.gov/policies">
          Policies
        </ExternalLink>
        <ExternalLink href="https://www.cancer.gov/policies/accessibility">
          Accessibility
        </ExternalLink>
        <ExternalLink href="https://www.cancer.gov/policies/foia">
          FOIA
        </ExternalLink>
        <ExternalLink href="https://www.hhs.gov/vulnerability-disclosure-policy/index.html">
          HHS Vulnerability Disclosure
        </ExternalLink>
        <ExternalLink href="https://gdc.cancer.gov/support" separator={false}>
          Support
        </ExternalLink>
      </div>
      <div>
        <ExternalLink href="https://www.hhs.gov/">
          U.S. Department of Health and Human Services
        </ExternalLink>
        <ExternalLink href="https://www.nih.gov/">
          National Institutes of Health
        </ExternalLink>
        <ExternalLink href="https://www.cancer.gov/">
          National Cancer Institute
        </ExternalLink>
        <ExternalLink href="https://www.usa.gov/" separator={false}>
          USA.gov
        </ExternalLink>
      </div>
      <div>NIH... Turning Discovery Into Health ®</div>
      <div>
        <span
          title={`UI version: ${uiVersion}${
            uiVersion ? `, tags: ${uiVersion}` : ""
          }`}
        >
          {`UI v${uiVersion}${
            uiCommitHash ? ` @ ${uiCommitHash.slice(0, 8)}` : ""
          }`}
        </span>

        {", "}

        <span title={`API version: ${apiVersion}`}>
          {`API v${apiVersion}${
            apiCommitHash ? ` @ ${apiCommitHash.slice(0, 8)}` : ""
          }`}
        </span>

        {", "}

        <span>
          <ExternalLink
            href="https://docs.gdc.cancer.gov/Data/Release_Notes/Data_Release_Notes/"
            separator={false}
          >
            {dataRelease}
          </ExternalLink>
        </span>
      </div>
    </div>
  );
};
