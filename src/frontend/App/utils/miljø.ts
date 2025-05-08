export const erProd = () => {
    return window.location.hostname.indexOf('familie-klage.intern.nav.no') > -1;
};

export const erDev = () => {
    return window.location.hostname.indexOf('dev.nav.no') > -1;
};
