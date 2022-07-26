import * as React from 'react';

export const Ikon: React.FC = (props) => {
    return (
        <svg
            width="35"
            height="35"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            role="img"
        >
            {props.children}
        </svg>
    );
};
