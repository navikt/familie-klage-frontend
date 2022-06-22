import * as React from 'react';
import { FC } from 'react';

export const DummyKomponent: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    return <div>{behandlingId}</div>;
};
