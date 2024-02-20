import { IProgram } from "@/models/locale/program.model";

const programs: IProgram = {
    intro: [
        "Just as in previous events, this year we will also offer a wide range of activities while trying to provide a meaningful and fulfilling experience for everyone.",
        "Below we have compiled the following list of ongoing or one-off activities available at the meeting venue.",
        `<span>
            Missing a program? Or maybe you have a new idea that you would want to implement? Contact the organizers at the following e-mail address:
            <Button 
                variant="text"
                link="mailto:orlifurstival@gmail.com"
            >
                orlifurstival@gmail.com
            </Button>
            !
        </span>`,
    ],
    body: [
        "<h4>Main Stage</h4>",
        `<span>
            This place is the soul of the försztivál! Every day from early afternoon until dawn, this is where all the main events will take place, and where our performers will perform. It is the venue for a wide variety of events, details of which you will find in the Conbook. You will see, hear, and feel all of it!
        </span>`,
        "<br/>",

        "<h4>NicoBar</h4>",
        `<span>
            The sun is setting, the music starts to rumble, lights came on in the party district with the night warming up the best cocktail bar in Fejér county, the NicoBar opens its doors serving Tiki cocktails and other specialities!<br/>
            What is your favourite cocktail that you would like to see on the menu?
        </span>`,
    ],
    content: [
        {
            title: "Suitlounge",
            body: [
                `<span>
                    Would you take a break while fursuiting? The suitlounge is always open, with a well-ventilated area and a wide range of refreshments and energy drinks that will keep you going. Access is restricted to fursuiters and their attendants only. No photos or videos are allowed in this area.
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Artist Alley",
            body: [
                `<span>
                    Your favourite artists and all those you don't know yet are eager for you to visit their booth and to grab tangible memories from them! Maybe you will get a deal here on the fursuit of your dreams or get a wonderful piece of art. Keep your wallet close, just in case!<br/><br/>
                    This year, the Artist Alley takes a more solid, simple but creative form. We're not only welcoming dealers, but we're also welcoming creators and suppliers to join in with either a piece of paper and a pencil or any fun idea that will brighten up anyone's day. A creative corner on Friday and Saturday afternoons at the Vidra House.
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Raffle",
            body: [
                `<span>
                    It's all down to luck here. Visit the raffle table in the Artist Alley, look for a prize of your liking and don't delay on buying your tickets!
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Beach",
            body: [
                `<span>
                    If it's summer, then it's the waterfront! Jump right in the cooling waves of Lake Velence, enjoy the water and the sunshine! Access to the beach is unlimited during its opening hours!<br/><br/>
                    The beach area is only open during its opening hours and only with a valid wristband. You can ask for a wristband at the registration desk for a deposit fee of 1000 HUF.
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Jacuzzi",
            body: [
                `<span>
                    Would you like to relax in the foams of lukewarm water? Now you can do it on försztivál, while the whole of Vibe City is partying right in front of you!
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Grill",
            body: [
                `<span>
                    The program that all försztivál attendees will definitely visit at least once. Every day from noon until dawn, the fire will be lit, and all the delicious food will be roasted on it. This program is of course weather dependent...<br/><br/>
                    We will provide the firewood, utensils, and even some spices and sauces as long as we have them in stock, you just need to bring what you want to cook or grill!
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Board Game Den",
            body: [
                `<span>
                    Bring your favourite game with you, form teams and dungeon groups to play together, there are plenty of good places to play whether it be on one of the terraces, under a shade of a tree or in a nearby gazebo.
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Fursuit Parade",
            body: [
                `<span>
                    Put on your Fursuit! This afternoon, all the furries will gather. Photos, videos and eventually a group photo will be taken, we will dazzle the neighbourhood.
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Biking around Lake Velence",
            body: [
                `<span>
                    A comfortable bicycle ride in the length of 30 kilometres with some refreshment stops around the whole lake, taking around 5-6 hours. If you do not have your own bike with you, then you will have the opportunity to rent one on the site. You need to notify Gali of this request no later than 10 days before the start of the event!<br/><br/>
                    You must take care of your bike and deal with any repairs if needed on the way! I'm sure that many of us will have tools or puncture repair kits on hand and we will help you and wait for you if needed, but please come in prepared just in case!<br/><br/><br/>
                    Map of the planned route and information about all the sights:
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
            title: "Sports Championship",
            body: [
                `<span>
                    Compete with others, enter the battle to win the table foosball or the ping-pong tournament where you will have to take on the toughest challenger at the end!<br/><br/>
                    You can sign up for the games during registration.
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Fursuit Games",
            body: [
                `<span>
                    Fun and creative games in small groups for fursuites only. How well can you play? Find out on Friday afternoon!
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Photography",
            body: [
                `<span>
                    Your paws are too big to handle the selfie stick? During the festival look for the ShutterFurs crew and book your private or small group photoshoots with them!<br/><br/>
                    The recommended timeframe is right before sunset (during golden hour)!
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Requests Show and Picnic",
            body: [
                `<span>
                    You know the meme: \"What would be the first song that you would want to listen to on this sound system?\"<br/><br/>
                    Every afternoon during the outdoor picnic, while there is no DJ playing, you can ask Gali to play your favourite tunes on the main stage. Please only send links from Spotify! We will also make a collective playlist from all the music played and share it with all of you after the festival is over. Please try to stay within the boundaries of good taste and don't let a single track take up too much time, so that we can listen to as many of your favourites as possible!
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Console Corner",
            body: [
                `<span>
                    An old friend, a game that inspired this year's theme. If you need a break or if you are missing a screen, visit the Console Corner in the Vidra House.
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Duck Hunt",
            body: [
                `<span>
                    There are 140 tiny yellow rubber ducks hiding in the event area. If you can find them, then you can exchange them for valuable prizes that are different each day.
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Just Dance",
            body: [
                `<span>
                    Dance? Yes! Alone or in a group, follow the moves, fly or spin on your face every day from 9:00 to 11:00 PM at the Vidra House!
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Food Exchange",
            body: [
                `<span>
                    Would you share a well-made treat with others? Show off your favourite beer or wine? Are you growing hot peppers or brewing liqueur? Here we have room for any original or unusual dish. Share it with others!
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Color Theory",
            body: [
                `<span>
                    Have you ever wondered why furry characters look so good in the media? Why do some species have a specific pattern and why do we look at their colours and exterior first? Find out in this lecture!
                </span>`,
                "<br/>",
            ]
        },
        {
            title: "Organising: Questions & Answers",
            body: [
                `<span>
                    \"I'll just post about the meeting, you guys come and it'll be fun!\" Yeah... If you ever wanted to know how much work is put into organising a con and why we've done all of it this year, then attend this presentation.
                </span>`
            ]
        }
    ]  
}

export default programs