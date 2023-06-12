export interface ConsequenceTableData {
  gene: string;
  aa_change: string;
  DNAChange: string;
  consequences: string;
  transcript_id: string;
  gene_strand: number;
  impact: {
    polyphenImpact: string;
    polyphenScore: number;
    siftImpact: string;
    siftScore: string | number;
    vepImpact: string;
  };
}
