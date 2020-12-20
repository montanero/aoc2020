import {resultA, resultB, findSolution} from './day16';

test('result A test ', () => {
    expect(resultA("data/day16/test.txt")).toBe(71);
});

test('result A', () => {
    expect(resultA("data/day16/input.txt")).toBe(19070);
});

test('result B', () => {
    expect(resultB("data/day16/input.txt")).toBe(161926544831);
});

// test('xxx', () => {
//   let poss = new Map([
//     [0, new Set(["a"])],
//     [1, new Set(["a", "b"])],
//   ])
//   let solution = findSolution(new Map(), poss)
//   expect(solution!.get(0)).toBe("a")
//   expect(solution!.get(1)).toBe("b")
// });

// test('xx2', () => {
//   let poss = new Map([
//     [0, new Set(["a","b"])],
//     [1, new Set(["b"])],
//   ])
//   let solution = findSolution(new Map(), poss)
//   expect(solution!.get(0)).toBe("a")
//   expect(solution!.get(1)).toBe("b")

// });
