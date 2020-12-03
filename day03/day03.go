package day02

import (
	"bergler.net/reader"
)

func Result(file string) int {
	data, err := reader.ReadStrings(file)
	panicOnErr(err)
	return trees(data, 3, 1)
}

func ResultB(file string) int {
	data, err := reader.ReadStrings(file)
	panicOnErr(err)
	return trees(data, 1, 1)*trees(data,3,1)*trees(data,5,1)*trees(data,7,1)*trees(data,1,2)
}

func trees(data []string, deltax int, deltay int) int {
	x, y := 0, 0
	trees := 0
	width := len(data[0])
	for y < len(data) {
		if runeAt(data[y], x%width) == '#' {
			trees++
		}
		x += deltax
		y += deltay
	}
	return trees
}

func runeAt(s string, index int) rune {
	return []rune(s)[index]
}

func panicOnErr(err error) {
	if err != nil {
		panic(err)
	}

}
