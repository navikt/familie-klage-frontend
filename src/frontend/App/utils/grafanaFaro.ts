import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';

enum TelemetryCollectorURL {
    prod = 'https://telemetry.nav.no/collect',
    test = 'https://telemetry.ekstern.dev.nav.no/collect',
    lokalt = 'http://localhost:12347/collect',
}

export const erProd = () => {
    return window.location.hostname.indexOf('intern.nav.no') > -1;
};

export const erDev = () => {
    return window.location.hostname.indexOf('dev.nav.no') > -1;
};

const getTelemetryCollectorURL = (): TelemetryCollectorURL => {
    if (erProd()) {
        return TelemetryCollectorURL.prod;
    }

    if (erDev()) {
        return TelemetryCollectorURL.test;
    }

    return TelemetryCollectorURL.lokalt;
};

export function initGrafanaFaro() {
    (erDev() || erProd()) &&
        initializeFaro({
            isolate: true,
            url: getTelemetryCollectorURL(),
            app: {
                name: 'familie-klage-frontend',
            },
            instrumentations: [
                ...getWebInstrumentations({
                    captureConsole: false,
                }),
            ],
        });
}
