import React, { FC, useEffect, useState } from 'react';
import { Select } from '@navikt/ds-react';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import { IMappe } from './IMappe';
import { useApp } from '../../../App/context/AppContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';

export const MappeVelger: FC<{
    oppgaveEnhet: string | undefined;
    valgtMappe: number | undefined;
    settMappe: (mappe: number | undefined) => void;
    erLesevisning: boolean;
}> = ({ oppgaveEnhet, valgtMappe, settMappe, erLesevisning }) => {
    const [mapper, settMapper] = useState<Ressurs<IMappe[]>>(byggTomRessurs());
    const { axiosRequest } = useApp();

    useEffect(() => {
        axiosRequest<IMappe[], null>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/mapper`, // TODO: Endre denne slik den matcher ef-klage.
        }).then((res: Ressurs<IMappe[]>) => {
            settMapper(res);
        });
    }, [axiosRequest]);

    return (
        <DataViewer response={{ mapper }}>
            {({ mapper }) => {
                const upplassertMappe = 'uplassert';

                // TODO: Antar at backend sender sortert liste basert på navn, ellers må dette gjøres her slik det er i EF-SAK.
                const aktuelleMapper = mapper.filter((mappe) => mappe.enhetsnr === oppgaveEnhet);

                return (
                    <Select
                        disabled={oppgaveEnhet === undefined}
                        value={valgtMappe}
                        label="Mappe"
                        size="small"
                        readOnly={erLesevisning}
                        onChange={(e) => {
                            // TODO: Kan dette gjøres enklere?
                            const verdi = e.target.value;
                            settMappe(verdi === upplassertMappe ? undefined : parseInt(verdi));
                        }}
                    >
                        <option value={upplassertMappe}>Uplassert</option>
                        {aktuelleMapper?.map((mappe) => (
                            <option key={mappe.id} value={mappe.id}>
                                {mappe.navn}
                            </option>
                        ))}
                    </Select>
                );
            }}
        </DataViewer>
    );
};
