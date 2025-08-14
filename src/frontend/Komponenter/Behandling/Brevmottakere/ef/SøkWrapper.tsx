import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { SøkPerson } from './SøkPerson';
import { SøkOrganisasjon } from './SøkOrganisasjon';
import styles from './SøkWrapper.module.css';
import { BodyShort, Select } from '@navikt/ds-react';
import { BrevmottakerOrganisasjon, BrevmottakerPerson } from '../brevmottaker';

interface Props {
    settValgtePersonMottakere: Dispatch<SetStateAction<BrevmottakerPerson[]>>;
    valgteOrganisasjonMottakere: BrevmottakerOrganisasjon[];
    settValgteOrganisasjonMottakere: Dispatch<SetStateAction<BrevmottakerOrganisasjon[]>>;
    behandlingId: string;
}

enum SøkType {
    ORGANISASJON = 'ORGANISASJON',
    PERSON = 'PERSON',
}

export const SøkWrapper: FC<Props> = ({
    settValgtePersonMottakere,
    valgteOrganisasjonMottakere,
    settValgteOrganisasjonMottakere,
    behandlingId,
}) => {
    const [søktype, settSøktype] = useState<SøkType>();

    return (
        <>
            <BodyShort size="large" spacing>
                Manuelt søk
            </BodyShort>
            <Select
                className={styles.søkTypeSelect}
                label={'Manuelt søk'}
                hideLabel
                value={søktype}
                onChange={(e) => settSøktype(e.target.value as SøkType)}
            >
                <option>Velg</option>
                <option value={SøkType.ORGANISASJON}>Organisasjon</option>
                <option value={SøkType.PERSON}>Person</option>
            </Select>
            {søktype === SøkType.ORGANISASJON && (
                <SøkOrganisasjon
                    valgteMottakere={valgteOrganisasjonMottakere}
                    settValgteMottakere={settValgteOrganisasjonMottakere}
                />
            )}
            {søktype === SøkType.PERSON && (
                <SøkPerson
                    settValgteMottakere={settValgtePersonMottakere}
                    behandlingId={behandlingId}
                />
            )}
        </>
    );
};
