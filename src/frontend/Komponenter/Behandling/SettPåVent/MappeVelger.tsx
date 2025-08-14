import React, { FC, useEffect, useState } from 'react';
import { Select } from '@navikt/ds-react';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import { IMappe } from '../Typer/IMappe';
import { useApp } from '../../../App/context/AppContext';
import { DataViewer } from '../../../Felles/DataViewer/DataViewer';
import { Fagsystem } from '../../../App/typer/fagsak';

export const MappeVelger: FC<{
    oppgaveEnhet: string | undefined;
    fagsystem: Fagsystem;
    valgtMappe: number | undefined;
    settMappe: (mappe: number | undefined) => void;
    erLesevisning: boolean;
}> = ({ oppgaveEnhet, fagsystem, valgtMappe, settMappe, erLesevisning }) => {
    const [mapper, settMapper] = useState<Ressurs<IMappe[]>>(byggTomRessurs());
    const { axiosRequest } = useApp();

    const visMapper = (fagsystem: Fagsystem) => fagsystem === Fagsystem.EF;

    useEffect(() => {
        if (visMapper(fagsystem)) {
            axiosRequest<IMappe[], null>({
                method: 'GET',
                url: `/familie-klage/api/behandling/mapper`,
            }).then((res: Ressurs<IMappe[]>) => {
                settMapper(res);
            });
        } else {
            settMapper(byggTomRessurs());
        }
    }, [axiosRequest, fagsystem]);

    return (
        <DataViewer response={{ mapper }}>
            {({ mapper }) => {
                type GrupperteMapper = {
                    [key: string]: IMappe[];
                };

                const aktuelleMapper = mapper.filter((mappe) => mappe.enhetsnr === oppgaveEnhet);

                const grupperteMapper: GrupperteMapper = aktuelleMapper.reduce(
                    (acc: GrupperteMapper, mappe: IMappe) => {
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
                        {Object.keys(grupperteMapper).map((enhetsnr) => (
                            <optgroup key={enhetsnr} label={`Enhetsnr: ${enhetsnr}`}>
                                {grupperteMapper[enhetsnr].map((mappe) => (
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
