import { resultA, resultB } from './day15';

test('result A test ', () => {
  expect(resultA("0,3,6")).toBe(436);
}); 

test('result A', () => {
  expect(resultA("0,13,1,16,6,17")).toBe(234);
}); 

test('result B test ', () => {
  expect(resultB("0,3,6", 2020)).toBe(436);
}); 

test('result B', () => {
  expect(resultB("0,13,1,16,6,17",  30000000)).toBe(8984);
}); 
