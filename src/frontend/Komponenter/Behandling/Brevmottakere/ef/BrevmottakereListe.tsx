import React, { Dispatch, FC, SetStateAction } from 'react';
import styles from './BrevmottakereListe.module.css';
import { BodyShort, VStack } from '@navikt/ds-react';
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
            <BodyShort size="large" spacing>
                Brevmottakere
            </BodyShort>
            {valgtePersonMottakere
                .filter((mottaker) => erBrevmottakerPersonMedIdent(mottaker))
                .map((mottaker, index) => (
                    <div className={styles.container} key={mottaker.navn + index}>
                        <VStack>
                            <BodyShort>
                                {`${mottaker.navn} (${mottaker.mottakerRolle.toLowerCase()})`}
                                <KopierbartNullableFødselsnummer
                                    fødselsnummer={mottaker.personIdent}
                                />
                            </BodyShort>
                        </VStack>
                        <SlettKnapp
                            onClick={fjernPersonMottaker(mottaker.personIdent)}
                            tekst={''}
                        />
                    </div>
                ))}
            {valgteOrganisasjonMottakere.map((mottaker, index) => (
                <div className={styles.container} key={mottaker.navnHosOrganisasjon + index}>
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
                </div>
            ))}
        </>
    );
};
