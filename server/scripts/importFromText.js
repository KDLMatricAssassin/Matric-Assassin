const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');

// Function to hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');    
    importData();
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// The player data as provided
const playerData = `
Sarah	Alexander	saraherin2208@icloud.com	KUNVVT	Leah Josselowitz
Gabi	Bailey	baileyg@sabje.co.za	JMGRG3	Jordan Ribiero
Jadon	Banfield	Banfieldjadon1@gmail.com	UPHQAB	Sam Kallner
Ella	Barnett	barnette@sabje.co.za	S235J3	Adam Gratch
Josh	Bayhack	joshua.bayhack@gmail.com	1PQ3VU	Savanna Shortridge
Hannah	Benson	bensonh@sabje.co.za	J7UV5H	Tyler Cimring
Gideon	Bloom	Gideonbloom50@gmail.com	1D5ZNB	Jaime Diamond
Leora	Boner	leoraboner@gmail.com	ATD4EO	Hannah Benson
Gabriel	Boyer	boyergabriel794@gmail.com	19QU2F	Jessica Woznica
Lily-Rose	Brenner	lilyrosebrenner@gmail.com	22Y234	Cami Lyons
Gabi	Camberg	cambergc@sabje.co.za	25CT4K	Jamie Kissos
Hannah	Camberg	cambergh@sabje.co.za	GGTPWZ	Emily Joffe
Tyler	Cimring	Cimring26@icloud.com	LKH6W9	Lindy Kolman
Aidan	Cohen	aidankcohen@gmail.com	1BXFUL	Sage Klug
Kiara	Cohen	kiarac@sabje.co.za	OHHDUU	Gabi Romberg
Sabrina	Cohen	Sabrina.cohen111@gmail.com	6UIIYN	Mika Fanaroff
Tayla	Cohen	taylalcohen@gmail.com	02FS2M	Noa Herring
Jacob	Defries	defries101@gmail.com	UVURP1	Jessica Sack
Jamie	Defries	defriesjamie@gmail.com	7ZLBZ8	Amy Moritz
Jaime	Diamond	jaimediamond2021@gmail.com	MH8K3G	Benji Furman
Cammi	Dorfman	Camryndorfman@gmail.com	SDQKNO	Cody Hirschman
Hannah	Duchen	duchenh@sabje.co.za	KHPDGL	Gila Smith
Eden	Dworcan	edendworcan@gmail.com	P4WEWL	Mia Jacobson
Erin	Dworkin	dworkinerin@gmail.com	TKZFHV	Leora Joffe
Mika	Fanaroff	fanaroffm@sabje.co.za	NUA4P7	Sara Joffe
Alexa	Fine	alexabf2101@gmail.com	FB2VA7	Alex Hirschowitz
Amber	Friedlein	friedleinamber@gmail.com	B9ZELS	Ethan Lunt
Leor	Friedman	Leorfriedman029@gmail.com	B8HR9R	Demi Toker
Benji	Furman	furmanbenji@gmail.com	PRQYBE	Sian Temkin
Josh	Galgut	galgutj@sabje.co.za	BTX6AS	Demi Wulfsohn
Sam	Gewer	gewers@sabje.co.za	WDZI63	Eitan Greenblatt
Ella	Gingell	ingellella@gmail.com	UJA48O	Jamie Defries
Adam	Goldberg	Adam@keepiton.co.za	4FNW83	Tyla Rothstein
Chad	Goldberg	cegoldberg18@gmail.com	TVZT5F	Demi Lurie
Teagan	Goldsmith	Teagangoldsmith50@gmail.com	4W0MC5	Gabi Camberg
Adam	Gordon	gordonad@sabje.co.za	EGDJN1	Lily-Rose Brenner
Hannah	Gordon	Gordonhannah06@gmail.com	Q244VL	Alexa Reubenson
Sasha	Gordon	gordonsr@sabje.co.za	KM2MLU	Sam Gewer
Adam	Gratch	Adammgratch@gmail.com	QY39V5	Daniel Waisman
Eitan	Greenblatt	eitanbgreenblatt@gmail.com	GFFV8U	Tali Smith
Noa	Herring	herringn@sabje.co.za	4ENAI6	Erin Dworkin
Cody	Hirschman	codyhirschman6@gmail.com	VQASRX	Amelie Hirschowitz
Alex	Hirschowitz	hirschowitza@gmail.com	FITD4K	Adam Gordon
Amelie	Hirschowitz	Ameliehirschowitz@icloud.com	29FFMD	Ari Symons
Juliana	Hirsh	julianahirsh13@gmail.com	79YNE1	Ella Solomon
Jaimie	Jackson	jewelsbyj11@gmail.com	YWTAL6	Jude Orbach
Mia	Jacobson	miajakes7@gmail.com	T3EVPP	Gaby Shankman
Rebecca	Jellin	jellinr@sabje.co.za	3BSCG7	Gideon Bloom
Emily	Joffe	emily@joffe18.com	NEIUHI	Tayla Cohen
Leora	Joffe	leorajoffe@gmail.com	WHRMAF	Levi Raff
Sam	Joffe	samjoffe777@gmail.com	G9C9N3	Eli Kagan
Sara	Joffe	joffesa@sabje.co.za	626IKL	Brad Shill
Harvey	Joshua	harveyjoshua428@gmail.com	CZVFG3	Jayden Sacker
Leah	Josselowitz	leahjoss@icloud.com	LTUBWI	Jordana Sundelson
Asher	Kagan	kagana@sabje.co.za	4Q058M	Amber Friedlein
Eli	Kagan	elikags613@gmail.com	12IIDS	Dunn Klaff
Sarah	Kahanovitz	kahanovitzsarah@gmail.com	FFPFW7	Hannah Gordon
Sam	Kallner	kallnersam123@gmail.com	86RWFJ	Doron Sandler
Zach	Karan	zach.karan@icloud.com	Y2ZD39	Leora Boner
Jayce	Katz	katzjayce@gmail.com	4R3LQK	Mischa Suchard
Alissa	Kirkel	alissakirkel@gmail.com	4LCZV9	Hannah Duchen
Jamie	Kissos	jamiekissos@icloud.com	3P365F	Jesse Silber
Dunn	Klaff	dunnklaff@gmail.com	KAVBEC	Rory Pai
Sage	Klug	Sage.klug7@gmail.com	R61LXC	Tyron Lasovsky
Lindy	Kolman	kolmanl@sabje.co.za	5NX9YP	Sienna Silbermann
Tyra	Kuper	tyrakuper8@gmail.com	JRXA6I	Gabi Bailey
Tyron	Lasovsky	lasovskytyron@gmail.com	XL5VR2	Levi Sweidan
Ben	Levin	levinbs@sabje.co.za	LINLZZ	Asher Kagan
Jami	Levin	jamilevin@icloud.com	7AXN22	Ella Barnett
David	Levitt	dlevitt929@gmail.com	KINNQZ	Tali Sack
Lia	Levy	levylia01@gmail.com	HBZC5A	Kiara Cohen
Ella	Lewis	ellalewisr@gmail.com	RQJH4R	Leah Kerr-Phillips
Bailey	Lipworth	bailey@lipworth.co.za	053VGN	Cody Lipworth
Cody	Lipworth	cody@lipworth.co.za	O1AQ9Q	Jayce Katz
Ethan	Lunt	lunte@sabje.co.za	6YR0BX	Eden Dworcan
Demi	Lurie	demilurie@icloud.com	KP92GT	Bailey Lipworth
Adam	Lyons	Lyonsadam357@gmail.com	DR9OBF	Lia Levy
Cami	Lyons	cameronlyons21@gmail.com	FSG3QA	Michael Markowitz
Eden	Lyons	Edenlyons21@gmail.com	FCD9NE	Seth Sklar
SJ	Makgalemele	Samuelmakgalemele5@gmail.com	GQL2OP	Gabriel Boyer
Jacob	Maloon	jakemaloon24@gmail.com	68I18R	Cammi Dorfman
Michael	Markowitz	markowitzm@sabje.co.za	VBZ9GW	Zach Karan
Ben	Meltzer	Meltzerb@sabje.co.za	T03VGB	Tayla Smith
Eliana	Mervis	mervisel@sabje.co.za	Q4I4FA	Sasha Gordon
Amy	Moritz	moritz@comairsa.com	AH6THD	Eliana Mervis
Jude	Orbach	Orbachju@sabje.co.za	O3Y1OR	Sabrina Cohen
Raz	Oudmayer	raz.oudmayer@gmail.com	KRH44Y	Adam Lyons
Rory	Pai	roryycp@gmail.com	XMUOKM	Teagan Goldsmith
Leah	Phillips	kerrphillipsl@sabje.co.za	55N7PN	Raz Oudmayer
Levi	Raff	leviraff18@gmail.com	L47VUM	Tyra Kuper
Alexa	Reubenson	reubensonalexa@gmail.com	5T0LEJ	Ella Lewis
Jordan	Ribiero	jordanflash2006@gmail.com	ZYO1IY	Jacob Defries
Gabi	Romberg	gabirom1412@gmail.com	JJGZAS	Adam Schlosberg
Tyla	Rothstein	rothsteint@sabje.co.za	58K2E1	Hannah Camberg
Sasha	Rubenstein	sasharubenstein3@gmail.com	1N83YH	SJ Makgalemele
Mika	Sacharowitz	Mikasachar@icloud.com	M3LLOM	Josh Bayhack
Jessica	Sack	jess.sack@icloud.com	819ZIO	Sierra Sher
Tali	Sack	sacktalia@gmail.com	0D9535	Sasha Rubenstein
Jayden	Sacker	jaydensacker@gmail.com	XEQ2DC	David Levitt
Aviva	Samuels	avivasamuels12@gmail.com	550SFF	Ella Gingell
Doron	Sandler	dodosandler@gmail.com	O72DBD	Lexi Silverman
Adam	Schlosberg	Schlosbergadam@gmail.com	TSSA36	Harvey Joshua
Gaby	Shankman	gaby@shankmans.org	L1U2GI	Leor Friedman
Sierra	Sher	sierrasher84@gmail.com	OMJN3L	Ben Meltzer
Brad	Shill	shillbrad9@gmail.com	CDA1VW	Mika Sacharowitz
Savanna	Shortridge	savanna.shortridge@icloud.com	JEN7FD	Chad Goldberg
Jesse	Silber	jesse@silber.co.za	8DIA82	Alissa Kirkel
Sienna	Silbermann	Siennasilbs@icloud.com	C1UJ2A	Josh Galgut
Lexi	Silverman	lexihannahsilverman@gmail.com	KT2Y1Y	Rebecca Jellin
Seth	Sklar	seth@sklar.co.za	B6UOS0	Jaimie Jackson
Gila	Smith	smithgi@sabje.co.za	F0VPTV	Jadon Banfield
Tali	Smith	talismith0707@gmail.com	CE2EFP	Jacob Maloon
Tayla	Smith	smithtay@sabje.co.za	Q606WZ	Alexa Fine
Ella	Solomon	tellasolomonsa@gmail.com	G77JSW	Yael Yanai
Mischa	Suchard	suchardmischa@gmail.com	5SYDU3	Ben Levin
Jordana	Sundelson	Jordanasundelson@gmail.com	GPNUCV	Eden Lyons
Levi	Sweidan	levisweidan@icloud.com	G3FPOY	Sarah Kahanovitz
Ari	Symons	arisymons45@gmail.com	AQS3L2	Dinah Worms
Sian	Temkin	sian.temkin1@gmail.com	I53Q9F	Aidan Cohen
Demi	Toker	Demitoker07@gmail.com	MN24WK	Aviva Samuels
Dakota	Trakman	dakotatrakman1234@gmail.com	JA21IE	Adam Goldberg
Daniel	Waisman	Dwaisman37@gmail.com	CCMIMX	Madison Williams
Madison	Williams	madisonrebeccawilliams@gmail.com	9JLWPT	Dakota Trakman
Dinah	Worms	dinahworms@gmail.com	7OXI2J	Jami Levin
Jessica	Woznica	Jessica.woznica1@gmail.com	GXA8P2	Juliana Hirsh
Demi	Wulfsohn	demiwulfsohn@icloud.com	WC39YA	Sam Joffe
Yael	Yanai	Yaelyanai2007@gmail.com	FZGXLH	Sarah Alexander
`;

async function importData() {
    try {
        // Parse the text data
        const players = playerData.trim().split('\n').map(line => {
            const [firstName, lastName, email, code, target] = line.trim().split('\t');
            return {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                code: code.trim(),
                target: target.trim()
            };
        });

        // Create user objects
        const users = [];
        const nameToCode = new Map();
        
        // First pass: create basic user info and map names to codes
        for (const player of players) {
            const fullName = `${player.firstName} ${player.lastName}`.trim();
            nameToCode.set(fullName, player.code);
            
            users.push({
                name: fullName,
                email: player.email,
                username: player.code.toLowerCase(),
                verificationCode: player.code,
                password: await hashPassword(player.code), // Using code as password
                isAdmin: false,
                status: 'active',
                targetName: player.target
            });
        }
        
        // Clear existing users
        await User.deleteMany({});
        
        // Insert new users
        const result = await User.insertMany(users);
        console.log(`Successfully imported ${result.length} users`);
        
        // Create a map of name to user ID for target assignment
        const nameToIdMap = new Map();
        for (const user of result) {
            nameToIdMap.set(user.name, user._id);
        }
        
        // Update targets
        let targetsUpdated = 0;
        for (const user of result) {
            if (user.targetName) {
                const targetId = nameToIdMap.get(user.targetName);
                if (targetId) {
                    await User.updateOne(
                        { _id: user._id },
                        { $set: { target: targetId } }
                    );
                    targetsUpdated++;
                } else {
                    console.warn(`Target not found for ${user.name}: ${user.targetName}`);
                }
            }
        }
        
        console.log(`Successfully updated ${targetsUpdated} targets`);
        console.log('\n=== IMPORT COMPLETE ===');
        console.log('Users can log in with:');
        console.log('- Username: their unique code (case-insensitive)');
        console.log('- Password: their unique code');
        
        process.exit(0);
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
}
