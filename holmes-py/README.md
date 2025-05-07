# Holmes
## Docs specific to Data Portal V2 can be found [here](docs/README.md)
## BDD test automation framework
_Detects and reports UI defects_

# Table of contents
1. Framework
   1.1 Concepts covered
2. Prerequisites
3. System(s) Under Test (SUT)
4. Executing specs
5. Docker Integration
6. GitLab CI/CD Pipeline

# Framework

This project uses

- [Gauge](http://gauge.org/)
- [Python 3.9.x or above](https://docs.python.org/3/index.html)
- [Playwright](https://playwright.dev/python/docs/library#macos)

## Concepts covered

- Use [Playwright](https://playwright.dev/python/docs/writing-tests) as base of implementation
- Specs
- Table driven execution
- File driven execution
- Simple execution

# Prerequisites

- [Install Gauge](https://docs.gauge.org/getting_started/installing-gauge.html?os=macos&language=python&ide=vscode)
- [Install Python 3.9.x or above](https://www.python.org/downloads/)
- [Install Gauge-Python plugin](https://github.com/kashishm/gauge-python/wiki/User-Documentation) by running

  ````bash
  gauge install python
  ````

## System(s) Under Test (SUT)
1. Download Reports Generator
2. New Data Portal

# Executing specs

### Set up

#### Virtual Environment

Ensure that you either create a virtual environment or are working in a Docker container.
Make sure to create the environment in the holmes-py folder.

_Creating a virtual environment:_ (Minimum python version 3.9.x)

```bash
python3 -m venv venv
```

_Activating the virtual environment:_

```bash
source venv/bin/activate
```

_Deactivating the virtual environment:_

```bash
source venv/bin/deactivate
```

or

```bash
deactivate
```

#### Install Requirements

##### Minimum versions:
```bash
Python: 3.9.x
getgauge: 0.4.9
playwright: 1.23.1
protobuf: 3.20.2
```
Upgrade pip before attempting to install dependencies
````bash
pip install --upgrade pip
````

This project requires pip to install dependencies. To install dependencies run:
````bash
pip install -r requirements.txt
````

Playwright
````bash
playwright install
````

### Properties
On Windows: Please update the env/default/python.properties as bellow.
````bash
GAUGE_PYTHON_COMMAND = python
````
### Set APP Environment
By default, the tests run on Production.
To see all environments, visit this document specific to the data portal v2 [Test Framework](docs/test-framework.md).
This command changes where the tests are pointed at.
````bash
export APP_ENVIRONMENT=ENVIRONMENT_NAME
````

### All specs
````bash
gauge run specs
````

#### Run by director(ies)
````bash
gauge run <path_to_spec1> <path_to_spec2> <path_to_spec3>
````

#### Run by tags
````bash
gauge run --tags "Tag_Name" specs
````

#### Run a single scenario
````bash
gauge run <specification_path>:<scenario_line_number>
````

### Specific specs
````bash
gauge run [args] [flags]
````

### Run in UI de-bug mode
````bash
PWDEBUG=1 gauge run specs
````

### Execute Tests in Parallel
Let gauge choose number of execution streams (depends on the number of CPU cores available):
````bash
gauge run --parallel specs
````
OR, choose number of streams:
````bash
gauge run --parallel -n=number_here specs
````

Note: On my local machine, I found that 6 streams strikes the balance between execution time and
consistency of test results. Anymore than 6, and there would be some flakey test results.

If a test does fail, rerun them individually before reporting results.

### How to Execute Each Type of Test Suite
The tests should be ran by tag. We have open-access and controlled-access tests that are not compatible to be ran together.
The controlled-access tests require you to manually login when prompted. The other tests do not have to be interacted with
once execution begins. Any of the commands below can also be ran in parallel or with de-bug mode. See above for commands.

#### Regression Test
````
gauge run specs --tags "regression"
````

#### Data Test
````
gauge run specs --tags "data-release"
````

#### Controlled Access Test
````
gauge run specs --tags "controlled-access"
````

### Gauge Execution Documentation
See [Run Gauge Specifications](https://docs.gauge.org/execution.html?os=macos&language=python&ide=vscode)

This will also compile all the supporting code implementations.

# Docker Integration

Here's how to build/run this repo inside a Docker container.

1. Build the Docker image:

 ```bash
 docker build -t holmes .
```

2. Run the tests in the Docker container (in this example, tests would be run against qa yellow):

```bash
Copy code
docker run --rm --env APP_ENVIRONMENT=qayellow --env browser="headless firefox" --env APP_ENVIRONMENT=QA_YELLOW .
```
Set the environment variable APP_ENVIRONMENT to the desired test environment (e.g., QA_YELLOW, QA_UAT, PROD_UAT).

NOTE: The IS_DOCKER variable is used to indicate that tests are running within the Docker container, and is set to True within the Dockerfile

These tests will not currently run against edge, and they will only work with headless browser configurations.

To run the tests locally using docker-compose, run:

```bash
docker-compose up [--build]
```

# GitLab CI/CD Pipeline

The GitLab CI/CD pipeline configured using the `.gitlab-ci.yml` file has been  updated to include the `build_and_run_ui_tests` stage, which is responsible for building and running these Playwright UI tests.

## Build and Run UI Tests Stage

```yaml
Build and run UI tests:
  stage: build_and_run_ui_tests
  services:
    - docker:${DOCKER_VERSION}-dind
  tags:
    - dind
  image: docker:${DOCKER_VERSION}-dind
  script:
    - docker build -t $DOCKER_RELEASE_REGISTRY/ncigdc/$CI_PROJECT_NAME-holmes-py:$CI_COMMIT_REF_SLUG-${CI_COMMIT_SHORT_SHA} -f ./holmes-py/Dockerfile ./holmes-py
    - docker run -v $(pwd):/app --name holmes-py --env APP_ENVIRONMENT=QA_YELLOW --env browser="headless chrome" -e PATH="$PATH:/usr/local/bin" "$DOCKER_RELEASE_REGISTRY/ncigdc/$CI_PROJECT_NAME-holmes-py:$CI_COMMIT_REF_SLUG-${CI_COMMIT_SHORT_SHA}" gauge run ./holmes-py/specs/gdc_data_portal_v2/
    - docker cp holmes-py:/app/holmes-py/.gauge .gauge
    - docker cp holmes-py:/app/holmes-py/downloads downloads
    - docker cp holmes-py:/app/holmes-py/logs logs
    - docker cp holmes-py:/app/holmes-py/reports reports
  rules:
    - if: '$CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"'
      when: on_success
      allow_failure: true
  artifacts:
    when: always
    paths:
      - holmes-py/.gauge
      - holmes-py/downloads
      - holmes-py/logs
      - holmes-py/reports
    expire_in: 3 months
```

The `Build and run UI tests` stage is designed to run after the `deploy` stage has been successfully completed. This stage will run the UI tests using the Holmes test automation framework within a Docker container.

When a pipeline is executed, it follows the order of the stages defined in the `stages` list. If a stage is set to `manual`, the pipeline will pause and wait for a user to manually trigger it. In our case, the pipeline will wait for the `deploy` stage to be manually triggered and successfully completed.

Once the `deploy` stage has been manually triggered and completed, the pipeline will automatically proceed to the `Build and run UI tests` stage. This ensures that the UI tests are only run after the deployment has been completed, providing an extra layer of validation for the deployed application.

In this stage, the pipeline:

1. Builds a Docker image using the holmes-py/Dockerfile.
2. Runs the Docker container with the built image, setting the environment variables APP_ENVIRONMENT and browser for the Playwright UI tests as desired.
3. Executes all Playwright UI tests using Gauge within the ./holmes-py/specs/gdc_data_portal_v2/ directory.
4. Copies the test artifacts from the Docker container to the host, including Gauge files, downloads, logs, and reports.

The rules section added specifies that this stage will run only when the target branch of the merge request is develop.

The artifacts section defines the paths to the test artifacts to be archived by gitlab, and is set to expire the artifacts after 3 months
