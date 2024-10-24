# Cart - Validate Tables
Date Created    : 10/24/2024
Version			    : 1.0
Owner		        : GDC QA
Description		  : Validate Authorization Level, Count by Projects, and Cart Item Tables
Test-Case       : PEAR-2244

tags: gdc-data-portal-v2, regression, cart

## Add Files to Cart
* On GDC Data Portal V2 app
* Navigate to "Downloads" from "Header" "section"
* Add the following files to the cart on the Repository page
  |file_uuid_to_add                     |
  |-------------------------------------|
  |eb2953ae-792d-425c-8616-ef1308d1f56e |
  |99ba6902-c95a-4955-af15-879363eda256 |
  |16d7a72e-681d-49aa-9936-feca9c07e3f1 |
  |8c38ec6c-ded8-49c9-8bbe-4fcc9b292939 |
  |a7e1ef41-f8ec-4ab0-8c8a-fc1a17ee7d2a |
  |351ebffd-6c59-45a5-9600-6b04c60f3533 |
  |8e98c589-2baf-48a6-8df4-d9f5e6f09b93 |
  |243bc89f-bad0-4190-bb1b-15e9536dde07 |
  |c0996bfb-70e0-4c11-9451-55bba9bbe600 |
  |025fc76e-bc90-4b23-b099-d63feb687dc0 |
  |322bb3ff-5123-47fd-bcd3-af4fbc2ad20f |
  |205c6982-8133-4532-a5cf-75ce3c1673f3 |
  |86465656-5b49-44b6-bcd0-cd874e08d75e |
  |1794c455-e32e-4a8b-9934-88aa63421c94 |
  |aa292d88-0f41-4618-a74b-ed7455e6a1bc |

## Validate Table: Authorization Level
* Navigate to "Cart" from "Header" "section"
* Verify the table "File counts by authorization level" header text is correct
    |expected_text                          |column |
    |---------------------------------------|-------|
    |Level                                  |1      |
    |Files                                  |2      |
    |File Size                              |3      |
* Verify the table "File counts by authorization level" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |Authorized                             |1    |1      |
    |9                                      |1    |2      |
    |8.09 MB                                |1    |3      |
    |Unauthorized                           |2    |1      |
    |6                                      |2    |2      |
    |13.13 MB                               |2    |3      |

## Validate Table: File Counts by Projects
* Verify the table "File counts by project" header text is correct
    |expected_text                          |column |
    |---------------------------------------|-------|
    |Project                                |1      |
    |Cases                                  |2      |
    |Files                                  |3      |
    |File Size                              |4      |
* Verify the table "File counts by project" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |HCMI-CMDC                              |1    |1      |
    |2                                      |1    |2      |
    |5                                      |1    |3      |
    |3.59 MB                                |1    |4      |
    |CGCI-BLGSP                             |2    |1      |
    |1                                      |2    |2      |
    |4                                      |2    |3      |
    |12.47 MB                               |2    |4      |
    |TCGA-OV                                |3    |1      |
    |1                                      |3    |2      |
    |3                                      |3    |3      |
    |627.12 kB                              |3    |4      |
    |MMRF-COMMPASS                          |4    |1      |
    |2                                      |4    |2      |
    |2                                      |4    |3      |
    |4.29 MB                                |4    |4      |
    |TARGET-AML                             |5    |1      |
    |1                                      |5    |2      |
    |1                                      |5    |3      |
    |240.14 kB                              |5    |4      |

## Validate Table: Cart Items
* Verify the table "Cart Items" has a total of "15" items
* Verify the table "Cart Items" header text is correct
    |expected_text                          |column |
    |---------------------------------------|-------|
    |Remove                                 |1      |
    |Access                                 |2      |
    |File Name                              |3      |
    |Cases                                  |4      |
    |Project                                |5      |
    |Data Category                          |6      |
    |Data Format                            |7      |
    |File Size                              |8      |
    |Annotations                            |9      |
* In table "Cart Items" select or deselect these options from the table column selector
    |table_column_to_select                 |
    |---------------------------------------|
    |File UUID                              |
    |Data Type                              |
    |Experimental Strategy                  |
    |Platform                               |
* Verify the table "Cart Items" header text is correct
    |expected_text                          |column |
    |---------------------------------------|-------|
    |File UUID                              |2      |
    |Data Type                              |8      |
    |Experimental Strategy                  |10     |
    |Platform                               |11     |
* In table "Cart Items", search the table for "8c38ec6c-ded8-49c9-8bbe-4fcc9b292939"
* Wait for table "Cart Items" body text to appear
    |expected_text                                        |row  |column |
    |-----------------------------------------------------|-----|-------|
    |8c38ec6c-ded8-49c9-8bbe-4fcc9b292939                 |1    |2      |
* Verify the table "Cart Items" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |controlled                             |1    |3      |
    |d2f99693-269c-4f5a-8d3a-646be6d0ee3d.wxs.varscan2.raw_somatic_mutation.vcf.gz|1    |4      |
    |1                                      |1    |5      |
    |TCGA-OV                                |1    |6      |
    |Simple Nucleotide Variation            |1    |7      |
    |Raw Simple Somatic Mutation            |1    |8      |
    |VCF                                    |1    |9      |
    |WXS                                    |1    |10     |
    |Illumina                               |1    |11     |
    |63.38 kB                               |1    |12     |
    |1                                      |1    |13     |

## Cart Items - Download JSON
* In table "Cart Items", search the table for "243bc89f-bad0-4190-bb1b-15e9536dde07"
* Wait for table "Cart Items" body text to appear
    |expected_text                                        |row  |column |
    |-----------------------------------------------------|-----|-------|
    |243bc89f-bad0-4190-bb1b-15e9536dde07                 |1    |2      |
* Download "JSON" from "Cart Items"
* Read from "JSON from Cart Items"
* Verify that "JSON from Cart Items" has expected information
    |text_to_validate                     |
    |-------------------------------------|
    |BEDPE                                |
    |504cd2fc-f577-49aa-a7bc-e289b2955490 |
    |CGCI-BLGSP                           |
    |controlled                           |
    |158b558b-a4f3-474a-8c74-fb40fae21610.wgs.BRASS.rerun_structural_variation.bedpe.gz|
    |243bc89f-bad0-4190-bb1b-15e9536dde07 |
    |Structural Rearrangement             |
    |Somatic Structural Variation         |
    |WGS                                  |
    |Illumina                             |
    |16219                                |
* Verify that "JSON from Cart Items" does not contain specified information
    |text_to_validate                     |
    |-------------------------------------|
    |eb2953ae-792d-425c-8616-ef1308d1f56e |
    |99ba6902-c95a-4955-af15-879363eda256 |
    |aa292d88-0f41-4618-a74b-ed7455e6a1bc |
    |Open                                 |

## Cart Items - Validate JSON Fields
  |field_name                             |
  |---------------------------------------|
  |data_format                            |
  |cases.case_id                          |
  |cases.project.project_id               |
  |access                                 |
  |file_name                              |
  |file_id                                |
  |data_type                              |
  |data_category                          |
  |experimental_strategy                  |
  |platform                               |
  |file_size                              |
* Verify that the "JSON from Cart Items" has <field_name> for each object

## Cart Items - Download TSV
* In table "Cart Items", search the table for "eb2953ae-792d-425c-8616-ef1308d1f56e"
* Wait for table "Cart Items" body text to appear
    |expected_text                                        |row  |column |
    |-----------------------------------------------------|-----|-------|
    |eb2953ae-792d-425c-8616-ef1308d1f56e                 |1    |2      |
* Download "TSV" from "Cart Items"
* Read from "TSV from Cart Items"
* Verify that "TSV from Cart Items" has expected information
    |text_to_validate                     |
    |-------------------------------------|
    |File UUID                            |
    |Cases                                |
    |Data Category                        |
    |Data Type                            |
    |Experimental Strategy                |
    |Annotations                          |
    |eb2953ae-792d-425c-8616-ef1308d1f56e |
    |Open                                 |
    |63ab7e0b-7264-4cde-a35d-94c30ec3942e.mirnaseq.isoforms.quantification.txt |
    |TARGET-AML                           |
    |Transcriptome Profiling              |
    |Isoform Expression Quantification    |
    |TSV                                  |
    |miRNA-Seq                            |
    |Illumina                             |
    |240.14 kB                            |
* Verify that "TSV from Cart Items" does not contain specified information
    |text_to_validate                     |
    |-------------------------------------|
    |Controlled                           |
    |243bc89f-bad0-4190-bb1b-15e9536dde07 |
    |351ebffd-6c59-45a5-9600-6b04c60f3533 |
    |16d7a72e-681d-49aa-9936-feca9c07e3f1 |
    |1794c455-e32e-4a8b-9934-88aa63421c94 |

## Remove Files and Validate Changes
* In table "Cart Items", search the table for "aa292d88-0f41-4618-a74b-ed7455e6a1bc"
* Wait for table "Cart Items" body text to appear
    |expected_text                                        |row  |column |
    |-----------------------------------------------------|-----|-------|
    |aa292d88-0f41-4618-a74b-ed7455e6a1bc                 |1    |2      |
* Select value from table "Cart Items" by row and column
    |row   |column|
    |------|------|
    |1     |1     |
* Is temporary modal with text "Removed df2d803c-95d5-447d-8345-eafcd4c71c69.mirnaseq.mirnas.quantification.txt from the cart." present on the page and "Remove Modal"

* In table "Cart Items", search the table for "8c38ec6c-ded8-49c9-8bbe-4fcc9b292939"
* Wait for table "Cart Items" body text to appear
    |expected_text                                        |row  |column |
    |-----------------------------------------------------|-----|-------|
    |8c38ec6c-ded8-49c9-8bbe-4fcc9b292939                 |1    |2      |
* Select value from table "Cart Items" by row and column
    |row   |column|
    |------|------|
    |1     |1     |
* Is temporary modal with text "Removed d2f99693-269c-4f5a-8d3a-646be6d0ee3d.wxs.varscan2.raw_somatic_mutation.vcf.gz from the cart." present on the page and "Remove Modal"

* Verify the table "File counts by authorization level" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |Authorized                             |1    |1      |
    |8                                      |1    |2      |
    |8.04 MB                                |1    |3      |
    |Unauthorized                           |2    |1      |
    |5                                      |2    |2      |
    |13.07 MB                               |2    |3      |
* Verify the table "File counts by project" body text is correct
    |expected_text                          |row  |column |
    |---------------------------------------|-----|-------|
    |CGCI-BLGSP                             |1    |1      |
    |1                                      |1    |2      |
    |4                                      |1    |3      |
    |12.47 MB                               |1    |4      |
    |HCMI-CMDC                              |2    |1      |
    |2                                      |2    |2      |
    |4                                      |2    |3      |
    |3.54 MB                                |2    |4      |
    |MMRF-COMMPASS                          |3    |1      |
    |2                                      |3    |2      |
    |2                                      |3    |3      |
    |4.29 MB                                |3    |4      |
    |TCGA-OV                                |4    |1      |
    |1                                      |4    |2      |
    |2                                      |4    |3      |
    |563.74 kB                              |4    |4      |
    |TARGET-AML                             |5    |1      |
    |1                                      |5    |2      |
    |1                                      |5    |3      |
    |240.14 kB                              |5    |4      |
