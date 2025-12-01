FROM mcr.microsoft.com/playwright/python:v1.53.0-jammy

RUN rm -rf /var/lib/apt/lists/* \
    && apt-get update \
    && apt-get install -y \
        scrot \
        unzip \
        libnss3 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libdrm2 \
        libxkbcommon0 \
        libgtk-3-0 \
        libxshmfence1 \
        libgbm1 \
        libasound2 \
        libatspi2.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY . /app

RUN python3 -m pip install -r /app/docker-requirements.txt

RUN playwright install --with-deps

RUN curl -SsL https://downloads.gauge.org/stable | sh
RUN gauge install python --version 0.4.11
RUN gauge install screenshot
RUN gauge install html-report

ENV IS_DOCKER=1

WORKDIR /app

CMD [ "sh", "-c", "gauge run ./specs/gdc_data_portal_v2/" ]
