# Third-party Analysis Tools

- React

  - Third-parties need to export a react components

- React-Redux

  - Need connected components
  - Third party should export these
  - Need to export core selector and dispatcher to third parties.

- Styling

  - Need to make sure third-parties do not apply styles that affect the rest of the application. How can we enforce this?

- Dependencies

  - In the library, the package.json should define versions of libraries that we use to expose them to the third parties and reduce conflicts.

- Testing
  - Need to determine how a third party would test
  - Mock data?
  - Query gdcapi
  - Prod (everyone has open access)
  - Qa (requires vpn)
  - If query, then fetch logic needs to exist in published package.
