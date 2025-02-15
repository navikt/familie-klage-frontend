import React, { Dispatch, FC, SetStateAction } from 'react';
import styled from 'styled-components';
import { BodyShort, Ingress } from '@navikt/ds-react';
import { KopierbartNullableFødselsnummer } from '../../../../Fødselsnummer/KopierbartNullableFødselsnummer';
import SlettKnapp from '../../../../Felles/Knapper/SlettKnapp';
import {
    BrevmottakerOrganisasjon,
    BrevmottakerPerson,
    erBrevmottakerPersonMedIdent,
} from '../brevmottaker';

interface Props {
    valgtePersonMottakere: BrevmottakerPerson[];
    settValgtePersonMottakere: Dispatch<SetStateAction<BrevmottakerPerson[]>>;
    valgteOrganisasjonMottakere: BrevmottakerOrganisasjon[];
    settValgteOrganisasjonMottakere: Dispatch<SetStateAction<BrevmottakerOrganisasjon[]>>;
}

const Undertittel = styled(Ingress)`
    margin-bottom: 1rem;
`;

const StyledMottakerBoks = styled.div`
    padding: 10px;
    margin-bottom: 4px;
    display: grid;
    grid-template-columns: 5fr 1fr;
    background: rgba(196, 196, 196, 0.2);
`;

const Flexboks = styled.div`
    display: flex;
    flex-direction: column;
`;

export const BrevmottakereListe: FC<Props> = ({
    valgtePersonMottakere,
    settValgtePersonMottakere,
    valgteOrganisasjonMottakere,
    settValgteOrganisasjonMottakere,
}) => {
    const fjernPersonMottaker = (personIdent: string) => () => {
        settValgtePersonMottakere((prevState) =>
            prevState.filter((mottaker) => {
                if (erBrevmottakerPersonMedIdent(mottaker)) {
                    return mottaker.personIdent !== personIdent;
                }
                return true;
            })
        );
    };
    const fjernOrganisasjonMottaker = (organisasjonsnummer: string) => () => {
        settValgteOrganisasjonMottakere((prevState) =>
            prevState.filter((mottaker) => mottaker.organisasjonsnummer !== organisasjonsnummer)
        );
    };
    return (
        <>
            <Undertittel>Brevmottakere</Undertittel>
            {valgtePersonMottakere
                .filter((mottaker) => erBrevmottakerPersonMedIdent(mottaker))
                .map((mottaker, index) => (
                    <StyledMottakerBoks key={mottaker.navn + index}>
                        <Flexboks>
                            <BodyShort>
                                {`${mottaker.navn} (${mottaker.mottakerRolle.toLowerCase()})`}
                                <KopierbartNullableFødselsnummer
                                    fødselsnummer={mottaker.personIdent}
                                />
                            </BodyShort>
                        </Flexboks>
                        <SlettKnapp
                            onClick={fjernPersonMottaker(mottaker.personIdent)}
                            tekst={''}
                        />
                    </StyledMottakerBoks>
                ))}
            {valgteOrganisasjonMottakere.map((mottaker, index) => (
                <StyledMottakerBoks key={mottaker.navnHosOrganisasjon + index}>
                    <div>
                        <BodyShort>{`${mottaker.navnHosOrganisasjon}`}</BodyShort>
                        <BodyShort>
                            {`Organisasjonsnummer: ${mottaker.organisasjonsnummer}`}
                        </BodyShort>
                    </div>
                    <SlettKnapp
                        onClick={fjernOrganisasjonMottaker(mottaker.organisasjonsnummer)}
                        tekst={''}
                    />
                </StyledMottakerBoks>
            ))}
        </>
    );
};
