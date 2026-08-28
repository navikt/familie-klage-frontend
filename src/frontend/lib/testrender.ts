import type {
    RenderOptions as RtlRenderOptions,
    RenderResult as RtlRenderResult,
    Screen as RtlScreen,
} from '@testing-library/react';
import { render as rtlRender, screen as rtlScreen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';
import userEvent from '@testing-library/user-event';
import React from 'react';

type RenderOptions = Omit<RtlRenderOptions, 'queries'>;

type RenderResult = RtlRenderResult & {
    user: UserEvent;
    screen: RtlScreen;
};

export function render(ui: React.ReactNode, options?: RenderOptions): RenderResult {
    return {
        user: userEvent.setup(),
        screen: rtlScreen,
        ...rtlRender(ui, options),
    };
}
