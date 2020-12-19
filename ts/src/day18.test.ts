import {resultA, resultB} from './day18';

test('result A', () => {
    expect(resultA("data/day18/input.txt")).toBe(24650385570008);
});

test('result B', () => {
    expect(resultB("data/day18/input.txt")).toBe(158183007916215);
});
