import { ITicket } from "@/models/locale/ticket.model"

const ticket: ITicket = {
    intro: [
        "Számos opcióval igyekeztünk mindenki számára biztosítani a lehetőséget, hogy meglátogathassa a rendezvényt, legyen az akár pár óra, akár a teljes Försztivál!",
        "A különböző csomagok tartalmát alább olvashatjátok.<br/>",
        "<b>Ne késlekedj, hiszen ha május 14 éjfél előtt választasz csomagot, annak árából 15% kedvezményt adunk!</b>"
    ],
    content: [
        {
            title: 'Napijegy',
            body: [
                "Belépési lehetőség a rendezvény területére a választott napon 14:00 órától aznap 23:00 óráig.<br/>",
                "A csomag tartalma:",
                `
                    <ul>
                        <li>
                            Korlátlan strandbelépő és jacuzzi használat, annak nyitvatartása alatt
                        </li>
                        <li>
                            A létesítmény eszközeinek szabad használata
                        </li>
                        <li>
                            Grilleszközök, fűszerek, szószok a sütéshez
                        </li>
                        <li>
                            Hozzáférés a programok többségéhez
                        </li>
                        <li>
                            Regisztrációs csomag
                        </li>
                    </ul>
                `,
                "<b>Fontos kiemelnünk, hogy ez az opció nem enged meg éjszakai tartózkodást!</b><br/><br/>"
            ]
        },
        {
            title: "Egy éjszakás jegy",
            body: [
                "Belépési lehetőség a rendezvény területére a választott napon 14:00 órától másnap 12:00 óráig.<br/>",
                "A csomag tartalma:",
                `
                    <ul>
                        <li>
                            1 éjszaka szállás, reggelivel, kizárólag saját sátorban
                        </li>
                        <li>
                            Korlátlan strandbelépő és jacuzzi használat, annak nyitvatartása alatt
                        </li>
                        <li>
                            A létesítmény eszközeinek szabad használata
                        </li>
                        <li>
                            Grilleszközök, fűszerek, szószok a sütéshez
                        </li>
                        <li>
                            Hozzáférés a programok többségéhez
                        </li>
                        <li>
                            Regisztrációs csomag
                        </li>
                    </ul>
                `,
                "<b>Fontos kiemelnünk, hogy a sátor, ágynemű és törülköző biztosítása mindenkinek saját felelőssége! Kérünk, hogy 2, egymást követő napot válassz!</b><br/><br/>"
            ]
        },
        {
            title: "Fesztiválbérlet",
            body: [
                "Belépési lehetőség a rendezvény területére június 15-én 14:00 órától június 18-án 12:00 óráig.<br/>",
                "A csomag tartalma:",
                `
                    <ul>
                        <li>
                            3 éjszaka szállás, reggelivel
                        </li>
                        <li>
                            Korlátlan strandbelépő és jacuzzi használat, annak nyitvatartása alatt
                        </li>
                        <li>
                            A létesítmény eszközeinek szabad használata
                        </li>
                        <li>
                            Grilleszközök, fűszerek, szószok a sütéshez
                        </li>
                        <li>
                            Hozzáférés a programok többségéhez
                        </li>
                        <li>
                            Regisztrációs csomag
                        </li>
                    </ul>
                    <br/>
                    <br/>
                `,
            ]
        },
        {
            title: "0. nap",
            body: [
                "Belépési lehetőség a rendezvény területére június 14-én 16:00 órától. <b>Önálló opcióként nem választható.</b><br/>",
                "A csomag tartalma:",
                `
                    <ul>
                        <li>
                            1 éjszaka szállás, reggelivel (Június 14.)
                        </li>
                        <li>
                            Korlátlan strandbelépő és jacuzzi használat, annak nyitvatartása alatt
                        </li>
                        <li>
                            A létesítmény eszközeinek szabad használata
                        </li>
                        <li>
                            Grilleszközök, fűszerek, szószok a sütéshez
                        </li>
                        <li>
                            Regisztrációs csomag
                        </li>
                    </ul>
                `,
                "<b>Fontos kiemelnünk, hogy a 0. napon még nincsenek hivatalos programok.</b><br/><br/>"
            ]
        },
        {
            title: "+1 nap",
            body: [
                "Belépési lehetőség a rendezvény területére június 19-én 11:00 óráig. <b>Önálló opcióként nem választható.</b><br/>",
                "A csomag tartalma:",
                `
                    <ul>
                        <li>
                            1 éjszaka szállás, reggelivel (Június 18.)
                        </li>
                        <li>
                            Korlátlan strandbelépő és jacuzzi használat, annak nyitvatartása alatt
                        </li>
                        <li>
                            A létesítmény eszközeinek szabad használata
                        </li>
                        <li>
                            Grilleszközök, fűszerek, szószok a sütéshez
                        </li>
                        <li>
                            Regisztrációs csomag
                        </li>
                    </ul>
                `,
                "<b>Fontos kiemelnünk, hogy ez az opció csak korlátozott számban érhető el.</b><br/><br/>"
            ]
        },
        {
            title: "Szponzor",
            body: [
               "A szponzor csomag tartalma:",
               `
                    <ul>
                        <li>
                            Egy poszter az eseményről
                        </li>
                        <li>
                        Egy italkupon, mely felhasználható a NicoBarban
                        </li>
                        <li>
                            ...és egy kis meglepetés
                        </li>
                    </ul>
                    <br/>
                    <br/>
               `
            ]
        },
        {
            title: "Szuper szponzor",
            body: [
                "A szuper szponzor csomag tartalma:",
                `
                    <ul>
                        <li>
                            Póló
                        </li>
                        <li>
                        A Nicobar repohara
                        </li>
                        <li>
                            ...és egy kis meglepetés
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
        Az egyes paneleken való részvétel a belépőjegy megvásárlásához kötött, további költséget nem rejt. Vannak azonban fakultatív programok, melyeket külső szolgáltató biztosít, így azok díjai további kiadást jelenthetnek a résztvevők részére. Erről bővebb tájékoztatás a
            <Button
                variant="text"
                link="/programs"
            >
                programok
            </Button>
            menüpont alatt olvasható.
        </span>
        <br/>
        `,
        "Belépés a strandfürdő területére csak karszalaggal lehetséges. Ennek letéti díja fejenként 1000 HUF, mely a karszalag leadásakor visszajár.",
        "Kérünk mindenkit, hogy a gördülékeny bejelentkezés érdekében készüljön a megfelelő bankjegyekkel.",
    ]
}

export default ticket