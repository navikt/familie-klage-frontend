import React, { useState } from 'react';
import { Ressurs } from '../../../App/typer/ressurs';
import styles from './PdfVisning.module.css';
import { Document, Page, pdfjs } from 'react-pdf';
import { DataViewer } from '../../../Felles/DataViewer/DataViewer';
import { Alert, Loader, Pagination, VStack } from '@navikt/ds-react';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

interface Props {
    pdfFilInnhold: Ressurs<string>;
}

export const PdfVisning: React.FC<Props> = ({ pdfFilInnhold }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        if (pageNumber > numPages) {
            setPageNumber(numPages);
        }
        setNumPages(numPages);
    }

    return (
        <DataViewer response={{ pdfFilInnhold }}>
            {({ pdfFilInnhold }) => (
                <VStack align="start" className={styles.container}>
                    <Pagination
                        className={styles.paginering}
                        page={pageNumber}
                        count={numPages}
                        onPageChange={setPageNumber}
                        size={'xsmall'}
                        hidden={numPages < 2}
                    />
                    <Document
                        className={styles.pdfDokument}
                        file={`data:application/pdf;base64,${pdfFilInnhold}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        error={
                            <Alert variant={'error'}>Ukjent feil ved henting av dokument.</Alert>
                        }
                        noData={<Alert variant={'error'}>'Dokumentet er tomt.</Alert>}
                        loading={<Loader />}
                    >
                        <Page pageNumber={pageNumber} renderTextLayer />
                    </Document>
                    <Pagination
                        className={styles.paginering}
                        page={pageNumber}
                        count={numPages}
                        onPageChange={setPageNumber}
                        size={'xsmall'}
                        hidden={numPages < 2}
                    />
                </VStack>
            )}
        </DataViewer>
    );
};
