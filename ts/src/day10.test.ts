import { resultA, resultB } from './day10';

test('result A test1', () => {
  expect(resultA("data/day10/test1.txt")).toBe(35);
});


test('result A', () => {
  expect(resultA("data/day10/input.txt")).toBe(2738);
});

test('result B test', () => {
  expect(resultB("data/day10/test1.txt")).toBe(8);
});

test('result B', () => {
  expect(resultB("data/day10/input.txt")).toBe(74049191673856);
});
