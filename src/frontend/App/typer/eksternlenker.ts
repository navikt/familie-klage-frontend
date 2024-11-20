type EksternlenkeKey =
    | 'efSakUrl'
    | 'baSakUrl'
    | 'ksSakUrl'
    | 'aInntekt'
    | 'gosys'
    | 'modia'
    | 'efTilbakekrevingUrl'
    | 'baTilbakekrevingUrl'
    | 'ksTilbakekrevingUrl';
export type Eksternlenker = {
    [key in EksternlenkeKey]: string;
};
