import { Command, Heading, Move, Position, resultA } from './day12';

test('result A test', () => {
  expect(resultA("data/day12/test.txt")).toBe(25);
});


test('result A', () => {
  expect(resultA("data/day12/input.txt")).toBe(1533);
});

test('position moves', () => {
  const p0 = new Position(0, 0, Heading.E)
  expect(p0.execute(new Command(Heading.N, 1))).toMatchObject({ x: 0, y: -1, h: Heading.E })
  expect(p0.execute(new Command(Heading.E, 1))).toMatchObject({ x: 1, y: 0, h: Heading.E })
  expect(p0.execute(new Command(Heading.S, 1))).toMatchObject({ x: 0, y: 1, h: Heading.E })
  expect(p0.execute(new Command(Heading.W, 1))).toMatchObject({ x: -1, y: 0, h: Heading.E })
});

test('position turns', () => {
  const p0 = new Position(0, 0, Heading.E)
  expect(p0.execute(new Command(Move.L, 0))).toMatchObject({ x: 0, y: 0, h: Heading.E })
  expect(p0.execute(new Command(Move.L, 90))).toMatchObject({ x: 0, y: 0, h: Heading.N })
  expect(p0.execute(new Command(Move.L, 180))).toMatchObject({ x: 0, y: 0, h: Heading.W })
  expect(p0.execute(new Command(Move.L, 270))).toMatchObject({ x: 0, y: 0, h: Heading.S })
  expect(p0.execute(new Command(Move.L, 360))).toMatchObject({ x: 0, y: 0, h: Heading.E })

  expect(p0.execute(new Command(Move.R, 0))).toMatchObject({ x: 0, y: 0, h: Heading.E })
  expect(p0.execute(new Command(Move.R, 90))).toMatchObject({ x: 0, y: 0, h: Heading.S })
  expect(p0.execute(new Command(Move.R, 180))).toMatchObject({ x: 0, y: 0, h: Heading.W })
  expect(p0.execute(new Command(Move.R, 270))).toMatchObject({ x: 0, y: 0, h: Heading.N })
  expect(p0.execute(new Command(Move.R, 360))).toMatchObject({ x: 0, y: 0, h: Heading.E })

});
