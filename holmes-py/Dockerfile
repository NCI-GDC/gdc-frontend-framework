ARG BASE_CONTAINER_VERSION=3.0.6
ARG BASE_CONTAINER_REGISTRY=docker.osdc.io/ncigdc

FROM ${BASE_CONTAINER_REGISTRY}/python3.12-builder:${BASE_CONTAINER_VERSION}

RUN curl -SsL https://downloads.gauge.org/stable | sh

COPY . /app

RUN pip install -r /app/docker-requirements.txt

RUN playwright install-deps
RUN playwright install

RUN gauge install python --version 0.4.9
RUN gauge install screenshot
RUN gauge install html-report

ENV IS_DOCKER=1

WORKDIR /app

CMD [ "sh", "-c", "gauge run ./specs/gdc_data_portal_v2/" ]
