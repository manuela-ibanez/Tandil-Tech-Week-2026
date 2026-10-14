export interface Mission {
  id: string;
  number: string;
  title: string;
  category: string;
  points: number;
  brief: string;
  evidence: string;
  question: string;
  hint: string;
  solution: string;
  answers: string[];
  choices: { value: string; label: string; code: string }[];
}

export const MISSIONS: Mission[] = [
  {
    id: 'phishing', number: '01', title: 'El enlace impostor', category: 'OSINT', points: 100,
    brief: 'Te llegan tres enlaces para acceder a un evento ficticio. Solo uno pertenece al dominio esperado: techweek.example. Identificá el enlace seguro.',
    evidence: 'DOMINIO ESPERADO\ntechweek.example\n\nNo te guíes por el candado.\nLeé el dominio completo.',
    question: '¿Cuál es el enlace correcto?',
    choices: [
      { value: 'a', label: 'https://techweek.example.login-check.test', code: 'A' },
      { value: 'b', label: 'https://tickets.techweek.example', code: 'B' },
      { value: 'c', label: 'https://tech-week.example', code: 'C' },
    ],
    answers: ['b'],
    hint: 'Leé el nombre del host de derecha a izquierda. Un subdominio válido termina en .techweek.example.',
    solution: 'Bien visto. tickets.techweek.example es un subdominio del sitio esperado. Los otros cambian el dominio o lo usan como señuelo. HTTPS cifra la conexión; no garantiza que el sitio sea legítimo.',
  },
  {
    id: 'cipher', number: '02', title: 'Señal desde las sierras', category: 'CRYPTO', points: 150,
    brief: 'Interceptaste un mensaje cifrado con César. Cada letra se desplazó tres lugares hacia adelante en el alfabeto A–Z. Volvé tres lugares para descubrir la palabra.',
    evidence: 'MENSAJE INTERCEPTADO\nWDQGLO\n\nCIFRADO: CÉSAR\nDESPLAZAMIENTO: +3\nEjemplo: D → A',
    question: '¿Qué palabra esconde la señal?', choices: [], answers: ['tandil'],
    hint: 'W → T, D → A, Q → N. Seguí el mismo desplazamiento con las tres letras restantes.',
    solution: 'Señal recuperada: TANDIL. El cifrado César es útil para aprender, pero sus pocas combinaciones lo hacen fácil de romper. Para información sensible, necesitás criptografía moderna.',
  },
  {
    id: 'permissions', number: '03', title: 'La llave justa', category: 'DEFENSA', points: 200,
    brief: 'Un bot solo necesita consultar una agenda pública. Elegí el permiso mínimo que le permite hacer su trabajo sin darle acceso innecesario.',
    evidence: 'SERVICIO: agenda-bot\nTAREA: consultar eventos\n\nNo crea eventos.\nNo administra usuarios.\nNo modifica la agenda.',
    question: '¿Qué permiso le darías?',
    choices: [
      { value: 'a', label: 'Administrador de toda la plataforma', code: 'A' },
      { value: 'b', label: 'Lectura y escritura de la agenda', code: 'B' },
      { value: 'c', label: 'Solo lectura de la agenda', code: 'C' },
    ],
    answers: ['c'],
    hint: 'Aplicá el principio de mínimo privilegio: solo el acceso necesario para cumplir la tarea.',
    solution: 'Acceso concedido, con criterio. Solo lectura es suficiente. Limitar los permisos reduce el impacto de un error o de una cuenta comprometida.',
  },
];

export function checkAnswer(mission: Mission, answer: string): boolean {
  return mission.answers.includes(answer.trim().toLocaleLowerCase('es-AR'));
}

export function scoreFor(solved: readonly string[]): number {
  return MISSIONS.filter(mission => solved.includes(mission.id)).reduce((total, mission) => total + mission.points, 0);
}
