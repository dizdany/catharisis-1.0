export interface RomanianNameVariations {
  [key: string]: string[];
}

export const romanianNameVariations: RomanianNameVariations = {
  "Ioan": [
    "Ion",
    "Ionuț",
    "Ionică",
    "Ionel",
    "Nelu",
    "Nelutu",
    "Jean",
    "Jan"
  ],
  "Maria": [
    "Marița",
    "Mărioara",
    "Mariuca",
    "Mimi",
    "Mia",
    "Mariana",
    "Maricica",
    "Măriuța",
    "Mara"
  ],
  "Iosif": [
    "Iosif",
    "Sebi",
    "Sever",
    "Iosica"
  ],
  "Petru": [
    "Petrică",
    "Petre",
    "Petrișor",
    "Petrinel"
  ],
  "Pavel": [
    "Pavel",
    "Pavăl",
    "Păvăluț"
  ],
  "Iacob": [
    "Iacob",
    "Cobi",
    "Iacu"
  ],
  "Andrei": [
    "Andrei",
    "Andi",
    "Andu",
    "Anduț",
    "Andruț",
    "Andrică",
    "Andrew"
  ],
  "Daniel": [
    "Dani",
    "Dănuț",
    "Dan",
    "Dăniță"
  ],
  "Mihai": [
    "Mișu",
    "Mihăiță",
    "Mihu",
    "Mihnea"
  ],
  "Elisabeta": [
    "Elisa",
    "Eliza",
    "Beta",
    "Sabi",
    "Sabina",
    "Beti"
  ],
  "Ana": [
    "Anuța",
    "Anica",
    "Ani",
    "Ancuța",
    "Ancu"
  ],
  "Sara": [
    "Sărița",
    "Saruța",
    "Sarina"
  ],
  "Rahela": [
    "Rahela",
    "Ralu",
    "Raluța",
    "Rahela"
  ],
  "David": [
    "Dănuț",
    "Davy",
    "Davi"
  ],
  "Isaac": [
    "Isac",
    "Isăcel",
    "Isa"
  ],
  "Avraam": [
    "Avram",
    "Avi",
    "Avrel"
  ],
  "Solomon": [
    "Solo",
    "Solonel",
    "Sol"
  ]
};

// Function to find the canonical name from any variation
export function findCanonicalName(inputName: string): string | null {
  const normalizedInput = inputName.toLowerCase().trim();
  
  // Check if it's already a canonical name
  for (const canonicalName of Object.keys(romanianNameVariations)) {
    if (canonicalName.toLowerCase() === normalizedInput) {
      return canonicalName;
    }
  }
  
  // Check if it's a variation of any canonical name
  for (const [canonicalName, variations] of Object.entries(romanianNameVariations)) {
    if (variations.some(variation => variation.toLowerCase() === normalizedInput)) {
      return canonicalName;
    }
  }
  
  return null;
}

// Function to get all variations for a canonical name
export function getNameVariations(canonicalName: string): string[] {
  return romanianNameVariations[canonicalName] || [];
}

// Function to check if a name has variations
export function hasNameVariations(name: string): boolean {
  const canonicalName = findCanonicalName(name);
  return canonicalName !== null && romanianNameVariations[canonicalName].length > 0;
}

// Function to search for name suggestions based on input (Romanian names only)
export function searchRomanianNameSuggestions(input: string): string[] {
  if (!input || input.length < 2) return [];
  
  const normalizedInput = input.toLowerCase().trim();
  const suggestions = new Set<string>();
  
  // Search in canonical names
  for (const canonicalName of Object.keys(romanianNameVariations)) {
    if (canonicalName.toLowerCase().includes(normalizedInput)) {
      suggestions.add(canonicalName);
      // Also add variations of this canonical name
      romanianNameVariations[canonicalName].forEach(variation => {
        suggestions.add(variation);
      });
    }
  }
  
  // Search in variations
  for (const [canonicalName, variations] of Object.entries(romanianNameVariations)) {
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

// Function to search for name suggestions based on input (combined Romanian and English)
export function searchNameSuggestions(input: string): string[] {
  if (!input || input.length < 2) return [];
  
  const normalizedInput = input.toLowerCase().trim();
  const suggestions = new Set<string>();
  
  // Import English names dynamically to avoid circular imports
  const { englishNameVariations } = require('./englishNames') as { englishNameVariations: { [key: string]: string[] } };
  
  // Search in Romanian canonical names
  for (const canonicalName of Object.keys(romanianNameVariations)) {
    if (canonicalName.toLowerCase().includes(normalizedInput)) {
      suggestions.add(canonicalName);
      // Also add variations of this canonical name
      romanianNameVariations[canonicalName].forEach(variation => {
        suggestions.add(variation);
      });
    }
  }
  
  // Search in Romanian variations
  for (const [canonicalName, variations] of Object.entries(romanianNameVariations)) {
    for (const variation of variations) {
      if (variation.toLowerCase().includes(normalizedInput)) {
        suggestions.add(canonicalName);
        suggestions.add(variation);
      }
    }
  }
  
  // Search in English canonical names
  for (const canonicalName of Object.keys(englishNameVariations)) {
    if (canonicalName.toLowerCase().includes(normalizedInput)) {
      suggestions.add(canonicalName);
      // Also add variations of this canonical name
      const variations = englishNameVariations[canonicalName] as string[];
      variations.forEach((variation: string) => {
        suggestions.add(variation);
      });
    }
  }
  
  // Search in English variations
  for (const [canonicalName, variations] of Object.entries(englishNameVariations)) {
    const variationsArray = variations as string[];
    for (const variation of variationsArray) {
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