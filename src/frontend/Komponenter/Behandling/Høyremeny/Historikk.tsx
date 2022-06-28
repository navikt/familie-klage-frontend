import * as React from 'react';
import hiddenIf from '../../../Felles/HiddenIf/hiddenIf';
import HistorikkOppdatering from './HistorikkOppdatering';

// Mockobjekt. Skal fjernes så fort data er mulig å hente ut.
const historikkMock = {
    behandlingsId: 'ad983bff-d807-4ade-928e-1093e16ec2ac',
    historikkOppdateringer: [
        {
            tittel: 'Behandling opprettet',
            dato: '24.06.2022',
            tidspunkt: '21:06:54',
            behandler: 'Kari Olavsen',
        },
        {
            tittel: 'Behandling henlagt',
            dato: '24.06.2022',
            tidspunkt: '21:06:54',
            behandler: 'Kari Olavsen ',
        },
    ],
};

const Historikk: React.FC = () => {
    return (
        <div>
            {historikkMock.historikkOppdateringer.map((oppdatering) => (
                <HistorikkOppdatering
                    tittel={oppdatering.tittel}
                    tidspunkt={oppdatering.tidspunkt}
                    dato={oppdatering.dato}
                    behandler={oppdatering.behandler}
                />
            ))}
        </div>
    );
};

export default hiddenIf(Historikk);
