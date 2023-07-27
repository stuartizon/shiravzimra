import { birkatHamazon } from './birkatHamazon'
import { chanukah } from './chanukah'
import { festivalMaariv } from './festivalMaariv'
import { festivalMussaf } from './festivalMussaf'
import { festivalTorah } from './festivalTorah'
import { hallel } from './hallel'
import { kabbalatShabbat } from './kabbalatShabbat'
import { kolNidrei } from './kolNidrei'
import { rhMaariv } from './rhMaariv'
import { shabbatMaariv } from './shabbatMaariv'
import { shabbatMussaf } from './shabbatMussaf'
import { shabbatShacharit } from './shabbatShacharit'
import { shabbatTorah } from './shabbatTorah'
import { tishaBav } from './tishaBav'
import { zmirotNight } from './zmirotNight'
import { Group, Piece, Section } from './types'

export {
  kabbalatShabbat,
  shabbatMaariv,
  shabbatShacharit,
  shabbatTorah,
  shabbatMussaf,
  hallel,
  festivalMaariv,
  festivalTorah,
  festivalMussaf,
  rhMaariv,
  kolNidrei,
  chanukah,
  tishaBav,
  birkatHamazon,
  zmirotNight
}

export const allGroups: Group[] = [
  {
    id: 'shabbat',
    name: 'Shabbat',
    hebrewName: 'שבת',
    sections: [
      kabbalatShabbat,
      shabbatMaariv,
      // shabbatShacharit,
      shabbatTorah,
      shabbatMussaf
    ]
  },
  {
    id: 'festivals',
    name: 'Festivals',
    hebrewName: 'שלש רגלים',
    sections: [hallel, festivalMaariv, festivalTorah, festivalMussaf]
  },
  {
    id: 'rh',
    name: 'Rosh Hashana',
    hebrewName: 'ראש השנה',
    sections: [rhMaariv]
  },
  {
    id: 'yk',
    name: 'Yom Kippur',
    hebrewName: 'יום כפור',
    sections: [kolNidrei]
  },
  {
    id: 'misc',
    name: 'Miscellaneous',
    hebrewName: 'שונות',
    sections: [chanukah, tishaBav]
  },
  {
    id: 'songs',
    name: 'Songs',
    hebrewName: 'שירים',
    sections: [birkatHamazon, zmirotNight]
  }
]

export const allSections: Section[] = allGroups.flatMap(group => group.sections)

export const allPieces: Piece[] = allSections.flatMap(section => section.pieces)

export const allPiecesMap: Map<string, Piece> = new Map(
  allPieces.map(p => [p.id, p])
)
