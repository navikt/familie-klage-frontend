export const erLokal = (): boolean =>
    ['local', 'lokalt-mot-preprod'].includes(process.env.ENV ?? '');
export const erPreprod = (): boolean => process.env.ENV === 'preprod';
export const erProd = (): boolean => process.env.ENV === 'production';
