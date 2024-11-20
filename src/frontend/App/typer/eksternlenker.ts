type EksternlenkeKey =
    | 'efSakUrl'
    | 'baSakUrl'
    | 'ksSakUrl'
    | 'aInntekt'
    | 'gosys'
    | 'modia'
    | 'tilbakekrevingUrl';
export type Eksternlenker = {
    [key in EksternlenkeKey]: string;
};
