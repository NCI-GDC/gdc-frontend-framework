# Holmes
## BDD test automation framework
_Detects and reports UI defects_

# Table of contents
1. Framework

    1.1 Concepts covered

2. Prerequisites
3. System(s) Under Test (SUT)


# Framework

This project uses

- [Gauge](http://gauge.org/)
- [Python 3.8.x or above](https://docs.python.org/3/index.html)
- [Playwright](https://playwright.dev/python/docs/library#macos)


## Concepts covered

- Use [Playwright](https://playwright.dev/python/docs/writing-tests) as base of implementation
- Specs
- Table driven execution
- File driven execution
- Simple execution

# Prerequisites

- [Install Gauge](https://docs.gauge.org/getting_started/installing-gauge.html?os=macos&language=python&ide=vscode)
- [Install Python 3.8.x or above](https://www.python.org/downloads/)
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

_Creating a virtual environment:_

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
Python: 3.8.x
getgauge: 0.3.17
playwright: 1.23.1
protobuf: 3.20.1
```

This project requires pip to install dependencies. To install dependencies run:
````bash
pip3 install -r requirements.txt
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
See [Run Gauge Specifications](https://docs.gauge.org/execution.html?os=macos&language=python&ide=vscode)

This will also compile all the supporting code implementations.
