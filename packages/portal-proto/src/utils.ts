import { KeyboardEventHandler } from "react";
import { CartFile } from "@gff/core";
import { replace, sortBy } from "lodash";
import { DocumentWithWebkit } from "./features/types";

export const toggleFullScreen = async (
  ref: React.MutableRefObject<any>,
): Promise<void> => {
  // Webkit vendor prefix for Safari support: https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen#browser_compatibility
  if (
    !document.fullscreenElement &&
    !(document as DocumentWithWebkit).webkitFullscreenElement
  ) {
    if (ref.current.requestFullscreen) {
      await ref.current.requestFullscreen();
    } else if (ref.current.webkitRequestFullScreen) {
      ref.current.webkitRequestFullScreen();
    }
  } else {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if ((document as DocumentWithWebkit).webkitExitFullscreen) {
      (document as DocumentWithWebkit).webkitExitFullscreen();
    }
  }
};

/* eslint-disable @typescript-eslint/ban-types */
export const createKeyboardAccessibleFunction = (
  func: Function,
): KeyboardEventHandler<any> => {
  return (e: React.KeyboardEvent<any>) => (e.key === "Enter" ? func() : null);
};
/* eslint-enable */

export const capitalize = (original: string): string => {
  const customCapitalizations = {
    id: "ID",
    uuid: "UUID",
    dna: "DNA",
    dbsnp: "dbSNP",
    cosmic: "COSMIC",
    civic: "CIViC",
  };

  return original
    .split(" ")
    .map(
      (word) =>
        customCapitalizations[word.toLowerCase()] ||
        `${word.charAt(0).toUpperCase()}${word.slice(1)}`,
    )
    .join(" ");
};

export const truncateString = (str: string, n: number): string => {
  if (str.length > n) {
    return str.substring(0, n) + "...";
  } else {
    return str;
  }
};
export const externalLinkNames = {
  civic: "CIViC",
  entrez_gene: "NCBI Gene",
  hgnc: "HGNC",
  omim_gene: "OMIM",
  uniprotkb_swissprot: "UniProtKB Swiss-Prot",
};

export const geneExternalLinkNames = {
  civic: "CIViC",
  entrez_gene: "NCBI Gene",
  hgnc: "HGNC",
  omim_gene: "OMIM",
  uniprotkb_swissprot: "UniProtKB Swiss-Prot",
};

export const externalLinks = {
  civic: (id: string): string => `https://civicdb.org/links/gene/${id}`,
  civicMutaton: (id: string): string =>
    `https://civicdb.org/links/variant/${id}`,
  cosm: (id: string): string =>
    `http://cancer.sanger.ac.uk/cosmic/mutation/overview?id=${id}`,
  cosn: (id: string): string =>
    `http://cancer.sanger.ac.uk/cosmic/ncv/overview?id=${id}`,
  dbsnp: (id: string): string =>
    `https://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?rs=${id}`,
  ensembl: (id: string): string =>
    `http://nov2020.archive.ensembl.org/Homo_sapiens/Gene/Summary?db=core;g=${id}`,
  entrez_gene: (id: string): string => `http://www.ncbi.nlm.nih.gov/gene/${id}`,
  hgnc: (id: string): string =>
    `https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/${id}`,
  omim_gene: (id: string): string => `http://omim.org/entry/${id}`,
  transcript: (id: string): string =>
    `http://nov2020.archive.ensembl.org/Homo_sapiens/Transcript/Summary?db=core;t=${id}`,
  uniprotkb_swissprot: (id: string): string =>
    `http://www.uniprot.org/uniprot/${id}`,
};

export const calculatePercentage = (count: number, total: number): string =>
  ((count / total) * 100).toFixed(2);

export const allFilesInCart = (carts: CartFile[], files: CartFile[]): boolean =>
  files?.every((file) => carts.some((cart) => cart.fileId === file.fileId));

/**
 *
 * @param givenObject Array of given objects
 * @param property Property (string) which we want to base the comparison on
 * @returns the array of given objects (@param givenObject) in ascending order based on the (@param property)
 */
export const sortByPropertyAsc = <T>(
  givenObjects: Array<T>,
  property: string,
): Array<T> =>
  sortBy(givenObjects, [
    (e) => replace(e[property], /[^a-zA-Z]/g, "").toLocaleLowerCase(),
  ]);
