import { Accordion } from "@mantine/core";
import { MdExpandMore as ExpandMoreIcon } from "react-icons/md";
import { FaExclamationCircle } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import tw from "tailwind-styled-components";

const H2 = tw.h2`
  font-heading
  text-md
  font-bold
  text-sm
`;

const P = tw.p`
  font-content
  font-normal
  text-sm
`;

function DownloadInfo() {
  return (
    <Accordion
      variant="contained"
      chevron={<ExpandMoreIcon size="1.75em" />}
      classNames={{
        item: "border-cartDarkerOrange border-l-[3rem]",
        chevron: "text-cartDarkerOrange",
        label: "text-sm font-bold uppercase font-heading py-2 ml-4",
      }}
    >
      <Accordion.Item
        value="howTo"
        className="border border-cartDarkerOrange rounded-none text-secondary-contrast-lighter bg-cartLighterOrange"
      >
        <Accordion.Control
          className="hover:bg-[#FFFFFF50] pl-0 relative"
          data-testid="button-how-to-download-files"
        >
          <FaExclamationCircle
            color="white"
            className="h-6 w-6 absolute left-[-2.2rem] top-[0.4rem]"
            aria-label="Warning"
          />
          How to download files in my cart?
        </Accordion.Control>
        <Accordion.Panel>
          <div data-testid="text-download-information">
            <div className="mb-2">
              <H2>Download Manifest:</H2>
              <P>
                Download a manifest for use with the{" "}
                <a
                  data-testid="link-gdc-data-transfer-tool"
                  href="https://gdc.cancer.gov/access-data/gdc-data-transfer-tool"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-linkDarkerColor font-bold underline"
                >
                  <FiExternalLink className="inline" /> GDC Data Transfer Tool
                </a>
                . The GDC Data Transfer Tool is recommended for transferring
                large volumes of data.
              </P>
            </div>

            <div className="mb-2">
              <H2>Download Cart:</H2>
              <P>Download Files in your Cart directly from the Web Browser.</P>
            </div>

            <div className="mb-2">
              <H2>Download Reference Files:</H2>
              <P>
                Download{" "}
                <a
                  data-testid="link-gdc-reference-files"
                  href="https://gdc.cancer.gov/about-data/gdc-data-processing/gdc-reference-files"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-linkDarkerColor font-bold"
                >
                  <FiExternalLink className="inline" /> GDC Reference Files
                </a>{" "}
                for use in your genomic data analysis.
              </P>
            </div>
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

export default DownloadInfo;
