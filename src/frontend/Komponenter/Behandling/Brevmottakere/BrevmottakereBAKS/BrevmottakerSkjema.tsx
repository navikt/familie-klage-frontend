import React from 'react';
import { SubmitErrorHandler, SubmitHandler } from 'react-hook-form';
import { Button, Fieldset, Select, TextField } from '@navikt/ds-react';
import { BrevmottakerMedAdresse, Mottaker, mottakerVisningsnavn } from './BrevmottakereBAKS';
import styled from 'styled-components';
import { ASpacing6 } from '@navikt/ds-tokens/dist/tokens';
import { useBrevmottakerSkjema } from './useBrevmottakerSkjema';
// import { FamilieLandvelger } from '../../../../Felles/Landvelger/Landvelger';

const MottakerSelect = styled(Select)`
    max-width: 19rem;
`;

const StyledFieldset = styled(Fieldset)`
    &.navds-fieldset > div:not(:first-of-type):not(:empty) {
        margin-top: ${ASpacing6};
    }
`;

const ModalKnapperad = styled.div`
    margin-top: 2.5rem;
    display: flex;
    justify-content: flex-start;
    gap: 1rem;
`;

interface BrevmottakerSkjemaProps {
    erLesevisning: boolean;
}

const BrevmottakerSkjema = ({ erLesevisning }: BrevmottakerSkjemaProps) => {
    const { felter, errors, handleSubmit } = useBrevmottakerSkjema();

    const onSubmit: SubmitHandler<BrevmottakerMedAdresse> = (data: BrevmottakerMedAdresse) => {
        console.log(data);
    };

    const onSubmitError: SubmitErrorHandler<BrevmottakerMedAdresse> = (errors) => {
        console.log(`errors.mottakerRolle: ${errors.mottakerRolle?.message}`);
        console.log(`errors.navn: ${errors.navn?.message}`);
        console.log(`errors.land: ${errors.land?.message}`);
        console.log(`errors.adresselinje1: ${errors.adresselinje1?.message}`);
        console.log(`errors.adresselinje2: ${errors.adresselinje2?.message}`);
        console.log(`errors.poststed: ${errors.poststed?.message}`);
        console.log(`errors.postnummer: ${errors.postnummer?.message}`);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
            <StyledFieldset
                legend="Skjema for å legge til eller fjerne brevmottaker"
                hideLegend
                error={errors?.root?.message}
            >
                <MottakerSelect
                    label="Mottaker"
                    {...felter.mottakerRolle}
                    error={errors.mottakerRolle?.message}
                >
                    {Object.values(Mottaker).map((mottaker) => (
                        <option key={mottaker} value={mottaker}>
                            {mottakerVisningsnavn[mottaker]}
                        </option>
                    ))}
                </MottakerSelect>

                <TextField label="Navn" {...felter.navn} error={errors.navn?.message} />

                {/*<FamilieLandvelger onChange={() => {}} id={'land'} label={'Land'} />*/}

                <TextField
                    label="Adresselinje 1"
                    {...felter.adresselinje1}
                    error={errors.adresselinje1?.message}
                />

                <TextField
                    label="Adresselinje 2 (Valgfri)"
                    {...felter.adresselinje2}
                    error={errors.adresselinje2?.message}
                />

                <TextField
                    label="Postnummer"
                    {...felter.postnummer}
                    error={errors.postnummer?.message}
                />

                <TextField label="Poststed" {...felter.poststed} error={errors.poststed?.message} />

                <ModalKnapperad>
                    {erLesevisning ? (
                        <Button onClick={() => {}}>Lukk</Button>
                    ) : (
                        <>
                            <Button variant={'primary'} type={'submit'}>
                                Legg til mottaker
                            </Button>
                            <Button variant="tertiary" onClick={() => {}}>
                                Avbryt
                            </Button>
                        </>
                    )}
                </ModalKnapperad>
            </StyledFieldset>
        </form>
    );
};

export default BrevmottakerSkjema;
