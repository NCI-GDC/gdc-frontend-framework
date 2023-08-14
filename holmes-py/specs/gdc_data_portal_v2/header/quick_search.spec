# Header - Quick Search Bar
Date Created    : 08/14/23
Version			    : 1.0
Owner		        : GDC QA
Description		  : Test results from quick search bar
Test-Case       : PEAR-937

tags: gdc-data-portal-v2, regression, search-bar

## Search - File
* On GDC Data Portal V2 app
* Quick search for "63690169-ccdd-47dd-a298-696187c79c4c", validate the result abbreviation is "FL", and go to its page
* Is text "File Properties" present on the page
* Is text "63690169-ccdd-47dd-a298-696187c79c4c" present on the page

## Search - Case
* Quick search for "HCM-BROD-0254-C49", validate the result abbreviation is "CA", and go to its page
* Is text "Case UUID" present on the page
* Is text "300223b2-7479-4849-8de5-14b30c586c3a" present on the page

## Search - Project
* Quick search for "GENIE-UHN", validate the result abbreviation is "PR", and go to its page
* Is text "AACR Project GENIE - Contributed by Princess Margaret Cancer Centre" present on the page
* Is text "phs001337" present on the page

## Search - Gene
* Quick search for "ENSG00000168702", validate the result abbreviation is "GN", and go to its page
* Is text "LRP1B" present on the page
* Is text "LDL receptor related protein 1B" present on the page
* Is text "ENSG00000168702" present on the page

## Search - Mutation
* Quick search for "chr2:g.208248388C>T", validate the result abbreviation is "MU", and go to its page
* Is text "fa9713e8-ce92-5413-aacc-ed3d95ab7906" present on the page
* Is text "Single base substitution" present on the page
