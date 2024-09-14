import { Group, Piece, Section } from './types'
import { shabbat } from './shabbat'
import { festivals } from './festivals'
import { roshHashana } from './roshHashana'
import { yomKippur } from './yomKippur'
import { misc } from './misc'
import { songs } from './songs'

export const allGroups: Group[] = [
  shabbat,
  festivals,
  roshHashana,
  yomKippur,
  misc,
  songs
]

export const allSections: Section[] = allGroups.flatMap(group => group.sections)

export const allPieces: Piece[] = allSections.flatMap(section => section.pieces)

export const allPiecesMap: Map<string, Piece> = new Map(
  allPieces.map(p => [p.id, p])
)
