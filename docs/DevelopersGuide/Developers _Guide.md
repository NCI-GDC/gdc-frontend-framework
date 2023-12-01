# GDC Portal Developer Guide

## Introduction

This guide will detail the process of developing applications for the GDC Portal Version 2.0.

## Table of Contents

- [Introduction](#introduction)
  - [Overview of an Application](#overview-of-an-application)
  - [Local vs Global Filters](#local-vs-global-filters)
  - [Cohorts and Filters](#cohorts-and-filters)
- Using the Portal Application API
  - Case Information
  - File Information
  - Sets: Gene, SSMS, and Case
  - Creating cohorts
  - Creating Sets
  - Count Information
  - Component Library
- Application Development
  - Local Filters
  - Local State
  - Persisting State
  - Source code layout
- Sample Application
- [Appendix](#appendix)
  - Using selectors and hooks
    - Selectors
    - Hooks
  - Querying the GDC API

## Introduction

The GDC Portal is designed to support the development of applications that allow for analysis, visualization,
and refinement of cohorts. The GDC Portal is built on top of the [GDC API](https://docs.gdc.cancer.gov/API/Users_Guide/Getting_Started/),
which provides access to the GDC data. The GDC Portal provides a framework for developing applications that
can be used to analyze and visualize data from the GDC. The GDC Portal is built on top of the [React](https://reactjs.org/)
framework, and uses the [Redux](https://redux.js.org/) library for state management. The GDC Portal uses
NextJS to provide server-side rendering of React components. Mantine.dev is the base component library used
and styling is done with [TailwindCSS](https://tailwindcss.com/).

The GDC Portal contains a Analysis Center where application are displayed for users to use with their cohorts.
The GDC Portal also provides a framework for developing applications that can be used to analyze and visualize data from the GDC.

## Overview of an Application

Applications are High Order Components (HOC) that are rendered in the Analysis Center. The portal major functions
like Project, Downloads, and Protein Paint are all applications. Each application handles a specific task and can be used to 
refine and analyze cohorts. Applications have access to all the current cohort information and can use that information
to query the GDC API for additional information. 

Local and Cohort filters are available to applications. Local filters are filters that are specific to the application, and 
are used to refine the data that is displayed in the application. Local filters are those available from the GDC API, and are typically not the
most common. For example in the Mutation Frequency application, the local filters are the gene and mutation type filters. In the figure
below the local filters are highlighted in yellow. These filter are used to refine the input cohort allowing users to 
drill down to specific genes and mutation types of interest in the cohort.

![Mutation Frequency](./images/mutation_frequency_app.png)

### Local vs Global Filters

A Portal application's input can be anything including a single cohort or multiple cohorts. Application then can either add filter 
to refine the cohort by adding filters, create additional cohorts, or display the data in a visualization. Applications typlically 
have:
* local filters that are used to refine the data displayed in the application.
* UI components that are used to display the data in the application.
* State that is used to store the data displayed in the application.
* Actions that are used to update the state of the application.

Applications can also create new cohorts. These cohorts can be used by other Portal applications.

![Structure of an Application](./images/application_structure.png)

## Cohorts and Filters

From a application perspective, a cohort is a Object containing the following information:
```typescript
interface Cohort {
  id: string;        // unique id for cohort
  name: string;      // name of cohort
  filters: FilterSet; // active filters for cohort
  caseSet: CaseSetDataAndStatus; // case ids for frozen cohorts
  modified?: boolean; // flag which is set to true is modified and unsaved
  modified_datetime: string; // last time cohort was modified
  saved?: boolean; // flag indicating if cohort has been saved.
  counts: CountsDataAndStatus; //case, file, etc. counts of a cohort
}
```

Likely the most important part of the cohort is the `filters` field. The `filters` field contains the active filters for the cohort.
The `filters` field is a `FilterSet` object. The `FilterSet` object contains the active filters for the cohort. When calling either the
GDC API or GDC GraphQL API the filterset is converted to the appropriate format for the API. The `FilterSet` object is of the form:

```typescript
interface FilterSet {
  op: "and" | "or"; // operator for combining filters
  root: Record<string,Operation >; // map of filter name to filter operation
}
```
Operation are GDC API filters described in [GDC API Guide](https://docs.gdc.cancer.gov/API/Users_Guide/Search_and_Retrieval/#filters-specifying-the-query). These are:
* Equals
* NotEquals
* LessThan
* LessThanOrEquals
* GreaterThan
* GreaterThanOrEquals
* Exists
* Missing
* Includes
* Excludes
* ExcludeIfAny
* Intersection
* Union

The `root` field is a map of filter name (as defined in the GDC API) to filter operation. The filter operation can be either a single operation
or a `FilterSet` object. The `op` field will eventually support either `and` or `or`, however at this time only `and` is supported. The `and` operator is used to combine filters using the `and` operator. The `or` operator is used to combine
filters using the `or` operator. The `FilterSet` object is converted to the appropriate format for the GDC API when the cohort is saved.
When using the GDC REST API, the FilterSet can be converted into the appropriate format using the `filterSetToOperation` function. 
When using the GDC GraphQL API, the FilterSet can be using the `convertFilterSetToGraphQL` function. The API guide will provide information
on what format the filters should be in for the API. Also as the code is in TypeScript, the IDE will provide information on the format as well.


### Getting Cohort Information

The current active cohort can be accessed via the selector `selectCurrentCohort`. This selector returns the current cohort,
which is the cohort that is currently being displayed in the Cohort Management Bar. Accessing the current cohort is done via the
selector:

```typescript
import {useCoreSelector,  selectCurrentCohort } from '@gff/core';

const currentCohort = useSelector(selectCurrentCohort);
```

By using the selector, the component/application will be updated when the cohort changes. There are also selectors for getting a particular field from the cohort. For example, to get the cohort name, the selector `selectCurrentCohortName` can be used. The selectors are:

```typescript
selectCurrentCohort
selectCurrentCohortName
selectCurrentCohortId
selectCurrentCohortFilters
selectCurrentCohortModified
selectCurrentCohortModifiedDatetime
selectCurrentCohortSaved
selectCurrentCohortCounts
```
The current active filters can be accessed via the selector `selectCurrentCohortFilters`. This selector returns the current filters,
which are the filters that are currently being displayed in the Cohort Management Bar. Accessing the current filters is done via the
selector:

```typescript
import {useCoreSelector,  selectCurrentFilters } from '@gff/core';

const currentFilters = useSelector(selectCurrentCohortFilters);
```

By using the selector, the application will be updated when the filters change. The filters are returned as a `FilterSet` object described above.

All the cohorts can be selected using the selector `selectAllCohorts`. This selector returns all the cohorts in the store. Accessing all the cohorts is done via the selector:

```typescript 
import {useCoreSelector,  selectAllCohorts } from '@gff/core';
  
const allCohorts = useSelector(selectAllCohorts);
```
# Using the Portal Application API

The GDC Portal provides a number of hooks for querying the GDC API. These hooks are located in the `@gff/core` package.
The hooks are designed to work in a manner similar to the RTL Query hooks. The hooks take arguments and return a object.
The object contains the data and the status of the query. The status of the query is stored in the `isSuccess` variable.
The @gff/core package also provides a set of selector that return values stored in the core redux store: `CoreStore`.

There are a number of hooks and selectors that are available for querying the GDC API, a subset of which are shown below:

![hooks and selectors](./images/hooks_and_selectors.png)

[comment]: <> (TODO: Add more hooks and selectors)


# Application Development

## Getting started

The GDC Portal V2 is a monorepo that contains all the code for the GDC Portal. The monorepo is managed using [lerna](https://lerna.js.org) and [npm]().
The monorepo contains the following packages:

* `@gff/core` - contains the core components and hooks for the GDC Portal.
* `@gff/portal-proto` - contains the UI components and application framework (using NextJS) for the GDC Portal.

Note that the UI components are located in the `@gff/portal-proto` package will be refactored into a separate package in the future, and 
`@gff/portal-proto` will be renamed to `@gff/portal`.

You can get started by cloning the repo and following the instructions in the [README.md](https://github.com/NCI-GDC/gdc-frontend-framework/blob/develop/README.md) file.


## Source code layout

![source code layout](./images/app_source_code_layout_fig.png)

# Sample Application


# Appendix

## Using selectors and hooks

Although a complete guide to react hooks and selectors are out of scope for this document, we will provide a brief overview 
of how to use them for application development. For more information on hooks and selectors please see the 
[React Hooks](https://reactjs.org/docs/hooks-intro.html). As we are using Redux-toolkit, we will be using the calls 
describe in the [Redux Toolkit](https://redux-toolkit.js.org/tutorials/typescript) documentation.

### Selectors

Selectors are used to access the state of the GDC Portal's main redux store. Using selectors is the preferred method for
accessing the state of the GDC Portal. Selectors are functions that take the state as an argument and return a value.

```typescript
import {useCoreSelector,  selectCurrentCohort } from '@gff/core';

const currentCohort = useSelector(selectCurrentCohort);
```

The selector will return the current value of the item in the store. Consult the GDC V2 API documentation for a complete
list of selectors.

### Hooks

Fetching data from the GDC API is done via hooks. Hooks are functions that take arguments and return a value. The value
returned is typically a promise that resolves to the data requested. The GDC Portal provides a number of hooks for
fetching data from the GDC API. These hooks are located in the `@gff/core` package. 

```typescript
import { useGeneSymbol } from '@gff/core';

const { data: geneSymbolDict, isSuccess } = useGeneSymbol(
        field === "genes.gene_id" ? facetValues.map((x) => x.toString()) : [],
);
```

GDC Portal hooks are design to work simlary to the RTL Query hooks. The hooks take arguments and return a object.
The object contains the data and the status of the query. The status of the query is stored in the `isSuccess` variable.
The data returned from the query is stored in the `data` variable. The object returned from a GDC hook is of the form:

```typescript
{
  data: any;
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error;
}
```

where `data` is the data returned from the query, `isSuccess` is a boolean indicating if the query was successful, `isLoading`
is a boolean indicating if the query is currently loading, `isError` is a boolean indicating if the query resulted in an error,
and `error` is the error returned from the query.

## Querying the GDC API
