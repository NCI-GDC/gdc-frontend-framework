# Header - Quick Search Bar
Date Created    : 08/14/23
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test results from quick search bar
Test-Case       : PEAR-937

tags: gdc-data-portal-v2, regression, search-bar, smoke-test

## Search - File
* On GDC Data Portal V2 app
* Quick search for "63690169-ccdd-47dd-a298-696187c79c4c"
* Validate the quick search bar result in position "1" of the result list has the text "File"
* Select the quick search bar result in position "1"
* Is text "File Properties" present on the page
* Is text "63690169-ccdd-47dd-a298-696187c79c4c" present on the page

## Search - Case
* Quick search for "HCM-BROD-0254-C49"
* Validate the quick search bar result in position "1" of the result list has the text "Case"
* Select the quick search bar result in position "1"
* Is text "Case UUID" present on the page
* Is text "300223b2-7479-4849-8de5-14b30c586c3a" present on the page

## Search - Project
* Quick search for "BEATAML1.0-COHORT"
* Validate the quick search bar result in position "1" of the result list has the text "Project"
* Select the quick search bar result in position "1"
* Is text "Functional Genomic Landscape of Acute Myeloid Leukemia" present on the page
* Is text "phs001657" present on the page

## Search - Gene
* Quick search for "ENSG00000168702"
* Validate the quick search bar result in position "1" of the result list has the text "Gene"
* Select the quick search bar result in position "1"
* Is text "LRP1B" present on the page
* Is text "LDL receptor related protein 1B" present on the page
* Is text "ENSG00000168702" present on the page

## Search - Mutation
* Quick search for "chr2:g.208248388C>T"
* Validate the quick search bar result in position "1" of the result list has the text "Mutation"
* Select the quick search bar result in position "1"
* Is text "fa9713e8-ce92-5413-aacc-ed3d95ab7906" present on the page
* Is text "Single base substitution" present on the page

## Search - Annotation
* Quick search for "b6a6a805-b621-4337-9692-bc738ba1b313"
* Validate the quick search bar result in position "1" of the result list has the text "Annotation"
* Select the quick search bar result in position "1"
* Is text "eaaf2dd8-9fdf-4004-bb41-82a7e44e7d21" present on the page
* Is text "annotated_somatic_mutation" present on the page
* Is text "Real somatic mutations were mistakenly labeled as LOH (Loss of Heterozygosity) in certain SomaticSniper VCF files." present on the page

## Search - Last Result
* Quick search for "321"
* Validate the quick search bar result in position "5" of the result list has the text "Gene"
* Select the quick search bar result in position "5"
* Is text "Cancer Distribution" present on the page
