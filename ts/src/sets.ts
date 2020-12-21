export function difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    var _difference = new Set(setA);
    for (let elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}

export function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    var _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
}

export function intersect<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    var _intersect = new Set(setA);
    for (let elem of setA) {
        if (!setB.has(elem)) {
            _intersect.delete(elem);
        }
    }
    return _intersect;
}

export function equals<T>(setA: Set<T>, setB: Set<T>): boolean {
    return difference(union(setA, setB), setB).size == 0
}

export function hasIntersection<T>(setA: Set<T>, setB: Set<T>): boolean {
    for (let elem of setA) {
        if (setB.has(elem)) {
            return true
        }
    }
    return false
}
