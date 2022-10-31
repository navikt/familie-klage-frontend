import React from 'react';
import styled from 'styled-components';
import { BodyLong, Heading } from '@navikt/ds-react';
import { IFormkravVilkår, Redigeringsmodus } from './typer';
import { alleVilkårOppfylt } from './utils';
import { Behandling } from '../../../App/typer/fagsak';
import { harVerdi } from '../../../App/utils/utils';
import {
    ErrorColored,
    FileContent,
    InformationColored,
    SuccessColored,
    WarningColored,
} from '@navikt/ds-icons';
import { formaterIsoDato } from '../../../App/utils/formatter';

const OppfyltIkon = styled(SuccessColored)`
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
    vurderinger: IFormkravVilkår;
    redigeringsmodus: Redigeringsmodus;
    behandling: Behandling;
}

export const KlageInfo: React.FC<IProps> = ({ behandling, vurderinger, redigeringsmodus }) => {
    const utledetIkon = () => {
        if (redigeringsmodus === Redigeringsmodus.IKKE_PÅSTARTET) {
            return <Advarsel height={26} width={26} />;
        } else if (
            alleVilkårOppfylt(vurderinger) &&
            harVerdi(vurderinger.saksbehandlerBegrunnelse)
        ) {
            return <OppfyltIkon height={23} width={23} />;
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
        </>
    );
};
