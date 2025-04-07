import { Fagsystem } from '../../../App/typer/fagsak';

export interface OppdaterBehandlendeEnhetRequest {
    enhetsnummer: string;
    begrunnelse: string;
}

export interface IArbeidsfordelingsenhet {
    enhetsnummer: string;
    enhetsnavn: string;
    gyldigForFagsystem: Fagsystem[];
}

export const behandlendeEnheter: IArbeidsfordelingsenhet[] = [
    {
        enhetsnummer: '2103',
        enhetsnavn: 'NAV Vikafossen',
        gyldigForFagsystem: [Fagsystem.BA, Fagsystem.KS],
    },
    {
        enhetsnummer: '4806',
        enhetsnavn: 'NAV Familie- og pensjonsytelser Drammen',
        gyldigForFagsystem: [Fagsystem.BA, Fagsystem.KS],
    },
    {
        enhetsnummer: '4820',
        enhetsnavn: 'NAV Familie- og pensjonsytelser Vadsø',
        gyldigForFagsystem: [Fagsystem.BA, Fagsystem.KS],
    },
    {
        enhetsnummer: '4833',
        enhetsnavn: 'NAV Familie- og pensjonsytelser Oslo 1',
        gyldigForFagsystem: [Fagsystem.BA, Fagsystem.KS],
    },
    {
        enhetsnummer: '4842',
        enhetsnavn: 'NAV Familie- og pensjonsytelser Stord',
        gyldigForFagsystem: [Fagsystem.BA, Fagsystem.KS],
    },
    {
        enhetsnummer: '4817',
        enhetsnavn: 'NAV Familie- og pensjonsytelser Steinkjer',
        gyldigForFagsystem: [Fagsystem.BA, Fagsystem.KS],
    },
    {
        enhetsnummer: '4812',
        enhetsnavn: 'NAV Familie- og pensjonsytelser Bergen',
        gyldigForFagsystem: [Fagsystem.KS],
    },
];
