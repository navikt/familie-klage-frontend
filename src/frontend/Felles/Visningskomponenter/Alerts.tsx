import type { AlertProps } from '@navikt/ds-react';
import { Alert } from '@navikt/ds-react';
import type { ReactNode } from 'react';
import React, { forwardRef, useEffect, useState } from 'react';

export const AlertError = forwardRef<HTMLDivElement, Omit<AlertProps, 'variant'>>((props, ref) => {
    return <Alert variant={'error'} {...props} ref={ref} />;
});

export const AlertSuccess = forwardRef<HTMLDivElement, Omit<AlertProps, 'variant'>>(
    (props, ref) => {
        return <Alert variant={'success'} {...props} ref={ref} />;
    }
);

export const AlertInfo = forwardRef<HTMLDivElement, Omit<AlertProps, 'variant'>>((props, ref) => {
    return <Alert variant={'info'} {...props} ref={ref} />;
});

export const AlertWarning = forwardRef<HTMLDivElement, Omit<AlertProps, 'variant'>>(
    (props, ref) => {
        return <Alert variant={'warning'} {...props} ref={ref} />;
    }
);

export const AlertMedLukkeKnapp = ({
    variant,
    children,
    keyProp,
}: {
    variant: AlertProps['variant'];
    children: ReactNode;
    keyProp: string;
}) => {
    const [skalVise, settSkalVise] = useState(true);

    useEffect(() => {
        settSkalVise(true);
    }, [keyProp]);

    return (
        skalVise && (
            <Alert size="small" variant={variant} closeButton onClose={() => settSkalVise(false)}>
                {children}
            </Alert>
        )
    );
};

AlertError.displayName = 'AlertError';
AlertSuccess.displayName = 'AlertSuccess';
AlertInfo.displayName = 'AlertInfo';
AlertWarning.displayName = 'AlertWarning';
AlertMedLukkeKnapp.displayName = 'AlertMedLukkeknapp';
