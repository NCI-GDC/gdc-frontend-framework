import { NextLink } from "@mantine/next";
import tw from "tailwind-styled-components";
import HorizontalSummaryTotalsPanel from "@/features/homepage/HorizontalSummaryTotalsPanel";
import { Bodyplot } from "@/features/homepage/Bodyplot";
import HPCard from "./HPCard";
import HPCardImgAlt from "./HPCardImgAlt";
import HPCardImg from "./HPCardImg";
import { useTotalCounts } from "@gff/core";
import { Image } from "@/components/Image";

export const HomepageButton = tw(NextLink)`
bg-primary text-sm text-base-max border-base-light border-1
hover:bg-primary-darker hover:text-primary-darker-contrast
font-medium font-heading rounded mt-4 px-4 py-3 w-fit inline-block
`;

const Homepage = (): JSX.Element => {
  const { data: countsInfo } = useTotalCounts();
  return (
    <div className="flex flex-col w-100 h-100 bg-base-max">
      <div className="flex flex-row bg-hero-pattern bg-cover">
        <div className="flex flex-col pl-7 basis-1/2">
          <div className="flex flex-col mt-12">
            <h1 className="font-heading tracking-[.03em] font-bold text-primary-darkest text-[2.4rem] py-5">
              Genomic Data Commons
              <span className="block font-medium -mt-4">Data Portal</span>
            </h1>
            <h2 className="mt-2 items-center font-heading font-bold text-md text-summarybar-text">
              Harmonized Cancer Datasets
            </h2>
            <p className="items-center tracking-wide text-primary-content-darkest w-[75%] font-content">
              A repository and computational platform for cancer researchers who
              need to understand cancer, its clinical progression, and response
              to therapy.
            </p>
          </div>

          <HomepageButton
            href={{
              pathname: "/analysis_page",
              query: { app: undefined },
            }}
            data-testid="button-homepage-explore-datasets"
          >
            Explore Our Cancer Datasets
          </HomepageButton>
          <HorizontalSummaryTotalsPanel />
          <div className="py-10" />
        </div>
        <div className="flex flex-row basis-1/2">
          <div className="relative mt-12" id="human-body-parent">
            <Bodyplot />
          </div>
        </div>
      </div>
      <HPCard
        head="High-quality Datasets"
        subhead="From Foundational Cancer Genomic Studies"
        body={
          <>
            High-quality datasets spanning{" "}
            {countsInfo?.repositoryCaseCounts?.toLocaleString()} cases from
            cancer genomic studies such as{" "}
            <strong className="italic">
              The Cancer Genomic Atlas (TCGA), Human Cancer Models Initiative
              (HCMI), Foundation Medicine Inc. (FMI), and Clinical Proteomic
              Tumor Analysis Consortium (CPTAC).
            </strong>
          </>
        }
        linkText="Explore These Studies and More in the Projects App"
        href={{
          pathname: "/analysis_page",
          query: { app: "Projects" },
        }}
      />
      <HPCardImgAlt
        head="Access Harmonized Clinical and Genomic Data"
        body={
          <p className="font-content">
            <p>
              Harmonized clinical and genomic data allow for convenient
              cross-analysis and comparison.
            </p>
            <br />
            <p>
              Clinical data, including demographics, diagnosis and treatment
              information, are standardized across hundreds of distinct
              properties.
            </p>
            <br />
            <p>
              State-of-the-art bioinformatics workflows are employed to align
              sequencing reads, ranging from whole genome to single-cell RNA,
              and generate high-level derived data.
            </p>
          </p>
        }
        linkText="Learn More About Our Harmonization Process"
        href="https://gdc.cancer.gov/about-data/gdc-data-processing"
        imgSrc="/homepage/genomic-clinical-data.jpg"
        imgAlt="Data Cloud"
      />
      <HPCardImg
        head="Visualize Genomic Alterations and Clinical Features"
        body={
          <p className="font-content font-medium">
            Create and refine custom cohorts of cancer patients for in silico
            studies using a variety of clinical and biospecimen filters in the
            Cohort Builder.
          </p>
        }
        linkText="Explore Cohort Builder"
        href={{
          pathname: "/analysis_page",
          query: { app: "CohortBuilder" },
        }}
        imgProps={{
          src: "/homepage/data-explorer.png",
          alt: "Skewed representation of data explorer",
          width: 696,
          height: 469,
          objectPosition: "top -54px right 94px",
        }}
      />
      <div className="rounded-2xl shadow-[0px_0px_16px_#00000029] text-center mx-auto mb-10">
        <div className="flex  m-8  max-w-screen-lg gap-14 items-center">
          <ul className="flex gap-4 w-2/3">
            {[
              {
                src: "/homepage/slide1-SurvivalP.jpg",
                title: "Survival Plot",
              },
              {
                src: "/homepage/slide1-MutationF.jpg",
                title: "Mutation Frequency",
              },
              {
                src: "/homepage/slide1-ProteinP.jpg",
                title: "ProteinPaint",
              },
            ].map((obj, index) => (
              <li className="flex flex-col w-[220px]" key={index}>
                <div className="border-solid rounded-t-lg border-t-1 border-x-1 border-nciGray-lighter">
                  <Image
                    alt={obj.title}
                    src={obj.src}
                    width={220}
                    height={164}
                    className="rounded-t-lg"
                  />
                </div>
                <div className="bg-nci-purple text-primary-max text-center rounded-b-lg py-3">
                  {obj.title}
                </div>
              </li>
            ))}
          </ul>
          <div className="text-left">
            <p className="font-content">
              Analyze your custom cohorts by applying the GDC&apos;s collection
              of tools for visualizing clinical features, genomic alterations,
              and other cancer drivers.
            </p>
            <HomepageButton
              href={{
                pathname: "/analysis_page",
                query: { app: undefined },
              }}
            >
              Explore More Tools
            </HomepageButton>
          </div>
        </div>
      </div>
      <HPCardImgAlt
        head={
          <>
            Download Primary and Higher-Level
            <br /> Data For Further Analysis
          </>
        }
        body={
          <p className="font-content">
            <p>
              Seamlessly download clinical, biospecimen, and genomic data from
              your cohorts for further analysis.
            </p>
            <br />
            <p>
              Browse through the files associated with your cohorts in the
              Repository app.
            </p>
            <br />
            <p>
              Find the files you want with the filters available, whether you
              are looking for somatic variants, gene expression data, slide
              images, or even files generated from a specific workflow.
            </p>
          </p>
        }
        linkText="Explore Repository"
        href={{
          pathname: "/analysis_page",
          query: { app: "Downloads" },
        }}
        imgSrc="/homepage/download-data.jpg"
        imgAlt="Data being transferred between files, folders, and clouds"
      />
      <HPCard
        head="Have questions"
        subhead="about the GDC's data or applications?"
        body={
          <>
            Contact our knowledgeable and highly engaged team of specialists for
            help with the data and the many features offered by the Genomic Data
            Commons. Send a question, suggestion, or description of an issue to
            our team who will respond promptly.
            <br />
            We look forward to hearing from our users!
          </>
        }
        linkText="Contact Us"
        href="https://gdc.cancer.gov/support"
        mainClassName="bg-btm-pattern bg-center bg-cover"
      />
    </div>
  );
};

export default Homepage;
