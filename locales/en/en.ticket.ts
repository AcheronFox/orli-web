import { ITicket } from "@/models/locale/ticket.model"

const ticket: ITicket = {
    intro: [
        "We've tried to give a wide range of opportunities for everyone when it comes to visiting the event, whether if it's just for a few hours or for the entirety of the Försztivál!",
        "You can find out more about the different packages and their contents below.<br/>",
        "<b>Don't delay, because if you choose a package before the midnight of May 14, we'll give you a 15% discount off the price!</b>"
    ],
    content: [
        {
            title: 'One Day Ticket',
            body: [
                "Entrance to the event area from 2:00 PM on the day of your choice until 11:00 PM of the same day.<br/>",
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
                            Registration care package
                        </li>
                    </ul>
                `,
                "<b>Please keep in mind that this option does not allow any overnight stays!</b><br/><br/>"
            ]
        },
        {
            title: "One night ticket",
            body: [
                "Access to the event area from 2:00 PM on the day of your choice until 12:00 PM (Noon) on the following day.<br/>",
                "This package includes:",
                `
                    <ul>
                        <li>
                            One night accommodation (Only in a tent brought by yourself), with breakfast included
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
                            Registration care package
                        </li>
                    </ul>
                `,
                "<b>Please keep in mind that providing tents, bed linen and towels is your own responsibility! Please choose 2 consecutive days!</b><br/><br/>"
            ]
        },
        {
            title: "Festival Pass",
            body: [
                "Access to the event area all the way from June 15, 2:00 PM until 12:00 PM (Noon) of June 18.<br/>",
                "This package includes:",
                `
                    <ul>
                        <li>
                            Accommodation for 3 nights with breakfast included
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
                            Registration care package
                        </li>
                    </ul>
                    <br/>
                    <br/>
                `,
            ]
        },
        {
            title: "Day zero",
            body: [
                "Access to the event area from 4:00 PM on June 14. <b>Not available as a stand-alone option.</b><br/>",
                "This package includes:",
                `
                    <ul>
                        <li>
                            One night accommodation with breakfast included (on June 14.)
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
                            Registration care package
                        </li>
                    </ul>
                `,
                "<b>Please keep in mind that there are no official programs on Day Zero.</b><br/><br/>"
            ]
        },
        {
            title: "Additional Day",
            body: [
                "Access to the event area up to 11:00 AM on June 19. <b>Not available as a stand-alone option.</b><br/>",
                "This package includes:",
                `
                    <ul>
                        <li>
                            One night accommodation with breakfast included (on June 14.)
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
                            Registration care package
                        </li>
                    </ul>
                `,
                "<b>Please keep in mind that this option is only available in a limited quantity.</b><br/><br/>"
            ]
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
                            A drink coupon to be used at the NicoBar
                        </li>
                        <li>
                            ... and a little surprise
                        </li>
                    </ul>
                    <br/>
                    <br/>
               `
            ]
        },
        {
            title: "Super Sponsor",
            body: [
                "The contents of the super sponsor package:",
                `
                    <ul>
                        <li>
                            T-shirt
                        </li>
                        <li>
                            The Nicobar's refillable cup
                        </li>
                        <li>
                            ... and a little surprise
                        </li>
                    </ul>
                    <br/>
                    <br/>
                `
            ]
        }
    ],
    outro: [
        `
        <span>
            Participation in each panel is subject to the purchase of an entry ticket, with no further additional cost. However, there are some optional programs that are handled by external service providers, so their fees may be an additional cost for participants. More information on this can be found under the
            <Button
                variant="text"
                link="/programs"
            >
                programs
            </Button>
            tab
        </span>
        `,
        '<br/>',
        "Access to the beach area is only possible with a provided wristband. The deposit fee for this is 1000 HUF per person, which will be refunded once the wristband is returned.",
        "We kindly ask you to prepare the appropriate banknotes of cash for a smooth check-in.",
    ]
}

export default ticket