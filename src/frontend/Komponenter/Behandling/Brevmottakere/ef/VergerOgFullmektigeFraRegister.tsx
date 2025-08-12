import React, { Dispatch, FC, SetStateAction } from 'react';
import { IFullmakt, IVergemål } from '../../../../App/typer/personopplysninger';
import styles from './SøkWrapper.module.css';
import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import { KopierbartNullableFødselsnummer } from '../../../../Fødselsnummer/KopierbartNullableFødselsnummer';
import {
    BrevmottakerPerson,
    BrevmottakerPersonMedIdent,
    erBrevmottakerPersonMedIdent,
    mapFullmaktTilBrevmottakerPersonMedIdent,
    mapVergemålTilBrevmottakerPersonMedIdent,
} from '../brevmottaker';
import { Button } from '../../../../Felles/Knapper/Button';

interface Props {
    valgteMottakere: BrevmottakerPerson[];
    settValgteMottakere: Dispatch<SetStateAction<BrevmottakerPerson[]>>;
    verger: IVergemål[];
    fullmakter: IFullmakt[];
}

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
            <BodyShort size="large" spacing>
                Verge/Fullmektig fra register
            </BodyShort>
            {muligeMottakere.length ? (
                muligeMottakere.map((mottaker, index) => {
                    const mottakerValgt = !!valgteMottakere.find((valgtMottaker) => {
                        if (erBrevmottakerPersonMedIdent(valgtMottaker)) {
                            return valgtMottaker.personIdent === mottaker.personIdent;
                        }
                    });

                    return (
                        <div className={styles.mottakerBoks} key={mottaker.navn + index}>
                            <VStack>
                                {`${mottaker.navn} (${mottaker.mottakerRolle.toLowerCase()})`}
                                <KopierbartNullableFødselsnummer
                                    fødselsnummer={mottaker.personIdent}
                                />
                            </VStack>
                            {!mottakerValgt && (
                                <HStack align="center">
                                    <Button
                                        variant="secondary"
                                        size="small"
                                        onClick={settMottaker(mottaker)}
                                    >
                                        Legg til
                                    </Button>
                                </HStack>
                            )}
                        </div>
                    );
                })
            ) : (
                <BodyShort>Ingen verge/fullmektig i register</BodyShort>
            )}
        </>
    );
};
