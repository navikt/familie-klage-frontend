import React, { Dispatch, SetStateAction } from 'react';
import styles from './VedtakSelect.module.css';
import { IFormkravVilkår } from './typer';
import {
    Fagsystem,
    PåklagetVedtakstype,
    påklagetVedtakstypeTilTekst,
} from '../../../App/typer/fagsak';
import {
    erVedtakFraFagsystemet,
    fagsystemVedtakTilVisningstekst,
    klageresultatTilVisningstekst,
    harManuellVedtaksdato,
    sorterVedtakstidspunktDesc,
    sorterVedtakstidspunktKlageResultatDesc,
} from './utils';
import { FagsystemVedtak } from '../../../App/typer/fagsystemVedtak';
import { Label, Select } from '@navikt/ds-react';
import { erGyldigDato } from '../../../App/utils/dato';
import { Datovelger } from '../../../Felles/Datovelger/Datovelger';
import { Klagebehandlingsresultat } from '../../../App/typer/klagebehandlingsresultat';

interface Props {
    settOppdaterteVurderinger: Dispatch<SetStateAction<IFormkravVilkår>>;
    vedtak: FagsystemVedtak[];
    vurderinger: IFormkravVilkår;
    fagsystem: Fagsystem;
    klagebehandlingsresultater: Klagebehandlingsresultat[];
}

export const VedtakSelect: React.FC<Props> = ({
    settOppdaterteVurderinger,
    vedtak,
    vurderinger,
    fagsystem,
    klagebehandlingsresultater,
}) => {
    const handleChange = (valgtElement: string) => {
        if (erVedtakFraFagsystemet(valgtElement)) {
            const erInternKlagebehandlingId = valgtElement.startsWith('internId');

            if (erInternKlagebehandlingId) {
                settOppdaterteVurderinger((prevState) => ({
                    ...prevState,
                    påklagetVedtak: {
                        internKlagebehandlingId: valgtElement.replace('internId', ''),
                        påklagetVedtakstype: PåklagetVedtakstype.AVVIST_KLAGE,
                    },
                }));
            } else {
                settOppdaterteVurderinger((prevState) => ({
                    ...prevState,
                    påklagetVedtak: {
                        eksternFagsystemBehandlingId: valgtElement,
                        påklagetVedtakstype: PåklagetVedtakstype.VEDTAK,
                    },
                }));
            }
        } else {
            settOppdaterteVurderinger((prevState) => ({
                ...prevState,
                påklagetVedtak: {
                    påklagetVedtakstype: valgtElement as PåklagetVedtakstype,
                },
            }));
        }
    };

    const hentValgForFagsystem = (fagsystem: Fagsystem): PåklagetVedtakstype[] => {
        switch (fagsystem) {
            case Fagsystem.EF:
                return [
                    PåklagetVedtakstype.INFOTRYGD_TILBAKEKREVING,
                    PåklagetVedtakstype.INFOTRYGD_ORDINÆRT_VEDTAK,
                    PåklagetVedtakstype.UTESTENGELSE,
                    PåklagetVedtakstype.UTEN_VEDTAK,
                ];
            case Fagsystem.KS:
            case Fagsystem.BA:
                return [
                    PåklagetVedtakstype.INFOTRYGD_TILBAKEKREVING,
                    PåklagetVedtakstype.INFOTRYGD_ORDINÆRT_VEDTAK,
                    PåklagetVedtakstype.UTEN_VEDTAK,
                ];
        }
    };

    const manuellVedtaksdato = vurderinger.påklagetVedtak.manuellVedtaksdato;

    return (
        <div className={styles.container}>
            <Select
                label={'Vedtak som er påklaget'}
                onChange={(e) => {
                    handleChange(e.target.value);
                }}
                value={
                    vurderinger.påklagetVedtak.eksternFagsystemBehandlingId ??
                    vurderinger.påklagetVedtak.internKlagebehandlingId ??
                    vurderinger.påklagetVedtak.påklagetVedtakstype
                }
            >
                <option value={PåklagetVedtakstype.IKKE_VALGT} disabled>
                    {påklagetVedtakstypeTilTekst[PåklagetVedtakstype.IKKE_VALGT]}
                </option>
                {vedtak.sort(sorterVedtakstidspunktDesc).map((valg, index) => (
                    <option key={index} value={valg.eksternBehandlingId}>
                        {fagsystemVedtakTilVisningstekst(valg)}
                    </option>
                ))}
                {klagebehandlingsresultater
                    .sort(sorterVedtakstidspunktKlageResultatDesc)
                    .map((klager, index) => (
                        <option key={index} value={'internId' + klager.id}>
                            {klageresultatTilVisningstekst(klager)}
                        </option>
                    ))}
                {hentValgForFagsystem(fagsystem).map((valg) => (
                    <option value={valg} key={valg}>
                        {påklagetVedtakstypeTilTekst[valg]}
                    </option>
                ))}
            </Select>
            {harManuellVedtaksdato(vurderinger.påklagetVedtak.påklagetVedtakstype) && (
                <div className={styles.datoVelgerContainer}>
                    <Label htmlFor={'vedtaksdato'}>Vedtaksdato</Label>
                    <Datovelger
                        id={'vedtaksdato'}
                        verdi={manuellVedtaksdato}
                        settVerdi={(dato) => {
                            settOppdaterteVurderinger((prevState) => ({
                                ...prevState,
                                påklagetVedtak: {
                                    ...prevState.påklagetVedtak,
                                    manuellVedtaksdato: dato as string,
                                },
                            }));
                        }}
                        feil={
                            manuellVedtaksdato && !erGyldigDato(manuellVedtaksdato)
                                ? 'Ugyldig dato'
                                : undefined
                        }
                        maksDato={new Date()}
                    />
                </div>
            )}
        </div>
    );
};
