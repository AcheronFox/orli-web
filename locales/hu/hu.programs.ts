import { IProgram } from "@/models/locale/program.model";

const programs: IProgram = {
    intro: [
        "A korábbi rendezvényekhez hasonlóan idén is széles programkínálattal jelentkezünk és igyekszünk mindenki számára tartalmas és eseménydús kikapcsolódást biztosítani.",
        "Az alábbi listába szedtük össze a találkozó helyszínén fellelhető folyamatos vagy egyszeri időtöltési lehetőségeket.",
        `<span>
        Hiányolsz egy programot? Esetleg új ötleted van, amit szeretnél megvalósítani? Vedd fel a kapcsolatot a Szervezőkkel e-mailben: 
            <Button 
                variant="text"
                link="mailto:orlifurstival@gmail.com"
            >
                orlifurstival@gmail.com
            </Button>
            vagy Telegramon
        </span>`,
    ],
    body: [
        "<h4>Nagyszínpad</h4>",
        `<span>
            Ez a hely a försztivál lelke! Minden nap kora délutántól hajnalig itt zajlanak a kiemelt események és itt lépnek fel előadóink. Számtalan változatos program helyszíne, melyekről a Conbookban olvashatsz majd részletesen. Látni, hallani és érezni fogod!
        </span>`,
        "<br/>",

        "<h4>NicoBar</h4>",
        `<span>
            Ahogy száll le az este és fokozódik a hangulat a szigeten úgy nyitja meg kapuit a Fejér vármegye legjobb koktélbárja, a NicoBar ahol igazi tiki koktélok és számtalan italkülönlegesség vár!<br/>
            Neked mi a kedvenced amit szívesen látnál az itallapon?
        </span>`,
    ],
    content: [
        {
            title: "Suitlounge",
            body: [
                `<span>
                    Megpihennél suitolás közben? A suitlounge mindig tárt kapukkal vár, ahol a megfelelő szellőztetés mellett különböző frissítők és apró harapnivaló biztosítja, hogy legyen elég erőd tovább tombolni.  A belépés csak suiterek és kísérőik számára megengedett. Ezen a helyen nem engedjük fotók és videók készítését.
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Alkotói Sarok",
            body: [
                `<span>
                    Kedvenc alkotóid mellett azok, akiket még nem is ismersz alig várják, hogy megtekintsd alkotásaikat és kézzel fogható emlékeket ragadj magadhoz! Talán itt kötsz üzletet életed suitjára vagy épp egy csodálatos műalkotásra. A pénztárcád legyen Nálad!<br/><br/>
                    Idén az Alkotói Negyed egy szolidabb, egyszerűbb, de annál kreatívabb formát ölt. Nem csak kereskedőket várunk, alkotókat, szolgáltatókat, akik csatlakoznak egy darab papírral és ceruzával vagy egy mókás ötlettel, hogy feldobják bárki napját.
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Jótékonysági aukció",
            body: [
                `<span>
                    Idén először egy karitatív szervezet számára szervezünk gyűjtést, ezzel segítve áldozatos munkájukat. Az aukción befolyt teljes összeg az ő részükre lesz eljuttatva. Bízunk benne, hogy az értékes felajánlások, emléktárgyak közt Te is megtalálod, ami számodra a legkedvesebb. Szállj versenybe érte!
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Strand",
            body: [
                `<span>
                    Ha nyár, akkor vízpart! Csobbanj egyet a Velencei-tó hűsítő hullámaiban, élvezd a vizet és a napfényt! A strandra a belépés nyitvatartási időben korlátlan, <b>de a csuklópánt viselése kötelező!</b><br/><br/>
                    A strand területe kizárólag nyitvatartási időben és csak az erre jogosító csuklópánttal látogatható. Csuklópántot a regisztrációnál tudsz kérni, melynek letéti díja 2000 HUF.
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Jacuzzi",
            body: [
                `<span>
                    Relaxálnál a langyos víz habjaiban? E központi helyről kényelmesen figyelheted a sziget nyüzsgését, szellemeinek tombolását.
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Grill",
            body: [
                `<span>
                    A program, amit egyszer minden försztiválozó tuti meg fog látogatni. Minden nap délutántól hajnalig lobog a tűz és sülhetnek a finom falatok, na persze ha az időjárás is ezt jóvá hagyja.<br/><br/>
                    A tüzelőről, eszközökről és a némi fűszerekről, sőt, szószokról a készlet erejéig mi gondoskodunk, Neked csak a főzni vagy sütnivalókat kell hoznod!
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Társasjáték sarok",
            body: [
                `<span>
                    Hozd el kedvenc játékod és üljetek össze versengeni vagy szövetkezni valamelyik teraszon vagy épp kalandozzatok egy eldugott pihenő árnyai alatt.
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Fursuit parádé",
            body: [
                `<span>
                    Fursuitot fel! A fénypont, amikor összegyűlik minden bundás, készülnek a fotók, videók és csoportképek, elkápráztatjuk a környéket.
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Velencei-tó kerülés kerékpárral",
            body: [
                `<span>
                    Egy kényelmes, körülbelül 30 km-es kerékpártúra frissítő megállókkal a tó körül, mely 5-6 órát vesz igénybe. Amennyiben nincs saját kerékpárod, lesz lehetőséged a helyszínen bérelni. Ezt az igényt legkésőbb 10 nappal a rendezvény kezdete előtt jelezned kell a Szervezők felé e-mailben vagy Telegramon.<br/><br/>
                    A kerékpárod felkészítéséről és annak esetleges útközbeni javításáról magadnak kell gondoskodnod! Biztosak vagyunk benne hogy sokunknál lesz szerszám vagy defekt javító szett és természetesen segítünk, megvárunk, de ettől függetlenül érkezzetek felkészülten!<br/><br/>
                    Térkép a tervezett útvonalról és információk a látványosságokról:
                    <Button 
                        variant="text"
                        target="_blank"
                        link="https://velenceitokor.hu/"
                    >
                        Velencei Tó Kör
                    </Button>
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Sportbajnokság",
            body: [
                `<span>
                    Versengj a többiekkel, szállj ringbe a győzelemért a csocsó vagy a ping-pong bajnokságon, hogy végül a legkomolyabb kihívással Te szállhass szembe<br/><br/>
                    Jelentkezés a játékokra a regisztrációnál lehetséges.
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Fursuit Games",
            body: [
                `<span>
                    Mókás és kreatív játékok pár fős csoportokban csak suiterek számára. Jelentkezés a regisztrációnál lehetésges.
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Fotózás",
            body: [
                `<span>
                    Nagy a mancsod és nehéz a szelfibot? A fesztivál ideje alatt keressétek a ShutterFurs csapatát és foglaljatok időpontot egyéni vagy kis csoportos fotózásra!<br/><br/>
                    Ajánlott időpont közvetlenül naplemente (golden hour)!
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Kívánságműsor és Piknik",
            body: [
                `<span>
                    Ismerős a meme: "Mi lenne az első zeneszám amit meghallgatnál ezen a hangrendszeren?"<br/><br/>
                    Minden délután -amíg nem játszik DJ- a szabadtéri piknik ideje alatt kérhetitek kedvenc zeneszámaitokat Galitól, hogy tegye be a nagyszínpadon. Kérlek válasszatok Spotifyról amiből közös playlistet készítünk és megosztjuk a fesztivál után. Törekedjetek arra, hogy a jó ízlés határain belül maradjunk és 1-1 szám ne töltsön ki túl sok időt, hogy minél több mindent meghallgathassunk a kedvenceitek közül!
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Konzolsarok",
            body: [
                `<span>
                    Egy régi ismerős, pár játék, mely magányos kikapcsolódást ígér. Ha egy kicsit elvonulnál vagy ha hiányzik a képernyő keresd fel a Konzolsarkot a Vidra házban. 
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Finomságexpo",
            body: [
                `<span>
                    Megosztanál másokkal egy jól elkészített finomságot? Bemutatnád kedvenc söröd vagy borod? Erőspaprikát nemesítesz vagy likőrt főzöl? Itt bármilyen eredeti vagy szokatlan eleségnek helyet adunk. Oszd meg Te is másokkal!
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Testépítésről őszintén (Metus)",
            body: [
                `<span>
                    Szó lesz tényekről, mítoszokról, képzetekről, szerekről és szó lesz a sportokról úgy egészében és az étkezésről. Mindemellett számos tényről amit az évek alatt megtapasztaltam, hallottam, mások tanácsoltak, mások átéltek és mindenről ami ahhoz volt szükséges, hogy most itt lehessek és ezt elmondhassam nektek.
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Az \"ÖRLI\". (Maszat)",
            body: [
                `<span>
                    Honnan indult a rendezvény, mik voltak a mérföldkövek és merre tart a jövőben?<br/>
                    Könnyed időutazás, ahol a történelemóra mellett beszélünk arról is, hogy mi a recept és mire van nagy szükség a további előrelépéshez.
                </span>`
            ]
        }
    ] 
}

export default programs