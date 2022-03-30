import { useMemo } from "react";
import { consequenceTypes } from "./constants";

const consequencePriorityOrder = [
  'missense_variant',
  'start_lost',
  'stop_lost',
  'stop_gained',
  'frameshift_variant',
];

interface Donor {
  readonly id: string;
  readonly gender: string;
  readonly race: string;
  readonly ethnicity: string;
  readonly age: number;
  readonly vitalStatus: 'not reported' | 'Alive' | 'Dead';
  readonly daysToDeath: number;
};

interface Gene {
  readonly id: string;
  readonly symbol: string;
  readonly totalDonors: number;
  readonly cgc: boolean;
  readonly cnv: number;
}

interface OncoGridDisplayData {
  readonly donors: Donor[];
  readonly genes: Gene[];
  readonly ssmObservations: any[];
  readonly cnvObservations: any[];
}

const useOncoGridDisplayData = (data : any) : OncoGridDisplayData =>
  useMemo(() => {
    const cnvObservations = data?.cnvOccurrences.map((occ) => ({
      donorId: occ.case.case_id,
      geneId: occ?.cnv?.consequence?.[0]?.gene.gene_id,
      ids: [occ.cnv_occurrence_id],
      cnvChange: occ.cnv.cnv_change,
      type: "cnv",
    }));

    const donors = data?.cases
      .map((donor) => {
        const {
          gender = "not reported",
          race = "not reported",
          ethnicity = "not reported",
          days_to_death,
          vital_status: vitalStatus = "not reported",
        } = donor?.demographic || {};
        const age_at_diagnosis = donor?.diagnoses?.[0].age_at_diagnosis;

        return {
          gender,
          race,
          ethnicity,
          vitalStatus,
          id: donor.case_id,
          displayId: `${donor.project.project_id} / ${donor.submitter_id}`,
          // The oncogrid library uses -777 as a special null value, don't ask me why :(
          age: age_at_diagnosis !== undefined ? age_at_diagnosis : -777,
          daysToDeath: days_to_death !== undefined ? days_to_death : -777,
          cnv: cnvObservations.filter((cnv) => donor.case_id === cnv.donorId)
            .length,
          ...Object.fromEntries(
            donor.summary.data_categories.map((cat) => [
              cat.data_category,
              cat.file_count,
            ]),
          ),
        };
      })
      .filter((c) => c.id);

    const genes = data?.genes.map((gene) => ({
      id: gene.gene_id,
      symbol: gene.symbol,
      totalDonors: gene._score,
      cgc: gene.is_cancer_gene_census,
      cnv: cnvObservations.filter((cnv) => gene.gene_id === cnv.geneId).length,
    }));

    const caseIds = new Set(donors.map((d) => d.id));
    const geneIdToSymbol = Object.fromEntries(
      genes.map((g) => [g.id, g.symbol]),
    );

    // TODO - something ain't right here
    const ssmMap = {};
    data?.ssmOccurrences
      .filter((occ) => caseIds.has(occ.case.case_id))
      .forEach((obv) => {
        const consequences = obv.ssm.consequence.filter((c) =>
          consequenceTypes.includes(c.transcript.consequence_type) && 
          c?.transcript?.annotation?.vep_impact && 
          geneIdToSymbol[c.transcript.gene.gene_id]
        );
        consequences.forEach((c) => {
          const key = `${c.transcript.gene.gene_id}_${obv.case.case_id}_${c.transcript.consequence_type}`;
          if (
            !ssmMap[key] ||
            (ssmMap[key] && !ssmMap[key]?.ids.includes(obv.ssm.ssm_id))
            
          ) {
            ssmMap[key] = {
              ids: [...(ssmMap[key]?.ids || []), obv.ssm.ssm_id],
              donorId: obv.case.case_id,
              geneId: c.transcript.gene.gene_id,
              consequence: c.transcript.consequence_type,
              type: "mutation",
              geneSymbol: geneIdToSymbol[c.transcript.gene.gene_id],
              functionalImpact: c.transcript.annotation.vep_impact,
            };
          }
        });
      });

    const ssmObservations = Object.values(ssmMap).sort((a, b) => (
        consequencePriorityOrder.indexOf(a.consequence) -
        consequencePriorityOrder.indexOf(b.consequence)
      )
    );
 
    return { donors, genes, ssmObservations, cnvObservations };
  }, [JSON.stringify(data)]);

export default useOncoGridDisplayData;
