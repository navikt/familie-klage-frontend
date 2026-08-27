import { BodyShort, HStack, VStack } from '@navikt/ds-react';
import type { Dispatch, FC, SetStateAction } from 'react';
import React from 'react';
import { usePersonopplysningerContext } from '../../../../App/context/PersonopplysningerContext';
import { KopierbartNullableFødselsnummer } from '../../../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import { Button } from '../../../../Felles/Knapper/Button';
import type { BrevmottakerPerson, BrevmottakerPersonMedIdent } from '../brevmottaker';
import {
    erBrevmottakerPersonMedIdent,
    mapFullmaktTilBrevmottakerPersonMedIdent,
    mapVergemålTilBrevmottakerPersonMedIdent,
} from '../brevmottaker';
import styles from './SøkWrapper.module.css';

interface Props {
    valgteMottakere: BrevmottakerPerson[];
    settValgteMottakere: Dispatch<SetStateAction<BrevmottakerPerson[]>>;
}

export const VergerOgFullmektigeFraRegister: FC<Props> = ({
    valgteMottakere,
    settValgteMottakere,
}) => {
    const {
        fagsakEier: { vergemål, fullmakt },
    } = usePersonopplysningerContext();

    const muligeMottakere = [
        ...vergemål.map(mapVergemålTilBrevmottakerPersonMedIdent),
        ...fullmakt.map(mapFullmaktTilBrevmottakerPersonMedIdent),
    ];

    const settMottaker = (mottaker: BrevmottakerPersonMedIdent) => () => {
        settValgteMottakere(prevState => {
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
                    const mottakerValgt = !!valgteMottakere.find(valgtMottaker => {
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
