export interface IAvsnitt {
    deloverskrift: string;
    innhold: string;
    skalSkjulesIBrevbygger?: boolean;
}

export type AvsnittMedId = IAvsnitt & { avsnittId: string };

export interface IFritekstBrev {
    overskrift: string;
    avsnitt: AvsnittMedId[];
    behandlingId?: string;
}
