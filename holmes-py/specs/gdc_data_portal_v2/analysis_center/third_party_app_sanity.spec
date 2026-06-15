# Analysis Center - 3rd Party App Sanity Check
Date Created    : 06/12/2026
Version			: 1.0
Owner		    : GDC QA
Description		: Opens 3rd party apps to ensure they load
Test-Case       : PEAR-1735

tags: gdc-data-portal-v2, navigation, analysis-center, smoke-test, regression

## Navigate to the analysis center
* On GDC Data Portal V2 app
* Navigate to "Analysis" from "Header" "section"
* Wait for cohort bar case count loading spinner

## Bam Slicing Download
* Navigate to "BAM Slicing Download" from "Analysis" "app"
* Is text "Please login to access the BAM Slicing Download tool." present on the page

## Cohort Level MAF
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Cohort Level MAF" from "Analysis" "app"
* Is text "compressed MAF data" present on the page

## Copy Number Segment
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Copy Number Segment" from "Analysis" "app"
* Is text "To view GDC CNV segments over a gene or region, enter genomic position" present on the page

## Copy Number Segment Demo
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Copy Number Segment Demo" from "Analysis" "app"
* Is text "Copy number homozygous deletion" present on the page

## Correlation Plot
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Correlation Plot" from "Analysis" "app"
* Is text "Correlation Input" present on the page

## Correlation Plot Demo
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Correlation Plot Demo" from "Analysis" "app"
* Is text "Group comparisons (log-rank test)" present on the page

## Gene Expression Clustering
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Gene Expression Clustering" from "Analysis" "app"
* Is text "Gene Expression (Z-score)" present on the page

## Gene Expression Clustering Demo
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Gene Expression Clustering Demo" from "Analysis" "app"
* Is text "Gene Expression (Z-score)" present on the page
* Is text "Demo showing cases with Gliomas." present on the page

## IDC Image Viewer
* Navigate to "Analysis" from "Header" "section"
* Navigate to "IDC Image Viewer" from "Analysis" "app"
* Is text "IDC Studies (Click to expand)" present on the page

## OncoMatrix
* Navigate to "Analysis" from "Header" "section"
* Navigate to "OncoMatrix" from "Analysis" "app"
* Is text "Consequences" present on the page
* Is text "Homozygous Deletion" present on the page

## OncoMatrix Demo
* Navigate to "Analysis" from "Header" "section"
* Navigate to "OncoMatrix Demo" from "Analysis" "app"
* Is text "Consequences" present on the page
* Is text "Homozygous Deletion" present on the page
* Is text "Demo showing cases with Gliomas." present on the page

## ProteinPaint
* Navigate to "Analysis" from "Header" "section"
* Navigate to "ProteinPaint" from "Analysis" "app"
* Is text "To view GDC mutations on a gene, enter one of gene symbol" present on the page

## ProteinPaint Demo
* Navigate to "Analysis" from "Header" "section"
* Navigate to "ProteinPaint Demo" from "Analysis" "app"
* Is text "To view GDC mutations on a gene, enter one of gene symbol" present on the page
* Is text " ENST00000377970" present on the page
* Is text "Demo showing MYC mutations from all GDC cases." present on the page

## Sequence Reads
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Sequence Reads" from "Analysis" "app"
* Is text "Please login to access the Sequence Read visualization tool." present on the page

## Single Cell RNA-seq
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Single Cell RNA-seq" from "Analysis" "app"
* Is text "Select a sample below to see its data:" present on the page

## Single Cell RNA-seq Demo
* Navigate to "Analysis" from "Header" "section"
* Navigate to "Single Cell RNA-seq Demo" from "Analysis" "app"
* Is text "Demo showing data for Case 2409, Project BEATAML1.0-COHORT ." present on the page
* Is text "Differential Expression" present on the page
