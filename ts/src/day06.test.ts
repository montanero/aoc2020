import { resultA, resultB } from './day06';

test('result A', () => {
  expect(resultA("data/day06/input.txt")).toBe(6782);
});

test('result B', () => {
  expect(resultB("data/day06/input.txt")).toBe(3596);
});

