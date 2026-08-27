import { Alert, Button, HStack } from '@navikt/ds-react';
import type { FC } from 'react';
import React, { useCallback, useState } from 'react';
import { useApp } from '../../../../App/context/AppContext';
import type { RessursFeilet, RessursSuksess } from '../../../../App/typer/ressurs';
import { RessursStatus } from '../../../../App/typer/ressurs';
import { EToast } from '../../../../App/typer/toast';
import { ModalWrapper } from '../../../../Felles/Modal/ModalWrapper';
import type { BrevmottakerOrganisasjon, BrevmottakerPerson } from '../brevmottaker';
import type { Brevmottakere } from '../brevmottakere';
import { BrevmottakereListe } from './BrevmottakereListe';
import styles from './BrevmottakereModal.module.css';
import { SkalBrukerHaBrev } from './SkalBrukerHaBrev';
import { SøkWrapper } from './SøkWrapper';
import { VergerOgFullmektigeFraRegister } from './VergerOgFullmektigeFraRegister';

interface Props {
    behandlingId: string;
    mottakere: Brevmottakere;
    hentBrevmottakere: () => void;
    genererBrev: () => void;
}

export const BrevmottakereModal: FC<Props> = ({
    behandlingId,
    mottakere,
    hentBrevmottakere,
    genererBrev,
}) => {
    const { visBrevmottakereModal, settVisBrevmottakereModal, settToast, axiosRequest } = useApp();

    const [valgtePersonMottakere, settValgtePersonMottakere] = useState<BrevmottakerPerson[]>(
        mottakere.personer
    );
    const [valgteOrganisasjonMottakere, settValgteOrganisasjonMottakere] = useState<
        BrevmottakerOrganisasjon[]
    >(mottakere.organisasjoner);
    const [feilmelding, settFeilmelding] = useState('');
    const [innsendingSuksess, settInnsendingSukksess] = useState(false);

    const kallErstattBrevmottakere = useCallback(
        (brevmottakere: Brevmottakere) =>
            axiosRequest<Brevmottakere, Brevmottakere>({
                url: `familie-klage/api/brevmottaker/${behandlingId}`,
                method: 'PUT',
                data: brevmottakere,
            }),
        [axiosRequest, behandlingId]
    );

    const settBrevmottakere = () => {
        settFeilmelding('');
        settInnsendingSukksess(false);
        kallErstattBrevmottakere({
            personer: valgtePersonMottakere,
            organisasjoner: valgteOrganisasjonMottakere,
        }).then((response: RessursSuksess<Brevmottakere> | RessursFeilet) => {
            if (response.status === RessursStatus.SUKSESS) {
                hentBrevmottakere();
                genererBrev();
                settVisBrevmottakereModal(false);
                settToast(EToast.BREVMOTTAKERE_SATT);
            } else {
                settFeilmelding(response.frontendFeilmelding);
            }
        });
    };

    const harValgtMottakere =
        valgtePersonMottakere.length > 0 || valgteOrganisasjonMottakere.length > 0;

    return (
        <ModalWrapper
            tittel={'Hvem skal motta brevet?'}
            visModal={visBrevmottakereModal}
            onClose={() => {
                settVisBrevmottakereModal(false);
            }}
            ariaLabel={'Velg brevmottakere'}
            width={'70rem'}
        >
            <div className={styles.container}>
                <div>
                    <VergerOgFullmektigeFraRegister
                        valgteMottakere={valgtePersonMottakere}
                        settValgteMottakere={settValgtePersonMottakere}
                    />
                    <div className={styles.horisontalLinje} />
                    <SøkWrapper
                        settValgtePersonMottakere={settValgtePersonMottakere}
                        valgteOrganisasjonMottakere={valgteOrganisasjonMottakere}
                        settValgteOrganisasjonMottakere={settValgteOrganisasjonMottakere}
                        behandlingId={behandlingId}
                    />
                    <div className={styles.horisontalLinje} />
                    <SkalBrukerHaBrev
                        valgteBrevmottakere={valgtePersonMottakere}
                        settValgtBrevMottakere={settValgtePersonMottakere}
                    />
                </div>
                <div className={styles.vertikalLinje} />
                <div>
                    <BrevmottakereListe
                        valgtePersonMottakere={valgtePersonMottakere}
                        settValgtePersonMottakere={settValgtePersonMottakere}
                        valgteOrganisasjonMottakere={valgteOrganisasjonMottakere}
                        settValgteOrganisasjonMottakere={settValgteOrganisasjonMottakere}
                    />
                </div>
            </div>
            <HStack justify="center" gap="space-16">
                <Button variant="tertiary" onClick={() => settVisBrevmottakereModal(false)}>
                    Avbryt
                </Button>
                <Button variant="primary" onClick={settBrevmottakere} disabled={!harValgtMottakere}>
                    Sett mottakere
                </Button>
            </HStack>
            {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
            {innsendingSuksess && <Alert variant={'success'}>Brevmottakere er satt</Alert>}
        </ModalWrapper>
    );
};
