import { findCanonicalName } from './romanianNames';
import { findEnglishCanonicalName } from './englishNames';
import { Language } from './translations';

export interface NameMeaning {
  name: string;
  meaning: string;
  biblicalCharacter: string;
  verse: {
    text: string;
    reference: string;
  };
}

// Romanian names meanings
export const romanianNamesMeanings: NameMeaning[] = [
  {
    name: "Alexandru",
    meaning: "Apărătorul oamenilor",
    biblicalCharacter: "Alexandru Macedonul",
    verse: {
      text: "Domnul este războinicul meu; Domnul este numele Lui.",
      reference: "Exodul 15:3"
    }
  },
  {
    name: "Maria",
    meaning: "Iubita de Dumnezeu",
    biblicalCharacter: "Maria, mama lui Isus",
    verse: {
      text: "Iată, roaba Domnului; fie-mi după cuvântul tău!",
      reference: "Luca 1:38"
    }
  },
  {
    name: "Ioan",
    meaning: "Dumnezeu este milostiv",
    biblicalCharacter: "Ioan Botezătorul",
    verse: {
      text: "El trebuie să crească, iar eu să mă micșorez.",
      reference: "Ioan 3:30"
    }
  },
  {
    name: "Ion",
    meaning: "Dumnezeu este milostiv",
    biblicalCharacter: "Ioan Botezătorul",
    verse: {
      text: "El trebuie să crească, iar eu să mă micșorez.",
      reference: "Ioan 3:30"
    }
  },
  {
    name: "Ana",
    meaning: "Har, milă",
    biblicalCharacter: "Ana, mama profetului Samuel",
    verse: {
      text: "Inima mea se bucură în Domnul, puterea mea se înalță prin Domnul.",
      reference: "1 Samuel 2:1"
    }
  },
  {
    name: "Mihai",
    meaning: "Cine este ca Dumnezeu?",
    biblicalCharacter: "Arhanghelul Mihail",
    verse: {
      text: "Domnul să te mustre, Satano!",
      reference: "Iuda 1:9"
    }
  },
  {
    name: "Elena",
    meaning: "Lumină strălucitoare",
    biblicalCharacter: "Elena, mama împăratului Constantin",
    verse: {
      text: "Voi sunteți lumina lumii.",
      reference: "Matei 5:14"
    }
  },
  {
    name: "Andrei",
    meaning: "Bărbătesc, curajos",
    biblicalCharacter: "Apostolul Andrei",
    verse: {
      text: "Veniți după Mine, și vă voi face pescari de oameni.",
      reference: "Matei 4:19"
    }
  },
  {
    name: "Cristina",
    meaning: "Următoare a lui Hristos",
    biblicalCharacter: "Sfânta Cristina",
    verse: {
      text: "Eu sunt calea, adevărul și viața.",
      reference: "Ioan 14:6"
    }
  },
  {
    name: "Gheorghe",
    meaning: "Lucrător al pământului",
    biblicalCharacter: "Sfântul Gheorghe",
    verse: {
      text: "Lupta cea bună am luptat-o, alergarea am sfârșit-o, credința am păzit-o.",
      reference: "2 Timotei 4:7"
    }
  },
  {
    name: "Ioana",
    meaning: "Dumnezeu este milostiv",
    biblicalCharacter: "Ioana, una dintre femeile care L-au urmat pe Isus",
    verse: {
      text: "Multe femei au făcut lucruri vrednice de laudă, dar tu le întreci pe toate.",
      reference: "Proverbe 31:29"
    }
  },
  {
    name: "Petru",
    meaning: "Piatră, stâncă",
    biblicalCharacter: "Apostolul Petru",
    verse: {
      text: "Tu ești Hristosul, Fiul Dumnezeului celui viu!",
      reference: "Matei 16:16"
    }
  },
  {
    name: "Magdalena",
    meaning: "Din Magdala",
    biblicalCharacter: "Maria Magdalena",
    verse: {
      text: "Am văzut pe Domnul!",
      reference: "Ioan 20:18"
    }
  },
  {
    name: "Stefan",
    meaning: "Coroană",
    biblicalCharacter: "Sfântul Ștefan, primul martir",
    verse: {
      text: "Doamne, nu le socoti această păcătuire!",
      reference: "Faptele Apostolilor 7:60"
    }
  },
  {
    name: "Elisabeta",
    meaning: "Dumnezeu este jurământul meu",
    biblicalCharacter: "Elisabeta, mama lui Ioan Botezătorul",
    verse: {
      text: "Binecuvântată ești tu între femei!",
      reference: "Luca 1:42"
    }
  },
  {
    name: "David",
    meaning: "Iubit",
    biblicalCharacter: "Regele David",
    verse: {
      text: "Domnul este păstorul meu: nu voi duce lipsă de nimic.",
      reference: "Psalmul 23:1"
    }
  },
  {
    name: "Iosif",
    meaning: "Dumnezeu va adăuga",
    biblicalCharacter: "Iosif din Egipt",
    verse: {
      text: "Voi știți că ați gândit să-mi faceți rău; dar Dumnezeu a schimbat răul în bine.",
      reference: "Geneza 50:20"
    }
  },
  {
    name: "Pavel",
    meaning: "Mic, smerit",
    biblicalCharacter: "Apostolul Pavel",
    verse: {
      text: "Prin harul lui Dumnezeu sunt ceea ce sunt.",
      reference: "1 Corinteni 15:10"
    }
  },
  {
    name: "Iacob",
    meaning: "Cel care ține de călcâi",
    biblicalCharacter: "Patriarhul Iacob",
    verse: {
      text: "Nu te voi lăsa până nu mă vei binecuvânta!",
      reference: "Geneza 32:26"
    }
  },
  {
    name: "Daniel",
    meaning: "Dumnezeu este judecătorul meu",
    biblicalCharacter: "Profetul Daniel",
    verse: {
      text: "Dumnezeul meu a trimis pe îngerul Său și a închis gura leilor.",
      reference: "Daniel 6:22"
    }
  },
  {
    name: "Sara",
    meaning: "Prințesă",
    biblicalCharacter: "Sara, soția lui Avraam",
    verse: {
      text: "Prin credință și Sara a primit putere să zămislească.",
      reference: "Evrei 11:11"
    }
  },
  {
    name: "Rahela",
    meaning: "Oaia",
    biblicalCharacter: "Rahela, soția lui Iacob",
    verse: {
      text: "Dumnezeu și-a adus aminte de Rahela.",
      reference: "Geneza 30:22"
    }
  },
  {
    name: "Isaac",
    meaning: "Râsul",
    biblicalCharacter: "Isaac, fiul lui Avraam",
    verse: {
      text: "Prin credință, Avraam, când a fost pus la încercare, L-a adus pe Isaac.",
      reference: "Evrei 11:17"
    }
  },
  {
    name: "Avraam",
    meaning: "Tatăl multor neamuri",
    biblicalCharacter: "Patriarhul Avraam",
    verse: {
      text: "Prin credință, Avraam a ascultat când a fost chemat să plece.",
      reference: "Evrei 11:8"
    }
  },
  {
    name: "Solomon",
    meaning: "Pacea",
    biblicalCharacter: "Regele Solomon",
    verse: {
      text: "Dă-mi înțelepciune și pricepere ca să pot să conduc poporul acesta.",
      reference: "2 Cronici 1:10"
    }
  }
];

// English names meanings
export const englishNamesMeanings: NameMeaning[] = [
  {
    name: "Abraham",
    meaning: "Father of many",
    biblicalCharacter: "Abraham, the patriarch",
    verse: {
      text: "I will make you into a great nation, and I will bless you.",
      reference: "Genesis 12:2"
    }
  },
  {
    name: "Adam",
    meaning: "Man, earth",
    biblicalCharacter: "Adam, the first man",
    verse: {
      text: "The Lord God formed a man from the dust of the ground.",
      reference: "Genesis 2:7"
    }
  },
  {
    name: "Daniel",
    meaning: "God is my judge",
    biblicalCharacter: "Daniel the prophet",
    verse: {
      text: "My God sent his angel, and he shut the mouths of the lions.",
      reference: "Daniel 6:22"
    }
  },
  {
    name: "David",
    meaning: "Beloved",
    biblicalCharacter: "King David",
    verse: {
      text: "The Lord is my shepherd, I lack nothing.",
      reference: "Psalm 23:1"
    }
  },
  {
    name: "Elijah",
    meaning: "My God is Yahweh",
    biblicalCharacter: "Elijah the prophet",
    verse: {
      text: "The Lord is God! The Lord is God!",
      reference: "1 Kings 18:39"
    }
  },
  {
    name: "Elisha",
    meaning: "God is salvation",
    biblicalCharacter: "Elisha the prophet",
    verse: {
      text: "Let me inherit a double portion of your spirit.",
      reference: "2 Kings 2:9"
    }
  },
  {
    name: "Enoch",
    meaning: "Dedicated",
    biblicalCharacter: "Enoch who walked with God",
    verse: {
      text: "Enoch walked faithfully with God; then he was no more.",
      reference: "Genesis 5:24"
    }
  },
  {
    name: "Ezekiel",
    meaning: "God strengthens",
    biblicalCharacter: "Ezekiel the prophet",
    verse: {
      text: "I will give you a new heart and put a new spirit in you.",
      reference: "Ezekiel 36:26"
    }
  },
  {
    name: "Ezra",
    meaning: "Helper",
    biblicalCharacter: "Ezra the scribe",
    verse: {
      text: "The hand of the Lord his God was on him.",
      reference: "Ezra 7:6"
    }
  },
  {
    name: "Gabriel",
    meaning: "God is my strength",
    biblicalCharacter: "Gabriel the archangel",
    verse: {
      text: "Do not be afraid, Mary; you have found favor with God.",
      reference: "Luke 1:30"
    }
  },
  {
    name: "Isaac",
    meaning: "He will laugh",
    biblicalCharacter: "Isaac, son of Abraham",
    verse: {
      text: "By faith Abraham, when God tested him, offered Isaac.",
      reference: "Hebrews 11:17"
    }
  },
  {
    name: "Isaiah",
    meaning: "Salvation of God",
    biblicalCharacter: "Isaiah the prophet",
    verse: {
      text: "Here am I. Send me!",
      reference: "Isaiah 6:8"
    }
  },
  {
    name: "Ishmael",
    meaning: "God hears",
    biblicalCharacter: "Ishmael, son of Abraham",
    verse: {
      text: "God has heard the boy crying.",
      reference: "Genesis 21:17"
    }
  },
  {
    name: "Jacob",
    meaning: "Supplanter",
    biblicalCharacter: "Jacob, later called Israel",
    verse: {
      text: "I will not let you go unless you bless me.",
      reference: "Genesis 32:26"
    }
  },
  {
    name: "James",
    meaning: "Supplanter",
    biblicalCharacter: "James the apostle",
    verse: {
      text: "Come, follow me, and I will send you out to fish for people.",
      reference: "Matthew 4:19"
    }
  },
  {
    name: "Jeremiah",
    meaning: "Exalted by the Lord",
    biblicalCharacter: "Jeremiah the prophet",
    verse: {
      text: "Before I formed you in the womb I knew you.",
      reference: "Jeremiah 1:5"
    }
  },
  {
    name: "Jesse",
    meaning: "Gift",
    biblicalCharacter: "Jesse, father of David",
    verse: {
      text: "A shoot will come up from the stump of Jesse.",
      reference: "Isaiah 11:1"
    }
  },
  {
    name: "Jesus",
    meaning: "Yahweh is salvation",
    biblicalCharacter: "Jesus Christ, the Savior",
    verse: {
      text: "I am the way and the truth and the life.",
      reference: "John 14:6"
    }
  },
  {
    name: "Job",
    meaning: "Persecuted",
    biblicalCharacter: "Job, the patient sufferer",
    verse: {
      text: "The Lord gave and the Lord has taken away; may the name of the Lord be praised.",
      reference: "Job 1:21"
    }
  },
  {
    name: "Joel",
    meaning: "Yahweh is God",
    biblicalCharacter: "Joel the prophet",
    verse: {
      text: "I will pour out my Spirit on all people.",
      reference: "Joel 2:28"
    }
  },
  {
    name: "John",
    meaning: "God is gracious",
    biblicalCharacter: "John the Baptist",
    verse: {
      text: "He must become greater; I must become less.",
      reference: "John 3:30"
    }
  },
  {
    name: "Jonathan",
    meaning: "God has given",
    biblicalCharacter: "Jonathan, friend of David",
    verse: {
      text: "Your love for me was wonderful, more wonderful than that of women.",
      reference: "2 Samuel 1:26"
    }
  },
  {
    name: "Joseph",
    meaning: "He will add",
    biblicalCharacter: "Joseph of Egypt",
    verse: {
      text: "You intended to harm me, but God intended it for good.",
      reference: "Genesis 50:20"
    }
  },
  {
    name: "Joshua",
    meaning: "Yahweh is salvation",
    biblicalCharacter: "Joshua, successor of Moses",
    verse: {
      text: "Be strong and courageous. Do not be afraid.",
      reference: "Joshua 1:9"
    }
  },
  {
    name: "Judah",
    meaning: "Praised",
    biblicalCharacter: "Judah, son of Jacob",
    verse: {
      text: "The scepter will not depart from Judah.",
      reference: "Genesis 49:10"
    }
  },
  {
    name: "Levi",
    meaning: "Joined, attached",
    biblicalCharacter: "Levi, son of Jacob",
    verse: {
      text: "The Lord is my portion and my cup.",
      reference: "Psalm 16:5"
    }
  },
  {
    name: "Luke",
    meaning: "Light-giving",
    biblicalCharacter: "Luke the evangelist",
    verse: {
      text: "I too decided to write an orderly account for you.",
      reference: "Luke 1:3"
    }
  },
  {
    name: "Mark",
    meaning: "Warlike",
    biblicalCharacter: "Mark the evangelist",
    verse: {
      text: "The beginning of the good news about Jesus Christ.",
      reference: "Mark 1:1"
    }
  },
  {
    name: "Matthew",
    meaning: "Gift of God",
    biblicalCharacter: "Matthew the apostle",
    verse: {
      text: "Follow me, and I will make you fishers of men.",
      reference: "Matthew 4:19"
    }
  },
  {
    name: "Micah",
    meaning: "Who is like God?",
    biblicalCharacter: "Micah the prophet",
    verse: {
      text: "He has shown you, O mortal, what is good.",
      reference: "Micah 6:8"
    }
  },
  {
    name: "Moses",
    meaning: "Drawn out",
    biblicalCharacter: "Moses the lawgiver",
    verse: {
      text: "I AM WHO I AM. This is what you are to say to the Israelites.",
      reference: "Exodus 3:14"
    }
  },
  {
    name: "Nathan",
    meaning: "He gave",
    biblicalCharacter: "Nathan the prophet",
    verse: {
      text: "You are the man!",
      reference: "2 Samuel 12:7"
    }
  },
  {
    name: "Nathaniel",
    meaning: "Gift of God",
    biblicalCharacter: "Nathaniel the apostle",
    verse: {
      text: "Here truly is an Israelite in whom there is no deceit.",
      reference: "John 1:47"
    }
  },
  {
    name: "Noah",
    meaning: "Rest, comfort",
    biblicalCharacter: "Noah, builder of the ark",
    verse: {
      text: "Noah was a righteous man, blameless among the people of his time.",
      reference: "Genesis 6:9"
    }
  },
  {
    name: "Paul",
    meaning: "Small, humble",
    biblicalCharacter: "Paul the apostle",
    verse: {
      text: "By the grace of God I am what I am.",
      reference: "1 Corinthians 15:10"
    }
  },
  {
    name: "Peter",
    meaning: "Rock",
    biblicalCharacter: "Peter the apostle",
    verse: {
      text: "You are the Messiah, the Son of the living God.",
      reference: "Matthew 16:16"
    }
  },
  {
    name: "Reuben",
    meaning: "Behold, a son",
    biblicalCharacter: "Reuben, firstborn of Jacob",
    verse: {
      text: "Reuben, you are my firstborn, my might and the beginning of my strength.",
      reference: "Genesis 49:3"
    }
  },
  {
    name: "Samuel",
    meaning: "God has heard",
    biblicalCharacter: "Samuel the prophet",
    verse: {
      text: "Speak, Lord, for your servant is listening.",
      reference: "1 Samuel 3:9"
    }
  },
  {
    name: "Saul",
    meaning: "Asked for",
    biblicalCharacter: "King Saul",
    verse: {
      text: "The Lord has sought out a man after his own heart.",
      reference: "1 Samuel 13:14"
    }
  },
  {
    name: "Seth",
    meaning: "Appointed",
    biblicalCharacter: "Seth, son of Adam",
    verse: {
      text: "God has granted me another child in place of Abel.",
      reference: "Genesis 4:25"
    }
  },
  {
    name: "Simon",
    meaning: "He has heard",
    biblicalCharacter: "Simon Peter",
    verse: {
      text: "Come, follow me, and I will send you out to fish for people.",
      reference: "Matthew 4:19"
    }
  },
  {
    name: "Stephen",
    meaning: "Crown",
    biblicalCharacter: "Stephen the first martyr",
    verse: {
      text: "Lord, do not hold this sin against them.",
      reference: "Acts 7:60"
    }
  },
  {
    name: "Thomas",
    meaning: "Twin",
    biblicalCharacter: "Thomas the apostle",
    verse: {
      text: "My Lord and my God!",
      reference: "John 20:28"
    }
  },
  {
    name: "Zachariah",
    meaning: "The Lord remembers",
    biblicalCharacter: "Zachariah, father of John the Baptist",
    verse: {
      text: "Praise be to the Lord, the God of Israel, because he has come to his people.",
      reference: "Luke 1:68"
    }
  },
  {
    name: "Miriam",
    meaning: "Wished-for child",
    biblicalCharacter: "Miriam, sister of Moses",
    verse: {
      text: "Sing to the Lord, for he is highly exalted.",
      reference: "Exodus 15:21"
    }
  },
  {
    name: "Mary",
    meaning: "Beloved, bitter, rebellious",
    biblicalCharacter: "Mary, mother of Jesus",
    verse: {
      text: "I am the Lord's servant. May your word to me be fulfilled.",
      reference: "Luke 1:38"
    }
  },
  {
    name: "Martha",
    meaning: "Lady",
    biblicalCharacter: "Martha of Bethany",
    verse: {
      text: "Yes, Lord, I believe that you are the Messiah.",
      reference: "John 11:27"
    }
  },
  {
    name: "Elizabeth",
    meaning: "God is my oath",
    biblicalCharacter: "Elizabeth, mother of John the Baptist",
    verse: {
      text: "Blessed are you among women!",
      reference: "Luke 1:42"
    }
  },
  {
    name: "Deborah",
    meaning: "Bee",
    biblicalCharacter: "Deborah the judge",
    verse: {
      text: "Wake up, wake up, Deborah! Wake up, wake up, break out in song!",
      reference: "Judges 5:12"
    }
  },
  {
    name: "Esther",
    meaning: "Star",
    biblicalCharacter: "Queen Esther",
    verse: {
      text: "If I perish, I perish.",
      reference: "Esther 4:16"
    }
  },
  {
    name: "Eve",
    meaning: "Life",
    biblicalCharacter: "Eve, the first woman",
    verse: {
      text: "The woman you put here with me—she gave me some fruit from the tree.",
      reference: "Genesis 3:12"
    }
  },
  {
    name: "Hannah",
    meaning: "Grace",
    biblicalCharacter: "Hannah, mother of Samuel",
    verse: {
      text: "My heart rejoices in the Lord; in the Lord my horn is lifted high.",
      reference: "1 Samuel 2:1"
    }
  },
  {
    name: "Leah",
    meaning: "Weary",
    biblicalCharacter: "Leah, wife of Jacob",
    verse: {
      text: "It was Leah! So Jacob said to Laban, 'What is this you have done to me?'",
      reference: "Genesis 29:25"
    }
  },
  {
    name: "Rachel",
    meaning: "Ewe",
    biblicalCharacter: "Rachel, wife of Jacob",
    verse: {
      text: "Then God remembered Rachel; he listened to her and enabled her to conceive.",
      reference: "Genesis 30:22"
    }
  },
  {
    name: "Rebecca",
    meaning: "To tie, to bind",
    biblicalCharacter: "Rebecca, wife of Isaac",
    verse: {
      text: "I will go with this man.",
      reference: "Genesis 24:58"
    }
  },
  {
    name: "Ruth",
    meaning: "Companion",
    biblicalCharacter: "Ruth the Moabite",
    verse: {
      text: "Where you go I will go, and where you stay I will stay.",
      reference: "Ruth 1:16"
    }
  }
];

// Combined names meanings
export const namesMeanings: NameMeaning[] = [...romanianNamesMeanings, ...englishNamesMeanings];

export function getNameMeaning(name: string, language: Language = 'en'): NameMeaning | null {
  const normalizedName = name.toLowerCase().trim();
  
  // Choose the appropriate meanings array based on language
  const meaningsArray = language === 'ro' ? romanianNamesMeanings : englishNamesMeanings;
  
  // First try direct match in the language-specific array
  let found = meaningsArray.find(nm => nm.name.toLowerCase() === normalizedName);
  
  // If not found, try to find canonical name from Romanian variations
  if (!found && language === 'ro') {
    const canonicalName = findCanonicalName(name);
    if (canonicalName) {
      found = romanianNamesMeanings.find(nm => nm.name.toLowerCase() === canonicalName.toLowerCase());
    }
  }
  
  // If not found, try to find canonical name from English variations
  if (!found && language === 'en') {
    const englishCanonicalName = findEnglishCanonicalName(name);
    if (englishCanonicalName) {
      found = englishNamesMeanings.find(nm => nm.name.toLowerCase() === englishCanonicalName.toLowerCase());
    }
  }
  
  // If still not found, try the other language as fallback
  if (!found) {
    const fallbackArray = language === 'ro' ? englishNamesMeanings : romanianNamesMeanings;
    found = fallbackArray.find(nm => nm.name.toLowerCase() === normalizedName);
    
    // Try canonical name search in fallback language
    if (!found) {
      if (language === 'ro') {
        const englishCanonicalName = findEnglishCanonicalName(name);
        if (englishCanonicalName) {
          found = englishNamesMeanings.find(nm => nm.name.toLowerCase() === englishCanonicalName.toLowerCase());
        }
      } else {
        const canonicalName = findCanonicalName(name);
        if (canonicalName) {
          found = romanianNamesMeanings.find(nm => nm.name.toLowerCase() === canonicalName.toLowerCase());
        }
      }
    }
  }
  
  return found || null;
}

export function getRandomNameMeaning(): NameMeaning {
  return namesMeanings[Math.floor(Math.random() * namesMeanings.length)];
}