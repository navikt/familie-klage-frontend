import React, { Dispatch, FC, SetStateAction } from 'react';
import styles from './BrevmottakereListe.module.css';
import { BodyShort, Button, VStack } from '@navikt/ds-react';
import { KopierbartNullableFødselsnummer } from '../../../../Fødselsnummer/KopierbartNullableFødselsnummer';
import {
    BrevmottakerOrganisasjon,
    BrevmottakerPerson,
    erBrevmottakerPersonMedIdent,
} from '../brevmottaker';
import { TrashIcon } from '@navikt/aksel-icons';

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
                        <Button
                            onClick={() => fjernPersonMottaker(mottaker.personIdent)}
                            icon={<TrashIcon fontSize="1.5rem" />}
                            variant={'tertiary'}
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
                    <Button
                        onClick={() => fjernOrganisasjonMottaker(mottaker.organisasjonsnummer)}
                        icon={<TrashIcon fontSize="1.5rem" />}
                        variant={'tertiary'}
                    />
                </div>
            ))}
        </>
    );
};
