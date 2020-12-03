package day02

import "testing"

func TestResult(t *testing.T) {
	r := Result("data/test1.txt")
	if r != 7 {
		t.Errorf("Result was incorrect, got: %d, want: %d.", r, 7)
	}
}

func TestResult2(t *testing.T) {
	r := Result("data/input.txt")
	if r != 259 {
		t.Errorf("Result was incorrect, got: %d, want: %d.", r, 259)
	}
}

func TestResulBt(t *testing.T) {
	r := ResultB("data/test1.txt")
	if r != 336 {
		t.Errorf("Result was incorrect, got: %d, want: %d.", r, 336)
	}
}

func TestResultB2(t *testing.T) {
	r := ResultB("data/input.txt")
	if r != 2224913600 {
		t.Errorf("Result was incorrect, got: %d, want: %d.", r, 2224913600)
	}
}
