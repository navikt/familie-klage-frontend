import React, { Dispatch, FC, SetStateAction } from 'react';
import { IFullmakt, IVergemål } from '../../../../App/typer/personopplysninger';
import styled from 'styled-components';
import { Ingress, Button, BodyShort } from '@navikt/ds-react';
import { VertikalSentrering } from '../../../../App/utils/styling';
import { KopierbartNullableFødselsnummer } from '../../../../Fødselsnummer/KopierbartNullableFødselsnummer';
import {
    BrevmottakerPerson,
    BrevmottakerPersonMedIdent,
    erBrevmottakerPersonMedIdent,
    mapFullmaktTilBrevmottakerPersonMedIdent,
    mapVergemålTilBrevmottakerPersonMedIdent,
} from '../brevmottaker';

interface Props {
    valgteMottakere: BrevmottakerPerson[];
    settValgteMottakere: Dispatch<SetStateAction<BrevmottakerPerson[]>>;
    verger: IVergemål[];
    fullmakter: IFullmakt[];
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

const Kolonner = styled.div`
    display: flex;
    flex-direction: column;
`;

export const VergerOgFullmektigeFraRegister: FC<Props> = ({
    valgteMottakere,
    settValgteMottakere,
    verger,
    fullmakter,
}) => {
    const muligeMottakere = [
        ...verger.map(mapVergemålTilBrevmottakerPersonMedIdent),
        ...fullmakter.map(mapFullmaktTilBrevmottakerPersonMedIdent),
    ];

    const settMottaker = (mottaker: BrevmottakerPersonMedIdent) => () => {
        settValgteMottakere((prevState) => {
            return [...prevState, mottaker];
        });
    };

    return (
        <>
            <Undertittel>Verge/Fullmektig fra register</Undertittel>
            {muligeMottakere.length ? (
                muligeMottakere.map((mottaker, index) => {
                    const mottakerValgt = !!valgteMottakere.find((valgtMottaker) => {
                        if (erBrevmottakerPersonMedIdent(valgtMottaker)) {
                            return valgtMottaker.personIdent === mottaker.personIdent;
                        }
                    });
                    return (
                        <StyledMottakerBoks key={mottaker.navn + index}>
                            <Kolonner>
                                {`${mottaker.navn} (${mottaker.mottakerRolle.toLowerCase()})`}
                                <KopierbartNullableFødselsnummer
                                    fødselsnummer={mottaker.personIdent}
                                />
                            </Kolonner>
                            {!mottakerValgt && (
                                <VertikalSentrering>
                                    <div>
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={settMottaker(mottaker)}
                                        >
                                            Legg til
                                        </Button>
                                    </div>
                                </VertikalSentrering>
                            )}
                        </StyledMottakerBoks>
                    );
                })
            ) : (
                <BodyShort>Ingen verge/fullmektig i register</BodyShort>
            )}
        </>
    );
};
