import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { SøkPerson } from './SøkPerson';
import { SøkOrganisasjon } from './SøkOrganisasjon';
import styled from 'styled-components';
import { Ingress, Select } from '@navikt/ds-react';
import { BrevmottakerOrganisasjon, BrevmottakerPerson } from '../brevmottaker';

interface Props {
    settValgtePersonMottakere: Dispatch<SetStateAction<BrevmottakerPerson[]>>;
    valgteOrganisasjonMottakere: BrevmottakerOrganisasjon[];
    settValgteOrganisasjonMottakere: Dispatch<SetStateAction<BrevmottakerOrganisasjon[]>>;
    behandlingId: string;
}

enum ESøktype {
    ORGANISASJON = 'ORGANISASJON',
    PERSON = 'PERSON',
}

const Underoverskrift = styled(Ingress)`
    margin-bottom: 1rem;
`;

const SøkTypeSelect = styled(Select)`
    width: 200px;
    margin-bottom: 1rem;
`;

export const SøkWrapper: FC<Props> = ({
    settValgtePersonMottakere,
    valgteOrganisasjonMottakere,
    settValgteOrganisasjonMottakere,
    behandlingId,
}) => {
    const [søktype, settSøktype] = useState<ESøktype>();

    return (
        <>
            <Underoverskrift>Manuelt søk</Underoverskrift>
            <SøkTypeSelect
                label={'Manuelt søk'}
                hideLabel
                value={søktype}
                onChange={(e) => settSøktype(e.target.value as ESøktype)}
            >
                <option>Velg</option>
                <option value={ESøktype.ORGANISASJON}>Organisasjon</option>
                <option value={ESøktype.PERSON}>Person</option>
            </SøkTypeSelect>
            {søktype === ESøktype.ORGANISASJON && (
                <SøkOrganisasjon
                    valgteMottakere={valgteOrganisasjonMottakere}
                    settValgteMottakere={settValgteOrganisasjonMottakere}
                />
            )}
            {søktype === ESøktype.PERSON && (
                <SøkPerson
                    settValgteMottakere={settValgtePersonMottakere}
                    behandlingId={behandlingId}
                />
            )}
        </>
    );
};
