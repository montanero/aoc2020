import { resultA, resultB } from './day07';

test('result A testdata', () => {
  expect(resultA("data/day07/test.txt")).toBe(4);
});

test('result A', () => {
  expect(resultA("data/day07/input.txt")).toBe(192);
});

