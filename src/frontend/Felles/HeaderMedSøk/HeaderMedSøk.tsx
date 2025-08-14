import React, { useMemo } from 'react';
import { ISaksbehandler } from '../../App/typer/saksbehandler';
import { useApp } from '../../App/context/AppContext';
import styles from './HeaderMedSøk.module.css';
import { AppEnv } from '../../App/api/env';
import { lagAInntektLink, lagGosysLink, lagModiaLink } from '../Lenker/lenker';
import { AxiosRequestCallback } from '../../App/typer/axiosRequest';
import { ActionMenu, InternalHeader } from '@navikt/ds-react';
import { MenuGridIcon } from '@navikt/aksel-icons';

export const HeaderMedSøk: React.FunctionComponent<{ innloggetSaksbehandler: ISaksbehandler }> = ({
    innloggetSaksbehandler,
}) => {
    const { axiosRequest, appEnv, valgtFagsakId, personIdent } = useApp();

    const navn = innloggetSaksbehandler?.displayName ?? 'Ukjent';
    const enhet = innloggetSaksbehandler?.enhet ?? 'Ukjent';
    const popoverItems = [{ name: 'Logg ut', href: `${window.origin}/auth/logout` }];
    const eksterneLenker = useMemo(
        () => lagEksterneLenker(axiosRequest, appEnv, valgtFagsakId, personIdent),
        [axiosRequest, appEnv, valgtFagsakId, personIdent]
    );

    return (
        <div className={styles.stickyContainer}>
            <Header
                saksbehandlerNavn={navn}
                saksbehandlerEnhet={enhet}
                brukerPopoverItems={popoverItems}
                eksterneLenker={eksterneLenker}
            />
        </div>
    );
};

const lagAInntekt = (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    fagsakId: string | undefined
): PopoverItem => {
    if (!fagsakId) {
        return { name: 'A-inntekt', href: appEnv.eksternlenker.aInntekt, isExternal: true };
    }

    return {
        name: 'A-inntekt',
        onSelect: async () => {
            window.open(await lagAInntektLink(axiosRequest, appEnv, fagsakId));
        },
    };
};

const lagGosys = (appEnv: AppEnv, personIdent: string | undefined): PopoverItem => {
    if (!personIdent) {
        return { name: 'Gosys', href: appEnv.eksternlenker.gosys, isExternal: true };
    }

    return {
        name: 'Gosys',
        onSelect: async () => {
            window.open(lagGosysLink(appEnv, personIdent));
        },
    };
};

const lagModia = (appEnv: AppEnv, personIdent: string | undefined): PopoverItem => {
    if (!personIdent) {
        return { name: 'Modia', href: appEnv.eksternlenker.modia, isExternal: true };
    }

    return {
        name: 'Modia',
        onSelect: async () => {
            window.open(lagModiaLink(appEnv, personIdent));
        },
    };
};

const lagEksterneLenker = (
    axiosRequest: AxiosRequestCallback,
    appEnv: AppEnv,
    fagsakId: string | undefined,
    personIdent: string | undefined
): PopoverItem[] => [
    lagAInntekt(axiosRequest, appEnv, fagsakId),
    lagGosys(appEnv, personIdent),
    lagModia(appEnv, personIdent),
];

export type PopoverItem =
    | {
          name: string;
          href: string;
          isExternal?: boolean;
          onSelect?: never;
      }
    | {
          name: string;
          href?: never;
          isExternal?: never;
          onSelect: (e: Event) => void;
      };

interface Props {
    saksbehandlerNavn: string;
    saksbehandlerEnhet: string;
    brukerPopoverItems: PopoverItem[];
    eksterneLenker: PopoverItem[];
}

export const Header: React.FC<Props> = ({
    saksbehandlerNavn,
    saksbehandlerEnhet,
    brukerPopoverItems,
    eksterneLenker,
}) => {
    const { gåTilUrl } = useApp();

    return (
        <InternalHeader>
            <InternalHeader.Title className={styles.header} onClick={() => gåTilUrl('#')}>
                NAV Familie - klage
            </InternalHeader.Title>
            <div style={{ marginLeft: 'auto' }} />
            <LenkePopover lenker={eksterneLenker} />
            <Bruker
                navn={saksbehandlerNavn}
                enhet={saksbehandlerEnhet}
                popoverItems={brukerPopoverItems}
            />
        </InternalHeader>
    );
};

const Bruker: React.FC<{
    navn: string;
    enhet?: string;
    popoverItems?: PopoverItem[];
}> = ({ navn, enhet, popoverItems }) => (
    <ActionMenu>
        <ActionMenu.Trigger>
            <InternalHeader.UserButton
                name={navn}
                description={enhet ? `Enhet: ${enhet}` : 'Ukjent enhet'}
            />
        </ActionMenu.Trigger>
        {popoverItems && (
            <ActionMenu.Content>
                <ActionMenu.Group label={''}>
                    {popoverItems.map((lenke, index) => {
                        return <ActionMenuLenke key={index} lenke={lenke} />;
                    })}
                </ActionMenu.Group>
            </ActionMenu.Content>
        )}
    </ActionMenu>
);

const LenkePopover: React.FC<{ lenker: PopoverItem[] }> = ({ lenker }) => (
    <ActionMenu>
        <ActionMenuTrigger />
        {lenker.length > 0 && (
            <ActionMenu.Content>
                <ActionMenu.Group label={''}>
                    {lenker.map((lenke, index) => (
                        <ActionMenuLenke lenke={lenke} key={index} />
                    ))}
                </ActionMenu.Group>
            </ActionMenu.Content>
        )}
    </ActionMenu>
);

const ActionMenuLenke: React.FC<{
    lenke: PopoverItem;
}> = ({ lenke }) =>
    lenke.onSelect ? (
        <ActionMenu.Item onSelect={(e) => lenke.onSelect(e)}>{lenke.name}</ActionMenu.Item>
    ) : (
        <ActionMenu.Item
            as={'a'}
            href={lenke.href}
            target={lenke.isExternal ? '_blank' : ''}
            rel={lenke.isExternal ? 'noopener noreferrer' : ''}
        >
            {lenke.name}
        </ActionMenu.Item>
    );

const ActionMenuTrigger = () => (
    <ActionMenu.Trigger>
        <InternalHeader.Button className="ml-auto">
            <MenuGridIcon fontSize={'1.5rem'} title="Andre systemer" />
        </InternalHeader.Button>
    </ActionMenu.Trigger>
);
