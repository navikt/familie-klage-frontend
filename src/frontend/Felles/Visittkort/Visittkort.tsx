import React, { FC, useEffect, useState } from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import Visittkort from '@navikt/familie-visittkort';
import styled from 'styled-components';
import { Element } from 'nav-frontend-typografi';
import { Behandling } from '../../App/typer/fagsak';
import navFarger from 'nav-frontend-core';
import { Sticky } from '../Visningskomponenter/Sticky';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { ISøkPerson } from '../../App/typer/personsøk';
import Lenke from 'nav-frontend-lenker';
import { IPersonIdent } from '../../App/typer/felles';
import { Hamburgermeny } from './Hamburgermeny';
import { erBehandlingRedigerbar } from '../../App/typer/behandlingstatus';
import { AlleStatuser, StatuserLitenSkjerm, StatusMeny } from './Status/StatusElementer';

const Visningsnavn = styled(Element)`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const ResponsivLenke = styled(Lenke)`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

export const VisittkortWrapper = styled(Sticky)`
    display: flex;

    border-bottom: 1px solid ${navFarger.navGra80};
    z-index: 22;
    top: 47px;

    .visittkort {
        padding: 0 1.5rem;
        border-bottom: none;
    }
`;

const StyledHamburgermeny = styled(Hamburgermeny)`
    margin-left: auto;
    display: block;
    position: sticky;

    z-index: 9999;
`;

const VisittkortComponent: FC<{
    personopplysninger: IPersonopplysninger;
    behandling: Behandling;
}> = ({ personopplysninger, behandling }) => {
    const { personId, kjønn, navn } = personopplysninger;

    const { id } = behandling;

    const { axiosRequest, gåTilUrl } = useApp();
    const [fagsakPersonId, settFagsakPersonId] = useState<string>('');

    useEffect(() => {
        const hentFagsak = (id: string): void => {
            if (!id) return;

            axiosRequest<ISøkPerson, IPersonIdent>({
                method: 'POST',
                url: `/familie-klage/api/sok/`,
                data: { personIdent: personId },
            }).then((respons: RessursSuksess<ISøkPerson> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    if (respons.data?.fagsakPersonId) {
                        settFagsakPersonId(respons.data.fagsakPersonId);
                    }
                }
            });
        };

        hentFagsak(id);

        // eslint-disable-next-line
    }, []);

    return (
        <VisittkortWrapper>
            <Visittkort
                alder={20}
                ident={personId}
                kjønn={kjønn}
                navn={
                    <ResponsivLenke
                        role={'link'}
                        href={`/person/${fagsakPersonId}`}
                        onClick={(e) => {
                            e.preventDefault();
                            gåTilUrl(`/person/${fagsakPersonId}`);
                        }}
                    >
                        <Visningsnavn>{navn}</Visningsnavn>
                    </ResponsivLenke>
                }
            ></Visittkort>

            {behandling && (
                <>
                    <AlleStatuser behandling={behandling} />
                    <StatuserLitenSkjerm>
                        <StatusMeny behandling={behandling} />
                    </StatuserLitenSkjerm>
                </>
            )}
            {behandling && erBehandlingRedigerbar(behandling) && <StyledHamburgermeny />}
        </VisittkortWrapper>
    );
};

export default VisittkortComponent;
