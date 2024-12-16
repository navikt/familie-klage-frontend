import { BrevmottakerFormState } from './brevmottakerFormState';

export type BrevmottakerFeltProps = {
    feltnavn: keyof BrevmottakerFormState;
    visningsnavn: string;
    erLesevisning?: boolean;
};
