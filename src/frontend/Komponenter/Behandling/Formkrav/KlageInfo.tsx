import React from 'react';
import styled from 'styled-components';
import { BodyLong, Heading } from '@navikt/ds-react';
import { IFormkravVilkår, Redigeringsmodus } from './typer';
import { Behandling } from '../../../App/typer/fagsak';
import { FileTextIcon } from '@navikt/aksel-icons';
import { formaterIsoDato } from '../../../App/utils/formatter';
import { alleVilkårOppfylt, påKlagetVedtakValgt } from './validerFormkravUtils';
import { useBehandling } from '../../../App/context/BehandlingContext';
import Oppfylt from '../../../Felles/Ikoner/Oppfylt';
import IkkeOppfylt from '../../../Felles/Ikoner/IkkeOppfylt';
import Advarsel from '../../../Felles/Ikoner/Advarsel';
import Info from '../../../Felles/Ikoner/Info';

const OppfyltIkon = styled(Oppfylt)`
    margin-top: 0.25rem;
`;

const ErrorIkon = styled(IkkeOppfylt)`
    margin-top: 0.25rem;
`;

const AdvarselIkon = styled(Advarsel)`
    margin-top: 0.2rem;
`;

const InfoIkon = styled(Info)`
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
    vurderinger: IFormkravVilkår;
    redigeringsmodus: Redigeringsmodus;
    behandling: Behandling;
}

export const KlageInfo: React.FC<IProps> = ({ behandling, vurderinger, redigeringsmodus }) => {
    const { formkravOppfylt } = useBehandling();
    const utledetIkon = () => {
        if (redigeringsmodus === Redigeringsmodus.IKKE_PÅSTARTET) {
            return <AdvarselIkon height={26} width={26} />;
        } else if (formkravOppfylt) {
            return <OppfyltIkon height={23} width={23} />;
        } else if (påKlagetVedtakValgt(vurderinger) && alleVilkårOppfylt(vurderinger)) {
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
                <FileTextIcon fontSize="1.5rem" />
                <BodyLong size="small">Klage mottatt</BodyLong>
                <BodyLong size="small">{formaterIsoDato(behandling.klageMottatt)}</BodyLong>
            </TabellRad>
        </>
    );
};
