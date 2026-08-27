import React, { useEffect } from 'react';
import { useApp } from '../../App/context/AppContext';
import type { EToast } from '../../App/typer/toast';
import { toastTilTekst } from '../../App/typer/toast';
import { AlertMedLukkeKnapp } from '../Visningskomponenter/Alerts';
import styles from './Toast.module.css';

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

const ToastAlert: React.FC<{ toast: EToast }> = ({ toast }) => (
    <div className={styles.container}>
        <AlertMedLukkeKnapp variant={'success'} keyProp={toast}>
            {toastTilTekst[toast]}
        </AlertMedLukkeKnapp>
    </div>
);
