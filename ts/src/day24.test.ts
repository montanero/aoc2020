import {resultA,resultB} from './day24';

test('result A', () => {
    expect(resultA("data/day24/input.txt")).toBe(360);
});

test('result B', () => {
    expect(resultB("data/day24/input.txt")).toBe(3924);
});
