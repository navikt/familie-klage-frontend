import * as React from 'react';
import styles from './Dokumentliste.module.css';
import { BodyShort, Button, Tag } from '@navikt/ds-react';
import { LogiskeVedlegg } from './LogiskeVedlegg';
import { Journalposttype, LogiskVedlegg } from '../../../App/typer/dokument';

export interface Dokument {
    tittel: string;
    dato?: string;
    journalpostId: string;
    journalposttype: Journalposttype;
    dokumentinfoId: string;
    filnavn?: string;
    logiskeVedlegg?: LogiskVedlegg[];
}

interface Props {
    dokumenter: Dokument[];
    onClick: (dokument: Dokument) => void;
}

export const Dokumentliste: React.FC<Props> = ({ dokumenter, onClick }) => (
    <ul className={styles.container}>
        {dokumenter.map((dokument: Dokument, indeks: number) => {
            return <DokumentElement dokument={dokument} onClick={onClick} key={indeks} />;
        })}
    </ul>
);

const DokumentElement: React.FC<{
    dokument: Dokument;
    onClick: (dokument: Dokument) => void;
}> = ({ dokument, onClick }) => (
    <li className={styles.dokument}>
        <div>
            <JournalpostTag journalposttype={dokument.journalposttype} />
        </div>
        <div>
            <Button
                variant="tertiary"
                size="small"
                onClick={() => onClick(dokument)}
                style={{ margin: 0, padding: 0, textAlign: 'left' }}
            >
                {dokument.tittel}
            </Button>
            <BodyShort size="small">{dokument.dato}</BodyShort>
            <LogiskeVedlegg logiskeVedlegg={dokument.logiskeVedlegg} />
        </div>
    </li>
);

const JournalpostTag: React.FC<{
    journalposttype: Journalposttype;
}> = ({ journalposttype }) => {
    switch (journalposttype) {
        case 'I':
            return (
                <Tag className={styles.dokumentTag} variant="info-moderate" size="small">
                    I
                </Tag>
            );
        case 'N':
            return (
                <Tag className={styles.dokumentTag} variant="neutral-moderate" size="small">
                    N
                </Tag>
            );
        case 'U':
            return (
                <Tag className={styles.dokumentTag} variant="alt1-moderate" size="small">
                    U
                </Tag>
            );
    }
};
