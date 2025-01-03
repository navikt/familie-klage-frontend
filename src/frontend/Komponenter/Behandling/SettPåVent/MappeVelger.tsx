import React, { FC, useEffect, useState } from 'react';
import { Select } from '@navikt/ds-react';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import { Mappe } from '../Typer/Mappe';
import { useApp } from '../../../App/context/AppContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Fagsystem } from '../../../App/typer/fagsak';

export const MappeVelger: FC<{
    oppgaveEnhet: string | undefined;
    fagsystem: Fagsystem;
    valgtMappe: number | undefined;
    settMappe: (mappe: number | undefined) => void;
    erLesevisning: boolean;
}> = ({ oppgaveEnhet, fagsystem, valgtMappe, settMappe, erLesevisning }) => {
    const [mapper, settMapper] = useState<Ressurs<Mappe[]>>(byggTomRessurs());
    const { axiosRequest } = useApp();

    useEffect(() => {
        axiosRequest<Mappe[], null>({
            method: 'GET',
            url: `/familie-klage/api/behandling/mapper`, // TODO: Endre denne slik den matcher ef-klage.
        }).then((res: Ressurs<Mappe[]>) => {
            settMapper(res);
        });
    }, [axiosRequest]);

    return (
        <DataViewer response={{ mapper }}>
            {({ mapper }) => {
                const upplassertMappe = 'uplassert';

                // TODO: Antar at backend sender sortert liste basert på navn, ellers må dette gjøres her slik det er i EF-SAK.
                const aktuelleMapper =
                    fagsystem === Fagsystem.EF
                        ? mapper.filter((mappe) => mappe.enhetsnr === oppgaveEnhet)
                        : [];

                return (
                    <Select
                        disabled={oppgaveEnhet === undefined || fagsystem !== Fagsystem.EF} // TODO: Fungerer, men er ikke maks chill.
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
