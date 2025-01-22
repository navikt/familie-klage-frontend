import React, { useEffect } from 'react';

import styled from 'styled-components';

import { useApp } from '../../App/context/AppContext';
import { EToast, toastTilTekst } from '../../App/typer/toast';
import { AlertMedLukkeKnapp } from '../Visningskomponenter/Alerts';

const Container = styled.div`
    z-index: 9999;
    position: fixed;
    right: 2rem;
    top: 4rem;
`;

const ToastAlert: React.FC<{ toast: EToast }> = ({ toast }) => {
    return (
        <Container>
            <AlertMedLukkeKnapp variant={'success'} keyProp={toast}>
                {toastTilTekst[toast]}
            </AlertMedLukkeKnapp>
        </Container>
    );
};

export const Toast: React.FC = () => {
    const { toast, settToast } = useApp();

    useEffect(() => {
        const timer = setTimeout(() => {
            settToast(undefined);
        }, 5000);
        return () => clearTimeout(timer);
    });

    return toast ? <ToastAlert toast={toast} /> : null;
};
