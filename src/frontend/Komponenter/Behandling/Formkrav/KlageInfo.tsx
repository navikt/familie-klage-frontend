import React from 'react';
import styles from './KlageInfo.module.css';
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

const utledStatusIkon = (
    redigeringsmodus: Redigeringsmodus,
    formkravErOppfylt: boolean,
    vurderinger: IFormkravVilkår
) => {
    if (redigeringsmodus === Redigeringsmodus.IKKE_PÅSTARTET) {
        return <Advarsel height={26} width={26} />;
    } else if (formkravErOppfylt) {
        return <Oppfylt height={23} width={23} />;
    } else if (påKlagetVedtakValgt(vurderinger) && alleVilkårOppfylt(vurderinger)) {
        return <Info height={23} width={23} />;
    }
    return <IkkeOppfylt height={23} width={23} />;
};

interface Props {
    vurderinger: IFormkravVilkår;
    redigeringsmodus: Redigeringsmodus;
    behandling: Behandling;
}

export const KlageInfo: React.FC<Props> = ({ behandling, vurderinger, redigeringsmodus }) => {
    const { formkravOppfylt } = useBehandling();

    const statusIkon = utledStatusIkon(redigeringsmodus, formkravOppfylt, vurderinger);

    return (
        <>
            <div className={styles.tabellRad}>
                <div className={styles.ikon}>{statusIkon}</div>
                <Heading spacing size="medium" level="2">
                    Formkrav
                </Heading>
            </div>
            <div className={styles.tabellRad}>
                <FileTextIcon fontSize="1.5rem" />
                <BodyLong size="small">Klage mottatt</BodyLong>
                <BodyLong size="small">{formaterIsoDato(behandling.klageMottatt)}</BodyLong>
            </div>
        </>
    );
};
