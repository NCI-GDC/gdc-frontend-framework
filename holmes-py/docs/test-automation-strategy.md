# Data Portal V2 Test Automation Strategy
## Test framework
### Where do the tests live?
- The tests will live in the application repository along with application code (`holmes-py` will be cloned within the application repo and will be maintained separately just for Data Portal V2).
- At the time of deployment of application code, the test repository should not be included in the deploy.

### Core Programming Language and Version
The `holmes-py` utilizes `Python` programming language

Version: `3.8.x`

## Major elements to locate
### List of locators:
Home
- Header
- Footer
- Notification Banner
- Privacy Notice for controlled access
- Warning Overlay
- Human Image
- Primary Site Graph
- Portal summary
- Quick Search button
- Search Field
- GDC Apps (top right)
- GDC Apps (bottom)

Projects
- Projects Facet and facet section
- Projects histogram and pie chart
- Projects table: (table and graph tab)

Repository

Analysis

Exploration

Cart

Project Entity Page

File Entity Page

Case Entity Page

Gene Entity Page

Mutation Entity Page

Annotations Page

Annotation Entity Page

Manage Set page

SSM entity page

Slide Images Page

Analysis Results Page
