# Data Release - Gene Inclusion
Date Created        : 08/04/2024
Version			    : 1.0
Owner		        : GDC QA
Description		    : Gene Inclusion in Data Release
Test-Case           : PEAR-1931

tags: gdc-data-portal-v2, data-release

table: resources/data_release/gene_inclusion.csv

## Gene Affected in this Data Release
* On GDC Data Portal V2 app
* Quick search for <Ensembl> and go to its page
* Verify the table "Summary Gene Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |<Name>                                 |
    |<Location>                             |
* Verify the table "External References Gene Summary" is displaying this information
    |text_to_validate                       |
    |---------------------------------------|
    |<NCBI Gene>                            |
    |<UniProtKB Swiss-Prot>                 |
    |<HGNC>                                 |
    |<OMIM>                                 |
    |<Ensembl>                              |
    |<CIViC>                                |
