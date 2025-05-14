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

export function erUtanlandskEøsLandkode(landkode: EøsLandkode | string) {
    const erEøsLandkode = Object.values(landkode).includes(landkode);
    return erEøsLandkode && landkode !== EøsLandkode.NO;
}
