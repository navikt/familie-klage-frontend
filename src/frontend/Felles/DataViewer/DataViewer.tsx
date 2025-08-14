import React, { ReactElement, ReactNode } from 'react';
import {
    harNoenRessursMedStatus,
    Ressurs,
    RessursStatus,
    RessursSuksess,
} from '../../App/typer/ressurs';
import { Alert, Loader, VStack } from '@navikt/ds-react';
import styles from './DataViewer.module.css';

/**
 * Input: { behandling: Ressurss<Behandling>, personopslyninger: Ressurss<IPersonopplysninger> }
 * T = {behandling: Behandling, personopslyninger: IPersonoppslysninger}
 * P = behandling, personoppslyninger
 * keyof T = alle nøkkler i T, i dette tilfelle behandling og personoppslyninger
 * T[P] = Behandling og IPersonoppslyninger
 */
interface DataViewerProps<T extends Record<string, unknown>> {
    response: { [P in keyof T]: Ressurs<T[P]> };
    children: ((data: T) => React.ReactElement) | ReactNode;
}

// eslint-disable-next-line
const renderFeil = (responses: Ressurs<any>[]) => (
    <>
        {responses.map((feilet, index) => {
            if (
                feilet.status === RessursStatus.FUNKSJONELL_FEIL ||
                feilet.status === RessursStatus.FEILET
            ) {
                return (
                    <Alert className={styles.alert} key={index} variant={'error'}>
                        {feilet.frontendFeilmelding}
                    </Alert>
                );
            } else {
                return null;
            }
        })}
    </>
);

// eslint-disable-next-line
const renderChildren = (children: any, response: any): ReactElement => {
    if (typeof children === 'function') {
        const data = Object.keys(response).reduce((acc: Record<string, unknown>, key) => {
            // eslint-disable-next-line
            acc[key] = (response[key] as RessursSuksess<any>).data;
            return acc;
        }, {});
        return children(data);
    }
    return children;
};

export const DataViewer = <T extends Record<string, unknown>>(
    props: DataViewerProps<T>
): ReactNode | null => {
    const { response, children } = props;
    const responses = Object.values(response);
    if (harNoenRessursMedStatus(responses, RessursStatus.FUNKSJONELL_FEIL, RessursStatus.FEILET)) {
        return renderFeil(responses);
    } else if (harNoenRessursMedStatus(responses, RessursStatus.IKKE_TILGANG)) {
        return <Alert variant={'error'}>Ikke tilgang!</Alert>;
    } else if (harNoenRessursMedStatus(responses, RessursStatus.HENTER)) {
        return (
            <VStack margin="4" align="center">
                <Loader size="xlarge" />
            </VStack>
        );
    } else if (harNoenRessursMedStatus(responses, RessursStatus.IKKE_HENTET)) {
        return null;
    } else if (responses.every((response) => response.status === RessursStatus.SUKSESS)) {
        return renderChildren(children, response);
    } else {
        return null;
    }
};
