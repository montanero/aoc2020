import { resultA, resultB } from './day09';

test('result A', () => {
  expect(resultA("data/day09/input.txt")).toBe(26134589);
});

test('result B', () => {
  expect(resultB("data/day09/input.txt")).toBe(3535124);
});
