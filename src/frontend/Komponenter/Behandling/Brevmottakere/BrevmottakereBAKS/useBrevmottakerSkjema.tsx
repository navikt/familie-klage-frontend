import { useForm } from 'react-hook-form';
import { BrevmottakerMedAdresse } from './BrevmottakereBAKS';

export const useBrevmottakerSkjema = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<BrevmottakerMedAdresse>();

    const mottakerRolle = register('mottakerRolle', {
        required: 'Dette feltet er påkrevd',
    });

    const navn = register('navn', {
        required: 'Navn på person eller organisasjon er påkrevd',
        maxLength: {
            value: 80,
            message: 'Feltet kan ikke inneholde mer enn 80 tegn',
        },
    });

    /*
    const mottakerRolleVerdi = watch('mottakerRolle');
    const land = register('land', {
        required: 'Dette feltet er påkrevd',
        validate: (value) => {
            if (mottakerRolleVerdi === 'BRUKER_MED_UTENLANDSK_ADRESSE' && value === 'NO') {
                return 'Norge kan ikke være satt for bruker med utenlandsk adresse';
            }
            return;
        },
    });
    */

    const adresselinje1 = register('adresselinje1', {
        required: 'Dette feltet er påkrevd',
        maxLength: { value: 80, message: 'Feltet kan ikke inneholde mer enn 80 tegn' },
    });

    const adresselinje2 = register('adresselinje2', {
        maxLength: { value: 80, message: 'Feltet kan ikke inneholde mer enn 80 tegn' },
    });

    const landVerdi = watch('land');
    const postnummer = register('postnummer', {
        required: landVerdi === 'NO' ? 'Dette feltet er påkrevd' : false,
        maxLength: { value: 10, message: 'Feltet kan ikke inneholde mer enn 10 tegn' },
    });

    const poststed = register('poststed', {
        required: landVerdi === 'NO' ? 'Dette feltet er påkrevd' : false,
        maxLength: { value: 50, message: 'Maks 50 tegn' },
    });

    const felter = {
        mottakerRolle,
        navn,
        // land,
        adresselinje1,
        adresselinje2,
        postnummer,
        poststed,
    };

    return { felter, errors, handleSubmit, watch };
};
