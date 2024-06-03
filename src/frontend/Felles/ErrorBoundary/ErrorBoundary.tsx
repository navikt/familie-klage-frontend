import * as React from 'react';
import { captureException, getCurrentScope, withScope } from '@sentry/core';
import { ISaksbehandler } from '../../App/typer/saksbehandler';

interface IProps {
    innloggetSaksbehandler: ISaksbehandler;
    children: React.ReactNode;
}

class ErrorBoundary extends React.Component<IProps> {
    public constructor(props: IProps) {
        super(props);
    }

    // eslint-disable-next-line
    public componentDidCatch(error: any, info: any): void {
        // eslint-disable-next-line no-console
        console.log(error, info);
        if (process.env.NODE_ENV !== 'development') {
            getCurrentScope().setUser({
                username: this.props.innloggetSaksbehandler.displayName,
            });

            withScope((scope) => {
                Object.keys(info).forEach((key) => {
                    scope.setExtra(key, info[key]);
                    captureException(error);
                });
            });
        }
    }

    render(): React.ReactNode {
        return this.props.children;
    }
}

export default ErrorBoundary;
