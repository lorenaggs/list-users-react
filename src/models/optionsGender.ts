export const OptionsGender = {
    hombre: 'hombre',
    mujer: 'mujer'
} as const;

export type OptionsGender = typeof OptionsGender[keyof typeof OptionsGender];
