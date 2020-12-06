import { resultA, resultB } from './day05';

test('result A', () => {
  expect(resultA("data/day05/input.txt")).toBe(913);
});

test('result B', () => {
  expect(resultB("data/day05/input.txt")).toBe(717);
});

