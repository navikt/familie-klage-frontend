import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useApp } from '../../../../App/context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import { DataViewer } from '../../../../Felles/DataViewer/DataViewer';
import { BodyShort, Button, TextField } from '@navikt/ds-react';
import { BrevmottakerOrganisasjon } from '../brevmottaker';
import styles from './SøkOrganisasjon.module.css';

interface Organisasjon {
    navn: string;
    organisasjonsnummer: string;
}

interface Props {
    valgteMottakere: BrevmottakerOrganisasjon[];
    settValgteMottakere: Dispatch<SetStateAction<BrevmottakerOrganisasjon[]>>;
}

export const SøkOrganisasjon: React.FC<Props> = ({ settValgteMottakere }) => {
    const { axiosRequest } = useApp();

    const [organisasjonsnummer, settOrganisasjonsnummer] = useState('');
    const [kontaktpersonHosOrganisasjon, settKontaktpersonHosOrganisasjon] = useState('');
    const [organisasjonRessurs, settOrganisasjonRessurs] = useState(byggTomRessurs<Organisasjon>());
    const [feil, settFeil] = useState('');

    useEffect(() => {
        if (organisasjonsnummer?.length === 9) {
            axiosRequest<Organisasjon, null>({
                method: 'GET',
                url: `familie-klage/api/sok/organisasjon/${organisasjonsnummer}`,
            }).then((response: Ressurs<Organisasjon>) => {
                settOrganisasjonRessurs(response);
            });
        }
    }, [axiosRequest, organisasjonsnummer]);

    const leggTilOrganisasjon = (organisasjonsnummer: string, organisasjonsnavn: string) => () => {
        if (!kontaktpersonHosOrganisasjon) {
            settFeil('Oppgi kontaktperson hos organisasjonen');
            return;
        }
        settFeil('');
        settValgteMottakere((prevState) => [
            ...prevState,
            {
                organisasjonsnummer: organisasjonsnummer,
                organisasjonsnavn: organisasjonsnavn,
                navnHosOrganisasjon: `${organisasjonsnavn} c/o ${kontaktpersonHosOrganisasjon}`,
            },
        ]);
    };

    return (
        <>
            <TextField
                className={styles.søkefelt}
                label={'Organisasjonsnummer'}
                htmlSize={26}
                placeholder={'Søk'}
                value={organisasjonsnummer}
                onChange={(e) => settOrganisasjonsnummer(e.target.value)}
            />
            <DataViewer response={{ organisasjonRessurs }}>
                {({ organisasjonRessurs }) => {
                    return (
                        <>
                            <div className={styles.søkeresultat}>
                                <div>
                                    <BodyShort>{organisasjonRessurs.navn}</BodyShort>
                                    {organisasjonRessurs.organisasjonsnummer}
                                </div>
                                <Button
                                    variant={'secondary'}
                                    onClick={leggTilOrganisasjon(
                                        organisasjonRessurs.organisasjonsnummer,
                                        organisasjonRessurs.navn
                                    )}
                                >
                                    Legg til
                                </Button>
                                <TextField
                                    htmlSize={25}
                                    label={'Ved'}
                                    placeholder={'Personen brevet skal til'}
                                    value={kontaktpersonHosOrganisasjon}
                                    onChange={(e) =>
                                        settKontaktpersonHosOrganisasjon(e.target.value)
                                    }
                                    error={feil}
                                />
                            </div>
                        </>
                    );
                }}
            </DataViewer>
        </>
    );
};
