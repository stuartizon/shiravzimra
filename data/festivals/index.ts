import { Group } from '../types'
import { hallel } from './hallel'
import { festivalMaariv } from './maariv'
import { festivalMussaf } from './mussaf'
import { festivalTorah } from './torah'

export const festivals: Group = {
  id: 'festivals',
  name: 'Festivals',
  hebrewName: 'שלש רגלים',
  sections: [hallel, festivalMaariv, festivalTorah, festivalMussaf]
}
