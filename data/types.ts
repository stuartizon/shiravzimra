export interface Piece {
    id: string
    name: string
    author: string
    description?: string
    amazonUrl?: string
    spotifyUrl?: string
    youtubeUrl?: string
  }
  
  export interface Section {
    id: string
    name: string
    pieces: Piece[]
  }

  export interface Group {
    name: string
    sections: Section[]
  }