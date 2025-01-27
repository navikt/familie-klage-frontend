import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useApp } from '../../../../App/context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../../App/typer/ressurs';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { Søkefelt, Søkeresultat } from './brevmottakereStyling';
import { BodyShort, Button, TextField } from '@navikt/ds-react';
import { BrevmottakerOrganisasjon } from '../brevmottaker';

interface Props {
    valgteMottakere: BrevmottakerOrganisasjon[];
    settValgteMottakere: Dispatch<SetStateAction<BrevmottakerOrganisasjon[]>>;
}
export const SøkOrganisasjon: React.FC<Props> = ({ settValgteMottakere }) => {
    const { axiosRequest } = useApp();

    const [organisasjonsnummer, settOrganisasjonsnummer] = useState('');
    const [navnHosOrganisasjon, settNavnHosOrganisasjon] = useState('');
    const [organisasjonRessurs, settOrganisasjonRessurs] =
        useState(byggTomRessurs<IOrganisasjon>());
    const [feil, settFeil] = useState('');

    useEffect(() => {
        if (organisasjonsnummer?.length === 9) {
            axiosRequest<IOrganisasjon, null>({
                method: 'GET',
                url: `familie-klage/api/sok/organisasjon/${organisasjonsnummer}`,
            }).then((response: Ressurs<IOrganisasjon>) => {
                settOrganisasjonRessurs(response);
            });
        }
    }, [axiosRequest, organisasjonsnummer]);

    const leggTilOrganisasjon = (organisasjonsnummer: string, organisasjonsnavn: string) => () => {
        if (!navnHosOrganisasjon) {
            settFeil('Oppgi kontaktperson hos organisasjonen');
            return;
        }
        settFeil('');
        settValgteMottakere([
            {
                organisasjonsnummer,
                organisasjonsnavn,
                navnHosOrganisasjon,
            },
        ]);
    };

    return (
        <>
            <Søkefelt
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
                            <Søkeresultat>
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
                                    value={navnHosOrganisasjon}
                                    onChange={(e) => settNavnHosOrganisasjon(e.target.value)}
                                    error={feil}
                                />
                            </Søkeresultat>
                        </>
                    );
                }}
            </DataViewer>
        </>
    );
};

export interface IOrganisasjon {
    navn: string;
    organisasjonsnummer: string;
}
