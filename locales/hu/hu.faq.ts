import { IFAQ } from "@/models/locale/faq.model"

const faq: IFAQ = {
    general: {
        translation: 'Általános',
        data: [
            {
                title: "Mi az \"Örli Försztivál\"?",
                content: [
                    "Az \"Örli Försztivál\" a furry szubkultúra iránt érdeklődők számára szervezett többnapos nemzetközi találkozó."
                ]
            },
            {
                title: "Mit tartalmaz a belépő?",
                content: [
                    "A különböző csomagok, opciók más-más lehetőségeket biztosítanak, így erről vásárlás előtt mindenképp tájékozódj az \"Árak\" menüpont alatt!"
                ]
            },
            {
                title: "Lesz-e suitwalk?",
                content: [
                    "Az üdülőn kívülre szervezett, biztosított suitwalk nem része a programkínálatnak."
                ]
            },
            {
                title: "Behozható étel, ital a rendezvény területére?",
                content: [
                    "Igen. Sem mennyiségi, sem minőségi korlátozás nincs a rendezvény ideje alatt."
                ]
            },
            {
                title: "Velem jöhet-e kiskedvencem a rendezvényre?",
                content: [
                    "Igen, rendezvényünk helyszíne szívesen látja a házi kedvenceket. Amennyiben őt is magaddal hozod, jelezd ezt a regisztráció során vagy vedd fel a kapcsolatot a Szervezőkkel e-mailben vagy Telegramon."
                ]
            },
            {
                title: "Mikortól tudok belépni a rendezvény területére?",
                content: [
                    "Az újonnan érkezők számára 15 órakor nyitjuk meg a kapukat, ez után lehet bejelentkezni és a szállást elfoglalni. Kérünk mindenkit, hogy ehhez igazítsa érkezését!"
                ]
            },
            {
                title: "Hol kapok segítséget probléma esetén?",
                content: [
                    "A Szervezők igyekeznek minden esetben segítséget nyújtani vagy megoldást találni a felmerült problémádra. <b>Őket <span style=\"color: #ff0000\">piros</span> színű nyakpánt fogja jelezni a rendezvény ideje alatt.</b>"
                ]
            },
            {
                title: "Miért lehetnek korlátozva a lehetőségeim a rendezvény közösségi felületein, chatszobáiban?",
                content: [
                    "Valószínűleg korábbi viselkedésed, esetleg egy korábbi kijelentésed eredménye a korlátozás. A rendezvény Szervezői ügyelnek a diszkrécióra, így a korlátozással kapcsolatban csakis személyes megkeresés esetén adnak részletes indoklást. A hasonló esetek megelőzése érdekében kérünk, hogy alaposan tanulmányozd át a Szabályzatunkat."
                ]
            }
        ],
    },
    
    registration: {
        translation: 'Regisztráció',
        data: [
            {
                title: "Szükséges-e regisztráció a részvételhez?",
                content: [
                    "Igen. Fontos, hogy megismerd és elfogadd a találkozó teljes szabályzatát, melyet a regisztráció folyamán igazolnod is kell. Ennek hiányában sajnos nem tudunk beengedni a rendezvény területére."
                ]
            },
            {
                title: "Van-e korhatár a rendezvényen?",
                content: [
                    "A korhatár a rendezvény kezdetéig betöltött 18. életév. Ezen szabály alól indokolt esetben három Szervező együttes beleegyezése, valamint egy kitöltött és hitelesített szülői hozzájárulás adhat felmentést."
                ]
            },
            {
                title: "Milyen adatokat kell megadnom a regisztráció során?",
                content: [
                    "Fontos, hogy valós polgári nevet, nemzetiséget, születési dátumot, valamint használatban lévő e-mail címet adj meg regisztrációnál. Ezek valódiságát a rendezvényre érkezéskor ellenőrizhetjük, felhasználásukról az \"Adatkezelés\" menüpont alatt tájékozódhatsz. Hamisan közölt adatok esetén a szervezők megtagadhatják a belépést. Minden más adat tetszőleges, azok a találkozó résztvevőit és a Szervezőket segítik egymás felismerésében valamint statisztikai jelentőséggel bír."
                ]
            },
            {
                title: "Miért kell érkezéskor leadnom egy arcképes igazolványt bejelentkezéskor?",
                content: [
                    "Az igazolványok digitális rögzítésére a hatályos jogszabályok kötelezik a szállásadónkat. Az igazolványokat továbbítjuk a szállásadónk felé, a leadott igazolványokat igyekszünk a lehető leghamarabb visszajuttatni a tulajdonosához."
                ]
            },
            {
                title: "Válthatok belépőt a helyszínen is?",
                content: [
                    "Igen, azonban a részvétel regisztrációhoz kötött. Csak akkor válthatsz jegyet a helyszínen, ha elfogadod a szabályzatot és weboldalunkon keresztül regisztrálsz."
                ]
            },
            {
                title: "Kötelező-e reggelit választanom?",
                content: [
                    "Igen, mivel ez a szolgáltatáscsomag részét képezi. Amennyiben nem kívánsz élni a lehetőséggel jótékony felajánlásod mások szívesen fogadják. Ételérzékenység esetén jelezd ezt a regisztráció során vagy vedd fel a kapcsolatot a Szervezőkkel e-mailben vagy Telegramon."
                ]
            }
        ],
    },
    
    financial: {
        translation: 'Pénzügy',
        data: [
            {
                title: "Mennyi időm van kifizetni a választott csomagot?",
                content: [
                    "A szolgáltatás megrendelésétől számítva 7 naptári nap áll rendelkezésedre, de legkésőbb érkezésedig meg kell, hogy érkezzen számunkra az összeg. Ellenkező esetben a kiválasztott csomagok törlődnek a rendszerünkből. Választott csomag kifizetése nélkül nem engedhetünk be a rendezvényre."
                ]
            },
            {
                title: "Mennyi időbe telik a befizetésem feldolgozása?",
                content: [
                    "A Szervezők éjt nappallá téve azon dolgoznak, hogy a regisztráció során minden a lehető leggördülékenyebben menjen. A befizetések feldolgozása általában gyorsan történik, azonban a regisztráció nyitásakor elképzelhető, hogy ez több időt is igénybe vehet. A Szervezők a problémamentes befizetés esetén 12 órán belül igyekeznek azt feldolgozni."
                ]
            },
            {
                title: "Tudom-e fizetni egyszerre több személy csomagját is?",
                content: [
                    "Igen. Ez esetben fontos, hogy fizetés során minden személy azonosítója szerepeljen a megjegyzésben/közleményben, egyértelműen elválasztva. A Szervezők nem adják ki harmadik személy számára mások azonosítóját, így azt egymástól kell elkérnetek."
                ]
            },
            {
                title: "Már kifizettem a választott csomagot, de mégsem tudok részt venni a rendezvényen. Mik a lehetőségeim?",
                content: [
                    "A kifizetett csomag visszatérítésére nincs lehetőség. Amennyiben másra ruháznád át választott csomag tartalmát fontos, hogy vegyétek fel <b>mindketten</b> a kapcsolatot a Szervezőkkel!"
                ]
            },
            {
                title: "Hogyan tudom támogatni a rendezvényt?",
                content: [
                    "Örömmel fogadunk bármilyen támogatást, legyen az anyagi, erkölcsi, vagy fizikai jellegű. Amennyiben anyagilag szeretnél minket támogatni, azt a jegyválasztásnál tudod megtenni."
                ]
            }
        ],
    },

    accom: {
        translation: 'Szállás',
        data: [
            {
                title: "Hogyan tudok szobát foglalni?",
                content: [
                    "A szobafoglalás csak visszaigazolt befizetés után érhető el, az alábbiakat követve:<br/>",
                    "Bejelentkezés után a Profil oldalt megnyitva a Szobák menüpont alatt érhető el a rendezvényhelyszín összes szobája.",
                    "Ha nincs név egy szobaszám mellett, az szabad, beléphetsz és az adminisztrátora lehetsz. Ezt követően elnevezheted, PIN kódot rendelhetsz hozzá, emellett a saját Telegram elérhetőséged is megoszthatod a szobánál.",
                    "Ha nincs már szabad szoba másokhoz kell csatlakoznod. Ezt megteheted, ha a szobára kattintva megadod annak PIN kódját.",
                    "Ha nem osztottak meg veled PIN kódot, akkor egy szoba adminisztrátorát kell felkeresned.",
                    "Ha adminisztrátorként kilész egy szobából, akkor a rang az időrendben utánad belépő résztvevőre száll át. Ha a szoba kiürül, az eddigi adatai törlődnek rendszerünkből.",
                    "Ha egyedül vagy egy szobában, úgy 72 órád van szobatársat találni, ellenkező esetben a rendszer kiléptet a szobából."
                ]
            },
            {
                title: "Nem találok több üres szobát, de egyes szobákban van még szabad férőhely. Hogy találok férőhelyet?",
                content: [
                    "Szobatársak kereséséhez használd a försztivál alábbi szobamegosztó Telegram csoportját: <Button link=\"https://t.me/+fsRN7t4bdJJlNzg0\" target=\"_blank\" variant=\"text\">Link</Button>",
                    "Fontos, hogy mindenekelőtt olvasd végig a chat leírását és tartsd is be a szabályokat!",
                    "Ha a határidő lejártáig nem találnál szobát, akkor a rendszerünk automatikusan be fog osztani a még szabad helyek valamelyikére."
                ]
            },
            {
                title: "Mit kell tudnom a sátrazásról?",
                content: [
                    "Sátrazásra a pihenőzónákban van lehetőség. Sátrazó vendégeinknek a tisztálkodásra a Vidra illetve a Fácán ház mosdóiban van lehetőség, valamint a kemping nyilvános mosdói is használhatóak. A terület több pontján is biztosított áramforrás. Fontos, hogy sátorról, ágyneműről és tisztálkodási felszerelésről mindenkinek saját felelőssége gondoskodnia!"
                ]
            }
        ],
    },

    location: {
        translation: 'Helyszín',
        data: [
            {
                title: "Mi a maximális létszám, melyet a helyszín fogadni tud?",
                content: [
                    "A helyszínen összesen 90 fő helyezhető el a szobákban és további 80 főre van kapacitás a kemping területén."
                ]
            },
            {
                title: "Milyen eszközökkel tudok fizetni a rendezvény helyszínén?",
                content: [
                    "A rendezvény helyszínén kínált szolgáltatások jelenleg csak készpénzes fizetéssel téríthetőek meg. Elképzelhető azonban, hogy a jövőben más fizetőeszközöket is fogadni tudunk."
                ]
            },
            {
                title: "Járművel érkezem. Hol tudok parkolni?",
                content: [
                    "Járműveiteket korlátozott számban az üdülő belső, zárt parkolójában, illetve kint, a telek előtt kialakított helyen hagyhatjátok."
                ]
            },
            {
                title: "Van-e ingyenes internet-hozzáférés a helyszínen?",
                content: [
                    "Igen, a rendezvény résztvevői számára ingyenes Wi-Fi hozzáférés biztosított."
                ]
            },
            {
                title: "Van-e italbár, büfé, melegétel árusítás a rendezvény területén?",
                content: [
                    "Saját bárunk, a NicoBar délutántól hajnalig árusít italokat a résztvevők számára. Az üdülő nem árusít élelmiszereket, így az korlátlan mennyiségben rendelhető vagy behozható a rendezvény területére."
                ]
            },
            {
                title: "Hol találok helyet hűtést igénylő ételeimnek, italaimnak?",
                content: [
                    "Az épületek konyháiban vagy a közös étkezőben több közös használatú hűtőszekrény ad lehetőséget az ételek, italok hidegen tartására. A kellemetlenségek elkerülése végett kérünk, hogy a kihelyezett eszközökkel egyértelműen jelöld meg tulajdonod és jegyezd meg, hogy hova pakoltad őket. Kérünk, hogy tartsd tiszteletben mások tulajdonát, a hűtőszekrények hőfokát ne állítsd át!"
                ]
            },
            {
                title: "A kerti sütőhelyeket, grillezőket szabadon használhatom?",
                content: [
                    "A szabad kapacitástól függően a kerti sütőhelyek, grillezők, rácsok, bográcsok, eszközök, szószok, fűszerek, tűzifa és gyújtós bármikor szabadon használható. Ha nem vagy biztos tűzgyújtási képességeidben kérd a Szervezők vagy az Önkéntesek segítségét."
                ]
            },
            {
                title: "Hova halmozhatom a felgyülemlett hulladékot?",
                content: [
                    "A területen több kihelyezett szelektív hulladékgyűjtő sziget biztosít erre lehetőséget. Amennyiben valamelyik zsák megtelt, jelezd a Szervezőknek vagy az Önkénteseknek!"
                ]
            },
            {
                title: "Mik a pihenőzónák?",
                content: [
                    "Ezen kijelölt területek elsősorban a sátorral érkező vendégein számára vannak elkülönítve. Kérünk, hogy itt semmivel se zavard a nyugalmat, illetve szociális igényeidet az üdülő más részén igyekezz kielégíteni."
                ]
            }
        ],
    },
}

export default faq