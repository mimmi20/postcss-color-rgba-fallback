import * as fs from 'node:fs';
import postcss from 'postcss';
import plugin from '../index.js';
import { describe, it, expect } from 'vitest';

function filename(name) {
  return 'test/' + name + '.css';
}
function read(name) {
  return fs.readFileSync(name, 'utf8');
}

describe('hex', () => {
  const tests = [
    {
      name: 'rgba-fallback',
      options: {},
    },
    {
      name: 'rgba-double-fallback',
      options: {},
    },
    {
      name: 'no-rgba-fallback',
      options: {},
    },
    {
      name: 'rgba-fallback-option',
      options: { properties: ['box-shadow'] },
    },
    {
      name: 'rgba-background-fallback',
      options: { backgroundColor: [255, 255, 255] },
    },
  ];

  tests.forEach(({ name, options }) => {
    it(name, function () {
      const postcssOpts = { from: filename('fixtures/' + name) };

      const actual = postcss().use(plugin(options)).process(read(postcssOpts.from), postcssOpts).css;
      const expected = read(filename('fixtures/' + name + '.expected'));

      expect(actual).toBe(expected);
    });
  });
});
