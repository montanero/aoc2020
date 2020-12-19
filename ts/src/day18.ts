import {readLinesFromFile} from './reader'


type Token = number | '(' | ')' | '+' | '*'


class Parser {

    public static readFile(filename: string): Token[][] {
        let arr: Token[][] = []
        readLinesFromFile(filename, line => {
            arr.push(this.tokenize(line))
        })
        return arr
    }


    private static tokenize(line: string): Token[] {
        const ret: Token[] = []
        let buffer = ""

        function flush(): void {
            if (buffer !== "") {
                ret.push(+buffer)
                buffer = ""
            }
        }

        for (const c of line) {
            switch (c) {
                case '(':
                case ')':
                case '+':
                case '*':
                    flush()
                    ret.push(c)
                    break
                default:
                case ' ':
                    flush();
                    break
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    buffer = buffer + c
                    break;
            }
        }
        flush()
        return ret
    }
}

export class EvaluatorA {
    evaluate(tokens: Token[]): number {
        const [i, akku] = this.evalSub(tokens, 0)
        return akku
    }

    evalSub(tokens: Token[], i: number): [idx: number, result: number] {
        let akku: number = 0;

        [i, akku] = this.evalSimple(tokens, i)

        while (i < tokens.length) {
            let t: Token = tokens[i++]
            if (t == '+') {
                let op: number
                [i, op] = this.evalSimple(tokens, i)
                akku += op
            } else if (t == '*') {
                let op: number
                [i, op] = this.evalSimple(tokens, i)
                akku *= op
            } else {
                --i
                break
            }
        }
        return [i, akku]
    }

    evalSimple(tokens: Token[], i: number): [idx: number, result: number] {
        let t = tokens[i++]
        if (t === '(') {
            let akku: number;
            [i, akku] = this.evalSub(tokens, i)
            t = tokens[i++]
            if (t != ')') {
                throw ("haeh")
            }
            return [i, akku]
        } else if (typeof (t) === 'number') {
            return [i, t]
        } else {
            throw ("haeh")
        }
    }
}


export function resultA(fileName: string): number {
    let tokens = Parser.readFile(fileName)
    let s = new EvaluatorA()
    let akku = 0
    for (const e of tokens) {
        akku += s.evaluate(e)
    }
    return akku
}

export class EvaluatorB {
    evaluate(tokens: Token[]): number {
        const [i, akku] = this.evalProduct(tokens, 0)
        return akku
    }

    evalProduct(tokens: Token[], i: number): [idx: number, result: number] {
        let akku: number = 0;

        [i, akku] = this.evalSum(tokens, i)

        while (i < tokens.length) {
            let t: Token = tokens[i++]
            if (t == '*') {
                let op: number
                [i, op] = this.evalSum(tokens, i)
                akku *= op
            } else {
                --i
                break
            }
        }
        return [i, akku]
    }

    evalSum(tokens: Token[], i: number): [idx: number, result: number] {
        let akku: number = 0;

        [i, akku] = this.evalSimple(tokens, i)

        while (i < tokens.length) {
            let t: Token = tokens[i++]
            if (t == '+') {
                let op: number
                [i, op] = this.evalSimple(tokens, i)
                akku += op
            } else {
                --i
                break
            }
        }
        return [i, akku]
    }

    evalSimple(tokens: Token[], i: number): [idx: number, result: number] {
        let t = tokens[i++]
        if (t === '(') {
            let akku: number;
            [i, akku] = this.evalProduct(tokens, i)
            t = tokens[i++]
            if (t != ')') {
                throw ("haeh")
            }
            return [i, akku]
        } else if (typeof (t) === 'number') {
            return [i, t]
        } else {
            throw ("haeh")
        }
    }
}

export function resultB(fileName: string): number {
    let tokens = Parser.readFile(fileName)
    let s = new EvaluatorB()
    let akku = 0
    for (const e of tokens) {
        akku += s.evaluate(e)
    }
    return akku
}