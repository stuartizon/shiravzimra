import { birkatHamazon } from './birkatHamazon'
import { chanukah } from './chanukah'
import { chuppah } from './chuppah'
import { festivalMaariv } from './festivalMaariv'
import { festivalMussaf } from './festivalMussaf'
import { festivalTorah } from './festivalTorah'
import { hallel } from './hallel'
import { havdala } from './havdala'
import { kabbalatShabbat } from './kabbalatShabbat'
import { kolNidrei } from './kolNidrei'
import { rhMaariv } from './rhMaariv'
import { rhMussaf } from './rhMussaf'
import { shabbatMaariv } from './shabbatMaariv'
import { shabbatMussaf } from './shabbatMussaf'
import { shabbatShacharit } from './shabbatShacharit'
import { shabbatTorah } from './shabbatTorah'
import { tishaBav } from './tishaBav'
import { Group, Piece, Section } from './types'
import { ykMaariv } from './ykMaariv'
import { zmirotDay } from './zmirotDay'
import { zmirotNight } from './zmirotNight'

export {
  kabbalatShabbat,
  shabbatMaariv,
  shabbatShacharit,
  shabbatTorah,
  shabbatMussaf,
  hallel,
  havdala,
  festivalMaariv,
  festivalTorah,
  festivalMussaf,
  rhMaariv,
  rhMussaf,
  kolNidrei,
  ykMaariv,
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
      shabbatShacharit,
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
    sections: [rhMussaf]
  },
  {
    id: 'yk',
    name: 'Yom Kippur',
    hebrewName: 'יום כפור',
    sections: [kolNidrei, ykMaariv]
  },
  {
    id: 'misc',
    name: 'Miscellaneous',
    hebrewName: 'שונות',
    sections: [chanukah, tishaBav, chuppah]
  },
  {
    id: 'songs',
    name: 'Songs',
    hebrewName: 'שירים',
    sections: [birkatHamazon, zmirotNight, zmirotDay, havdala]
  }
]

export const allSections: Section[] = allGroups.flatMap(group => group.sections)

export const allPieces: Piece[] = allSections.flatMap(section => section.pieces)

export const allPiecesMap: Map<string, Piece> = new Map(
  allPieces.map(p => [p.id, p])
)
