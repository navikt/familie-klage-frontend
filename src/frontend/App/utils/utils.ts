import { Behandling, Fagsystem } from '../typer/fagsak';
import { Eksternlenker } from '../typer/eksternlenker';

export const base64toBlob = (b64Data: string, contentType = '', sliceSize = 512): Blob => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
};

export const harVerdi = (str: string | undefined | null): boolean =>
    str !== undefined && str !== '' && str !== null;

export const utledBehandlingLenke = (
    behandling: Behandling,
    eksternLenker: Eksternlenker
): string => {
    return utledEksternBehandlingLenke(
        behandling,
        behandling.påklagetVedtak?.eksternFagsystemBehandlingId,
        eksternLenker
    );
};

export const utledEksternBehandlingLenke = (
    behandling: Behandling,
    eksternBehandlingId: string | undefined,
    eksternLenker: Eksternlenker
): string => {
    return `${utledFagsystemUrl(behandling.fagsystem, eksternLenker)}/fagsak/${
        behandling.eksternFagsystemFagsakId
    }/${eksternBehandlingId}`;
};

export const utledTilbakekrevingLenke = (
    behandling: Behandling,
    eksternLenker: Eksternlenker
): string => {
    return `${eksternLenker.tilbakekrevingUrl}/${behandling.fagsystem}/fagsak/${
        behandling.eksternFagsystemFagsakId
    }/behandling/${behandling.påklagetVedtak?.eksternFagsystemBehandlingId}`;
};

export const utledSaksoversiktLenke = (
    behandling: Behandling,
    eksternLenker: Eksternlenker
): string => {
    return `${utledFagsystemUrl(behandling.fagsystem, eksternLenker)}/fagsak/${
        behandling.eksternFagsystemFagsakId
    }/saksoversikt`;
};

export const utledFagsystemUrl = (fagsystem: Fagsystem, eksternLenker: Eksternlenker): string => {
    switch (fagsystem) {
        case Fagsystem.EF:
            return eksternLenker.efSakUrl;
        case Fagsystem.BA:
            return eksternLenker.baSakUrl;
        case Fagsystem.KS:
            return eksternLenker.ksSakUrl;
    }
};

export const harTallverdi = (verdi: number | undefined | null): boolean =>
    verdi !== undefined && verdi !== null;

export const åpnePdfIEgenTab = (blob: Blob, filnavn: string): void => {
    const blobUrl = URL.createObjectURL(blob);
    const newWindow = window.open(blobUrl, '_blank');
    setTimeout(function () {
        if (newWindow) {
            newWindow.document.title = filnavn;
        }
    }, 500);
};

export const åpneFilIEgenTab = (
    journalpostId: string,
    dokumentinfoId: string,
    filnavn: string
): void => {
    const newWindow = window.open(
        `/dokument/vedlegg/${journalpostId}/dokument-pdf/${dokumentinfoId}`,
        '_blank'
    );
    setTimeout(function () {
        if (newWindow) {
            newWindow.document.title = filnavn;
        }
    }, 500);
};

// Brukes for å fjerne undefined og null fra lister som blir generert av .find()-funksjoner
export function ensure<T>(
    argument: T | undefined | null,
    message = 'Verdien kan ikke være null eller undefined'
): T {
    if (argument === undefined || argument === null) {
        throw new TypeError(message);
    }

    return argument;
}
