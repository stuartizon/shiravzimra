import { Group } from '../types'
import { rhMaariv } from './maariv'
import { rhMussaf } from './mussaf'
import { rhTorah } from './torah'

export const roshHashana: Group = {
  id: 'rh',
  name: 'Rosh Hashana',
  hebrewName: 'ראש השנה',
  sections: [rhMaariv, rhTorah, rhMussaf]
}
