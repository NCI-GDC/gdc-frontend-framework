# Cohort Management

A cohort is a collection of cases. The user should be able to define and modify cohorts.

## Cohort Types

The GDC has multiple constructs that effectively represent a collection of cases:

- Program
- Project
- Study
- Case Set

For the new portal, we can think of these as pre-built cohorts.

- New Cohort Model TBD

## Cohort Operations

CRUD Operations:

- Create a cohort.
  - new, empty cohort.
  - new cohort from an existing cohort.
- Read a cohort.
- Update a cohort.
  - Add cases
  - Remove cases
- Delete a cohort.

Set Operations:

- Union - combine two or more cohorts.
- Intersection - find the common cases of two or more cohorts
- Difference - find the cases in the first cohort that are not in the second cohort
- Complement - Find all cases that are not in a given cohort.
  - Note: This might be a computationally expensive operation.

## Cohort History

Ideally, we would track the changes that are made to a cohort. This cohort history has the potential to expose many features:

- Cohort history could allow the user to understand how the cohort was created.
- Cohort history could allow the user to revert to a previous version of the cohort.
- Cohort history could support branching, which would allow experimentation.

We can also track who (a user) or what (a tool) modified the cohort.

## Cohort Model

The cohort model should be immutable. This will allow us to reliably track history.

Cohort Properties:

- id - unique identifier. system defined.
- name - humna readable identifier. user defined.
- filters - filters used to define cohort
- case ids - result of applying filters
- search date - date filters were applied

### Filters vs Case Ids

Filters define how the user is selecting data. Case Ids define the results of the filters at a point in time.

The idea is that we could re-apply filters after a data release, compare the new and previous results, and show the user what has changed.

Re-applying filters can get complex quickly in the context of cohort history.

- Should re-applying happen at every step of the history?
- Do filters describe the complete filtering or just the difference from the previous cohort in history?
- Does re-applying create a new copy of the cohorts and it's history? Or does it mutate in-place? (which violates immutablilty)? Or do we maintain case id history too?
- Filtering performed by analysis tools probably cannot be automatically applied. This would require the user to manually re-do their analysis. How do we facilitate this interaction, if at all?

## Controlled Access Data

If cohorts are sharable, we need to check data access permissions for the entities in the cohort to ensure that users are not seeing data that they are not allowed to view.

We may also need to detect when changes in access for a cohort? For example, the data could change from open to controlled, or a user could lose dbGaP access to controlled-access data.

Likewise, data can be redacted or deleted. We need to handle that as well.
