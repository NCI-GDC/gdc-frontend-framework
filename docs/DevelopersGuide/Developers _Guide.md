# GDC Portal Developer Guide

## Introduction

This guide will detail the process of developing applications for the GDC Portal Version 2.0.

## Table of Contents

- [Introduction](#introduction)
- [Overview of an Application](#overview-of-an-application)
- [Local vs Global Filters](#local-vs-global-filters)
- [Cohorts and Filters](#cohorts-and-filters)
- Local vs Global Filters
- Querying the API
  - Cohorts
  - Filters
  - Case Information
  - File Information
  - Sets: Gene, SSMS, and Case
  - Creating cohorts
  - Creating Sets
- Application Development
  - Local Filters
  - Local State
  - Persisting State
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
refine and analyze cohorts. Applications have access to all of the current cohort information and can use that information
to query the GDC API for additional information. 

Local and Cohort filters are available to applications. Local filters are filters that are specific to the application, and 
are used to refine the data that is displayed in the application. Local filters are those available from the GDC API, and are typically not the
most common. For example in the Mutation Frequency application, the local filters are the gene and mutation type filters. In the figure
below the local filters are highlighted in yellow. These filter are used to refine the input cohort allowing users to 
drill down to specific genes and mutation types of interest in the cohort.

![Mutation Frequency](./images/mutation_frequency.png)

### Local vs Global Filters

Application input can be anything including a single cohort or multiple cohorts. Application then can either add filter 
to refine the cohort by adding filters, create additional cohorts, or display the data in a visualization.



add Figure of FLow through an Application


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
Operation is a GDC filter as described in [](https://docs.gdc.cancer.gov/API/Users_Guide/Search_and_Retrieval/#filters-specifying-the-query) :
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


The current active cohort can be accessed via the selector `selectCurrentCohort`. This selector returns the current cohort,
which is the cohort that is currently being displayed in the Cohort Management Bar. 

Add example of getting the cohort from the @gff/core

Add example of FilterSet

# Appendix

## Using selectors and hooks

Although a complete guide to react hooks and selectors are out of scope for this document, we will provide a brief overview 
of how to use them for application development. For more information on hooks and selectors please see the 
[React Hooks](https://reactjs.org/docs/hooks-intro.html. As we are using Redux-toolkit, we will be using the calls 
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
