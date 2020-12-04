package day04

import (
	"regexp"
	"strings"

	"bergler.net/reader"
)

func Result(file string) int {
	sdata, err := reader.ReadStrings(file)
	panicOnErr(err)
	sdata = append(sdata, "")
	valid := 0
	passport := make(map[string]string)
	for _, r := range sdata {
		if r != "" {

			convertLine(r, passport)
		} else {
			if len(passport) != 0 && isvalid(passport) {
				valid++
			}
			passport = make(map[string]string)
		}
	}
	return valid
}

func isvalid(m map[string]string) bool {
	if _, ok := m["byr"]; !ok {
		return false
	}
	if _, ok := m["iyr"]; !ok {
		return false
	}
	if _, ok := m["eyr"]; !ok {
		return false
	}
	if _, ok := m["hgt"]; !ok {
		return false
	}
	if _, ok := m["hcl"]; !ok {
		return false
	}
	if _, ok := m["ecl"]; !ok {
		return false
	}
	if _, ok := m["pid"]; !ok {
		return false
	}
	return true
}

func convertLine(s string, m map[string]string) {
	pattern := regexp.MustCompile(`^(.+):(.+)$`)
	fields := strings.Split(s, " ")
	for _, f := range fields {
		groups := pattern.FindStringSubmatch(f)
		m[groups[1]] = groups[2]
	}
}

func runeAt(s string, index int) rune {
	return []rune(s)[index]
}

func panicOnErr(err error) {
	if err != nil {
		panic(err)
	}

}
