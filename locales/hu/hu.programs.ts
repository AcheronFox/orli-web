import { IProgram } from "@/models/locale/program.model";

const programs: IProgram = {
    intro: [
        "A korábbi rendezvényekhez hasonlóan idén is széles programkínálattal jelentkezünk és igyekszünk mindenki számára tartalmas és eseménydús kikapcsolódást biztosítani.",
        "Az alábbi listába szedtük össze a találkozó helyszínén fellelhető folyamatos vagy egyszeri időtöltési lehetőségeket.",
        `<span>
            Hiányolsz egy programot? Esetleg új ötleted van, amit szeretnél megvalósítani? Vedd fel a kapcsolatot a szervezőkkel az,
            <Button 
                variant="text"
                link="mailto:orlifurstival@gmail.com"
            >
                orlifurstival@gmail.com
            </Button>
            címen!
        </span>`,
    ],
    content: [
        "<h4>Nagyszínpad</h4>",
        `<span>
            Ez a hely a försztivál lelke! Minden nap kora délutántól hajnalig itt zajlanak a kiemelt események és itt lépnek fel előadóink. Számtalan változatos program helyszíne, melyekről a Conbookban olvashatsz majd részletesen. Látni, hallani és érezni fogod!
        </span>`,
        "<br/>",

        "<h4>NicoBar</h4>",
        `<span>
            Ahogy száll le az este és emelkedik a hangulat a bulinegyedben úgy nyitja meg kapuit a Fejér vármegye legjobb koktélbárja, a NicoBar ahol tiki koktélok és különlegesebb italok várnak!<br/>
            Neked mi a kedvenced amit szívesen látnál az itallapon?
        </span>`,
        "<br/>",

        "<h4>Suitlounge</h4>",
        `<span>
            Megpihennél suitolás közben? A suitlounge mindig tárt kapukkal vár, ahol a megfelelő szellőztetés mellett különböző frissítők és fogyasztható energia biztosítja, hogy legyen elég erőd tovább tombolni. A belépés csak suiterek és kísérőik számára megengedett. Ezen a helyen nem engedjük fotók és videók készítését.
        </span>`,
        "<br/>",

        "<h4>Alkotói Negyed</h4>",
        `<span>
            Kedvenc alkotóid és mindazok, akiket még nem ismersz alig várják, hogy megtekintsd alkotásaikat és kézzel fogható emlékeket ragadj magadhoz! Talán itt kötsz üzletet életed suitjára vagy épp egy csodálatos műalkotásra. Azért a pénztárcád legyen Nálad!<br/>
            Idén az Alkotói Negyed egy szolidabb, egyszerűbb, de annál kreatívabb formát ölt. Nem csak kereskedőket várunk, alkotókat, szolgáltatókat, akik csatlakoznak egy darab papírral és ceruzával vagy egy mókás ötlettel, hogy feldobják bárki napját. Egy kreatív sarok péntek és szombat délután a Vidra házban.
        </span>`,
        "<br/>",

        "<h4>Tombola</h4>",
        `<span>
            Itt a szerencsén múlik minden. Keresd fel a tombolanyeremények asztalát az Alkotói Negyedben, nézz ki magadnak egy nyereményt és ne késlekedj megvenni a szelvényeket!
        </span>`,
        "<br/>",

        "<h4>Strand</h4>",
        `<span>
            Ha nyár, akkor vízpart! Csobbanj egyet a Velencei-tó hűsítő hullámaiban, élvezd a vizet és a napfényt! A strandra a belépés nyitvatartási időben korlátlan!<br/>
            A strand területe kizárólag nyitvatartási időben és csak az erre jogosító karszalaggal látogatható. Karszalagot a regisztrációnál tudsz kérni, melynek letéti díja 1000 HUF.
        </span>`,
        "<br/>",

        "<h4>Jacuzzi</h4>",
        `<span>
            Relaxálnál a langyos víz habjaiban? Már a försztiválon is megteheted, miközben előtted tombol egész Vibe City!
        </span>`,
        "<br/>",

        "<h4>Grill</h4>",
        `<span>
            A program, amit egyszer minden försztiválozó tuti meg fog látogatni. Minden nap délutántól hajnalig lobog a tűz és sülhetnek a finom falatok. Ez a program persze időjárásfüggő...<br/>
            A tüzelőről, eszközökről és a némi fűszerekről, sőt, szószokról a készlet erejéig mi gondoskodunk, Neked csak a főzni vagy sütnivalókat kell hoznod!
        </span>`,
        "<br/>",

        "<h4>Társasjáték sarok</h4>",
        `<span>
            Hozd el kedvenc játékod és üljetek össze versengeni vagy szövetkezni valamelyik teraszon vagy épp kalandozzatok egy eldugott pihenő árnyai alatt.
        </span>`,
        "<br/>",

        "<h4>Fursuit parádé</h4>",
        `<span>
            Fursuitot fel! Ezen a délutánon összegyűlik minden bundás, készülnek a fotók, videók és csoportképek, elkápráztatjuk a környéket.
        </span>`,
        "<br/>",

        "<h4>Velencei-tó kerülés</h4>",
        `<span>
            Egy kényelmes, körülbelül 30 km-es kerékpártúra frissítő megállókkal a tó körül, mely 5-6 órát vesz igénybe. Amennyiben nincs saját kerékpárod, lesz lehetőséged a helyszínen bérelni. Ezt az igényt legkésőbb 10 nappal a rendezvény kezdete előtt jelezned kell Galinak!<br/>
            A kerékpárod felkészítéséről és annak esetleges útközbeni javításáról magadnak kell gondoskodnod! Biztos vagyok benne hogy sokunknál lesz szerszám vagy defekt javító szett és természetesen segítünk, megvárunk, de ettől függetlenül érkezzetek felkészülten!<br/>
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

        "<h4>Sportbajnokság</h4>",
        `<span>
            Versengj a többiekkel, szállj ringbe a győzelemért a csocsó vagy a ping-pong bajnokságon, hogy végül a legkomolyabb kihívással Te szállhass szembe<br/>
            Jelentkezés a játékokra a regisztrációnál lehetséges.
        </span>`,
        "<br/>",

        "<h4>Fursuit Games</h4>",
        `<span>
            Mókás és kreatív játékok pár fős csoportokban csak suiterek számára. Mennyire tudsz játszani? Péntek délután kiderül!
        </span>`,
        "<br/>",

        "<h4>Fotózás</h4>",
        `<span>
            Nagy a mancsod és nehéz a szelfibot? A fesztivál ideje alatt keressétek a ShutterFurs csapatát és foglaljatok időpontot egyéni vagy kis csoportos fotózásra!<br/>
            Ajánlott időpont közvetlenül naplemente (golden hour)!
        </span>`,
        "<br/>",

        "<h4>Kívánságműsor és Piknik</h4>",
        `<span>
            Ismerős a meme: "Mi lenne az első zeneszám amit meghallgatnál ezen a hangrendszeren?"<br/>
            Minden délután -amíg nem játszik DJ- a szabadtéri piknik ideje alatt kérhetitek kedvenc zeneszámaitokat Galitól, hogy tegye be a nagyszínpadon. Kérlek válasszatok Spotifyról amiből közös playlistet készítünk és megosztjuk a fesztivál után. Törekedjetek arra, hogy a jó ízlés határain belül maradjunk és 1-1 szám ne töltsön ki túl sok időt, hogy minél több mindent meghallgathassunk a kedvenceitek közül!
        </span>`,
        "<br/>",

        "<h4>Konzolsarok</h4>",
        `<span>
            Egy régi ismerős, egy játék, mely a rendezvény idei témáját ihlette. Ha egy kicsit elvonulnál vagy ha hiányzik a képernyő keresd fel a Konzolsarkot a Vidra házban.
        </span>`,
        "<br/>",

        "<h4>Kacsavadászat</h4>",
        `<span>
            A rendezvény területén elbújt 140 pici, sárga gumikacsa. Ha megtaláljátok őket, naponta változó értékes ajándékokat kaphattok értük.
        </span>`,
        "<br/>",

        "<h4>Just Dance</h4>",
        `<span>
            Tánc? Igen! Egyedül vagy csapatban, kövesd a mozdulatokat, repülj vagy pörögj az arcodon minden nap este 9 és 11 között a Vidra házban!
        </span>`,
        "<br/>",

        "<h4>Finomságexpo</h4>",
        `<span>
            Megosztanál másokkal egy jól elkészített finomságot? Bemutatnád kedvenc söröd vagy borod? Erőspaprikát nemesítesz vagy likőrt főzöl? Itt bármilyen eredeti vagy szokatlan eleségnek helyet adunk. Oszd meg Te is másokkal!
        </span>`,
        "<br/>",

        "<h4>Színelmélet</h4>",
        `<span>
            Töprengtél azon, hogy a furry karakterek miért néznek ki olyan jól a médiában? Miért van meghatározott mintája egyes fajoknak és miért a kültakarót vesszük szemügyre először? Derítsd ki az előadáson!
        </span>`,
        "<br/>",

        "<h4>Szervezés: Kérdések és válaszok</h4>",
        `<span>
            "Csak kiírom a találkozót, jöttök és jó lesz!" Aha... Ha érdekel, hogy mennyivel több egy conszervezés és miért csináltuk mindazt, amit idén elétek került látogass el az előadásra.
        </span>`

    ]   
}

export default programs