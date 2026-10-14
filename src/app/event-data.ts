export const OFFICIAL_SITE = 'https://www.tandiltechweek.com/';
export const EVENT_SOURCE = 'https://www.clustertecnologicotandil.org.ar/nota-tandil-tech-week-2026-dos-jornadas-para-conectar-tecnologia--startups-e-innovacion-63931';

export const DAYS = [
  {
    id: 'hacking', number: '01', date: '14', weekday: 'Miércoles',
    title: 'Hacking Day', category: 'CIBERSEGURIDAD + COMUNIDAD',
    location: 'Campus Universitario UNICEN',
    map: 'https://www.google.com/maps/search/?api=1&query=Campus+Universitario+UNICEN+Tandil',
    description: 'Pensá como un hacker. Resolvé en equipo.',
    detail: 'Una competencia de ciberseguridad para poner a prueba tus conocimientos, compartir estrategias y aprender con otros. Traé tu curiosidad y las ganas de resolver desafíos.',
    topics: ['Desafíos técnicos', 'Hacking en equipos', 'Aprendizaje colaborativo'],
  },
  {
    id: 'startup', number: '02', date: '15', weekday: 'Jueves',
    title: 'Startup Day', category: 'STARTUPS + NUEVAS CONEXIONES',
    location: 'Distrito Avellaneda · Tandil',
    map: 'https://www.google.com/maps/search/?api=1&query=Distrito+Avellaneda+Tandil',
    description: 'Conocé a quienes están construyendo lo que viene.',
    detail: 'Charlas y networking para cruzar ideas con founders, inversores, estudiantes y referentes del ecosistema. Experiencias reales y conversaciones que pueden convertirse en tu próximo proyecto.',
    topics: ['Experiencias de founders', 'Inversión y producto', 'Networking'],
  },
] as const;

export const ORGANIZERS = [
  { name: 'Hack Tandil', role: 'Comunidad tech', mark: 'hack_tandil', url: 'https://www.tandiltechweek.com/' },
  { name: 'Picante', role: 'Venture capital', mark: 'picante', url: 'https://picante.fund' },
  { name: 'Relaw', role: 'Venture legal', mark: 'RELAW', url: 'https://relaw.io' },
  { name: 'Paisanos', role: 'Product studio', mark: 'paisanos®', url: 'https://www.paisanos.io' },
  { name: 'Geonosis', role: 'Tecnología', mark: 'GEONOSIS', url: 'https://geonosisgroup.com' },
  { name: 'Fardo', role: 'Brand intelligence', mark: 'fardo.', url: 'https://heyfardo.com' },
] as const;

export const SPONSORS = [
  { name: 'Geonosis', mark: 'GEONOSIS', role: 'Sponsor' },
  { name: 'Rotonda', mark: 'Rotonda', role: 'Sponsor' },
  { name: 'Fardo', mark: 'fardo.', role: 'Sponsor' },
  { name: 'Payoneer', mark: 'Payoneer', role: 'Sponsor' },
  { name: 'The Red Guild', mark: 'the red guild', role: 'Sponsor' },
  { name: 'TDL 2050', mark: 'TDL 2050', role: 'Sponsor' },
  { name: 'Novum', mark: 'Novum', role: 'Sponsor' },
  { name: 'Baken', mark: 'Baken', role: 'Sponsor · Café' },
] as const;

export type EventState = 'upcoming' | 'live' | 'finished';
export function getEventState(now: number): EventState {
  const start = Date.parse('2026-10-14T00:00:00-03:00');
  const end = Date.parse('2026-10-16T00:00:00-03:00');
  return now < start ? 'upcoming' : now < end ? 'live' : 'finished';
}
