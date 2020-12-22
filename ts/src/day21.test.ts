import { resultA} from './day21';

test('test A', () => {
    expect(resultA("data/day21/test.txt")).toBe(5);
});

test('result A', () => {
    expect(resultA("data/day21/input.txt")).toBe(1913);
});
