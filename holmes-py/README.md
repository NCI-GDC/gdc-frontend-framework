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
  gauge install python --version 0.4.9
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
docker run --rm --env APP_ENVIRONMENT=PROD --env browser="headless firefox"
```
Set the environment variable APP_ENVIRONMENT to the desired test environment (e.g., QA_YELLOW, QA_UAT, PROD_UAT).

NOTE: The IS_DOCKER variable is used to indicate that tests are running within the Docker container, and is set to True within the Dockerfile

These tests will not currently run against edge, and they will only work with headless browser configurations.

To run the tests locally using docker-compose, run:

```bash
docker-compose up [--build]
```

# GitLab CI/CD Pipeline

The GitLab CI/CD pipeline configured using the `.gitlab-ci.yml` file. Our steps are 'Build UI Tests Docker Image' and 'Trigger Holmes-py Tests' which build the docker image and then execute the holmes-py tests.

### The Gitlab CI/CD Pipeline Flow:

1. Runs on a schedule at [this URL](https://gitlab.datacommons.io/nci-gdc/front-end/gdc-frontend-framework/-/pipeline_schedules)
2. Edit the variable PORTAL_REV_PROXY_IP_ADDRESS in the schedule to pick which environment to execute the tests in. Some choices are:

    A. $QA_INT_PORTAL_REV_PROXY_IP

    B. $QA_ORANGE_PORTAL_REV_PROXY_IP

    C. $QA_PINK_PORTAL_REV_PROXY_IP

    D. $QA_YELLOW_PORTAL_REV_PROXY_IP

3. Edit the variable TAG_TEST_TYPE in the schedule to pick test tag should run. Some choices are:

    A. regression

    B. smoke-test

    C. data-release

4. The pipeline executes on a schedule or on demand using the 'play' button
5. Pipeline is started
6. Dockerfile is built
7. Dockerfile executes Holmes-py regression test
8. Copies the test artifacts from the Docker container to the host, including Gauge files, downloads, logs, and report.
9. To download the artifact, go to the job step 'Trigger Holmes-py Tests'. On the right-hand side there will be a section that says 'Job artifacts' and click the 'Download' button. The artifacts will be stored in Gitlab for 3 months.
