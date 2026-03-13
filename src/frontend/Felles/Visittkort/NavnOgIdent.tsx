import React from 'react';
import { BodyShort, CopyButton, HStack } from '@navikt/ds-react';

export const NavnOgIdent = ({
    navn,
    ident,
    alder,
}: {
    navn: string;
    ident: string;
    alder?: number;
}) => {
    return (
        <HStack align={'center'} gap={'space-8 space-12'} wrap={false}>
            <BodyShort as={'span'} weight={'semibold'} style={{ whiteSpace: 'nowrap' }}>
                {navn}
                {alder && ` (${alder} år)`}
            </BodyShort>
            <div>|</div>
            <HStack align={'center'} gap={'1'} wrap={false}>
                {ident}
                <CopyButton copyText={ident.replaceAll(' ', '')} size={'small'} />
            </HStack>
        </HStack>
    );
};
