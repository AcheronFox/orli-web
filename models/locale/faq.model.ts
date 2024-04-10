export const FaqCategories = {
    general: '',
    registration: '',
    financial: '',
    accom: '',
    location: '',
}

export type IFaqCategories = keyof typeof FaqCategories;

export type IFAQ = {
    [x in IFaqCategories]: {
        translation: string
        data: {
            title: string
            content: string[]
        }[]
    }
}