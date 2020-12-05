package day02

import "testing"

func TestResult(t *testing.T) {
	r, err := Result("data/test1.txt")
	if err != nil {
		t.Error(err)
	}
	if r != 2 {
		t.Errorf("Result was incorrect, got: %d, want: %d.", r, 2)
	}

	r2, err2 := Result("data/input.txt")
	if err2 != nil {
		t.Error(err2)
	}
	if r2 != 469 {
		t.Errorf("Result was incorrect, got: %d, want: %d.", r2, 469)
	}
}

func TestResultB(t *testing.T) {
	r, err := ResultB("data/test1.txt")
	if err != nil {
		t.Error(err)
	}
	if r != 1 {
		t.Errorf("Result was incorrect, got: %d, want: %d.", r, 1)
	}

	r2, err2 := ResultB("data/input.txt")
	if err2 != nil {
		t.Error(err2)
	}
	if r2 != 267 {
		t.Errorf("Result was incorrect, got: %d, want: %d.", r2, 267)
	}
}
