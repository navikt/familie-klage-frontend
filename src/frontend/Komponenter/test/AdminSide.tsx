import React from 'react';
import styled from 'styled-components';
import { Side } from '../../Felles/Visningskomponenter/Side';
import { Button } from '@navikt/ds-react';
import { useApp } from '../../App/context/AppContext';
import { useNavigate } from 'react-router-dom';

const StyledAdmin = styled.div`
    display: flex;
    flex-direction: column;
    width: 10rem;
    margin: 2rem;
`;

// const TextFieldMargin = styled(TextField)`
//     margin: 1rem 0;
// `;

export const AdminSide: React.FC = () => {
    const { axiosRequest } = useApp();
    const navigate = useNavigate();
    // const [behandlingId, settBehandlingId] = useState<string>('');

    const lagBehandling = () => {
        axiosRequest<null, null>({
            method: 'POST',
            url: `/familie-klage/api/behandling`,
        }).then((res) => {
            if (res.status === 'SUKSESS') {
                navigate(`/behandling/${res?.data.id}`);
            }
        });
    };

    return (
        <Side className={'container'}>
            <StyledAdmin>
                [Test]
                {/*<TextFieldMargin label="Opprett behandling" />*/}
                <Button onClick={lagBehandling}>Lag behandling</Button>
            </StyledAdmin>
        </Side>
    );
};
