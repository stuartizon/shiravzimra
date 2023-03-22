import { Section } from './types'

export const shabbatMussaf: Section = {
  id: 'shabbatMussaf',
  name: 'Shabbat Mussaf',
  pieces: [
    { id: '68a', name: "Va'anachnu", author: 'Felix Mendelssohn' },
    { id: '69b', name: 'Hodo Al Eretz', author: 'Salomon Sulzer' },
    { id: '71a', name: 'Eitz Chayim', author: 'Nissan Blumenthal' },
    { id: '71e', name: 'Eitz Chayim', author: 'Samuel Naumbourg' },
    { id: '74a', name: "M'chalkel", author: 'Max Wohlberg' },
    { id: '92a', name: 'Ein Keloheinu', author: 'Julius Freudenthal' },
    { id: '92f', name: 'Ein Keloheinu', author: 'George Frideric Handel' },
    {
      id: '94a',
      name: 'Adon Olam',
      author: 'Trad',
      youtubeUrl: 'https://youtu.be/8EUG0m4RuEk',
      spotifyUrl:
        'https://open.spotify.com/track/7xoy2KChzfB3mIluGNPe8z?si=c7f07ece955f40a6'
    },
    {
      id: '94d',
      name: 'Adon Olam',
      author: 'Simon Waley',
      youtubeUrl: 'https://youtu.be/Lq85Frff_TE',
      description:
        "This classic setting of Adon Olam is by Simon Waley, pianist, composer and prominent member of the West London Synagogue. There is something deeply resonant in its alternation between major and minor. Waley's melody was readily adopted by the Spanish and Portuguese community and Ashkenazi orthodox communities in the UK, though it inexplicably has struggled to gain a foothold further afield."
    }
  ]
}
