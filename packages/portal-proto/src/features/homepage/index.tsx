import HorizontalSummaryTotalsPanel from "@/features/homepage/HorizontalSummaryTotalsPanel";
import { Bodyplot } from "@/features/homepage/Bodyplot";
import HPCard from "./HPCard";
import HPCardImgAlt from "./HPCardImgAlt";
import HPCardImg from "./HPCardImg";
import { useTotalCounts } from "@gff/core";
import { Image } from "@/components/Image";
import Link from "next/link";

export const homepageButtonClass = `
bg-primary text-xl md:text-lg lg:text-sm text-base-max border-base-light border-0
hover:bg-primary-darker hover:text-primary-darker-contrast
font-medium font-heading rounded mt-4 px-4 py-3 w-fit inline-block cursor-pointer
`;

const Homepage = (): JSX.Element => {
  const { data: countsInfo } = useTotalCounts();
  return (
    <div className="flex flex-col bg-base-max">
      <div className="flex flex-col xl:flex-row xl:py-10 bg-hero-pattern bg-cover pt-8">
        <div className="flex flex-col px-4 xl:pr-0 basis-1/2">
          <div className="flex flex-col">
            <h1 className="font-heading text-6xl md:text-5xl tracking-normal xl:text-[2.4rem] xl:tracking-[.03em] font-bold text-primary-darkest py-5">
              Genomic Data Commons
              <span className="block font-medium">Data Portal</span>
            </h1>
            <h2 className="mt-6 items-center font-heading font-bold text-2xl md:text-xl xl:text-md text-summarybar-text">
              Harmonized Cancer Datasets
            </h2>
            <p className="text-2xl md:text-xl w-full tracking-normal items-center xl:text-[1rem] xl:w-[80%] xl:tracking-wide text-primary-content-darkest font-content">
              A repository and computational platform for cancer researchers who
              need to understand cancer, its clinical progression, and response
              to therapy.
            </p>
          </div>

          <Link
            href={{
              pathname: "/analysis_page",
              query: { app: undefined },
            }}
            data-testid="button-homepage-explore-datasets"
            className={homepageButtonClass}
          >
            Explore Our Cancer Datasets
          </Link>
          <HorizontalSummaryTotalsPanel />
        </div>

        <div
          className="relative mt-10 pr-4 mx-auto xl:mt-0 xl:-mb-1 xl:self-end "
          id="human-body-parent"
        >
          <Bodyplot />
        </div>
      </div>
      <HPCard
        head="High-quality Datasets"
        subhead="From Foundational Cancer Genomic Studies"
        cardId="high-quality-datasets-card"
        body={
          <>
            High-quality datasets spanning{" "}
            {countsInfo?.caseCount?.toLocaleString()} cases from cancer genomic
            studies such as{" "}
            <strong className="italic font-bold">
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
          <div className="font-content">
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
          </div>
        }
        linkText="Learn More About Our Harmonization Process"
        href="https://gdc.cancer.gov/about-data/gdc-data-processing"
        imgSrc="/homepage/genomic-clinical-data.jpg"
        imgAlt="Data Cloud"
      />
      <div className="bg-mid-pattern bg-cover xl:py-10">
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
            width: 556,
            height: 264,
          }}
        />
        <div className="xl:flex xl:justify-center">
          <div className="bg-base-max px-4 py-6 lg:flex lg:items-center lg:gap-9 xl:max-w-screen-lg xl:rounded-2xl">
            <ul className="grid grid-cols-3 gap-5 lg:gap-4 lg:flex lg:w-2/3">
              {[
                {
                  src: "/homepage/slide1-SurvivalP.jpg",
                  title: "Survival Plot",
                  alt: "graph of survival plot",
                },
                {
                  src: "/homepage/slide1-MutationF.jpg",
                  title: "Mutation Frequency",
                  alt: "graph of mutation frequency",
                },
                {
                  src: "/homepage/slide1-ProteinP.jpg",
                  title: "ProteinPaint",
                  alt: "feature of protein paint",
                },
              ].map((obj, index) => (
                <li
                  className="flex flex-col lg:w-[191px] xl:w-[220px]"
                  key={index}
                >
                  <div className="border-solid rounded-t-lg border-t-1 border-x-1 border-nciGray-lighter">
                    <Image
                      alt={obj.alt}
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
            <div className="mt-8 lg:mt-0">
              <p className="font-content text-secondary-contrast-lighter text-2xl md:text-xl lg:text-[1rem]">
                Analyze your custom cohorts by applying the GDC&apos;s
                collection of tools for visualizing clinical features, genomic
                alterations, and other cancer drivers.
              </p>
              <Link
                href={{
                  pathname: "/analysis_page",
                  query: { app: undefined },
                }}
                className={homepageButtonClass}
              >
                Explore More Tools
              </Link>
            </div>
          </div>
        </div>
      </div>
      <HPCardImgAlt
        head={
          <>
            Download Primary and{" "}
            <span className="whitespace-nowrap">Higher-Level</span>
            <br className="hidden xl:block" /> Data For Further Analysis
          </>
        }
        body={
          <div className="font-content">
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
          </div>
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
        mainClassName="bg-center bg-cover"
      />
    </div>
  );
};

export default Homepage;
