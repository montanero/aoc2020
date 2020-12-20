import {SolverA, SolverB} from './day19';

test('result A', () => {
    let s = new SolverA()
    expect(s.solve("data/day19/input.txt")).toBe(160);
});


test('result B', () => {
    let s = new SolverB()
    expect(s.solve("data/day19/input.txt")).toBe(160);
});