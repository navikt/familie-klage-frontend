export function sendTilUmami(eventNavn: string, obj: object) {
    if (typeof window !== 'undefined' && window.umami) {
        console.log('Umami', eventNavn, obj);
        // window.umami.track(eventNavn, obj);
    }
}
