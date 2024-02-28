import { IFAQ } from "@/models/locale/faq.model"

const faq: IFAQ = {
    cat1: {
        translation: 'categória 1',
        data: [
            {
                title: "Mi az \"Örli Försztivál\"?",
                content: [
                    "Az \"Örli Försztivál\" a furry szubkultúra iránt érdeklődők számára szervezett többnapos nemzetközi találkozó."
                ]
            },
            {
                title: "Szükséges-e regisztráció a részvételhez?",
                content: [
                    "Igen. Fontos, hogy megismerd és elfogadd a találkozó szabályzatát, üzleti feltételeit. Ennek hiányában sajnos nem tudunk beengedni a rendezvény területére."
                ]
            },
            {
                title: "Van-e korhatár a rendezvényen?",
                content: [
                    "A korhatár a rendezvény kezdetéig betöltött 18. életév. Amennyiben fiatalabb vagy és mindenképp részt szeretnél venni a találkozón, vedd fel a kapcsolatot a szervezőkkel!"
                ]
            },
            {
                title: "Mennyi időbe telik a befizetésem feldolgozása?",
                content: [
                    "A szervezők éjt nappallá téve azon fáradoznak, hogy a regisztráció során minden a lehető leggördülékenyebben menjen, azonban a befizetések feldolgozására 24 órás türelmet kérnek Tőled."
                ]
            },
        ],
    },

    cat2: {
        translation: 'categória 2',
        data: [
            {
                title: "Hol találok helyet hűtést igénylő ételeimnek, italaimnak?",
                content: [
                    "Az épületekben több konyha, hűtőszekrény is várja, hogy különböző termékekkel legyenek feltöltve. A kellemetlenségek elkerülése végett kérünk, hogy a kihelyezett eszközökkel egyértelműen jelöld meg finomságaidat és jegyezd meg, hogy hova pakoltad őket. Más ételeihez, italaihoz ne nyúlj, a hűtőszekrények hőfokát ne állítsd át!"
                ]
            },
            {
                title: "A kerti sütőhelyeket, grillezőket szabadon használhatom?",
                content: [
                    "A szabad kapacitástól függően a kerti sütőhelyek, grillezők, rácsok, bográcsok, eszközök, szószok, fűszerek, tűzifa és gyújtós bármikor szabadon használható. Ha nem vagy biztos tűzgyújtási képességeidben kérd a szervezők segítségét."
                ]
            },
            {
                title: "Hova halmozhatom a felgyülemlett hulladékot?",
                content: [
                    "A területen több kihelyezett szelektív hulladékgyűjtő sziget biztosít erre lehetőséget. Amennyiben valamelyik zsák megtelt, jelezd a szervezőknek!"
                ]
            },
            {
                title: "Behozható étel, ital a rendezvény területére?",
                content: [
                    "Igen. Sem mennyiségi, sem minőségi korlátozás nincs a rendezvény ideje alatt."
                ]
            },
        ],
    },

    cat3: {
        translation: 'categória 3',
        data: [
            {
                title: "Van-e italbár, büfé, melegétel árusítás a rendezvény területén?",
                content: [
                    "Saját bárunk, a NicoBar délutántól hajnalig gondoskodik róla, hogy torkod ne maradjon száraz. Az üdülő nem árusít élelmiszereket, így az korlátlan mennyiségben rendelhető vagy behozható a rendezvény területére."
                ]
            },
            {
                title: "Milyen adatokat kell megadnom a regisztráció során?",
                content: [
                    "Fontos, hogy a valós polgári nevet, nemzetiséget és születési dátumot, valamint használatban lévő e-mail címet adj meg regisztrációnál. Ezek valódiságát a rendezvényre érkezéskor ellenőrizhetjük, felhasználásukról az \"Adatkezelés\" menüpont alatt tájékozódhatsz. Hamisan közölt adatok esetén a szervezők megtagadhatják a belépést. Minden más adat tetszőleges, azok a találkozó résztvevőit és a szervezőket segítik egymás felismerésében valamint statisztikai jelentőséggel bír."
                ]
            },
            {
                title: "Hogyan tudom támogatni a rendezvényt?",
                content: [
                    "Örömmel fogadunk bármilyen támogatást, legyen az anyagi, erkölcsi, vagy fizikai jellegű. Amennyiben anyagilag szeretnél minket támogatni, azt a jegyválasztásnál tudod megtenni."
                ]
            },
            {
                title: "Velem jöhet-e kiskedvencem a rendezvényre?",
                content: [
                    "Igen, rendezvényünk helyszíne szívesen látja a házi kedvenceket. Amennyiben őt is magaddal hozod, kérünk vedd fel a kapcsolatot a szervezőkkel e-mailben vagy Telegramon."
                ]
            },
        ],
    },

    cat4: {
        translation: 'categória 4',
        data: [
            {
                title: "Lesz-e suitwalk?",
                content: [
                    "Szervezett, biztosított suitwalk nem része a programsorozatnak."
                ]
            },
            {
                title: "Mennyi időm van kifizetni a választott csomagot?",
                content: [
                    "A csomagok kiválasztásától számítva 7 napod áll rendelkezésre, de érkezésedig legkésőbb kell, hogy megérkezzen számunkra az összeg. Ellenkező esetben a kiválasztott csomagok törlődnek a rendszerünkből. Választott csomag kifizetése nélkül nem engedhetünk be a rendezvényre."
                ]
            },
            {
                title: "Hogyan tudok szobát foglalni?",
                content: [
                    "A szobafoglalás csak visszaigazolt fizetés esetén érhető el. A menete a következő:",
                    "A Szobák menüpontot megnyitva magad előtt látod a rendezvényhelyszín összes elérhető szobáját. Amennyiben nincs név a szobaszám mellett, úgy Tied a lehetőség, hogy belépj és a szoba adminisztrátora legyél. Elnevezheted a szobád, megadhasz egy PIN kódot, illetve a saját Telegram elérhetőséged is megoszthatod másokkal.",
                    "Ha nincs szabad szoba vagy másokhoz csatlakoznál, úgy a szobára kattintva adhatod meg annak PIN kódját, hogy beléphess.",
                    "Ha nem osztottak meg Veled PIN kódot, akkor a szoba adminisztrátorát kell felkeresned.",
                    "Ha adminisztrátorként lépsz ki egy szobából, akkor a rang a Téged időrendben követő következő tagra száll át. Ha a szoba kiürül, az adatok törlődnek rendszerünkből.",
                    "Ha egyedül vagy egy szobában, úgy 72 órád van szobatársat találni, ellenkező esetben a rendszer kiléptet a szobából."
                ]
            },
            {
                title: "Nem találok több üres szobát, de egyes szobákban van még szabad férőhely. Mit tudok tenni?",
                content: [
                    "Szobatársak kereséséhez használd a försztivál alábbi szobamegosztó Telegram csoportját: $https://t.me/+fsRN7t4bdJJlNzg0ß. Fontos, hogy mindenekelőtt olvasd végig a chat leírását és tartsd is be a szabályokat! Ha június 4 éjfélig nem találnál szobát, akkor a rendszerünk automatikusan be fog osztani a még szabad helyek valamelyikére."
                ]
            },
        ],
    },

    cat5: {
        translation: 'categória 5',
        data: [
            {
                title: "Mit tartalmaz a belépő?",
                content: [
                    "A különböző csomagok, opciók más-más lehetőségeket biztosítanak, így erről vásárlás előtt mindenképp tájékozódj az \"Árak\" menüpont alatt."
                ]
            },
            {
                title: "Kötelező-e reggelit választanom?",
                content: [
                    "Igen, mivel ez elválaszthatatlan része az éjszakai tartózkodásnak. Amennyiben nem kívánod a reggeli falatokat bízhatsz benne, hogy a választott fogás éhes szájakra fog találni."
                ]
            },
            {
                title: "Mikortól tudok belépni a rendezvény területére?",
                content: [
                    "Az újonnan érkezők számára 14 órakor nyitjuk meg a kapukat. Ez alól kivétel a nulladik nap, ahol 16 órától várjuk a résztvevőket."
                ]
            },
            {
                title: "Válthatok-e belépőt a helyszínen is?",
                content: [
                    "Igen, azonban a részvétel regisztrációhoz kötött. Csak akkor válthatsz jegyet a helyszínen, hogy elfogadod a szabályzatot és weboldalunkon keresztül regisztrálsz."
                ]
            },
        ],
    },

    cat6: {
        translation: 'categória 6',
        data: [
            {
                title: "Már kifizettem a belépőt, de mégsem tudok részt venni a rendezvényen. Mik a lehetőségeim?",
                content: [
                    "Kifizetett jegy visszatérítésére nincs lehetőség. Amennyiben másra ruháznád át belépődet mindenképp vegyétek fel mindketten a kapcsolatot a szervezőkkel."
                ]
            },
            {
                title: "Miért kell leadnom egy arcképes igazolványt bejelentkezéskor?",
                content: [
                    "Az igazolványok digitális rögzítésére a hatályos jogszabályok kötelezik a szállásadónkat. A leadott igazolványokat igyekszünk a lehető leghamarabb visszajuttatni a tulajdonosához."
                ]
            },
            {
                title: "Mit kell tudni a pihenőzónákról?",
                content: [
                    "Ezen kijelölt területek elsősorban a sátorral érkező vendégein számára vannak elkülönítve. Kérünk, hogy itt semmivel se zavard a nyugalmat, illetve szociális igényeidet az üdülő más részén igyekezz kielégíteni."
                ]
            },
            {
                title: "Van-e ingyenes internet-hozzáférés a helyszínen?",
                content: [
                    "Igen, a rendezvény résztvevői számára ingyenes Wi-Fi hozzáférés biztosított."
                ]
            },
        ],
    },

    cat7: {
        translation: 'categória 7',
        data: [
            {
                title: "Mit kell tudnom a sátrazásról?",
                content: [
                    "A sátrazásra a pihenőzónákban van lehetőség. Sátrazó vendégeinknek a tisztálkodásra a Vidra illetve a Fácán ház mosdóiban van lehetőség, valamint a kemping nyilvános mosdói is használhatóak. A terület több pontján is biztosított áramforrás. Fontos, hogy sátorról, ágyneműről és tisztálkodási felszerelésről mindenkinek saját felelőssége gondoskodnia!"
                ]
            },
            {
                title: "Járművel érkezem. Hol tudok parkolni?",
                content: [
                    "Járműveiteket zárt parkolóban az üdülő területén belül, illetve kint, a telek előtt kialakított helyen hagyhatjátok."
                ]
            },
            {
                title: "Hol kapok segítséget probléma esetén?",
                content: [
                    "A szervezők igyekeznek minden esetben segítséget nyújtani vagy megoldást találni a felmerült problémádra. Őket piros színű nyakpánt fogja jelezni a rendezvény ideje alatt."
                ]
            },
            {
                title: "Tudom-e fizetni egyszerre több személy csomagját is?",
                content: [
                    "Igen. Ez esetben fontos, hogy fizetés során minden személy azonosítója szerepeljen a megjegyzésben/közleményben, egyértelműen elválasztva. Az azonosítókat a szervezők nem adják ki harmadik személynek, így azt egymástól kell elkérnetek."
                ]
            },
        ],
    },

    cat8: {
        translation: 'categória 8',
        data: [
            {
                title: "Milyen eszközökkel tudok fizetni a rendezvény helyszínén?",
                content: [
                    "A rendezvény helyszínén kínált szolgáltatások jelenleg csak készpénzes fizetéssel téríthetőek meg. Elképzelhető azonban, hogy a jövőben más fizetőeszközöket is fogadni tudunk."
                ]
            },
            {
                title: "Mi a maximális létszám, melyet a helyszín fogadni tud?",
                content: [
                    "A helyszínen összesen 90 fő helyezhető el a szobákban és további 60 főre van kapacitás a kemping területén."
                ]
            },
            {
                title: "Miért lehetnek korlátozva a lehetőségeim a rendezvény közösségi felületein, chatszobáiban?",
                content: [
                    "Valószínűleg korábbi viselkedésed, esetleg egy korábbi kijelentésed eredménye a korlátozás. A rendezvény szervezői ügyelnek a diszkrécióra, így a korlátozással kapcsolatban csakis személyes megkeresés esetén adnak részletes indoklást. A hasonló esetek megelőzése érdekében kérünk, hogy alaposan tanulmányozd át a Szabályzatunkat."
                ]
            }
        ]
    }
}

export default faq