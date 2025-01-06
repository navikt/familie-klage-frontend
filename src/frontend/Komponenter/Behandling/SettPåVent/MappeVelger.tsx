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

    const visMapper = (fagsystem: Fagsystem) => {
        switch (fagsystem) {
            case Fagsystem.EF:
                return true;
            default:
                return false;
        }
    };

    useEffect(() => {
        if (visMapper(fagsystem)) {
            axiosRequest<Mappe[], null>({
                method: 'GET',
                url: `/familie-klage/api/behandling/mapper`,
            }).then((res: Ressurs<Mappe[]>) => {
                settMapper(res);
            });
        } else {
            settMapper(byggTomRessurs());
        }
    }, [axiosRequest, fagsystem]);

    return (
        <DataViewer response={{ mapper }}>
            {({ mapper }) => {
                type SorterteMapper = {
                    [key: string]: Mappe[];
                };

                const sorterteMapper: SorterteMapper = mapper.reduce(
                    (acc: SorterteMapper, mappe: Mappe) => {
                        if (!acc[mappe.enhetsnr]) {
                            acc[mappe.enhetsnr] = [];
                        }
                        acc[mappe.enhetsnr].push(mappe);
                        return acc;
                    },
                    {}
                );

                return (
                    <Select
                        disabled={!oppgaveEnhet || !visMapper(fagsystem)}
                        value={valgtMappe}
                        label="Mappe"
                        size="small"
                        readOnly={erLesevisning}
                        onChange={(e) => {
                            const verdi = e.target.value;
                            settMappe(verdi === 'uplassert' ? undefined : parseInt(verdi));
                        }}
                    >
                        <option value="uplassert">Uplassert</option>
                        {Object.keys(sorterteMapper).map((enhetsnr) => (
                            <optgroup key={enhetsnr} label={`Enhetsnr: ${enhetsnr}`}>
                                {sorterteMapper[enhetsnr].map((mappe) => (
                                    <option key={mappe.id} value={mappe.id}>
                                        {mappe.navn}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </Select>
                );
            }}
        </DataViewer>
    );
};
