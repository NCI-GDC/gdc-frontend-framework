export interface ConsequenceTableData {
  gene: string;
  gene_id: string;
  aa_change: string;
  coding_dna_change: string;
  consequences: string;
  transcript: string;
  is_canonical: boolean;
  gene_strand: number;
  impact: {
    polyphen_impact: string;
    polyphen_score: number;
    sift_impact: string;
    sift_score: string | number;
    vep_impact: string;
  };
}
