package day01

import (
	"errors"
	"strconv"

	"bergler.net/reader"
)

func Result(file string) (int, error) {
	if data, err := reader.ReadNumbers(file); err == nil {
		if ndata, err := toNum(data); err == nil {

			for _, i1 := range ndata {
				for _, i2 := range ndata {
					if i1+i2 == 2020 {
						return i1 * i2, nil
					}
				}
			}

		}
	}
	return 0, errors.New("problem")
}

func ResultB(file string) (int, error) {
	if data, err := reader.ReadNumbers(file); err == nil {
		if ndata, err := toNum(data); err == nil {

			for _, i1 := range ndata {
				for _, i2 := range ndata {
					for _, i3 := range ndata {
						if i1+i2+i3 == 2020 {
							return i1 * i2 * i3, nil
						}
					}
				}

			}
		}
	}
	return 0, errors.New("problem")
}

func toNum(ss []string) ([]int, error) {
	retval := make([]int, 0)
	for _, s := range ss {
		i, err := strconv.Atoi(s)
		if err != nil {
			return nil, err
		}

		retval = append(retval, i)
	}
	return retval, nil

}
