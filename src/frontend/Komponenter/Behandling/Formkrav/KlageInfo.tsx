import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components';
import { BodyLong, Heading } from '@navikt/ds-react';
import { IFormkravVilkår, Redigeringsmodus } from './typer';
import { alleVilkårOppfylt } from './utils';
import {
    Behandling,
    PåklagetVedtak,
    PåklagetVedtakstype,
    påklagetVedtakstypeTilTekst,
} from '../../../App/typer/fagsak';
import { harVerdi } from '../../../App/utils/utils';
import {
    ErrorColored,
    FileContent,
    InformationColored,
    SuccessColored,
    WarningColored,
} from '@navikt/ds-icons';
import { formaterIsoDato, formaterIsoDatoTid } from '../../../App/utils/formatter';
import { useApp } from '../../../App/context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import { FamilieSelect } from '@navikt/familie-form-elements';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { compareDesc } from 'date-fns';

const OppfyltIkonStyled = styled(SuccessColored)`
    margin-top: 0.25rem;
`;

const ErrorIkon = styled(ErrorColored)`
    margin-top: 0.25rem;
`;

const Advarsel = styled(WarningColored)`
    margin-top: 0.2rem;
`;

const InfoIkon = styled(InformationColored)`
    margin-top: 0.25rem;
`;

const TabellRad = styled.div`
    display: grid;
    grid-template-columns: 21px 250px repeat(2, 325px);
    grid-auto-rows: min-content;
    grid-gap: 0.5rem;
    margin-bottom: 0.5rem;
`;

interface IProps {
    behandling: Behandling;
    vurderinger: IFormkravVilkår;
    redigeringsmodus: Redigeringsmodus;
    settOppdaterteVurderinger: Dispatch<SetStateAction<IFormkravVilkår>>;
}

interface FagsystemVedtak {
    behandlingstype: string;
    resultat: string;
    eksternBehandlingId: string;
    vedtakstidspunkt: string;
}

const fagsystemVedtakTilVisningstekst = (vedtak: FagsystemVedtak) =>
    `${vedtak.behandlingstype} - ${vedtak.resultat} - ${formaterIsoDatoTid(
        vedtak.vedtakstidspunkt
    )}`;

const erVedtak = (valgtElement: string) => {
    return !(
        valgtElement === PåklagetVedtakstype.UTEN_VEDTAK ||
        valgtElement === PåklagetVedtakstype.IKKE_VALGT
    );
};

const utledFagsystemVedtakFraPåklagetVedtak = (
    fagsystemVedtak: FagsystemVedtak[],
    påklagetVedtak: PåklagetVedtak
) => {
    return fagsystemVedtak.find(
        (vedtak) => vedtak.eksternBehandlingId === påklagetVedtak.eksternFagsystemBehandlingId
    );
};

const SelectWrapper = styled.div`
    width: 80%;
`;

const sorterVedtakstidspunktDesc = (a: FagsystemVedtak, b: FagsystemVedtak): number => {
    if (!a.vedtakstidspunkt) {
        return 1;
    } else if (!b.vedtakstidspunkt) {
        return -1;
    }
    return compareDesc(new Date(a.vedtakstidspunkt), new Date(b.vedtakstidspunkt));
};

export const KlageInfo: React.FC<IProps> = ({
    behandling,
    vurderinger,
    redigeringsmodus,
    settOppdaterteVurderinger,
}) => {
    const { axiosRequest } = useApp();
    const [fagsystemVedtak, settFagsystemVedtak] = useState<Ressurs<FagsystemVedtak[]>>(
        byggTomRessurs()
    );

    useEffect(() => {
        const hentVedtak = () => {
            axiosRequest<FagsystemVedtak[], null>({
                method: 'GET',
                url: `/familie-klage/api/behandling/${behandling.id}/fagsystem-vedtak`,
            }).then(settFagsystemVedtak);
        };

        hentVedtak();
    }, [axiosRequest, behandling.id]);

    const utledetIkon = () => {
        if (redigeringsmodus === Redigeringsmodus.IKKE_PÅSTARTET) {
            return <Advarsel height={26} width={26} />;
        } else if (
            alleVilkårOppfylt(vurderinger) &&
            harVerdi(vurderinger.saksbehandlerBegrunnelse)
        ) {
            return <OppfyltIkonStyled height={23} width={23} />;
        } else if (alleVilkårOppfylt(vurderinger)) {
            return <InfoIkon height={23} width={23} />;
        }
        return <ErrorIkon height={23} width={23} />;
    };

    return (
        <>
            <TabellRad>
                {utledetIkon()}
                <Heading spacing size="medium" level="5">
                    Formkrav
                </Heading>
            </TabellRad>
            <TabellRad>
                <FileContent />
                <BodyLong size="small">Klage mottatt</BodyLong>
                <BodyLong size="small">{formaterIsoDato(behandling.klageMottatt)}</BodyLong>
            </TabellRad>
            <div>
                <DataViewer response={{ fagsystemVedtak }}>
                    {({ fagsystemVedtak }) => {
                        const gjeldendeFagsystemVedtak = utledFagsystemVedtakFraPåklagetVedtak(
                            fagsystemVedtak,
                            vurderinger.påklagetVedtak
                        );
                        return (
                            <SelectWrapper>
                                <FamilieSelect
                                    label={'Vedtak som er påklaget'}
                                    erLesevisning={redigeringsmodus === Redigeringsmodus.VISNING}
                                    lesevisningVerdi={
                                        gjeldendeFagsystemVedtak
                                            ? fagsystemVedtakTilVisningstekst(
                                                  gjeldendeFagsystemVedtak
                                              )
                                            : påklagetVedtakstypeTilTekst[
                                                  vurderinger.påklagetVedtak.påklagetVedtakstype
                                              ]
                                    }
                                    onChange={(e) => {
                                        const valgtElement = e.target.value;
                                        if (erVedtak(valgtElement)) {
                                            settOppdaterteVurderinger((prevState) => ({
                                                ...prevState,
                                                påklagetVedtak: {
                                                    eksternFagsystemBehandlingId: valgtElement,
                                                    påklagetVedtakstype: PåklagetVedtakstype.VEDTAK,
                                                },
                                            }));
                                        } else {
                                            settOppdaterteVurderinger((prevState) => ({
                                                ...prevState,
                                                påklagetVedtak: {
                                                    påklagetVedtakstype:
                                                        valgtElement as PåklagetVedtakstype,
                                                },
                                            }));
                                        }
                                    }}
                                    value={
                                        vurderinger.påklagetVedtak.eksternFagsystemBehandlingId ??
                                        vurderinger.påklagetVedtak.påklagetVedtakstype
                                    }
                                >
                                    <option value={PåklagetVedtakstype.IKKE_VALGT}>
                                        {
                                            påklagetVedtakstypeTilTekst[
                                                PåklagetVedtakstype.IKKE_VALGT
                                            ]
                                        }
                                    </option>
                                    <option value={PåklagetVedtakstype.UTEN_VEDTAK}>
                                        {
                                            påklagetVedtakstypeTilTekst[
                                                PåklagetVedtakstype.UTEN_VEDTAK
                                            ]
                                        }
                                    </option>
                                    {fagsystemVedtak
                                        .sort(sorterVedtakstidspunktDesc)
                                        .map((valg, index) => (
                                            <option key={index} value={valg.eksternBehandlingId}>
                                                {fagsystemVedtakTilVisningstekst(valg)}
                                            </option>
                                        ))}
                                </FamilieSelect>
                            </SelectWrapper>
                        );
                    }}
                </DataViewer>
            </div>
        </>
    );
};
