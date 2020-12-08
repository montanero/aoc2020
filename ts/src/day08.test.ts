import { resultA, resultB } from './day08';

test('result A test', () => {
  expect(resultA("data/day08/test.txt")).toBe(5);
});


test('result A', () => {
  expect(resultA("data/day08/input.txt")).toBe(1939);
});

test('result B', () => {
  expect(resultB("data/day08/input.txt")).toBe(2212);
});
