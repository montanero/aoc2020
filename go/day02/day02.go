package day02

import (
	"errors"
	"regexp"
	"strconv"

	"bergler.net/reader"
)

func Result(file string) (int, error) {
	pattern := regexp.MustCompile(`^(\d+)-(\d+) ([a-z]): ([a-z]+)$`)
	count := 0
	if data, err := reader.ReadStrings(file); err == nil {
		for _, d := range data {

			groups := pattern.FindStringSubmatch(d)
			i0, i1, c, passwd := atoi(groups[1]), atoi(groups[2]), runeAt(groups[3], 0), groups[4]
			if check(i0, i1, c, passwd) {
				count = count + 1
			}
		}
		return count, nil
	}
	return 0, errors.New("problem")
}

func check(min int, max int, c rune, val string) bool {
	count := 0
	for _, d := range val {
		if d == c {
			count++
		}
	}
	return count >= min && count <= max

}

func ResultB(file string) (int, error) {
	pattern := regexp.MustCompile(`^(\d+)-(\d+) ([a-z]): ([a-z]+)$`)
	count := 0
	if data, err := reader.ReadStrings(file); err == nil {
		for _, d := range data {

			groups := pattern.FindStringSubmatch(d)
			i0, i1, c, passwd := atoi(groups[1]), atoi(groups[2]), runeAt(groups[3], 0), groups[4]
			if check2(i0, i1, c, passwd) {
				count = count + 1
			}
		}
		return count, nil
	}
	return 0, errors.New("problem")
}

func check2(pos0 int, pos1 int, c rune, val string) bool {
	b0 := runeAt(val, pos0-1) == c
	b1 := runeAt(val, pos1-1) == c
	return b0 && !b1 || b1 && !b0
}

func atoi(s string) int {
	i0, e0 := strconv.Atoi(s)
	if e0 != nil {
		panic(e0)
	}
	return i0
}

func runeAt(s string, index int) rune {
	return []rune(s)[index]
}
