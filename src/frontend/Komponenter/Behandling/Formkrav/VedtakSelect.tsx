import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { IFormkravVilkår } from './typer';
import { PåklagetVedtakstype, påklagetVedtakstypeTilTekst } from '../../../App/typer/fagsak';
import { FamilieDatovelger, FamilieSelect } from '@navikt/familie-form-elements';
import {
    erVedtakFraFagsystemet,
    fagsystemVedtakTilVisningstekst,
    sorterVedtakstidspunktDesc,
} from './utils';
import { FagsystemVedtak } from '../../../App/typer/fagsystemVedtak';
import { Label } from '@navikt/ds-react';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';

interface IProps {
    settOppdaterteVurderinger: Dispatch<SetStateAction<IFormkravVilkår>>;
    vedtak: FagsystemVedtak[];
    vurderinger: IFormkravVilkår;
}

const SelectWrapper = styled.div`
    width: 80%;
`;

const DatoWrapper = styled.div`
    margin-top: 1rem;
`;

export const VedtakSelect: React.FC<IProps> = ({
    settOppdaterteVurderinger,
    vedtak,
    vurderinger,
}) => {
    const { toggles } = useToggles();
    const handleChange = (valgtElement: string) => {
        if (erVedtakFraFagsystemet(valgtElement)) {
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
                    påklagetVedtakstype: valgtElement as PåklagetVedtakstype,
                },
            }));
        }
    };

    return (
        <SelectWrapper>
            <FamilieSelect
                label={'Vedtak som er påklaget'}
                onChange={(e) => {
                    handleChange(e.target.value);
                }}
                value={
                    vurderinger.påklagetVedtak.eksternFagsystemBehandlingId ??
                    vurderinger.påklagetVedtak.påklagetVedtakstype
                }
            >
                <option value={PåklagetVedtakstype.IKKE_VALGT}>
                    {påklagetVedtakstypeTilTekst[PåklagetVedtakstype.IKKE_VALGT]}
                </option>
                <option value={PåklagetVedtakstype.UTEN_VEDTAK}>
                    {påklagetVedtakstypeTilTekst[PåklagetVedtakstype.UTEN_VEDTAK]}
                </option>

                {toggles[ToggleName.skalKunneVelgePåklagetVedtakFraInfotrygd] && (
                    <option value={PåklagetVedtakstype.INFOTRYGD_TILBAKEKREVING}>
                        {påklagetVedtakstypeTilTekst[PåklagetVedtakstype.INFOTRYGD_TILBAKEKREVING]}
                    </option>
                )}
                {vedtak.sort(sorterVedtakstidspunktDesc).map((valg, index) => (
                    <option key={index} value={valg.eksternBehandlingId}>
                        {fagsystemVedtakTilVisningstekst(valg)}
                    </option>
                ))}
            </FamilieSelect>
            {vurderinger.påklagetVedtak.påklagetVedtakstype ===
                PåklagetVedtakstype.INFOTRYGD_TILBAKEKREVING && (
                <DatoWrapper>
                    <Label htmlFor={'vedtaksdato'}>
                        Vedtaksdato for tilbakekreving i infotrygd
                    </Label>
                    <FamilieDatovelger
                        label={null}
                        id={'vedtaksdato'}
                        valgtDato={vurderinger.påklagetVedtak.vedtaksdatoInfotrygd}
                        onChange={(dato) => {
                            settOppdaterteVurderinger((prevState) => ({
                                ...prevState,
                                påklagetVedtak: {
                                    ...prevState.påklagetVedtak,
                                    vedtaksdatoInfotrygd: dato as string,
                                },
                            }));
                        }}
                    />
                </DatoWrapper>
            )}
        </SelectWrapper>
    );
};
