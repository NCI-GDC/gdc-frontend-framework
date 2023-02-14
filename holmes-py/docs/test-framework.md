# Data Portal V2 Test Documentation
## Test framework
Will be using `holmes-py` test framework.
Please visit https://github.com/NCI-GDC/holmes-py for more information related to the framework.

The `holmes-py` is a python-based test framework that may use various sub-technologies (sub-technology agnostic test framework) maintained by GDC QA.

### Locator / Selector
For each interactable component on Data Portal V2, both frontend and QA team have agreed upon to use the following method to help identify the elements on the applicaiton.

Use `data-testid={elementIdentifierName}` within a tag to help locate the element quickly and effectively, where `elementIdentifierName` would be a value that is descriptive of element to interact with. We would want to avoid using any numbers for the values because it may not be descriptive enough while implementing test automation.

Reference:
1. **Using "data-test" in Tests** - https://blog.rstankov.com/using-rel-in-testing/
2. **data-\*** - https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*

### Target Test Environment setup
The following environment are supported:

| environment | environment variable  | value    | target url                        |
|-------------|-----------------------|----------|-----------------------------------|
| Shared QA / Prod  | APP_ENVIRONMENT | (default)| https://portal.gdc.cancer.gov/v2  |
| Local / Localhost | APP_ENVIRONMENT | _LOCAL   | http://localhost:3000/v2          |

Example: run the following command in your CLI before running tests
1. Run tests in particular environment
```bash
# localhost
export APP_ENVIRONMENT=_LOCAL

# Shared QA / Prod
unset APP_ENVIRONMENT
```
2. Then run tests
```bash
gauge run specs
```
