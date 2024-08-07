FROM mcr.microsoft.com/playwright:v1.23.1-focal

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    python3-tk \
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

RUN curl -SsL https://downloads.gauge.org/stable | sh

COPY . /app

RUN mv /app/gdc_ca.crt /usr/share/ca-certificates/gdc_ca.crt
RUN chmod 644 /usr/share/ca-certificates/gdc_ca.crt
RUN echo "gdc_ca.crt" >> /etc/ca-certificates.conf
RUN cat /usr/share/ca-certificates/gdc_ca.crt
RUN update-ca-certificates

RUN pip install -r /app/docker-requirements.txt

RUN npm install -g --force playwright@1.23.1 && \
    playwright install --with-deps

RUN gauge install python
RUN gauge install screenshot
RUN gauge install html-report

ENV IS_DOCKER=1

WORKDIR /app

CMD [ "sh", "-c", "gauge run ./specs/gdc_data_portal_v2/" ]
