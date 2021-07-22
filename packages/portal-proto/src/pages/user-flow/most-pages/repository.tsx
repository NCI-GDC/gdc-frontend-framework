import { NextPage } from "next";
import Link from "next/link";
import { UserFlowVariedPages } from "../../../features/layout/UserFlowVariedPages";
import { CohortManager } from "../../../features/user-flow/most-pages/cohort";
import Select from "react-select";
import { useState } from "react";

const RepositoryPage: NextPage = () => {
  const options = [
    { value: "cb-modal", label: "Cohort Buidler Modal" },
    { value: "cb-expand", label: "Cohort Builder Expand" },
  ];

  const [protoOption, setProtoOption] = useState(options[0]);
  const [isExpanded, setIsExpanded] = useState(false);

  const [showCohortBuilderModal, setShowCohortBuilderModal] = useState(false);

  const Options = () => (
    <Select
      inputId="analysis-proto-options"
      isSearchable={false}
      value={protoOption}
      options={options}
      onChange={(v) => {
        if (v.value != "cb-expand") {
          setIsExpanded(false);
        }
        setProtoOption(v);
      }}
    />
  );

  const headerElements = [
    <Link key="Home" href="/">
      Home
    </Link>,
    <Link key="Studies" href="/user-flow/most-pages/studies">
      Studies
    </Link>,
    <Link key="Analysis" href="/user-flow/most-pages/analysis">
      Analysis
    </Link>,
    "Repository",
  ];

  return (
    <UserFlowVariedPages {...{ headerElements, Options }}>
      <div className="flex flex-col p-4 gap-y-4">
        <div className="border p-4 border-gray-400">
          <CohortManager
            setIsModalOpen={setShowCohortBuilderModal}
            setIsExpanded={setIsExpanded}
            isExpanded={isExpanded}
            mode={protoOption}
            isOpen={showCohortBuilderModal}
            closeModal={() => setShowCohortBuilderModal(false)}
          />
        </div>
        <div className="border p-4 border-gray-400">
          <div className="text-center">
            Some repo-specific actions, e.g. download, etc. here.
          </div>
        </div>
        <div className="border p-4 border-gray-400">
          <Files />
        </div>
      </div>
    </UserFlowVariedPages>
  );
};

export default RepositoryPage;

const Files = () => {
  const filenames = [
    "5c5855ea-eb7c-4a36-b171-c6c41795f937.wxs.somaticsniper.raw_somatic_mutation.vcf.gz",
    "10f1f28a-d8ae-4376-82e0-9b87947cf942_wgs_gdc_realn.bam",
    "89707eb7-0a0c-48da-8153-2ff875905714.wxs.SomaticSniper.somatic_annotation.vcf.gz",
    "5d1b7efc-03b0-4dbd-8122-96e15638ca45.rna_seq.star_splice_junctions.tsv.gz",
    "ceb05441-9d6e-4ad2-b99d-6c0037c89305.wxs.VarScan2.aliquot.maf.gz",
    "12629490-dff9-4bef-964a-1d3655beff73.wxs.Pindel.somatic_annotation.vcf.gz",
    "821f2e4c-0fda-422c-849b-89898994e34f_wxs_gdc_realn.bam",
    "204feb71-8a08-44b4-ad81-cf810b41ebdc_wgs_gdc_realn.bam",
    "a74acc66-1899-4cc2-9669-00f3830ab3b5.wxs.MuTect2.somatic_annotation.vcf.gz",
    "0f02be45-869f-48e8-8010-7e100f6cf09f_wgs_gdc_realn.bam",
    "0ae20bf8-f05d-4b66-bba2-ae7b48aa4ace.wxs.somaticsniper.raw_somatic_mutation.vcf.gz",
    "c2ac6287-2da3-4da1-ab39-baf60b2b202d.wxs.SomaticSniper.aliquot.maf.gz",
    "259cc07b-09d5-4251-bd15-4535420291d2.wxs.mutect2.raw_somatic_mutation.vcf.gz",
    "eb4abd6e-e321-4047-9ee6-9e2c21d454cb.rna_seq.transcriptome.gdc_realn.bam",
    "TCGA-HNSC.fcf1dd86-0f1b-4f3d-a6c6-dcd80e201f20.gene_level_copy_number.tsv",
    "UNDID_p_TCGA_353_354_355_37_NSP_GenomeWideSNP_6_G03_1376908.grch38.seg.v2.txt",
    "TCGA_AB_2969_11A_01D_0756_21.nocnv_grch38.seg.v2.txt",
    "50a83d0d-595c-4439-87f4-abdee17d11ef.vep.vcf.gz",
    "TCGA-LAML.80fd1413-7e22-44e2-b3c3-f03c08a2fefd.ascat2.allelic_specific.seg.txt",
    "genome.wustl.edu_clinical.TCGA-AB-2903.xml",
  ];

  return (
    <div className="overflow-y-auto h-96">
      <table
        className="table-auto border-collapse border-gray-400 w-full"
        style={{ borderSpacing: "4em" }}
      >
        <thead>
          <tr className="bg-gray-400">
            <th className="px-2">File</th>
            <th className="px-2">Lorem</th>
            <th className="px-2">Ipsum</th>
            <th className="px-2">Dolor</th>
            <th className="px-2">Licet</th>
            <th className="px-2">Dona</th>
            <th className="px-2">Nobis</th>
            <th className="px-2">Pacem</th>
          </tr>
        </thead>
        <tbody>
          {filenames.map((filename, i) => (
            <tr key={filename} className={i % 2 == 0 ? "bg-gray-200" : ""}>
              <td className="px-2 break-all">{filename}</td>
              <td className="px-2">XXXX</td>
              <td className="px-2">XXXX</td>
              <td className="px-2">XXX</td>
              <td className="px-2">X</td>
              <td className="px-2">XXXX</td>
              <td className="px-2 whitespace-nowrap">XXXXXX XXXX</td>
              <td className="px-2">XXXXX</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
