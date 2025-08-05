export interface EnglishNameVariations {
  [key: string]: string[];
}

export const englishNameVariations: EnglishNameVariations = {
  "Abraham": [
    "Abe",
    "Abram",
    "Bram",
    "Ham"
  ],
  "Adam": [
    "Ad",
    "Addie",
    "Adan"
  ],
  "Daniel": [
    "Dan",
    "Danny",
    "Dani",
    "Dannie"
  ],
  "David": [
    "Dave",
    "Davey",
    "Davy",
    "Davie"
  ],
  "Elijah": [
    "Eli",
    "Elias",
    "Ely"
  ],
  "Elisha": [
    "Eli",
    "Lisha"
  ],
  "Enoch": [
    "Eno"
  ],
  "Ezekiel": [
    "Zeke",
    "Ezra",
    "Kiel"
  ],
  "Ezra": [
    "Ez"
  ],
  "Gabriel": [
    "Gabe",
    "Gabby",
    "Gabi"
  ],
  "Isaac": [
    "Ike",
    "Izzy",
    "Zac"
  ],
  "Isaiah": [
    "Isa",
    "Izzy"
  ],
  "Ishmael": [
    "Ish",
    "Ishy"
  ],
  "Jacob": [
    "Jake",
    "Jack",
    "Coby",
    "Cob"
  ],
  "James": [
    "Jim",
    "Jimmy",
    "Jamie",
    "Jay"
  ],
  "Jeremiah": [
    "Jerry",
    "Jeremy",
    "Jere"
  ],
  "Jesse": [
    "Jess",
    "Jessie"
  ],
  "Jesus": [
    "Jesús"
  ],
  "Job": [
    "Joby"
  ],
  "Joel": [
    "Joe",
    "Joey"
  ],
  "John": [
    "Johnny",
    "Jack",
    "Jon",
    "Johnnie"
  ],
  "Jonathan": [
    "Jon",
    "Johnny",
    "Nathan",
    "Jonny"
  ],
  "Joseph": [
    "Joe",
    "Joey",
    "Jos",
    "Josie"
  ],
  "Joshua": [
    "Josh",
    "Joshy"
  ],
  "Judah": [
    "Jude",
    "Judy"
  ],
  "Levi": [
    "Lev",
    "Lee"
  ],
  "Luke": [
    "Lukey",
    "Luc"
  ],
  "Mark": [
    "Marky",
    "Marc"
  ],
  "Matthew": [
    "Matt",
    "Matty",
    "Mat"
  ],
  "Micah": [
    "Mic",
    "Mickey"
  ],
  "Moses": [
    "Moe",
    "Mo",
    "Mosey"
  ],
  "Nathan": [
    "Nate",
    "Nat",
    "Natty"
  ],
  "Nathaniel": [
    "Nate",
    "Nathan",
    "Nat",
    "Natty"
  ],
  "Noah": [
    "No"
  ],
  "Paul": [
    "Paulie",
    "Paolo"
  ],
  "Peter": [
    "Pete",
    "Petey",
    "Pedro"
  ],
  "Reuben": [
    "Rube",
    "Ruben",
    "Ben"
  ],
  "Samuel": [
    "Sam",
    "Sammy",
    "Sammie"
  ],
  "Saul": [
    "Sol"
  ],
  "Seth": [
    "Set"
  ],
  "Simon": [
    "Si",
    "Sim",
    "Simmy"
  ],
  "Stephen": [
    "Steve",
    "Stevie",
    "Stefan"
  ],
  "Thomas": [
    "Tom",
    "Tommy",
    "Thom"
  ],
  "Zachariah": [
    "Zach",
    "Zachary",
    "Zack",
    "Zac"
  ],
  "Miriam": [
    "Miri",
    "Mim",
    "Mira"
  ],
  "Mary": [
    "Marie",
    "Maria",
    "Molly",
    "Polly"
  ],
  "Martha": [
    "Marty",
    "Mattie",
    "Patty"
  ],
  "Elizabeth": [
    "Liz",
    "Beth",
    "Eliza",
    "Betty",
    "Lizzy"
  ],
  "Deborah": [
    "Deb",
    "Debbie",
    "Debby"
  ],
  "Esther": [
    "Essie",
    "Ester"
  ],
  "Eve": [
    "Evie",
    "Eva"
  ],
  "Hannah": [
    "Anna",
    "Annie",
    "Hanna"
  ],
  "Leah": [
    "Lee",
    "Lea"
  ],
  "Rachel": [
    "Rach",
    "Rachie",
    "Rae"
  ],
  "Rebecca": [
    "Becky",
    "Becca",
    "Bec",
    "Rebekah"
  ],
  "Ruth": [
    "Ruthie",
    "Ru"
  ]
};

// Function to find the canonical name from any variation
export function findEnglishCanonicalName(inputName: string): string | null {
  const normalizedInput = inputName.toLowerCase().trim();
  
  // Check if it's already a canonical name
  for (const canonicalName of Object.keys(englishNameVariations)) {
    if (canonicalName.toLowerCase() === normalizedInput) {
      return canonicalName;
    }
  }
  
  // Check if it's a variation of any canonical name
  for (const [canonicalName, variations] of Object.entries(englishNameVariations)) {
    if (variations.some(variation => variation.toLowerCase() === normalizedInput)) {
      return canonicalName;
    }
  }
  
  return null;
}

// Function to get all variations for a canonical name
export function getEnglishNameVariations(canonicalName: string): string[] {
  return englishNameVariations[canonicalName] || [];
}

// Function to check if a name has variations
export function hasEnglishNameVariations(name: string): boolean {
  const canonicalName = findEnglishCanonicalName(name);
  return canonicalName !== null && englishNameVariations[canonicalName].length > 0;
}

// Function to search for name suggestions based on input
export function searchEnglishNameSuggestions(input: string): string[] {
  if (!input || input.length < 2) return [];
  
  const normalizedInput = input.toLowerCase().trim();
  const suggestions = new Set<string>();
  
  // Search in canonical names
  for (const canonicalName of Object.keys(englishNameVariations)) {
    if (canonicalName.toLowerCase().includes(normalizedInput)) {
      suggestions.add(canonicalName);
      // Also add variations of this canonical name
      englishNameVariations[canonicalName].forEach(variation => {
        suggestions.add(variation);
      });
    }
  }
  
  // Search in variations
  for (const [canonicalName, variations] of Object.entries(englishNameVariations)) {
    for (const variation of variations) {
      if (variation.toLowerCase().includes(normalizedInput)) {
        suggestions.add(canonicalName);
        suggestions.add(variation);
      }
    }
  }
  
  // Convert to array and sort by relevance (exact matches first, then starts with, then contains)
  const suggestionsArray = Array.from(suggestions);
  
  return suggestionsArray.sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    
    // Exact match comes first
    if (aLower === normalizedInput) return -1;
    if (bLower === normalizedInput) return 1;
    
    // Starts with comes next
    const aStartsWith = aLower.startsWith(normalizedInput);
    const bStartsWith = bLower.startsWith(normalizedInput);
    
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    
    // Then alphabetical order
    return a.localeCompare(b);
  }).slice(0, 8); // Limit to 8 suggestions
}