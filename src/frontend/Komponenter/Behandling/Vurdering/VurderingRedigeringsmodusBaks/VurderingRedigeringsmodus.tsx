import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, ErrorSummary, Heading, HStack, VStack } from '@navikt/ds-react';
import { IVurdering, VedtakValg, vedtakValgTilTekst, årsakAlternativer } from '../vurderingValg';
import { useNavigate } from 'react-router-dom';
import { useHentVurderinger } from '../../../../App/hooks/useHentVurderinger';
import { Behandling } from '../../../../App/typer/fagsak';
import { AccordionTilstand, InnstillingTilNavKlageinstans } from './InnstillingTilNavKlageinstans';
import { FieldErrors, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { Nedtrekksliste } from './Nedtrekksliste';
import { hjemlerAlternativer } from '../hjemmel';
import { Tekstfelt } from './Tekstfelt';
import { FloppydiskIcon, PaperplaneIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { useApp } from '../../../../App/context/AppContext';

interface VurderingRedigeringsmodusProps {
    behandling: Behandling;
    vurdering: IVurdering;
}

export const VurderingRedigeringsmodus = ({
    behandling,
    vurdering,
}: VurderingRedigeringsmodusProps) => {
    const fagsystem = behandling.fagsystem;
    const navigate = useNavigate();
    const errorSummaryRef = useRef<HTMLDivElement>(null);

    const { nullstillIkkePersisterteKomponenter } = useApp();
    const { lagreVurdering, lagreVurderingOgOppdaterSteg, melding } = useHentVurderinger();

    const [accordionTilstand, settAccordionTilstand] = useState<AccordionTilstand>({
        dokumentasjonOgUtredning: true,
        spørsmåletISaken: false,
        aktuelleRettskilder: false,
        klagersAnførsler: false,
        vurderingAvKlagen: false,
    });

    const toggleAccordionTilstand = (feltnavn: keyof AccordionTilstand) =>
        settAccordionTilstand({ ...accordionTilstand, [feltnavn]: !accordionTilstand[feltnavn] });

    const initiellVurdering: IVurdering = { behandlingId: behandling.id };
    const form = useForm<IVurdering>({
        defaultValues: vurdering ?? initiellVurdering,
        mode: 'onChange',
    });
    const {
        formState: { errors },
        getValues,
        handleSubmit,
        reset,
        trigger,
        watch,
    } = form;
    const vedtak = watch('vedtak');

    const [lagrer, settLagrer] = useState<boolean>(false);
    const [lagrerOgOppdatererSteg, settLagrerOgOppdatererSteg] = useState<boolean>(false);
    const [visInterntNotat, settVisInterntNotat] = useState<boolean>(!!vurdering?.interntNotat);
    const toggleInterntNotat = () => {
        if (visInterntNotat) form.setValue('interntNotat', undefined);
        settVisInterntNotat(!visInterntNotat);
    };

    useEffect(() => {
        reset({
            ...initiellVurdering,
            vedtak: vedtak,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vedtak]);

    const lagreVurderingUtenValidering = () => {
        trigger('vedtak').then((vedtakErValgt) => {
            if (vedtakErValgt) {
                settLagrer(true);
                lagreVurdering(getValues())
                    .then((respons) => {
                        if (respons.status === 'SUKSESS') {
                            nullstillIkkePersisterteKomponenter();
                            reset(respons.data);
                        }
                    })
                    .finally(() => settLagrer(false));
            }
        });
    };

    const lagreVurderingOgNavigerTilBrev: SubmitHandler<IVurdering> = (vurdering) => {
        settLagrerOgOppdatererSteg(true);
        lagreVurderingOgOppdaterSteg(vurdering)
            .then((respons) => {
                if (respons.status === 'SUKSESS') {
                    nullstillIkkePersisterteKomponenter();
                    navigate(`/behandling/${behandling.id}/brev`);
                }
            })
            .finally(() => settLagrerOgOppdatererSteg(false));
    };

    const vedValideringsfeil = (errors: FieldErrors<IVurdering>) => {
        settAccordionTilstand({
            dokumentasjonOgUtredning: !!errors.dokumentasjonOgUtredning,
            spørsmåletISaken: !!errors.spørsmåletISaken,
            aktuelleRettskilder: !!errors.aktuelleRettskilder,
            klagersAnførsler: !!errors.klagersAnførsler,
            vurderingAvKlagen: !!errors.vurderingAvKlagen,
        });
    };

    return (
        <FormProvider {...form}>
            <form
                onSubmit={(event) => {
                    handleSubmit(
                        lagreVurderingOgNavigerTilBrev,
                        vedValideringsfeil
                    )(event).then(() => {
                        errorSummaryRef.current?.focus();
                    });
                }}
            >
                <VStack gap="4" marginInline="8" marginBlock="8">
                    <Nedtrekksliste
                        visningsnavn={'Vedtak'}
                        feltnavn={'vedtak'}
                        alternativer={vedtakValgTilTekst}
                    />
                    {vedtak == VedtakValg.OMGJØR_VEDTAK && (
                        <>
                            <Nedtrekksliste
                                visningsnavn={'Årsak'}
                                feltnavn={'årsak'}
                                alternativer={årsakAlternativer(fagsystem)}
                            />
                            <Box maxWidth="40rem">
                                <Heading spacing size="medium" level="2">
                                    Begrunnelse for omgjøring (internt notat)
                                </Heading>
                                <Tekstfelt
                                    visningsnavn="Begrunnelse for omgjøring (internt notat)"
                                    feltnavn="begrunnelseOmgjøring"
                                />
                            </Box>
                        </>
                    )}
                    {vedtak == VedtakValg.OPPRETTHOLD_VEDTAK && (
                        <>
                            <Nedtrekksliste
                                visningsnavn={'Hjemmel'}
                                feltnavn={'hjemmel'}
                                alternativer={hjemlerAlternativer(fagsystem)}
                            />
                            <InnstillingTilNavKlageinstans
                                behandling={behandling}
                                accordionTilstand={accordionTilstand}
                                toggleAccordionTilstand={toggleAccordionTilstand}
                            />
                            <HStack justify="end">
                                <Button
                                    variant={'tertiary'}
                                    type="button"
                                    icon={visInterntNotat ? <TrashIcon /> : <PlusCircleIcon />}
                                    onClick={toggleInterntNotat}
                                >
                                    {visInterntNotat
                                        ? 'Fjern internt notat'
                                        : 'Skriv internt notat'}
                                </Button>
                            </HStack>
                            {visInterntNotat && (
                                <Tekstfelt
                                    visningsnavn="Internt notat"
                                    feltnavn={'interntNotat'}
                                    frivillig
                                />
                            )}
                        </>
                    )}
                    {Object.values(errors).length > 0 && (
                        <Box maxWidth="40rem">
                            <ErrorSummary ref={errorSummaryRef}>
                                {Object.entries(errors).map(([key, error]) => (
                                    <ErrorSummary.Item key={key} href={`#${key}`}>
                                        {error.message}
                                    </ErrorSummary.Item>
                                ))}
                            </ErrorSummary>
                        </Box>
                    )}
                    <HStack gap="4">
                        <Button
                            variant="secondary"
                            size="medium"
                            onClick={lagreVurderingUtenValidering}
                            type="button"
                            loading={lagrer}
                            disabled={lagrer || lagrerOgOppdatererSteg}
                            icon={<FloppydiskIcon />}
                        >
                            Lagre vurdering
                        </Button>
                        <Button
                            variant="primary"
                            size="medium"
                            type="submit"
                            loading={lagrerOgOppdatererSteg}
                            disabled={lagrer || lagrerOgOppdatererSteg}
                            icon={<PaperplaneIcon />}
                            iconPosition="right"
                        >
                            Lagre vurdering og fortsett
                        </Button>
                    </HStack>
                    {melding && (
                        <Box maxWidth="40rem">
                            <Alert variant={melding.type} size="medium">
                                {melding.tekst}
                            </Alert>
                        </Box>
                    )}
                </VStack>
            </form>
        </FormProvider>
    );
};
