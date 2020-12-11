import { resultA, resultB} from './day11';

test('result A test1', () => {
  expect(resultA("data/day11/test.txt")).toBe(37);
});


test('result A', () => {
  expect(resultA("data/day11/input.txt")).toBe(2238);
});

test('result B test1', () => {
  expect(resultB("data/day11/test.txt")).toBe(26);
});

test('result B', () => {
  expect(resultB("data/day11/input.txt")).toBe(2013);
});
