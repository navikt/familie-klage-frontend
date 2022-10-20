import React, { useEffect, useState } from 'react';
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

function erVedtak(valg: FagsystemVedtak | PåklagetVedtakstype): valg is FagsystemVedtak {
    return (valg as FagsystemVedtak).eksternBehandlingId !== undefined;
}

export const KlageInfo: React.FC<IProps> = ({ behandling, vurderinger, redigeringsmodus }) => {
    const { axiosRequest } = useApp();
    const [fagsystemVedtak, settFagsystemVedtak] = useState<Ressurs<FagsystemVedtak[]>>(
        byggTomRessurs()
    );

    const [valgtVedtak, settValgtVedtak] = useState<number>(0);

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
                        const muligeValg = [
                            PåklagetVedtakstype.IKKE_VALGT,
                            PåklagetVedtakstype.UTEN_VEDTAK,
                            ...fagsystemVedtak,
                        ];
                        return (
                            <FamilieSelect
                                label={'Vedtak som er påklaget'}
                                onChange={(e) => {
                                    settValgtVedtak(e.target.value as unknown as number);
                                }}
                                value={valgtVedtak}
                            >
                                {muligeValg.map((valg, index) => (
                                    <option key={index} value={index}>
                                        {erVedtak(valg)
                                            ? fagsystemVedtakTilVisningstekst(valg)
                                            : påklagetVedtakstypeTilTekst[valg]}
                                    </option>
                                ))}
                            </FamilieSelect>
                        );
                    }}
                </DataViewer>
            </div>
        </>
    );
};
