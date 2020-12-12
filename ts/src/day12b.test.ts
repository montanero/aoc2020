import { result } from './day12b';

test('result B test', () => {
  expect(result("data/day12/test.txt")).toBe(286);
});


test('result B', () => {
  expect(result("data/day12/input.txt")).toBe(25235);
});
