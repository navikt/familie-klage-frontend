import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DataViewer } from '../../../Felles/DataViewer/DataViewer';
import { compareDesc } from 'date-fns';
import { formaterNullableIsoDatoTid } from '../../../App/utils/formatter';
import { åpneFilIEgenTab } from '../../../App/utils/utils';
import { Dokument, Dokumentliste } from './Dokumentliste';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';

interface Props {
    hidden: boolean;
}

export const Dokumenter: React.FC<Props> = ({ hidden }) => {
    const { axiosRequest } = useApp();
    const { behandlingId } = useParams<{ behandlingId: string }>();

    const [dokumenter, settDokumenter] = useState<Ressurs<Dokument[]>>(byggTomRessurs());

    const hentDokumenter = useCallback(
        (behandlingId: string) => {
            settDokumenter({ status: RessursStatus.HENTER });
            axiosRequest<Dokument[], null>({
                method: 'GET',
                url: `/familie-klage/api/vedlegg/${behandlingId}`,
            }).then((response: RessursSuksess<Dokument[]> | RessursFeilet) => {
                settDokumenter(response);
            });
        },
        [axiosRequest]
    );

    useEffect(() => {
        if (behandlingId) {
            hentDokumenter(behandlingId);
        }
    }, [behandlingId, hentDokumenter]);

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
        <DataViewer response={{ dokumenter }}>
            {({ dokumenter }) => {
                const sortertDokumentliste = sorterDokumentlisten(dokumenter);
                return (
                    <Dokumentliste dokumenter={sortertDokumentliste} onClick={lastNedDokument} />
                );
            }}
        </DataViewer>
    );
};
