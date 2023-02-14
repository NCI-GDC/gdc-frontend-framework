# Unresolved Use Cases

## Aliquot-level Data

In the GDC, a case can have multiple aliquots. For example, a case may have a tumor sample and a normal sample that were both sequences. Currently, we index only one aliquot per case. In the future, we want to index multiple aliquots per case. When
this happens, we may need to select data for different aliquots per case.

Example: Tumor vs Normal Gene Expression Analysis

A user may want to compare the gene expression from a tumor sample and a normal sample
for a given set of cases. There are different way to view this from a modelling
perspective.

1. This could be a single cohort of cases, and the data request would be for a sample
   type (tumor or normal) and a data type (gene expression quantification).
2. This could be two cohorts of aliquots, and the data request would be for a data type
   (gene expression quantification).
3. This could be a single cohort of cases with two sub-cohorts of aliquots. The data
   request would be for a data type (gene expression quantification).

Data Request

- In #1, the data request now requires additional input that is not specifically
  related to the data. This may be undesirable as we might want to maintain a division
  of data attributes and entity attributes.
- In #2 and #3, the data request is limited to only data attributes.

Cohort Definition

- In #1, the cohort is a collection of cases, which is consistent with the simple definition
  that a cohort is always a collection of cases.
- In #2 and #3, the (sub-)cohort is a collection of aliquots. This introduces a cohort
  variant. Variants increase the complexity of a cohort model and concept. This also opens
  up the possibility of other variants, like a cohort of genes, a cohort of mutations, a
  cohort of aliquots. Perhaps the variants are collections of entities and a cohort is always
  a collection of cases. One disadvantage is that two independent collection of aliquots
  are not guaranteed to represent the same set of cases.
- In #3, the sub-cohort is also a new concept, although a sub-cohort might just be a cohort
  with a specialized relationship with another cohort.

Integrity

- The single cohort ensures that data is requested for the same collection of cases, which
  helps maintain integrity across the two data sets.
