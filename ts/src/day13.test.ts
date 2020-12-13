import { SolverA } from './day13';

test('result A test', () => {
  expect(SolverA.result("data/day13/test.txt")).toBe(295);
});


test('result B', () => {
  expect(SolverA.result("data/day13/input.txt")).toBe(156);
});
