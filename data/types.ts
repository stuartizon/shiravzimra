export interface Piece {
    id: string
    name: string
    author: string
    description?: string
    amazonUrl?: string
    appleUrl?: string
    spotifyUrl?: string
    youtubeUrl?: string
  }
  
  export interface Section {
    id: string
    name: string
    shortName: string
    hebrewName: string
    pieces: Piece[]
  }

  export interface Group {
    id: string
    name: string
    hebrewName: string
    sections: Section[]
  }