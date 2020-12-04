package day04

import "testing"

func TestResult(t *testing.T) {
	r := Result("data/test1.txt")
	if r != 2 {
		t.Errorf("Result was incorrect, got: %d, want: %d.", r, 2)
	}
}

func TestResult2(t *testing.T) {
	r := Result("data/input.txt")
	if r != 264 {
		t.Errorf("Result was incorrect, got: %d, want: %d.", r, 264)
	}
}

func TestInvalidB(t *testing.T) {
	r := ResultB("data/invalidB.txt")
	if r != 0 {
		t.Errorf("Result was incorrect, got: %d, want: %d.", r, 0)
	}
}

func TestValidB(t *testing.T) {
	r := ResultB("data/validB.txt")
	if r != 4 {
		t.Errorf("Result was incorrect, got: %d, want: %d.", r, 4)
	}
}

func TestResultB(t *testing.T) {
	r := ResultB("data/input.txt")
	if r != 264 {
		t.Errorf("Result was incorrect, got: %d, want: %d.", r, 264)
	}
}
