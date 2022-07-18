import { AvsnittMedId, IFritekstBrev } from './BrevTyper';
import { v4 as uuidv4 } from 'uuid';

export const flyttAvsnittOppover = (
    avsnittId: string,
    eksisterendeAvsnitt: AvsnittMedId[]
): AvsnittMedId[] => {
    const avsnittSomSkalFlyttesIndeks = eksisterendeAvsnitt.findIndex(
        (avsnitt) => avsnitt.avsnittId === avsnittId
    );
    const avsnittFørIndeks = avsnittSomSkalFlyttesIndeks - 1;
    const avsnittEtterIndeks = avsnittSomSkalFlyttesIndeks + 1;

    return [
        ...eksisterendeAvsnitt.slice(0, avsnittFørIndeks),
        eksisterendeAvsnitt[avsnittSomSkalFlyttesIndeks],
        eksisterendeAvsnitt[avsnittFørIndeks],
        ...eksisterendeAvsnitt.slice(avsnittEtterIndeks),
    ];
};

export const flyttAvsnittNedover = (
    avsnittId: string,
    eksisterendeAvsnitt: AvsnittMedId[]
): AvsnittMedId[] => {
    const avsnittSomSkalFlyttesIndeks = eksisterendeAvsnitt.findIndex(
        (avsnitt) => avsnitt.avsnittId === avsnittId
    );
    const avsnittEtterIndeks = avsnittSomSkalFlyttesIndeks + 1;

    return [
        ...eksisterendeAvsnitt.slice(0, avsnittSomSkalFlyttesIndeks),
        eksisterendeAvsnitt[avsnittEtterIndeks],
        eksisterendeAvsnitt[avsnittSomSkalFlyttesIndeks],
        ...eksisterendeAvsnitt.slice(avsnittEtterIndeks + 1),
    ];
};

export const initielleAvsnittMellomlager = (
    mellomlagretFritekstbrev: IFritekstBrev | undefined
): AvsnittMedId[] => {
    return mellomlagretFritekstbrev
        ? mellomlagretFritekstbrev.avsnitt.map((avsnitt) => ({ ...avsnitt, id: uuidv4() }))
        : [];
};

const lagTomtAvsnitt = (): AvsnittMedId => ({
    deloverskrift: '',
    innhold: '',
    avsnittId: uuidv4(),
});

export const leggTilAvsnittFørst = (eksisterendeAvsnitt: AvsnittMedId[]): AvsnittMedId[] => {
    return [lagTomtAvsnitt(), ...eksisterendeAvsnitt];
};

export const leggAvsnittBakSisteSynligeAvsnitt = (
    eksisterendeAvsnitt: AvsnittMedId[]
): AvsnittMedId[] => {
    const førsteSkjulteAvsnitt = eksisterendeAvsnitt.findIndex(
        (avsnitt) => avsnitt.skalSkjulesIBrevbygger
    );

    return [
        ...eksisterendeAvsnitt.slice(0, førsteSkjulteAvsnitt),
        lagTomtAvsnitt(),
        ...eksisterendeAvsnitt.slice(førsteSkjulteAvsnitt),
    ];
};

export const skjulAvsnittIBrevbygger = (avsnitt: AvsnittMedId[]): AvsnittMedId[] =>
    avsnitt.map((avsnitt) => ({ ...avsnitt, skalSkjulesIBrevbygger: true }));
