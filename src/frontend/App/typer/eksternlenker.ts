type EksternlenkeKey = 'efSakUrl' | 'baSakUrl' | 'ksSakUrl';
export type Eksternlenker = {
    [key in EksternlenkeKey]: string;
};
