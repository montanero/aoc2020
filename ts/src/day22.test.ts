import { resultA, resultB } from './day22';

test('result A', () => {
    expect(resultA("data/day22/input.txt")).toBe(30197);
});

test('test B', () => {
    expect(resultB("data/day22/test.txt")).toBe(291);
});

test('result B', () => {
    expect(resultB("data/day22/input.txt")).toBe(34031);
});
