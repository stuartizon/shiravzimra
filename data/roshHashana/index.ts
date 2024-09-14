import { Group } from '../types'
import { rhMussaf } from './mussaf'
import { rhTorah } from './torah'

export const roshHashana: Group = {
  id: 'rh',
  name: 'Rosh Hashana',
  hebrewName: 'ראש השנה',
  sections: [rhTorah, rhMussaf]
}
