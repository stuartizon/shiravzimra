import { Group } from '../types'
import { chanukah } from './chanukah'
import { chuppah } from './chuppah'
import { purim } from './purim'
import { selichot } from './selichot'
import { tishaBav } from './tishaBav'

export const misc: Group = {
  id: 'misc',
  name: 'Miscellaneous',
  hebrewName: 'שונות',
  sections: [chanukah, purim, tishaBav, selichot, chuppah]
}
