import {Bits, Border, Orientation, OrientedTile, resultA, resultB, Tile} from './day20';

test('test A', () => {
    expect(resultA("data/day20/test.txt")).toBe(20899048083289);
});

test('test B', () => {
    expect(resultB("data/day20/test.txt")).toBe(273);
});

test('result A', () => {
    expect(resultA("data/day20/input.txt")).toBe(18482479935793);
});

test('result B', () => {
    expect(resultB("data/day20/input.txt")).toBe(2118);
});

test('test Bits rotate', () => {
    expect(Bits.rotate(0b1011, 6 )).toBe(0b110100);
});

test('test Bits string', () => {
    expect(Bits.stringToBits("#.##")).toBe(0b1011);
});

test('test Tile construction', () => {
    let tile = new Tile(4711,[
        "........1.",
        "1.........",
        "1.........",
        "1.........",
        "1.........",
        "..........",
        "..........",
        ".........1",
        ".........1",
        ".111......",
    ] )
    const b0 = tile.borders[Orientation.NONE_NONE]
    expect(b0[Border.TOP]).toBe(0b10)
    expect(b0[Border.RIGHT]).toBe(0b110)
    expect(b0[Border.BOTTOM]).toBe(0b111000000)
    expect(b0[Border.LEFT]).toBe(0b111100000)

    const br = tile.borders[Orientation.NONE_RIGHT]
    expect(br[Border.TOP]).toBe(0b11110)
    expect(br[Border.RIGHT]).toBe(0b10)
    expect(br[Border.BOTTOM]).toBe(0b110000000)
    expect(br[Border.LEFT]).toBe(0b111000000)

    const bh = tile.borders[Orientation.HORIZONTAL_NONE]
    expect(bh[Border.TOP]).toBe(0b100000000)
    expect(bh[Border.RIGHT]).toBe(0b111100000)
    expect(bh[Border.BOTTOM]).toBe(0b1110)
    expect(bh[Border.LEFT]).toBe(0b110)
});

test('test Tile rotation access', () => {
    let tile = new Tile(4711, [
        ".#........",
        "..........",
        "..........",
        "..........",
        "..........",
        "..........",
        "..........",
        "..........",
        "..........",
        ".........."
    ])
    expect(new OrientedTile(tile, Orientation.NONE_NONE).getPixel(1,0)).toBe(true)
    expect(new OrientedTile(tile, Orientation.NONE_RIGHT).getPixel(9,1)).toBe(true)
    expect(new OrientedTile(tile, Orientation.NONE_TWO).getPixel(8,9)).toBe(true)
    expect(new OrientedTile(tile, Orientation.NONE_LEFT).getPixel(0,8)).toBe(true)

    expect(new OrientedTile(tile, Orientation.HORIZONTAL_NONE).getPixel(8,0)).toBe(true)
    expect(new OrientedTile(tile, Orientation.HORIZONTAL_RIGHT).getPixel(9,8)).toBe(true)
    expect(new OrientedTile(tile, Orientation.HORIZONTAL_TWO).getPixel(1,9)).toBe(true)
    expect(new OrientedTile(tile, Orientation.HORIZONTAL_LEFT).getPixel(0,1)).toBe(true)


})