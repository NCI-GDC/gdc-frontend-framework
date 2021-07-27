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

Example: Fetch project data

```jsx
import { useProjects } from "@gff/core";

const myComponent = () => {
  const { data, error, isUninitialized, isFetching, isSuccess, isError } =
    useProjects();
  return (
    <ul>
      {data.map((project) => (
        <li key={project.project_id}>{project.project_id}</li>
      ))}
    </ul>
  );
};
```

In this example, the component call the `useProjects` hook to obtain an array of projects.
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

### Cache invaldiation

Cache invalidation will need to be performed when certain data changes. For example, with facets, when the filters
change, the existing facets data may be stale. This is a business logic issue though. So, core may need to
expose the ability and leave it to the application to decide.

### Refresh callback

The hook may want to return a callback to retrigger the request. This will overlap with cache invalidation.
