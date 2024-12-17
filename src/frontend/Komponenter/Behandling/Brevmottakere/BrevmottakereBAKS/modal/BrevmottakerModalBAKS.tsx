import React, { useState } from 'react';

import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, Modal } from '@navikt/ds-react';

import BrevmottakerTabell from './tabell/BrevmottakerTabell';
import { useApp } from '../../../../../App/context/AppContext';
import { BrevmottakerForm } from './form/BrevmottakerForm';
import { IPersonopplysninger } from '../../../../../App/typer/personopplysninger';
import { Brevmottaker, Mottakertype, OpprettBrevmottakerDto } from '../brevmottaker';

const StyledAlert = styled(Alert)`
    margin: 1rem 0 2.5rem;
`;
const StyledHeading = styled(Heading)`
    margin: 1rem 0 0.75rem;
`;
const LeggTilKnapp = styled(Button)`
    margin-top: 1rem;
`;
const LukkKnapp = styled(Button)`
    margin-top: 2.5rem;
`;

interface Props {
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
    brevmottakere: Brevmottaker[];
    opprettBrevmottaker: (brevmottaker: OpprettBrevmottakerDto) => void;
    slettBrevmottaker: (brevmottakerId: string) => void;
    erLesevisning: boolean;
}

const utledHeading = (antallMottakere: number, erLesevisning: boolean) => {
    if (erLesevisning) {
        return antallMottakere === 1 ? 'Brevmottaker' : 'Brevmottakere';
    } else {
        return antallMottakere === 0
            ? 'Legg til brevmottaker'
            : antallMottakere === 1
              ? 'Legg til eller fjern brevmottaker'
              : 'Brevmottakere';
    }
};

export const BrevmottakerModalBAKS = ({
    behandlingId,
    personopplysninger,
    brevmottakere,
    opprettBrevmottaker,
    slettBrevmottaker,
    erLesevisning,
}: Props) => {
    const { settVisBrevmottakereModal, visBrevmottakereModal } = useApp();
    const heading = utledHeading(brevmottakere.length, erLesevisning);

    const [visSkjemaNårDetErÉnBrevmottaker, settVisSkjemaNårDetErÉnBrevmottaker] = useState(false);

    const erSkjemaSynlig =
        visBrevmottakereModal &&
        ((brevmottakere.length === 0 && !erLesevisning) ||
            (brevmottakere.length === 1 && visSkjemaNårDetErÉnBrevmottaker));

    const erPåDokumentutsending = useLocation().pathname.includes('dokumentutsending');

    const lukkModal = () => {
        settVisBrevmottakereModal(false);
        settVisSkjemaNårDetErÉnBrevmottaker(false);
    };

    const erBrevmottakerMedDødsbo = brevmottakere
        .map((brevmottaker) => brevmottaker.mottakertype)
        .some((mottakertype) => Mottakertype.DØDSBO === mottakertype);

    return (
        <Modal
            open={visBrevmottakereModal}
            onClose={lukkModal}
            header={{ heading: heading, size: 'medium' }}
            width={'35rem'}
            portal
        >
            <Modal.Body>
                <StyledAlert variant="info">
                    Brev sendes til brukers folkeregistrerte adresse eller annen foretrukken kanal.
                    Legg til mottaker dersom brev skal sendes til utenlandsk adresse, fullmektig
                    {erPåDokumentutsending ? ' eller verge' : ', verge eller dødsbo'}.
                </StyledAlert>
                {brevmottakere.map((mottaker) => (
                    <BrevmottakerTabell
                        mottaker={mottaker}
                        key={`mottaker-${mottaker}`}
                        slettBrevmottaker={slettBrevmottaker}
                        erLesevisning={erLesevisning}
                    />
                ))}
                {erSkjemaSynlig ? (
                    <>
                        {brevmottakere.length === 1 && (
                            <StyledHeading size="medium">Ny mottaker</StyledHeading>
                        )}
                        <BrevmottakerForm
                            behandlingId={behandlingId}
                            personopplysninger={personopplysninger}
                            brevmottakere={brevmottakere}
                            erLesevisning={false}
                            lukkModal={lukkModal}
                            opprettBrevmottaker={opprettBrevmottaker}
                        />
                    </>
                ) : (
                    <>
                        {erBrevmottakerMedDødsbo && (
                            <Alert variant={'info'} inline={true}>
                                Ved dødsbo kan kun en brevmottaker legges til.
                            </Alert>
                        )}
                        {!erBrevmottakerMedDødsbo &&
                            brevmottakere.length === 1 &&
                            !erLesevisning && (
                                <LeggTilKnapp
                                    variant="tertiary"
                                    size="small"
                                    icon={<PlusCircleIcon />}
                                    onClick={() => settVisSkjemaNårDetErÉnBrevmottaker(true)}
                                >
                                    Legg til ny mottaker
                                </LeggTilKnapp>
                            )}
                        <div>
                            <LukkKnapp onClick={lukkModal}>Lukk vindu</LukkKnapp>
                        </div>
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};
