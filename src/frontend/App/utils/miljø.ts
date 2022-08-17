export const erProd = (): boolean => window.location.host === 'familie-klage.intern.nav.no';

export const tilbakekrevingBaseUrl = (): string =>
    erProd()
        ? 'https://familietilbakekreving.intern.nav.no'
        : 'https://familie-tilbake-frontend.dev.intern.nav.no';
