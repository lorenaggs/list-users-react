export const OptionsStatus = {
    activo: 'activo',
    inactivo: 'inactivo'
} as const;

export type OptionsStatus = typeof OptionsStatus[keyof typeof OptionsStatus];