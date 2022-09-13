import { IFormkravVilkår, VilkårStatus } from '../../Komponenter/Behandling/Formkrav/typer';

export const formkravOppfylt = (formVilkår: IFormkravVilkår): boolean => {
    const vilkårListe = [
        formVilkår.klagePart,
        formVilkår.klageKonkret,
        formVilkår.klagefristOverholdt,
        formVilkår.klageSignert,
    ];
    const oppfyltKrav = vilkårListe.filter((item: VilkårStatus) => item === 'OPPFYLT').length;
    return oppfyltKrav === vilkårListe.length && oppfyltKrav > 0;
};
