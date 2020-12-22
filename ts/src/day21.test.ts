import {resultA, resultB} from './day21';

test('test A', () => {
    expect(resultA("data/day21/test.txt")).toBe(5);
});

test('result A', () => {
    expect(resultA("data/day21/input.txt")).toBe(1913);
});

test('test B', () => {
    expect(resultB("data/day21/test.txt")).toBe("mxmxvkd,sqjhc,fvjkl");
});

test('result B', () => {
    expect(resultB("data/day21/input.txt")).toBe("gpgrb,tjlz,gtjmd,spbxz,pfdkkzp,xcfpc,txzv,znqbr");
});
