import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';
import { erDev, erProd } from './miljø';

enum TelemetryCollectorURL {
    prod = 'https://telemetry.nav.no/collect',
    dev = 'https://telemetry.ekstern.dev.nav.no/collect',
    lokalt = 'http://localhost:12347/collect',
}

const getTelemetryCollectorURL = (): TelemetryCollectorURL => {
    if (erProd()) {
        return TelemetryCollectorURL.prod;
    }

    if (erDev()) {
        return TelemetryCollectorURL.dev;
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
