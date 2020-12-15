import { resultA } from './day15';

test('result A test ', () => {
  expect(resultA("0,3,6")).toBe(436);
}); 

test('result A', () => {
  expect(resultA("0,13,1,16,6,17")).toBe(234);
}); 

