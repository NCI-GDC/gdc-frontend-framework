# Holmes-py

## For Artillery Performance Tests, go [here](artillery/README.md)
Artillery is our tool for data portal performance testing. The tests can be ran authenticated (logged in) or non authenticated.

There are additional scripts to compare performance data, and generate graphs for data visualization.

## Docs specific to Data Portal V2 can be found [here](docs/README.md)
Holmes-py is our tool for testing the behavior of the data portal. There are full regression and smoke tests, along with data release specific tests.

## BDD test automation framework
_Detects and reports UI defects_

<br>

# Table of contents

1. [Framework](#framework)
2. [System(s) Under Test (SUT)](#systems-under-test-sut)
3. [Installation Guide](#installation-guide)
4. [Executing specs](#executing-specs)
5. [Docker Integration](#docker-integration)
6. [GitLab CI/CD Pipeline](#gitlab-cicd-pipeline)

<br>

# Framework

This project uses Python, Gauge, and Playwright. Here are links for relevant documentation. Installation guide begins under [Installation Guide](#installation-guide)

- [Gauge](http://gauge.org/)
- [Python 3.12](https://docs.python.org/3.12/)
- [Playwright](https://playwright.dev/python/)

<br>

## System(s) Under Test (SUT)
1. Download Reports Generator
2. Data Portal 2.0

<br>

# Installation Guide

## Install Framework

- [Install Gauge](https://docs.gauge.org/getting_started/installing-gauge.html?os=macos&language=python&ide=vscode)
- [Install Python 3.12](https://www.python.org/downloads/)
- [Install Gauge-Python plugin](https://github.com/kashishm/gauge-python/wiki/User-Documentation) by running this command. It MUST be the version listed.
  ````bash
  gauge install python --version 0.4.11
  ````


## Virtual Environment

Ensure that you either create a virtual environment or are working in a Docker container.
Make sure to create the environment in the holmes-py folder.

_Creating a virtual environment:_ (python version 3.12.x)

Set your local python to be the version of 3.12 you have installed on your machine
```bash
 pyenv local 3.12.x
```
Create the virtual environment

```bash
python -m venv venv
```

_Activating the virtual environment:_

```bash
source venv/bin/activate
```

## Install Requirements

Upgrade pip before attempting to install dependencies
````bash
pip install --upgrade pip
````

This project requires pip to install dependencies. To install dependencies run:
````bash
pip install -r requirements.txt
````

Install Playwright Browsers
````bash
playwright install
````

##### Correct versions:
```bash
Python: 3.12.x
getgauge: 0.4.11
playwright: 1.53.0
```

### Properties
On Windows: Please update the env/default/python.properties as bellow.
````bash
GAUGE_PYTHON_COMMAND = python
````
### How to test different environments
On your machine, VPN to the environment you want to run the tests against.

<br><br>

# Executing specs

## Test Execution Commands

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
gauge run specs --tags "Tag_Name"
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
Any of the commands below can also be ran in parallel or with de-bug mode.

The controlled-access tests require you to manually login to the data portal when prompted in the terminal. You will be prompted at the beginning of the test run. You only need to login to one window when running controlled access tests regardless if running in parallel. For further details on controlled-access mechanism,
see the step login_to_data_portal_if_necessary() inside file generic_steps.py

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

#### Example command: Run regression test with 6 threads
````
gauge run -p -n=6 specs --tags "regression"
````

### Gauge Execution Documentation
See [Run Gauge Specifications](https://docs.gauge.org/execution.html?os=macos&language=python&ide=vscode) for additional execution commands

<br><br>

# Docker Integration

Here's how to build/run this repo inside a Docker container.

1. Build the Docker image:

 ```bash
 docker build -t holmes .
```

2. Run the tests in the Docker container (example of running open access regression test):

```bash
docker run {docker_container_name} --env browser="headless chrome" gauge run -p -n=6 ./holmes-py/specs/gdc_data_portal_v2/  --tags "regression"
```

NOTE: The IS_DOCKER variable is used to indicate that tests are running within the Docker container, and is set to True within the Dockerfile

These tests will not currently run against edge, and they will only work with headless browser configurations.

To run the tests locally using docker-compose, run:

```bash
docker-compose up [--build]
```

<br><br>


# GitLab CI/CD Pipeline

The GitLab CI/CD pipeline configured using the `.gitlab-ci.yml` file. Our steps are 'Build UI Tests Docker Image' and 'Trigger Holmes-py Tests' which build the docker image and then execute the holmes-py tests.

This pipeline should be used to test the latest front-end code. Whether that's in qa-int or the QA environment during a software release. To test production level code, use the [holmes-py pipelines](https://gitlab.datacommons.io/nci-gdc/qa/holmes-py/-/pipeline_schedules)

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
