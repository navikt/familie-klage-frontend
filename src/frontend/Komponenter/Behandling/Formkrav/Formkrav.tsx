import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Formvilkår } from './Formvilkår';
import { Klageinfo } from './Klageinfo';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { IFormKlage } from './utils';

const FormKravStyling = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    margin: 2rem 5rem 0 5rem;
`;

const FormKravStylingBody = styled.div`
    display: flex;
    @media only screen and (max-width: 800px) {
        flex-direction: column;
    }
    width: 100%;
`;

export const Formkrav: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();

    const formObjekt: IFormKlage = {
        behandlingId: behandlingId,
        fagsakId: 'b0fa4cae-a676-44b3-8725-232dac935c4a',
        vedtaksDato: '',
        klageMottatt: '',
        klageAarsak: '',
        klageBeskrivelse: '',
    };

    const [formkrav, settFormkrav] = useState<IFormKlage>(formObjekt);
    const { formkravLåst, settFormkravLåst, formkravGyldig, settFormkravGyldig } = useBehandling();

    useEffect(() => {
        document.title = 'Oppgavebenk';
        axiosRequest<IFormKlage, null>({
            method: 'GET',
            url: `/familie-klage/api/klageinfo/${behandlingId}`,
        }).then((res: Ressurs<IFormKlage>) => {
            if (res.status === RessursStatus.SUKSESS) {
                settFormkrav((prevState) => ({
                    ...prevState,
                    fagsakId: res.data.fagsakId,
                    klageMottatt: res.data.klageMottatt,
                    klageAarsak: res.data.klageAarsak,
                    klageBeskrivelse: res.data.klageBeskrivelse,
                    vedtaksDato: res.data.vedtaksDato,
                }));
            }
        });
    }, [axiosRequest, behandlingId]);

    return (
        <FormKravStyling>
            <FormKravStylingBody>
                {formkrav !== undefined && (
                    <Klageinfo
                        formkravGyldig={formkravGyldig}
                        formkrav={formkrav}
                        låst={formkravLåst}
                    />
                )}
                <Formvilkår
                    behandlingId={behandlingId}
                    settFormkravGyldig={settFormkravGyldig}
                    låst={formkravLåst}
                    settLåst={settFormkravLåst}
                />
            </FormKravStylingBody>
        </FormKravStyling>
    );
};
