import * as React from 'react';
import { AxiosRequestConfig } from 'axios';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { IBehandlingParams } from '../../../App/typer/routing';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { DataViewer } from '../../../Felles/DataViewer/DataViewer';
import { compareDesc } from 'date-fns';
import { formaterNullableIsoDatoTid } from '../../../App/utils/formatter';
import { åpneFilIEgenTab } from '../../../App/utils/utils';
import { Dokument, Dokumentliste } from './Dokumentliste';

interface Props {
    hidden: boolean;
}

export const Dokumenter: React.FC<Props> = ({ hidden }) => {
    const { behandlingId } = useParams<IBehandlingParams>();

    const dokumentConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-klage/api/vedlegg/${behandlingId}`,
        }),
        [behandlingId]
    );
    const dokumentResponse = useDataHenter<Dokument[], null>(dokumentConfig);

    const sorterDokumentlisten = (dokumenter: Dokument[]) => {
        return dokumenter
            .sort((a, b) => {
                if (!a.dato) {
                    return 1;
                } else if (!b.dato) {
                    return -1;
                }
                return compareDesc(new Date(a.dato), new Date(b.dato));
            })
            .map((dokument) => {
                return { ...dokument, dato: formaterNullableIsoDatoTid(dokument.dato) };
            });
    };

    const lastNedDokument = (dokument: Dokument) => {
        åpneFilIEgenTab(
            dokument.journalpostId,
            dokument.dokumentinfoId,
            dokument.tittel || dokument.filnavn || ''
        );
    };

    if (hidden) {
        return <></>;
    }

    return (
        <DataViewer response={{ dokumentResponse }}>
            {({ dokumentResponse }) => {
                const sortertDokumentliste = sorterDokumentlisten(dokumentResponse);
                return (
                    <Dokumentliste dokumenter={sortertDokumentliste} onClick={lastNedDokument} />
                );
            }}
        </DataViewer>
    );
};
