import {SolverA} from './day19';

test('result A', () => {
    let s = new SolverA()
    expect(s.solve("data/day19/input.txt")).toBe(160);
});
