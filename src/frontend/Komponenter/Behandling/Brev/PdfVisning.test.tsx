import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { Ressurs } from '../../../App/typer/ressurs';
import { RessursStatus } from '../../../App/typer/ressurs';
import { render } from '../../../lib/testrender';
import { PdfVisning } from './PdfVisning';

const { lastetPdf } = vi.hoisted(() => ({
    lastetPdf: { antallSider: undefined as number | undefined },
}));

vi.mock('react-pdf', async () => {
    const { useEffect } = await import('react');
    return {
        Document: ({ onLoadSuccess }: { onLoadSuccess: (pdf: { numPages: number }) => void }) => {
            useEffect(() => {
                if (lastetPdf.antallSider !== undefined) {
                    onLoadSuccess({ numPages: lastetPdf.antallSider });
                }
            }, [onLoadSuccess]);
            return null;
        },
        Page: () => null,
        pdfjs: { GlobalWorkerOptions: {} },
    };
});

const PDF: Ressurs<string> = { status: RessursStatus.SUKSESS, data: 'JVBERi0=' };

describe('PdfVisning', () => {
    beforeEach(() => {
        lastetPdf.antallSider = undefined;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('skal ikke logge feil til konsollen før pdf-en er lastet', () => {
        // Arrange
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

        // Act
        render(<PdfVisning pdfFilInnhold={PDF} />);

        // Assert
        expect(consoleError).not.toHaveBeenCalled();
    });

    test('skal vise paginering over og under pdf-en når den har flere sider', () => {
        // Arrange
        lastetPdf.antallSider = 3;

        // Act
        const { screen } = render(<PdfVisning pdfFilInnhold={PDF} />);

        // Assert
        expect(screen.getAllByRole('navigation')).toHaveLength(2);
    });

    test('skal ikke vise paginering når pdf-en har én side', () => {
        // Arrange
        lastetPdf.antallSider = 1;

        // Act
        const { screen } = render(<PdfVisning pdfFilInnhold={PDF} />);

        // Assert
        expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });
});
