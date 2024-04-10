import { ITicket } from "@/models/locale/ticket.model"

const ticket: ITicket = {
    intro: [
        "Számos opcióval igyekeztünk mindenki számára biztosítani a lehetőséget, hogy meglátogathassa a rendezvényt, legyen az akár pár óra, akár a teljes Försztivál!",
        "A különböző csomagok tartalmát az alábbiakban olvashatjátok.<br/>",
        "<b>Ne késlekedj, hiszen ha április 28. éjfél előtt választasz csomagot, annak árából körülbelül 15% kedvezményt adunk!</b>"
    ],
    content: [
        {
            title: 'Fesztiválbérlet',
            body: [
                "A legjobb választás!<br/>",
                "Belépési lehetőség a rendezvény területére június 13-án 15:00 órától június 16-án 14:00 óráig.<br/>",
                "A csomag tartalma:",
                `
                    <ul>
                        <li>
                            3 éjszaka szállás, reggelivel
                        </li>
                        <li>
                            Elhelyezés a házak 4-6 fős szobáiban
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
            ],
            priceKey: "WACC"
        },
        {
            title: "Sátras Bérlet",
            body: [
                "Azoknak, akik nem riadnak vissza az igazi fesztiválhangulattól.<br/>",
                "Belépési lehetőség a rendezvény területére június 13-án 15:00 órától június 16-án 14:00 óráig.<br/>",
                "A csomag tartalma:",
                `
                    <ul>
                        <li>
                            3 éjszaka szállás, reggelivel
                        </li>
                        <li>
                            Elhelyezés sátorban
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
                "Fontos kiemelnünk, hogy a sátor, ágynemű és törülköző biztosítása mindenkinek saját felelőssége!<br/>"
            ],
            priceKey: "TENT"
        },
        {
            title: "0. nap",
            body: [
                "Azoknak, akik korábban érkeznének a szigetre.<br/>",
                "Belépési lehetőség a rendezvény területére június 12-én 15:00 órától. <b>Önálló opcióként nem választható.</b><br/>",
                "A csomag tartalma:",
                `
                    <ul>
                        <li>
                            1 éjszaka szállás, reggelivel (június 12.)
                        </li>
                        <li>
                            Elhelyezés a házak 4-6 fős szobáiban
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
                "Fontos kiemelnünk, hogy a 0. napon még nincsenek hivatalos programok.<br/>"
            ],
            priceKey: "EARLY"
        },
        {
            title: "Ráadás",
            body: [
                "Azoknak, akik pihennének még egy éjszakát.<br/>",
                "Belépési lehetőség a rendezvény területére június 17-én 12:00 óráig. <b>Önálló opcióként nem választható.</b><br/>",
                "A csomag tartalma:",
                `
                    <ul>
                        <li>
                            1 éjszaka szállás, reggelivel (június 16.)
                        </li>
                        <li>
                            Elhelyezés a Fácán ház 4 fős szobáiban
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
                "Fontos kiemelnünk, hogy ez az opció csak korlátozott számban érhető el.<br/>"
            ],
            priceKey: "LATE"
        },
        {
            title: "Szponzor",
            body: [
               "A szponzor csomag tartalma:",
               `
                    <ul>
                        <li>
                            Az esemény posztere
                        </li>
                        <li>
                            Matricacsomag
                        </li>
                        <li>
                            Kitűző
                        </li>
                    </ul>
               `,
            ],
            priceKey: "SPONS"
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
                            Repohár a Nicobar felajánlásából
                        </li>
                        <li>
                            Különleges nyakpánt
                        </li>
                        <li>
                            Matricacsomag
                        </li>
                        <li>
                            Kitűző
                        </li>
                    </ul>
                `,
            ],
            priceKey: "SSPONS"
        },
        {
            title: "Napijegy",
            body: [
                "Azoknak, akik nem tudnak végig velünk lenni.<br/>",
                "Belépési lehetőség a rendezvény területére a választott napon 15:00 órától aznap 23:00 óráig.<br/>",
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
                            Regisztrációs csomag
                        </li>
                    </ul>
                `,
                "Fontos kiemelnünk, hogy ez az opció nem enged meg éjszakai tartózkodást!",
                "<b>Csak helyszínen vásárolható meg!</b><br/><br/>"
            ],
            priceKey: "DAILY"
        }
    ],
    outro: [
        `
        <span>
        Az egyes paneleken való részvétel a belépőjegy megvásárlásához kötött, további költséget nem rejt. Vannak azonban fakultatív programok, melyeket külső szolgáltató biztosít, így azok díjai további kiadást jelenthetnek a Résztvevők részére. Erről bővebb tájékoztatás a
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
        "Belépés a strandfürdő területére csak karszalaggal lehetséges. Ennek letéti díja fejenként 2 000 HUF, <b>mely a karszalag leadásakor visszajár!</b>",
        "Kérünk mindenkit, hogy a gördülékeny bejelentkezés érdekében készüljön megfelelő bankjegyekkel.",
    ]
}

export default ticket