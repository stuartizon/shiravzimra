import { Group } from '../types'
import { birkatHamazon } from './birkatHamazon'
import { havdala } from './havdala'
import { pesachSeder } from './pesachSeder'
import { seudaShlishit } from './seudaShlishit'
import { zmirotDay } from './zmirotDay'
import { zmirotNight } from './zmirotNight'

export const songs: Group = {
  id: 'songs',
    name: 'Songs',
    hebrewName: 'שירים',
    sections: [birkatHamazon, zmirotNight, zmirotDay, seudaShlishit, havdala, pesachSeder]
}
