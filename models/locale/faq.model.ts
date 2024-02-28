export const FaqCategories = {
    cat1: '',
    cat2: '',
    cat3: '',
    cat4: '',
    cat5: '',
    cat6: '',
    cat7: '',
    cat8: '',
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