import { captureException } from '@nais/apm';
import * as React from 'react';

interface Props {
    children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<Props> {
    public constructor(props: Props) {
        super(props);
    }

    public componentDidCatch(error: any, info: any): void {
        console.log(error, info);
        if (!import.meta.env.DEV) {
            captureException(error, {
                context: {
                    componentStack: info.componentStack,
                },
            });
        }
    }

    render(): React.ReactNode {
        return this.props.children;
    }
}
