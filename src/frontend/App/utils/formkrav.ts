import { IFormVilkår, VilkårStatus } from '../../Komponenter/Behandling/Formkrav/utils';

export const formkravOppfylt = (formVilkår: IFormVilkår): boolean => {
    const vilkårListe = [
        formVilkår.klagePart,
        formVilkår.klageKonkret,
        formVilkår.klagefristOverholdt,
        formVilkår.klageSignert,
    ];
    const oppfyltKrav = vilkårListe.filter((item: VilkårStatus) => item === 'OPPFYLT').length;
    return oppfyltKrav === vilkårListe.length && oppfyltKrav > 0;
};
