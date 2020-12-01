package reader

import (
	"bufio"
	"log"
	"os"
)

func ReadNumbers(filepath string) ([]string, error) {
	retval := make([]string, 0)
	file, err := os.Open(filepath)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		retval = append(retval, scanner.Text())
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
		return nil, err
	}

	return retval, nil
}
