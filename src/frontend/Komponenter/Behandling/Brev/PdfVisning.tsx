import React, { useState } from 'react';
import { Ressurs } from '../../../App/typer/ressurs';
import styled from 'styled-components';
import { Document, Page, pdfjs } from 'react-pdf';
import Pagination from 'paginering';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Alert, Loader } from '@navikt/ds-react';

// eslint-disable-next-line
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PdfVisningProps {
    pdfFilInnhold: Ressurs<string>;
}

const StyledPagination = styled(Pagination)`
    margin: 0 auto;
`;

const StyledDokument = styled(Document)`
    .react-pdf__Page__canvas {
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25), 0px 0px 2px rgb(0 0 0 / 25%);
        margin: 0 auto;
    }

    margin: 0 auto 2rem auto;
`;

const DokumentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 600px;

    align-self: flex-start;
    position: sticky;
    top: 100px;
    left: 0;
`;

const PdfVisning: React.FC<PdfVisningProps> = ({ pdfFilInnhold }) => {
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
                <DokumentWrapper>
                    <StyledPagination
                        numberOfItems={numPages}
                        onChange={setPageNumber}
                        itemsPerPage={1}
                        currentPage={pageNumber}
                    />
                    <StyledDokument
                        file={`data:application/pdf;base64,${pdfFilInnhold}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        error={
                            <Alert variant={'error'}>Ukjent feil ved henting av dokument.</Alert>
                        }
                        noData={<Alert variant={'error'}>'Dokumentet er tomt.</Alert>}
                        loading={<Loader />}
                    >
                        <Page pageNumber={pageNumber} />
                    </StyledDokument>
                    <StyledPagination
                        numberOfItems={numPages}
                        onChange={setPageNumber}
                        itemsPerPage={1}
                        currentPage={pageNumber}
                    />
                </DokumentWrapper>
            )}
        </DataViewer>
    );
};

export default PdfVisning;
