import { AnchorLink } from "@/components/AnchorLink";
import { CollapsibleTextArea } from "@/components/CollapsibleTextArea";
import { SummaryCard, SummaryHeader } from "@/components/SummaryHeader";
import { useGenesSummaryData } from "@gff/core";
import { FaBook, FaTable } from "react-icons/fa";
import { HiPlus, HiMinus } from "react-icons/hi";
import { externalLinkNames, externalLinks } from "src/utils";
import { humanify } from "../biospecimen/utils";
import { formatDataForHorizontalTable } from "../files/utils";

export const GeneSummary = ({ gene_id }: { gene_id: string }) => {
  const { data, isFetching } = useGenesSummaryData({ gene_id });
  console.log(data);
  const formatDataForSummary = () => {
    const {
      genes: {
        symbol,
        name,
        synonyms,
        biotype: type,
        gene_chromosome,
        gene_start,
        gene_end,
        gene_strand,
        description,
        is_cancer_gene_census,
      },
    } = data;

    const location = `chr${gene_chromosome}:${gene_start}-${gene_end} (GRCh38)`;
    const Strand = gene_strand && gene_strand === 1 ? <HiPlus /> : <HiMinus />;
    const annotation = is_cancer_gene_census ? (
      <a href="#" className="underline">
        Cancer Gene Census
      </a>
    ) : (
      "--"
    );
    const synonymss = synonyms?.length && (
      <div>
        {synonyms?.map((s) => (
          <div key={s}>{s}</div>
        ))}
      </div>
    );

    const desc = <CollapsibleTextArea text={description} />;

    const summaryObj = {
      symbol,
      name,
      synonyms: synonymss,
      type,
      location,
      Strand,
      description: desc,
      annotation,
    };

    const headersConfig = Object.keys(summaryObj).map((key) => ({
      field: key,
      name: humanify({ term: key }),
    }));

    return formatDataForHorizontalTable(summaryObj, headersConfig);
  };

  const formatDataForExternalReferences = () => {
    const externalLinksObj = {
      ...data.genes.external_db_ids,
      ensembl: data.genes.gene_id,
      civic: data.genes.civic,
    };

    // console.log(externalLinksObj);

    let obj = {};

    Object.keys(externalLinksObj).forEach((link) => {
      const objs = {
        [`${externalLinkNames[link] || link.replace(/_/, " ")}`]:
          externalLinksObj[link]?.length ? (
            <AnchorLink
              href={externalLinks[link](externalLinksObj[link][0])}
              title={externalLinksObj[link][0]}
            />
          ) : (
            "--"
          ),
      };

      obj = { ...obj, ...objs };
    });

    const headersConfig = Object.keys(obj).map((key) => ({
      field: key,
      name: humanify({ term: key }),
    }));

    return formatDataForHorizontalTable(obj, headersConfig);
  };

  return (
    <div>
      {!isFetching && data.genes && (
        <>
          <SummaryHeader iconText="GN" headerTitle={data.genes.symbol} />
          <div className="pt-4">
            <div className="text-nci-gray">
              <div className="flex gap-6">
                <div className="flex-1">
                  <SummaryCard
                    tableData={formatDataForSummary()}
                    Icon={FaTable}
                  />
                </div>
                <div className="flex-1">
                  <SummaryCard
                    tableData={formatDataForExternalReferences()}
                    Icon={FaBook}
                    title="External References"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
