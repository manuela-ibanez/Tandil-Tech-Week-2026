import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import ts from 'typescript';

async function loadSource(relativePath) {
  const source = await readFile(new URL(relativePath, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}

const { MISSIONS, checkAnswer, scoreFor } = await loadSource('../src/app/cyber-lab.ts');
const { getEventState } = await loadSource('../src/app/event-data.ts');

test('el enlace señuelo y el dominio parecido no resuelven phishing', () => {
  assert.equal(checkAnswer(MISSIONS[0], 'a'), false);
  assert.equal(checkAnswer(MISSIONS[0], 'c'), false);
  assert.equal(checkAnswer(MISSIONS[0], ' B '), true);
});

test('el mensaje César se descifra a TANDIL', () => {
  const decoded = 'WDQGLO'.split('').map(letter => String.fromCharCode((letter.charCodeAt(0) - 65 + 23) % 26 + 65)).join('');
  assert.equal(checkAnswer(MISSIONS[1], decoded), true);
  assert.equal(checkAnswer(MISSIONS[1], 'WDQGLO'), false);
  assert.equal(checkAnswer(MISSIONS[1], ''), false);
});

test('los permisos de escritura y administrador no son mínimos', () => {
  assert.equal(checkAnswer(MISSIONS[2], 'a'), false);
  assert.equal(checkAnswer(MISSIONS[2], 'b'), false);
  assert.equal(checkAnswer(MISSIONS[2], 'c'), true);
});

test('resolver una misión repetida no duplica la puntuación', () => {
  assert.equal(scoreFor(['phishing', 'phishing']), 100);
  assert.equal(scoreFor(['phishing', 'cipher', 'permissions']), 450);
  assert.equal(scoreFor(['unknown']), 0);
  assert.equal(scoreFor([]), 0);
});

test('el encuentro comienza el 14 de octubre a medianoche de Argentina', () => {
  assert.equal(getEventState(Date.parse('2026-10-14T02:59:59Z')), 'upcoming');
  assert.equal(getEventState(Date.parse('2026-10-14T03:00:00Z')), 'live');
});

test('ambas jornadas están incluidas, y el estado cambia al terminar el día 15', () => {
  assert.equal(getEventState(Date.parse('2026-10-15T23:59:59-03:00')), 'live');
  assert.equal(getEventState(Date.parse('2026-10-16T00:00:00-03:00')), 'finished');
});
