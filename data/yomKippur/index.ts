import { Group } from '../types'
import { kolNidrei } from './kolNidrei'
import { ykMaariv } from './maariv'

export const yomKippur: Group = {
  id: 'yk',
  name: 'Yom Kippur',
  hebrewName: 'יום כפור',
  sections: [kolNidrei, ykMaariv]
}
