// `export {}` gjør fila til en modul. Uten den er dette et globalt script, og da er `declare global`
// ugyldig og augmenteringen under blir stilltiende ignorert (skjult av `skipLibCheck`).
// https://github.com/mui/material-ui/issues/35287#issuecomment-1337250566
// Uten denne så klager ts på at onResize og onResizeCapture ikke er definiert på alle våre ikoner
export {};

declare global {
    namespace React {
        interface DOMAttributes<T> {
            onResize?: ReactEventHandler<T> | undefined;
            onResizeCapture?: ReactEventHandler<T> | undefined;
            nonce?: string | undefined;
        }
    }
}
