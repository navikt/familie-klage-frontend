import React from 'react';
import { useApp } from '../../../../../App/context/AppContext';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import CountryData from '@navikt/land-verktoy';
import { Alert, BodyShort, Button, Label, Tooltip } from '@navikt/ds-react';
import { Brevmottaker, Mottakertype, mottakerVisningsnavn } from '../BrevmottakereWrapper';
import styled from 'styled-components';

const Grid = styled.div`
    display: grid;
    grid-template-columns: 9rem 23rem 16rem;
`;

const InfoHeader = styled.div`
    display: grid;
    grid-template-columns: 26rem 12rem;
`;

const KompaktButton = styled(Button)`
    padding: 0;
    justify-content: right;
`;

type Props = {
    brevmottakere: Brevmottaker[];
};

export function BrevmottakereOppsumering({ brevmottakere }: Props) {
    const { settVisBrevmottakereModal } = useApp();
    const { behandlingErRedigerbar } = useBehandling();
    const utledNavnPåMottakere = (brevMottakere: Brevmottaker[]) => {
        return [
            ...brevMottakere.map((person) => {
                const land = CountryData.getCountryInstance('nb').findByValue(
                    person.landkode
                ).label;
                return (
                    `${person.navn} (${mottakerVisningsnavn[person.mottakertype]}): ${person.adresselinje1}, ` +
                    (person.landkode === 'NO'
                        ? `${person.postnummer}, ${person.poststed}, ${land}`
                        : `${land}`)
                );
            }),
        ];
    };

    const navn = utledNavnPåMottakere(brevmottakere);
    const flereBrevmottakereErValgt = navn.length > 1;
    const erBrevmottakerAvTypeBruker = brevmottakere.find(
        (person) => person.mottakertype === Mottakertype.BRUKER
    );

    return flereBrevmottakereErValgt || !erBrevmottakerAvTypeBruker ? (
        <Alert variant={'info'}>
            <InfoHeader>
                <Label>Brevmottakere:</Label>
                {behandlingErRedigerbar && (
                    <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                        <KompaktButton
                            variant={'tertiary'}
                            onClick={() => settVisBrevmottakereModal(true)}
                        >
                            Legg til/endre brevmottakere
                        </KompaktButton>
                    </Tooltip>
                )}
            </InfoHeader>
            <ul>
                {navn.map((navn, index) => (
                    <li key={navn + index}>
                        <BodyShort key={navn + index}>{navn}</BodyShort>
                    </li>
                ))}
            </ul>
        </Alert>
    ) : (
        <Grid>
            <Label>Brevmottaker:</Label>
            <BodyShort>{navn.map((navn) => navn)}</BodyShort>
            {behandlingErRedigerbar && (
                <Tooltip content={'Legg til verge eller fullmektige brevmottakere'}>
                    <KompaktButton
                        variant={'tertiary'}
                        onClick={() => settVisBrevmottakereModal(true)}
                    >
                        Legg til/endre brevmottakere
                    </KompaktButton>
                </Tooltip>
            )}
        </Grid>
    );
}
