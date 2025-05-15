export type BlankEøsLandkode = '';

export enum EøsLandkode {
    BE = 'BE',
    BG = 'BG',
    DK = 'DK',
    EE = 'EE',
    FI = 'FI',
    FR = 'FR',
    GR = 'GR',
    IE = 'IE',
    IS = 'IS',
    IT = 'IT',
    HR = 'HR',
    CY = 'CY',
    LV = 'LV',
    LI = 'LI',
    LT = 'LT',
    LU = 'LU',
    MT = 'MT',
    NL = 'NL',
    NO = 'NO',
    PL = 'PL',
    PT = 'PT',
    RO = 'RO',
    SK = 'SK',
    SI = 'SI',
    ES = 'ES',
    CH = 'CH',
    SE = 'SE',
    CZ = 'CZ',
    DE = 'DE',
    HU = 'HU',
    AT = 'AT',
}

export function erEøsLandkode(eøsLandkode: EøsLandkode | string): eøsLandkode is EøsLandkode {
    return Object.values(EøsLandkode).includes(eøsLandkode as EøsLandkode);
}

export function erUtenlandskEøsLandkode(
    eøsLandkode: EøsLandkode | string
): eøsLandkode is EøsLandkode {
    return erEøsLandkode(eøsLandkode) && eøsLandkode !== EøsLandkode.NO;
}
