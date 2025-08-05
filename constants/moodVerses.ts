import { MoodType, generateMoodVerseId } from './verses';

export interface MoodVerse {
  id: string;
  text: string;
  reference: string;
  book: string;
  chapter: number;
  verse: number;
  mood: MoodType;
}



// Local database of mood-based verses
export const moodVerses: Record<MoodType, MoodVerse[]> = {
  lost: [
    {
      id: generateMoodVerseId("John", 14, 6, "lost"),
      text: "Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'",
      reference: "John 14:6",
      book: "John",
      chapter: 14,
      verse: 6,
      mood: "lost"
    },
    {
      id: generateMoodVerseId("Psalms", 119, 105, "lost"),
      text: "Your word is a lamp for my feet, a light on my path.",
      reference: "Psalm 119:105",
      book: "Psalms",
      chapter: 119,
      verse: 105,
      mood: "lost"
    },
    {
      id: generateMoodVerseId("Isaiah", 41, 10, "lost"),
      text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
      reference: "Isaiah 41:10",
      book: "Isaiah",
      chapter: 41,
      verse: 10,
      mood: "lost"
    },
    {
      id: generateMoodVerseId("Luke", 15, 4, "lost"),
      text: "Suppose one of you has a hundred sheep and loses one of them. Doesn't he leave the ninety-nine in the open country and go after the lost sheep until he finds it?",
      reference: "Luke 15:4-7",
      book: "Luke",
      chapter: 15,
      verse: 4,
      mood: "lost"
    },
    {
      id: generateMoodVerseId("Proverbs", 3, 5, "lost"),
      text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
      reference: "Proverbs 3:5-6",
      book: "Proverbs",
      chapter: 3,
      verse: 5,
      mood: "lost"
    },
    {
      id: generateMoodVerseId("Psalms", 23, 1, "lost"),
      text: "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul. He guides me along the right paths for his name's sake. Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
      reference: "Psalm 23:1-4",
      book: "Psalms",
      chapter: 23,
      verse: 1,
      mood: "lost"
    },
    {
      id: generateMoodVerseId("Jeremiah", 29, 11, "lost"),
      text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
      reference: "Jeremiah 29:11",
      book: "Jeremiah",
      chapter: 29,
      verse: 11,
      mood: "lost"
    },
    {
      id: generateMoodVerseId("Matthew", 11, 28, "lost"),
      text: "Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls.",
      reference: "Matthew 11:28-30",
      book: "Matthew",
      chapter: 11,
      verse: 28,
      mood: "lost"
    }
  ],
  unsure: [
    {
      id: generateMoodVerseId("Proverbs", 3, 5, "unsure"),
      text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
      reference: "Proverbs 3:5-6",
      book: "Proverbs",
      chapter: 3,
      verse: 5,
      mood: "unsure"
    },
    {
      id: generateMoodVerseId("James", 1, 5, "unsure"),
      text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you. But when you ask, you must believe and not doubt, because the one who doubts is like a wave of the sea, blown and tossed by the wind.",
      reference: "James 1:5-6",
      book: "James",
      chapter: 1,
      verse: 5,
      mood: "unsure"
    },
    {
      id: generateMoodVerseId("Isaiah", 40, 31, "unsure"),
      text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
      reference: "Isaiah 40:31",
      book: "Isaiah",
      chapter: 40,
      verse: 31,
      mood: "unsure"
    },
    {
      id: generateMoodVerseId("Romans", 8, 28, "unsure"),
      text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
      reference: "Romans 8:28",
      book: "Romans",
      chapter: 8,
      verse: 28,
      mood: "unsure"
    },
    {
      id: generateMoodVerseId("Philippians", 4, 6, "unsure"),
      text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
      reference: "Philippians 4:6-7",
      book: "Philippians",
      chapter: 4,
      verse: 6,
      mood: "unsure"
    },
    {
      id: generateMoodVerseId("2 Timothy", 1, 7, "unsure"),
      text: "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.",
      reference: "2 Timothy 1:7",
      book: "2 Timothy",
      chapter: 1,
      verse: 7,
      mood: "unsure"
    },
    {
      id: generateMoodVerseId("Psalms", 37, 23, "unsure"),
      text: "The Lord makes firm the steps of the one who delights in him; though he may stumble, he will not fall, for the Lord upholds him with his hand.",
      reference: "Psalm 37:23-24",
      book: "Psalms",
      chapter: 37,
      verse: 23,
      mood: "unsure"
    },
    {
      id: generateMoodVerseId("Psalms", 46, 10, "unsure"),
      text: "Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.",
      reference: "Psalm 46:10",
      book: "Psalms",
      chapter: 46,
      verse: 10,
      mood: "unsure"
    }
  ],
  good: [
    {
      id: generateMoodVerseId("1 Thessalonians", 5, 16, "good"),
      text: "Rejoice always, pray continually, give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
      reference: "1 Thessalonians 5:16-18",
      book: "1 Thessalonians",
      chapter: 5,
      verse: 16,
      mood: "good"
    },
    {
      id: generateMoodVerseId("Philippians", 4, 4, "good"),
      text: "Rejoice in the Lord always. I will say it again: Rejoice! Let your gentleness be evident to all. The Lord is near. Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
      reference: "Philippians 4:4-7",
      book: "Philippians",
      chapter: 4,
      verse: 4,
      mood: "good"
    },
    {
      id: generateMoodVerseId("Colossians", 3, 17, "good"),
      text: "And whatever you do, whether in word or deed, do it all in the name of the Lord Jesus, giving thanks to God the Father through him.",
      reference: "Colossians 3:17",
      book: "Colossians",
      chapter: 3,
      verse: 17,
      mood: "good"
    },
    {
      id: generateMoodVerseId("James", 1, 17, "good"),
      text: "Every good and perfect gift is from above, coming down from the Father of the heavenly lights, who does not change like shifting shadows.",
      reference: "James 1:17",
      book: "James",
      chapter: 1,
      verse: 17,
      mood: "good"
    },
    {
      id: generateMoodVerseId("Psalms", 100, 4, "good"),
      text: "Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name. For the Lord is good and his love endures forever; his faithfulness continues through all generations.",
      reference: "Psalm 100:4-5",
      book: "Psalms",
      chapter: 100,
      verse: 4,
      mood: "good"
    },
    {
      id: generateMoodVerseId("Proverbs", 11, 2, "good"),
      text: "When pride comes, then comes disgrace, but with humility comes wisdom.",
      reference: "Proverbs 11:2",
      book: "Proverbs",
      chapter: 11,
      verse: 2,
      mood: "good"
    },
    {
      id: generateMoodVerseId("Luke", 6, 38, "good"),
      text: "Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap. For with the measure you use, it will be measured to you.",
      reference: "Luke 6:38",
      book: "Luke",
      chapter: 6,
      verse: 38,
      mood: "good"
    },
    {
      id: generateMoodVerseId("Micah", 6, 8, "good"),
      text: "He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.",
      reference: "Micah 6:8",
      book: "Micah",
      chapter: 6,
      verse: 8,
      mood: "good"
    }
  ],
  distressed: [
    {
      id: generateMoodVerseId("Psalms", 34, 18, "distressed"),
      text: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.",
      reference: "Psalm 34:18",
      book: "Psalms",
      chapter: 34,
      verse: 18,
      mood: "distressed"
    },
    {
      id: generateMoodVerseId("Matthew", 11, 28, "distressed"),
      text: "Come to me, all you who are weary and burdened, and I will give you rest.",
      reference: "Matthew 11:28",
      book: "Matthew",
      chapter: 11,
      verse: 28,
      mood: "distressed"
    },
    {
      id: generateMoodVerseId("2 Corinthians", 1, 3, "distressed"),
      text: "Praise be to the God and Father of our Lord Jesus Christ, the Father of compassion and the God of all comfort, who comforts us in all our troubles, so that we can comfort those in any trouble with the comfort we ourselves receive from God.",
      reference: "2 Corinthians 1:3-4",
      book: "2 Corinthians",
      chapter: 1,
      verse: 3,
      mood: "distressed"
    },
    {
      id: generateMoodVerseId("Psalms", 46, 1, "distressed"),
      text: "God is our refuge and strength, an ever-present help in trouble.",
      reference: "Psalm 46:1",
      book: "Psalms",
      chapter: 46,
      verse: 1,
      mood: "distressed"
    },
    {
      id: generateMoodVerseId("Isaiah", 41, 10, "distressed"),
      text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
      reference: "Isaiah 41:10",
      book: "Isaiah",
      chapter: 41,
      verse: 10,
      mood: "distressed"
    },
    {
      id: generateMoodVerseId("Psalms", 55, 22, "distressed"),
      text: "Cast your cares on the Lord and he will sustain you; he will never let the righteous be shaken.",
      reference: "Psalm 55:22",
      book: "Psalms",
      chapter: 55,
      verse: 22,
      mood: "distressed"
    },
    {
      id: generateMoodVerseId("1 Peter", 5, 7, "distressed"),
      text: "Cast all your anxiety on him because he cares for you.",
      reference: "1 Peter 5:7",
      book: "1 Peter",
      chapter: 5,
      verse: 7,
      mood: "distressed"
    },
    {
      id: generateMoodVerseId("Psalms", 147, 3, "distressed"),
      text: "He heals the brokenhearted and binds up their wounds.",
      reference: "Psalm 147:3",
      book: "Psalms",
      chapter: 147,
      verse: 3,
      mood: "distressed"
    }
  ],
  amazing: [
    {
      id: generateMoodVerseId("Ephesians", 3, 20, "amazing"),
      text: "Now to him who is able to do immeasurably more than all we ask or imagine, according to his power that is at work within us, to him be glory in the church and in Christ Jesus throughout all generations, for ever and ever! Amen.",
      reference: "Ephesians 3:20-21",
      book: "Ephesians",
      chapter: 3,
      verse: 20,
      mood: "amazing"
    },
    {
      id: generateMoodVerseId("Psalms", 139, 14, "amazing"),
      text: "I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.",
      reference: "Psalm 139:14",
      book: "Psalms",
      chapter: 139,
      verse: 14,
      mood: "amazing"
    },
    {
      id: generateMoodVerseId("Romans", 8, 37, "amazing"),
      text: "No, in all these things we are more than conquerors through him who loved us.",
      reference: "Romans 8:37",
      book: "Romans",
      chapter: 8,
      verse: 37,
      mood: "amazing"
    },
    {
      id: generateMoodVerseId("Philippians", 4, 13, "amazing"),
      text: "I can do all this through him who gives me strength.",
      reference: "Philippians 4:13",
      book: "Philippians",
      chapter: 4,
      verse: 13,
      mood: "amazing"
    },
    {
      id: generateMoodVerseId("1 John", 4, 4, "amazing"),
      text: "You, dear children, are from God and have overcome them, because the one who is in you is greater than the one who is in the world.",
      reference: "1 John 4:4",
      book: "1 John",
      chapter: 4,
      verse: 4,
      mood: "amazing"
    },
    {
      id: generateMoodVerseId("2 Corinthians", 5, 17, "amazing"),
      text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
      reference: "2 Corinthians 5:17",
      book: "2 Corinthians",
      chapter: 5,
      verse: 17,
      mood: "amazing"
    },
    {
      id: generateMoodVerseId("Jeremiah", 32, 17, "amazing"),
      text: "Ah, Sovereign Lord, you have made the heavens and the earth by your great power and outstretched arm. Nothing is too hard for you.",
      reference: "Jeremiah 32:17",
      book: "Jeremiah",
      chapter: 32,
      verse: 17,
      mood: "amazing"
    },
    {
      id: generateMoodVerseId("Isaiah", 40, 31, "amazing"),
      text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
      reference: "Isaiah 40:31",
      book: "Isaiah",
      chapter: 40,
      verse: 31,
      mood: "amazing"
    }
  ],
  wonderful: [
    {
      id: generateMoodVerseId("Psalms", 103, 1, "wonderful"),
      text: "Praise the Lord, my soul; all my inmost being, praise his holy name. Praise the Lord, my soul, and forget not all his benefits— who forgives all your sins and heals all your diseases, who redeems your life from the pit and crowns you with love and compassion, who satisfies your desires with good things so that your youth is renewed like the eagle's.",
      reference: "Psalm 103:1-5",
      book: "Psalms",
      chapter: 103,
      verse: 1,
      mood: "wonderful"
    },
    {
      id: generateMoodVerseId("Revelation", 4, 11, "wonderful"),
      text: "You are worthy, our Lord and God, to receive glory and honor and power, for you created all things, and by your will they were created and have their being.",
      reference: "Revelation 4:11",
      book: "Revelation",
      chapter: 4,
      verse: 11,
      mood: "wonderful"
    },
    {
      id: generateMoodVerseId("Psalms", 8, 3, "wonderful"),
      text: "When I consider your heavens, the work of your fingers, the moon and the stars, which you have set in place, what is mankind that you are mindful of them, human beings that you care for them?",
      reference: "Psalm 8:3-4",
      book: "Psalms",
      chapter: 8,
      verse: 3,
      mood: "wonderful"
    },
    {
      id: generateMoodVerseId("Isaiah", 6, 3, "wonderful"),
      text: "And they were calling to one another: 'Holy, holy, holy is the Lord Almighty; the whole earth is full of his glory.'",
      reference: "Isaiah 6:3",
      book: "Isaiah",
      chapter: 6,
      verse: 3,
      mood: "wonderful"
    },
    {
      id: generateMoodVerseId("Romans", 11, 33, "wonderful"),
      text: "Oh, the depth of the riches of the wisdom and knowledge of God! How unsearchable his judgments, and his paths beyond tracing out! Who has known the mind of the Lord? Or who has been his counselor? Who has ever given to God, that God should repay them? For from him and through him and to him are all things. To him be the glory forever! Amen.",
      reference: "Romans 11:33-36",
      book: "Romans",
      chapter: 11,
      verse: 33,
      mood: "wonderful"
    },
    {
      id: generateMoodVerseId("Psalms", 19, 1, "wonderful"),
      text: "The heavens declare the glory of God; the skies proclaim the work of his hands.",
      reference: "Psalm 19:1",
      book: "Psalms",
      chapter: 19,
      verse: 1,
      mood: "wonderful"
    },
    {
      id: generateMoodVerseId("Ephesians", 3, 20, "wonderful"),
      text: "Now to him who is able to do immeasurably more than all we ask or imagine, according to his power that is at work within us, to him be glory in the church and in Christ Jesus throughout all generations, for ever and ever! Amen.",
      reference: "Ephesians 3:20-21",
      book: "Ephesians",
      chapter: 3,
      verse: 20,
      mood: "wonderful"
    },
    {
      id: generateMoodVerseId("Psalms", 145, 3, "wonderful"),
      text: "Great is the Lord and most worthy of praise; his greatness no one can fathom.",
      reference: "Psalm 145:3",
      book: "Psalms",
      chapter: 145,
      verse: 3,
      mood: "wonderful"
    }
  ]
};

// Helper functions
export const getVersesByMood = (mood: MoodType): MoodVerse[] => {
  return moodVerses[mood] || [];
};

export const getRandomVerseByMood = (mood: MoodType): MoodVerse | null => {
  const verses = getVersesByMood(mood);
  if (verses.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * verses.length);
  return verses[randomIndex];
};

export const getVerseById = (id: string): MoodVerse | null => {
  for (const mood of Object.keys(moodVerses) as MoodType[]) {
    const verse = moodVerses[mood].find(v => v.id === id);
    if (verse) return verse;
  }
  return null;
};