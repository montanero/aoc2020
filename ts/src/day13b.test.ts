import { SolverB } from './day13b';

test('result B test', () => {
  expect(SolverB.result("data/day13/test.txt")).toBe(1068781n);
}); 


test('result B', () => {
  expect(SolverB.result("data/day13/input.txt")).toBe(404517869995362n);
});
