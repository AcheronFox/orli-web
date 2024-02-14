import { IPOI } from "@/models/locale/poi.model";

const poi: IPOI[] = [
    {
        title: "Lidl",
        description: "Élelmiszerbolt",
        time: [
            "H-Sz: 7-21",
            "V: 7-19"
        ],
        address: "Gárdony, Akácfa utca 2, 2484",
        distance: "~27 perc (gyalog)",
        link: "https://goo.gl/maps/d7Ztbte8VpwAng9U8"
    },
    {
        title: "Aranysárkány Patika Bt.",
        description: "Gyógyszertár",
        time: [
            "H-P: 8-17",
            "Sz: 8-12",
            "V: Zárva"
        ],
        address: "Gárdony, Balatoni út 78, 2484",
        distance: "~21 perc (gyalog)",
        link: "https://goo.gl/maps/b6FoHhdDjtmgMcMP7"
    },
    {
        title: "Fehér Fregatt Vendéglő",
        description: "Étterem",
        time: [
            "H: Zárva",
            "K-V: 12-22"
        ],
        address: "Gárdony, Chernel István u. 42-44, 2484",
        distance: "~7 perc (gyalog)",
        link: "https://goo.gl/maps/rggLXgnsJdwwPEwJ6"
    }
]

export default poi