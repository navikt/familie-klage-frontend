import Modal from 'nav-frontend-modal';
import * as React from 'react';
import { IModal } from '../../App/typer/modal';
import classNames from 'classnames';
import { Heading } from '@navikt/ds-react';

interface IProps {
    modal: IModal;
    children: React.ReactElement | React.ReactElement[];
}

const UIModalWrapper: React.FunctionComponent<IProps> = ({ modal, children }) => {
    const { tittel, visModal, onClose, lukkKnapp, actions, className } = modal;

    return (
        <Modal
            className={classNames(className, 'uimodal')}
            isOpen={visModal}
            onRequestClose={(): void => onClose && onClose()}
            contentLabel="ui-modal"
            closeButton={lukkKnapp}
        >
            <div className="uimodal__content">
                <Heading size={'medium'}>{tittel}</Heading>
                <div className="uimodal__content--inner-content">{children}</div>
                {actions && <div className="uimodal__content--actions"> {actions} </div>}
            </div>
        </Modal>
    );
};

export default UIModalWrapper;
