import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Container = styled.div<{ skillelinje: boolean }>`
    display: flex;
    margin: 2rem;
    border-bottom: ${(props: { skillelinje: boolean }) =>
        props.skillelinje ? '3px solid #e9e7e7' : 'none'};

    @media (max-width: 1600px) {
        flex-direction: column;
    }
`;

const VenstreKolonne = styled.div`
    padding: 1.5rem 0;
    width: 50%;
    max-width: 50rem;

    @media (max-width: 1600px) {
        width: 100%;
    }
`;

const HøyreKolonne = styled.div`
    padding: 1.5rem 0;
    width: 50%;
    max-width: 50rem;

    @media (max-width: 1600px) {
        width: 100%;
    }
`;

interface Props {
    skillelinje?: boolean;
    children: {
        venstre: ReactNode;
        høyre: ReactNode;
    };
}

const ToKolonnerLayout: React.FC<Props> = ({
    skillelinje = true,
    children: { venstre, høyre },
}) => {
    return (
        <Container skillelinje={skillelinje}>
            <VenstreKolonne>{venstre}</VenstreKolonne>
            <HøyreKolonne>{høyre}</HøyreKolonne>
        </Container>
    );
};

export default ToKolonnerLayout;
