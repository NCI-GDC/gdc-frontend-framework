export interface ConsequenceTableData {
  gene: string;
  gene_id: string;
  aa_change: string;
  DNAChange: string;
  consequences: string;
  transcript_id: string;
  is_canonical: boolean;
  gene_strand: number;
  impact: {
    polyphenImpact: string;
    polyphenScore: number;
    siftImpact: string;
    siftScore: number;
    vepImpact: string;
  };
  subRows: string;
}
