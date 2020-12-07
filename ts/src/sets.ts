function difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    var _difference = new Set(setA);
    for (let elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}

function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    var _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
}

function intersect<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    var _intersect = new Set(setA);
    for (let elem of setA) {
        if (!setB.has(elem)) {
            _intersect.delete(elem);
        }
    }
    return _intersect;
}

function equals<T>(setA: Set<T>, setB: Set<T>): boolean {
    return difference (union(setA, setB), setB).size == 0
}

export { difference, union, intersect, equals }