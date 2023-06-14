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
  birkatHamazon
}

export const allGroups: Group[] = [
  {
    id: 'shabbat',
    name: 'Shabbat',
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
    sections: [hallel, festivalMaariv, festivalTorah, festivalMussaf]
  },
  {
    id: 'rh',
    name: 'Rosh Hashana',
    sections: [rhMaariv]
  },
  {
    id: 'yk',
    name: 'Yom Kippur',
    sections: [kolNidrei]
  },
  {
    id: 'misc',
    name: 'Miscellaneous',
    sections: [chanukah]
  },
  {
    id: 'songs',
    name: 'Songs',
    sections: [birkatHamazon]
  }
]

export const allSections: Section[] = allGroups.flatMap(group => group.sections)

export const allPieces: Piece[] = allSections.flatMap(section => section.pieces)

export const allPiecesMap: Map<string, Piece> = new Map(
  allPieces.map(p => [p.id, p])
)
