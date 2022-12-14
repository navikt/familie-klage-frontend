// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PartialRecord<K extends keyof any, T> = {
    [P in K]?: T;
};

export interface PropsWithChildren {
    children: React.ReactElement | React.ReactElement[];
}
