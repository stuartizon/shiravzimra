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
import { Piece, Section } from './types'

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

export const allSections: Section[] = [
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
]

export const allPieces: Piece[] = kabbalatShabbat.pieces
  .concat(shabbatMaariv.pieces)
  .concat(shabbatShacharit.pieces)
  .concat(shabbatTorah.pieces)
  .concat(shabbatMussaf.pieces)
  .concat(hallel.pieces)
  .concat(festivalMaariv.pieces)
  .concat(festivalTorah.pieces)
  .concat(festivalMussaf.pieces)
  .concat(rhMaariv.pieces)
  .concat(kolNidrei.pieces)
  .concat(chanukah.pieces)
  .concat(birkatHamazon.pieces)

export const allPiecesMap: Map<string, Piece> = new Map(
  allPieces.map(p => [p.id, p])
)
