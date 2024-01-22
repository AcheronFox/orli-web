declare interface Language {
    // NAV
    navLogin: string
    navReg: string
    navLocation: string
    navGallery: string
    navPrograms: string
    navPrices: string
    navAccom: string
    navEventCenter: string
    navGetting: string
    navPoi: string
    navLegal: string
    navFaq: string
    navParticipants: string
    navStaff: string
    navProfile: string
    navEvent: string
    navImportant: string
    navTickets: string
    navRooms: string
    navAdmin: string
    navLogout: string
    navMe: string

    // ERRORS
    errLoginPass: string
    errLoginNotFound: string
    errLoginUnverified: string
    errResetNotFound: string
    errResetToken: string
    errDefault: string
    errRegConflict: string
    errBadRequest: string
    errProfileLoginExp: string
    errFileTooLarge: string

    resetSuccess: string
    resetEmailSent: string
    profSuccess: string
}