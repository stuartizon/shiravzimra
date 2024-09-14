import { Group } from '../types'
import { kabbalatShabbat } from './kabbalatShabbat'
import { shabbatMaariv } from './maariv'
import { shabbatShacharit } from './shacharit'
import { shabbatTorah } from './torah'
import { shabbatMussaf } from './mussaf'

export const shabbat: Group = {
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
}
