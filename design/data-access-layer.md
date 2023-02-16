# Data Access Layer

## Requirements

Define the shape of data
Define how to get data
Define how to inject cohort or other core data

component requests data

- dispatch action
  - TODO: add async support
  - TODO: add cache support
- select data

## Data Access Hooks

Custom React hooks will make data available to React components and abstract away the details
of the data source, how data is queried, and how the data is managed within the app. Caching
is an example of data management.

The react component should be able to import and invoke a data access hook. The invocation
should return a variety of information such as the data itself. Since data requests can
be asynchronous, the invocation should also return information about the status of the
request. In the event of a failed data request, the invocation should also return
information about the failure.

### Avalible Hooks

- `useAnnotations(Query Params defined below)`
- `useGetFilesQuery(Query Params defined below)`
- `useFileHistory(String: uuid of file)`
- `useGetProjectsQuery(Query Params defined below)`

Example: Fetch project data

```jsx
import { useGetProjectsQuery } from "@gff/core";

const myComponent = () => {
  const { data, error, isUninitialized, isFetching, isSuccess, isError } =
    useGetProjectsQuery();
  return (
    <ul>
      {data.map((project) => (
        <li key={project.project_id}>{project.project_id}</li>
      ))}
    </ul>
  );
};
```

In this example, the component call the `useGetProjectsQuery` hook to obtain an array of projects.
The hook returns the following:

- `data` - The requested data. This will be `undefined` if the request has not successfully completd.
- `error` - An error message. This should be populated when a request fails.
- `isUninitialized` - If `true`, then the request has not been made yet. `data` should be `undefined` at this point.
- `isFetching` - If `true`, then the request is in progress. `data` should be `undefined` at this point.
- `isSuccess` - If `true`, then the request has been successfully completed. `data` should be defined at this point.
- `isError` - if `true`, then the request failed. `error` should contain addtional information about the failure.

## Considerations

### Query Params

In order to add query support, the hook needs to take a parameter. For the gdc api, the parameter would
end up populating the `filter` parameter of the api.

Example:

```jsx
import { useGetProjectsQuery } from "@gff/core";

const myComponent = () => {
  const { data, error, isUninitialized, isFetching, isSuccess, isError } =
    useGetProjectsQuery({
      filters: {
        op: "=",
        content: {
          field: "project_id",
          value: props.setCurrentProject,
        },
      },
      expand: ["summary", "program"],
    });
  return (
    <ul>
      {data?.projectData.map((project) => (
        <li key={project.project_id}>{project.project_id}</li>
      ))}
    </ul>
  );
};
```

### Cache invaldiation

Cache invalidation will need to be performed when certain data changes. For example, with facets, when the filters
change, the existing facets data may be stale. This is a business logic issue though. So, core may need to
expose the ability and leave it to the application to decide.

### Refresh callback

The hook may want to return a callback to retrigger the request. This will overlap with cache invalidation.

## Contextual Data Access

Requests for data automatically use filter criteria from the context when making requests.

Filter criteria in the store may be facet filters, case set id, cohort id, etc.

For the various filter criteria, we'll need ways of setting those values in the context. This will be actions
of some sort.

Any contextual data will need to be refetched when filter criteria changes. Or, at least, the cached data (in
the redux store) should be cleared/reinitialized, which should cause data to be requested again.

use contextual cases

- get case filters
- fetch cases with filter criteria

what are the contexts?
when querying cases, we need case filters, cohort id, case set id. We may have case filters and a
collection for cases, such as a cohort.

when querying files, we need file filters. if the context is a collection of cases, such as a cohort,
then we also filter for files that are related to the cases in the collection of cases.

when querying mutations, we need mutations filters. if the context is a collection of cases, such as a cohort,
then we also filter for mutations that occur in these cases. if the context has a collection of genes, then
we also filter for mutations in that gene.

two cohort comparison would require two contexts.

context contains

- collection of cases
  - cohort id
  - case set id
  - project id
  - study id
- case filters
  - this may be instead of a collection of cases or it maybe in addition to the collection of case
- collection of genes
  - gene set id
  - external gene set (msigdb)
- gene filters
- collection of mutations
  - ssm set id
- mutation filters
- collection of cnvs
- cnv filters

there should be a default context. we also need to be able to pass (or specify) a context to a
contextual consumer. contexts should probably be inherited by other contextual consumers that
are invoked. Seems like we should be able to achieve this with a dynamic react context:
https://reactjs.org/docs/context.html#dynamic-context

use cases

- fetches and returns cases

use cases(fields)

- fetches and returns cases with specfic fields

use cases(filters)

- fetches and returns cases based on given filters

use cases(req)

- uses req as key for data cache or fetch. returns cases

use contextual cases

- fetches and return cases based on current case filters and cohort id

case filters

cohort
current
type: "cohort" | "project" | "caseSet"
id

field filter
field name
and | or
values

field group
and | or
field filters

what does multi-context look like?

what does two-cohort comparison look like?

- in-app comparison requires two cohorts
  - sounds like custom selection for app
- side-by-side comparison
  - example
    - app1 and cohort1
    - app2 and cohort2
  - This sounds like two contexts:
    - context 1
      - current cohort
      - current app
    - context 2
      - current cohort
      - current app

contexts

- id: context

context

- current cohort
- current app

get current cohort
context = get context
get current cohort(context)

#### Scenario: Get cases from all of gdc

- fetch from cases endpoint

#### Scenario: Get cases for current cohort

- select current cohort
- fetch from cases endpoint

#### Scenario: Get cases from all of gdc with a filter

- get filters
  - this could be passed in as an argument
  - this could be page-scoped filter
  - this could be an application-scoped filter
  - this could be a globally scoped filter
  - NOTE: seems that filter scoping is an application concern. not a framework concern
  - NOTE: can dynamic contexts abstract this scoping problems?
- fetch from cases endpoint with filters

#### Scenario: Get cases from a cohort with a filter

- get filters (see above scenario)
- get cohort
  - this could be the current cohort
  - this could be passed in as an argument
  - this could be any of the \*-scope levels
- compose filters and cohort
- fetch from cases endpoing with composed filters
- NOTE: our filter models and utils should provide composition

#### Scenario: Get cases for a project

Same as above, but the cohort is a project id.

#### Scenario: Get cases from a case set

Same as above, but the cohort is a case set id or a collection of case ids.

#### Scenario: Get cases for a study (TBD)

Need to determine study behavior. With the current implementation, then
a cohort will be a filter. Will we need to expose a study id?

#### Scenario: Get cases from two cohorts

Two options here:

- model a "current cohort" and a "second cohort". this implies that we
  may need to duplicate many other properties as "second \*". this might be
  ok if the "second" has a subset of functionality. but that seems like an
  inflexible or hard to maintain design choice, regardless of the application
  logic.
- mode a "context" that encapsulates all of the cohort related state. then
  we allow the contexts to be referencable during data requests. this would allow
  the correct filters, etc to be select at data access time. this is a powerful,
  flexbile option. however, it has the potential to get complex and cumbersome
  if not designed well. finding the proper abstraction will be very important
  here. (NOTE: this sounds like the better option)

#### Example: Cases View

For a given cohort, show the cases.
Allow the cases to be sorted and filtered.

### Dynamic Context

Dynamic contexts could allow us to define the context (or context id) at render time.
Then, any contextual data can be retrieved based on the contents of that context.
Possible context contents include cohort id, case filters, file filters, etc.
