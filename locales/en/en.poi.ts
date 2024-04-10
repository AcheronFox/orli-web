import { IPOI } from "@/models/locale/poi.model";

const poi: IPOI[] = [
    {
        title: "Lidl",
        description: "Discount Supermarket",
        time: [
            "Mon-Sat: 7-21",
            "Sun: 7-19"
        ],
        address: "Gárdony, Akácfa street 2",
        distance: "~27 minutes (on foot)",
        link: "https://goo.gl/maps/d7Ztbte8VpwAng9U8"
    },
    {
        title: "Aranysárkány Patika Bt.",
        description: "Pharmacy",
        time: [
            "Mon-Fri: 8-17",
            "Sat: 8-12",
            "Sun: Closed"
        ],
        address: "Gárdony, Balatoni way 78, 2484",
        distance: "~21 minutes (on foot)",
        link: "https://goo.gl/maps/b6FoHhdDjtmgMcMP7"
    },
    {
        title: "Fehér Fregatt Vendéglő",
        description: "Restaurant",
        time: [
            "Mon: Closed",
            "Tue-Sun: 12-22"
        ],
        address: "Gárdony, Chernel István way 42-44, 2484",
        distance: "~7 minutes (on foot)",
        link: "https://goo.gl/maps/rggLXgnsJdwwPEwJ6"
    }
]

export default poi