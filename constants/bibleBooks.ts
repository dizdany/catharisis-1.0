// This file now only contains utility functions for working with Bible books
// The actual book data comes from the API

export interface BibleBook {
  id: string;
  name: string;
  chapters: number;
  testament: 'old' | 'new';
  order: number;
}

// Utility functions for working with Bible book data from API
export const getBookById = (books: BibleBook[], id: string): BibleBook | undefined => {
  return books.find(book => book.id === id);
};

export const getBooksByTestament = (books: BibleBook[], testament: 'old' | 'new'): BibleBook[] => {
  return books.filter(book => book.testament === testament).sort((a, b) => a.order - b.order);
};

export const getBookByName = (books: BibleBook[], name: string): BibleBook | undefined => {
  return books.find(book => 
    book.name.toLowerCase() === name.toLowerCase() ||
    book.id.toLowerCase() === name.toLowerCase()
  );
};