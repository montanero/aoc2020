import {resultA, resultB} from './day23b';

test('test A', () => {
    expect(resultA("389125467", 10)).toBe("92658374");
});

test('result A', () => {
    expect(resultA("315679824", 100)).toBe("72496583");
});

test('test B', () => {
    expect(resultB("389125467", 1_000_000, 10_000_000)).toBe(149245887792);
});

test('result B', () => {
    expect(resultB("315679824", 1_000_000, 10_000_000)).toBe(41785843847);
});
