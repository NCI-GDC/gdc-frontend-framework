ARG BASE_CONTAINER_VERSION=3.0.6
ARG BASE_CONTAINER_REGISTRY=docker.osdc.io/ncigdc

FROM ${BASE_CONTAINER_REGISTRY}/python3.12-builder:${BASE_CONTAINER_VERSION}

RUN apk update && apk add \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libxkbcommon0 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \


RUN ln -fs /usr/bin/python3.12-builder /usr/bin/python3

RUN curl -SsL https://downloads.gauge.org/stable | sh

COPY . /app

RUN pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r /app/docker-requirements.txt

RUN playwright install

RUN gauge install python --version 0.4.9
RUN gauge install screenshot
RUN gauge install html-report

ENV IS_DOCKER=1

WORKDIR /app

CMD [ "sh", "-c", "gauge run ./specs/gdc_data_portal_v2/" ]
