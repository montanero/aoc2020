package day01

import "testing"

func TestResult(t *testing.T) {
	r, err := Result("data/day01_test1.txt")
	if err != nil {
		t.Error(err)
	}
	if r != 514579 {
		t.Errorf("Result was incorrect, got: %d, want: %d.", r, 514579)
	}

	r2, err2 := Result("data/input.txt")
	if err2 != nil {
		t.Error(err2)
	}
	if r2 != 157059 {
		t.Errorf("Result was incorrect, got: %d, want: %d.", r2, 157059)
	}

}

func TestResultB(t *testing.T) {

	r2, err2 := ResultB("data/input.txt")
	if err2 != nil {
		t.Error(err2)
	}
	if r2 != 165080960 {
		t.Errorf("ResultB was incorrect, got: %d, want: %d.", r2, 165080960)
	}

}
