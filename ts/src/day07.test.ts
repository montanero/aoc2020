import { resultA, resultB } from './day07';

test('result A testdata', () => {
  expect(resultA("data/day07/test.txt")).toBe(4);
});

test('result A', () => {
  expect(resultA("data/day07/input.txt")).toBe(192);
});

test('result B testdata 1', () => {
  expect(resultB("data/day07/test.txt")).toBe(32);
});

test('result B testdata 2', () => {
  expect(resultB("data/day07/test2.txt")).toBe(126);
});

test('result B', () => {
  expect(resultB("data/day07/input.txt")).toBe(12128);
});
