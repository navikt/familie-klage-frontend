import * as React from 'react';
import styled from 'styled-components';

const IkonStyled = styled.svg`
    margin-right: 0.4rem;
    margin-left: 0.6rem;
`;

export const Ikon: React.FC = (props) => {
    return (
        <IkonStyled
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            role="img"
        >
            {props.children}
        </IkonStyled>
    );
};
