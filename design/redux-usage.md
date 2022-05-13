# Redux Usage

- Use Redux for state management

  - Need to define the version of redux.

- Multiple Stores
  - We can use multiple stores to isolate the framework from the host application from third-party applications.
  - This was not supported by the original redux release and is still discouraged. However, with the addition of the react context api, multiple stores is not supported.
- State

  - Use namespacing to avoid conflicts in state.
  - All GDC state should live under a “GDC” key, or similar
  - All third-party features should live under a unique key.
  - Might need a registration mechanism to enforce this.

- Selectors

  - If we expose a library of selectors, third parties can access data that should exist in the state
  - (needs more thought) If the data does not exist in the state, then we’ll need a way to load the data.

- Reducers

  - GDC reducers should not be available to third parties.
  - Third parties should be allocated their own slice of the redux state. They can manage it themselves with their own reducers.
  - (needs more thought) We need a way to add third party reducers to the root reducer.

- Actions

  - Namespacing needs to be enforced for action prefixes
  - Third-parties should not need GDC actions

- Thunks

  - Thunks, like actions, need namespacing
  - Might need to provide a library of thunk actions to initialize state
  - If we provide a gdcapi client, we can inject it into the thunk middleware.

- Redux-toolkit
  - This will normalize development. We should use it for GDC work and for third-parties.
  - (needs more thought) Can we wrap redux-toolkit to automatically provide the namespace enforcement?
