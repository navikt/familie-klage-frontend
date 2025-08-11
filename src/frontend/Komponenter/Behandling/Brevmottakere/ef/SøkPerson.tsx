import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useApp } from '../../../../App/context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { BodyShort, Button, HStack, TextField } from '@navikt/ds-react';
import { MottakerRolle } from '../mottakerRolle';
import { BrevmottakerPerson } from '../brevmottaker';
import styles from './SøkOrganisasjon.module.css';

interface Props {
    settValgteMottakere: Dispatch<SetStateAction<BrevmottakerPerson[]>>;
    behandlingId: string;
}

interface PersonSøk {
    personIdent: string;
    behandlingId: string;
    navn: string;
}

export const SøkPerson: React.FC<Props> = ({ settValgteMottakere, behandlingId }) => {
    const { axiosRequest } = useApp();
    const [søkIdent, settSøkIdent] = useState('');
    const [søkRessurs, settSøkRessurs] = useState(byggTomRessurs<PersonSøk>());

    useEffect(() => {
        if (søkIdent && søkIdent.length === 11) {
            axiosRequest<PersonSøk, { personIdent: string; behandlingId: string }>({
                method: 'POST',
                url: 'familie-klage/api/sok/person',
                data: {
                    personIdent: søkIdent,
                    behandlingId: behandlingId,
                },
            }).then((resp: Ressurs<PersonSøk>) => {
                settSøkRessurs(resp);
            });
        }
    }, [axiosRequest, søkIdent, behandlingId]);

    const leggTilBrevmottaker = (personIdent: string, navn: string) => () => {
        settValgteMottakere((prevState) => [
            ...prevState,
            { navn, personIdent, mottakerRolle: MottakerRolle.VERGE },
        ]);
    };

    return (
        <>
            <TextField
                className={styles.søkefelt}
                label={'Personident'}
                htmlSize={26}
                placeholder={'Personen som skal ha brevet'}
                value={søkIdent}
                onChange={(e) => settSøkIdent(e.target.value)}
            />
            <DataViewer response={{ søkRessurs }}>
                {({ søkRessurs }) => {
                    return (
                        <div className={styles.søkeresultat}>
                            <div>
                                <BodyShort>{søkRessurs.navn}</BodyShort>
                                {søkRessurs.personIdent}
                            </div>
                            <HStack align="center" justify="center">
                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={leggTilBrevmottaker(
                                        søkRessurs.personIdent,
                                        søkRessurs.navn
                                    )}
                                >
                                    Legg til
                                </Button>
                            </HStack>
                        </div>
                    );
                }}
            </DataViewer>
        </>
    );
};
