package day04

import (
	"regexp"
	"strconv"
	"strings"

	"bergler.net/reader"
)

func ResultB(file string) int {
	sdata, err := reader.ReadStrings(file)
	panicOnErr(err)
	sdata = append(sdata, "")
	valid := 0
	passport := make(map[string]string)
	for _, r := range sdata {
		if r != "" {

			convertLine(r, passport)
		} else {
			if len(passport) != 0 && isvalid2(passport) {
				valid++
			}
			passport = make(map[string]string)
		}
	}
	return valid
}

func isvalid2(m map[string]string) bool {
	if v, ok := m["byr"]; ok {
		i, err := strconv.Atoi(v)
		if err != nil || i < 1920 || i > 2002 {
			return false
		}
	} else {
		return false
	}

	if v, ok := m["iyr"]; ok {
		i, err := strconv.Atoi(v)
		if err != nil || i < 2010 || i > 2020 {
			return false
		}
	} else {
		return false
	}
	if v, ok := m["eyr"]; ok {
		i, err := strconv.Atoi(v)
		if err != nil || i < 2020 || i > 2030 {
			return false
		}
	} else {
		return false
	}
	if v, ok := m["hgt"]; ok {
		in := strings.TrimSuffix(v, "in")
		if in != v {
			i, err := strconv.Atoi(in)
			if err != nil || i < 59 || i > 76 {
				return false
			}
		} else {
			in := strings.TrimSuffix(v, "cm")
			if in != v {
				i, err := strconv.Atoi(in)
				if err != nil || i < 150 || i > 193 {
					return false
				}
			} else {
				return false
			}
		}
	} else {
		return false
	}
	if v, ok := m["hcl"]; ok {
		pattern := regexp.MustCompile(`^#[0-9a-f]{6}$`)
		if !pattern.MatchString(v) {
			return false
		}
	} else {
		return false
	}
	if v, ok := m["ecl"]; ok {
		pattern := regexp.MustCompile(`^(amb|blu|brn|gry|grn|hzl|oth)$`)
		if !pattern.MatchString(v) {
			return false
		}
	} else {
		return false
	}
	if v, ok := m["pid"]; ok {
		pattern := regexp.MustCompile(`^[0-9]{9}$`)
		if !pattern.MatchString(v) {
			return false
		}
	} else {
		return false
	}
	return true
}
