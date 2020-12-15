import { resultA,resultB } from './day14';

test('result A ', () => {
  expect(resultA("data/day14/input.txt")).toBe(2346881602152);
}); 

test('result B', () => {
  expect(resultB("data/day14/input.txt")).toBe(3885232834169);
}); 
