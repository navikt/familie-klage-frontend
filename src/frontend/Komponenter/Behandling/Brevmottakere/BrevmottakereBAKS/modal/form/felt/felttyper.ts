export type BrevmottakerFeltProps = {
    feltnavn: BrevmottakerFeltnavn;
    visningsnavn: string;
    erLesevisning?: boolean;
};

export enum BrevmottakerFeltnavn {
    MOTTAKERTYPE = 'mottakertype',
    LANDKODE = 'landkode',
    NAVN = 'navn',
    ADRESSELINJE1 = 'adresselinje1',
    ADRESSELINJE2 = 'adresselinje2',
    POSTNUMMER = 'postnummer',
    POSTSTED = 'poststed',
}
