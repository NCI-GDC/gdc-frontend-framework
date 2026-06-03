export type CivicLinkType = "entrez_id" | "variant";

export type ExternalReferenceEntry = {
  label: string;
  ids: string | string[] | null | undefined;
  buildHref: (id: string) => string;
  linkTitle?: string;
};

type ExternalLinks = {
  civic: (id: string, type: CivicLinkType) => string;
  cosm: (id: string) => string;
  cosn: (id: string) => string;
  dbsnp: (id: string) => string;
  ensembl: (id: string) => string;
  entrez_gene: (id: string) => string;
  genecards: (id: string) => string;
  hgnc: (id: string) => string;
  omim_gene: (id: string) => string;
  transcript: (id: string) => string;
  uniprotkb_swissprot: (id: string) => string;
};

export const externalLinks: ExternalLinks = {
  civic: (id: string, type: CivicLinkType): string =>
    `https://civicdb.org/links/?idtype=${type}&id=${id}`,

  cosm: (id: string): string =>
    `http://cancer.sanger.ac.uk/cosmic/mutation/overview?id=${id}`,

  cosn: (id: string): string =>
    `http://cancer.sanger.ac.uk/cosmic/ncv/overview?id=${id}`,

  dbsnp: (id: string): string => `https://www.ncbi.nlm.nih.gov/snp/${id}`,

  ensembl: (id: string): string =>
    `http://nov2020.archive.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=${id}`,

  entrez_gene: (id: string): string => `http://www.ncbi.nlm.nih.gov/gene/${id}`,

  genecards: (id: string): string =>
    `https://www.genecards.org/cgi-bin/carddisp.pl?gene=${id}`,

  hgnc: (id: string): string =>
    `https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${id}`,

  omim_gene: (id: string): string => `http://omim.org/entry/${id}`,

  transcript: (id: string): string =>
    `http://nov2020.archive.ensembl.org/Homo_sapiens/Transcript/Summary?db=core;t=${id}`,

  uniprotkb_swissprot: (id: string): string =>
    `http://www.uniprot.org/uniprot/${id}`,
};
