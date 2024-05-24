import { ITicket } from "@/models/locale/ticket.model"

const ticket: ITicket = {
    intro: [
        "We tried to offer a wide variety of options for everyone to visiting the event, whether if it's just for a couple of hours or the whole Försztivál!",
        "You may find more about the different packages and their contents below.<br/>",
        "<b>Don't be late, because if you choose a package before the midnight of May 26, we give you around a 15% discount off the price!</b>"
    ],
    content: [
        {
            title: 'Festival pass',
            body: [
                "The perfect choice!<br/>",
                "Access to the event area all the way from June 13, 15:00 till June 16 14:00.<br/>",
                "This package includes:",
                `
                    <ul>
                        <li>
                            Accommodation for 3 nights with breakfast included
                        </li>
                        <li>
                            Accommodation in rooms for 4-6 people
                        </li>
                        <li>
                            Unlimited access to the beach and jacuzzi during their open hours
                        </li>
                        <li>
                            Free use of utilities
                        </li>
                        <li>
                            Grill equipment, spices, and sauces for grilling
                        </li>
                        <li>
                            Access to the majority of the programs
                        </li>
                        <li>
                            Registration package
                        </li>
                    </ul>
                `,
            ],
            priceKey: "WACC",
        },
        {
            title: "Camping pass",
            body: [
                "For those who aren't afraid of the true festival feeling.<br/>",
                "Access to the event area all the way from June 13, 15:00 till June 16 14:00.<br/>",
                "This package includes:",
                `
                    <ul>
                        <li>
                            Accommodation for 3 nights with breakfast included
                        </li>
                        <li>
                            Accommodation in a tent
                        </li>
                        <li>
                            Unlimited access to the beach and jacuzzi during their opening hours
                        </li>
                        <li>
                            Free use of the utilities around the place
                        </li>
                        <li>
                            Grilling equipment, spices, and sauces for cooking
                        </li>
                        <li>
                            Access to the majority of the programs
                        </li>
                        <li>
                            Registration package
                        </li>
                    </ul>
                `,
                "Please keep in mind that taking care of tents, bedclothes, and towels is your own responsibility!<br/>"
            ],
            priceKey: "TENT"
        },
        {
            title: "Early arrival",
            body: [
                "For those who wish to arrive earlier to the island.<br/>",
                "Access to the event area from June 12, 15:00. <b>Not available as a standalone option.</b><br/>",
                "This package includes:",
                `
                    <ul>
                        <li>
                            Accommodation for one night with breakfast included (June 12)
                        </li>
                        <li>
                            Accommodation in rooms for 4-6 people
                        </li>
                        <li>
                            Unlimited access to the beach and jacuzzi during their opening hours
                        </li>
                        <li>
                            Free use of the utilities around the place
                        </li>
                        <li>
                            Grilling equipment, spices, and sauces for cooking
                        </li>
                        <li>
                            Access to the majority of the programs
                        </li>
                        <li>
                            Registration package
                        </li>
                    </ul>
                `,
                "Please keep in mind that there are no official programs on this day.<br/>"
            ],
            priceKey: "EARLY"
        },
        {
            title: "Late departure",
            body: [
                "For those who wish to relax for one more night.<br/>",
                "Access to the event area till June 17, Noon. <b>Not available as a standalone option.</b><br/>",
                "This package includes:",
                `
                    <ul>
                        <li>
                            Accommodation for one night with breakfast included (June 16)
                        </li>
                        <li>
                            Accommodation in one of the 4 people rooms of the Fácán house
                        </li>
                        <li>
                            Unlimited access to the beach and jacuzzi during their opening hours
                        </li>
                        <li>
                            Free use of the utilities around the place
                        </li>
                        <li>
                            Grilling equipment, spices, and sauces for cooking
                        </li>
                        <li>
                            Access to the majority of the programs
                        </li>
                        <li>
                            Registration package
                        </li>
                    </ul>
                `,
                "Please keep in mind that this option is only available in a limited quantity.<br/>"
            ],
            priceKey: "LATE"
        },
        {
            title: "Sponsor",
            body: [
               "The contents of the sponsor package:",
               `
                    <ul>
                        <li>
                            A poster of the event
                        </li>
                        <li>
                            A sticker pack
                        </li>
                        <li>
                            A pin
                        </li>
                    </ul>
               `,
            ],
            priceKey: "SPONS"
        },
        {
            title: "Super sponsor",
            body: [
                "The contents of the super sponsor package:",
                `
                    <ul>
                        <li>
                            A t-shirt
                        </li>
                        <li>
                            A refillable cup, offered by Nicobar
                        </li>
                        <li>
                            A special neckband
                        </li>
                        <li>
                            A sticker pack
                        </li>
                        <li>
                            A pin
                        </li>
                    </ul>
                `,
            ],
            priceKey: "SSPONS"
        },
        {
            title: "Daily ticket",
            body: [
                "For those, who can't stay with us till the end.<br/>",
                "Entrance to the event area on the day of your choice between 15:00 and 23:00.<br/>",
                "This package includes:",
                `
                    <ul>
                        <li>
                            Unlimited access to the beach and jacuzzi during their opening hours
                        </li>
                        <li>
                            Free use of the utilities around the place
                        </li>
                        <li>
                            Grilling equipment, spices, and sauces for cooking
                        </li>
                        <li>
                            Access to the majority of the programs
                        </li>
                        <li>
                            Registration package
                        </li>
                    </ul>
                `,
                "Please keep in mind that this option does not allow overnight stays!",
                "<b>Can only be purchased in person on site!</b><br/>"
            ],
            priceKey: "DAILY"
        }
    ],
    outro: [
        `
        <span>
        Participation in each panel is subject to the purchase of a festival ticket, with no further additional costs. However, there are some optional programs that are handled by external service providers, their fees may be of additional cost for participants. More information about this can be found under the
            <Button
                variant="text"
                link="/programs"
            >
                programs
            </Button>
            menu point.
        </span>
        <br/>
        `,
        "Access to the beach area is only possible with a provided wristband. The deposit fee is 2000 HUF per person, <b>which is refunded upon the return of the wristband!</b>",
        "We kindly ask everyone to prepare the appropriate banknotes for a smooth check-in.",
    ]
}

export default ticket