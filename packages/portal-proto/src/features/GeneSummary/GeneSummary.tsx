import { AnchorLink } from "@/components/AnchorLink";
import { CollapsibleTextArea } from "@/components/CollapsibleTextArea";
import { SummaryCard, SummaryHeader } from "@/components/SummaryHeader";
import { useGenesSummaryData } from "@gff/core";
import { FaBook, FaTable } from "react-icons/fa";
import { HiPlus, HiMinus } from "react-icons/hi";
import { externalLinkNames, externalLinks } from "src/utils";
import { humanify } from "../biospecimen/utils";
import { formatDataForHorizontalTable } from "../files/utils";

export const GeneSummary = ({ gene_id }: { gene_id: string }): JSX.Element => {
  const { data, isFetching } = useGenesSummaryData({ gene_id });
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
    const annotation = is_cancer_gene_census
      ? // TODO: need to change this after figuring out what to do with clicking on it
        "Cancer Gene Census"
      : "--";
    const synonymsList = synonyms?.length && (
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
      synonyms: synonymsList,
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
    const {
      genes: {
        external_db_ids: { entrez_gene, uniprotkb_swissprot, hgnc, omim_gene },
        gene_id,
        civic,
      },
    } = data;

    const externalLinksObj = {
      entrez_gene,
      uniprotkb_swissprot,
      hgnc,
      omim_gene,
      ensembl: gene_id,
      civic,
    };

    let externalReferenceLinksobj = {};

    Object.keys(externalLinksObj).forEach((link) => {
      const modified = {
        [`${externalLinkNames[link] || link.replace(/_/, " ")}`]:
          externalLinksObj[link] && externalLinksObj[link]?.length ? (
            <AnchorLink
              href={externalLinks[link](externalLinksObj[link])}
              title={externalLinksObj[link]}
            />
          ) : (
            "--"
          ),
      };

      externalReferenceLinksobj = { ...externalReferenceLinksobj, ...modified };
    });

    const headersConfig = Object.keys(externalReferenceLinksobj).map((key) => ({
      field: key,
      name: humanify({ term: key }),
    }));

    return formatDataForHorizontalTable(
      externalReferenceLinksobj,
      headersConfig,
    );
  };

  return (
    <div>
      {!isFetching && data?.genes && (
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
