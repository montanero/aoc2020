export class Node<T> {
    next: Node<T> | null = null
    data: T

    constructor(data: T) {
        this.data = data
    }
}

export class LinkedList<T> {
    head: Node<T> | null
    tail: Node<T> | null
    map: Map<T, Node<T>> = new Map()

    constructor() {
        this.head = null
        this.tail = null
    }

    push(data: T) {
        let node = new Node(data)
        this.map.set(data, node)
        if (this.tail === null) {
            this.head = node
            this.tail = node
        } else {
            this.tail.next = node
            this.tail = node
        }
    }

    findNode(data: T): Node<T> | null {
        let x = this.map.get(data)
        if (x)
            return x
        return null
    }

    isEmpty(): boolean {
        return this.head === null
    }

    insertAfter(node: Node<T>, list: T[]): void {
        if (list.length === 0)
            return

        const rest = node.next
        for (const v of list)
        {
            const newnode = new Node(v)
            node.next = newnode
            node = newnode
            this.map.set(v, newnode)
        }
        node.next = rest
        if (rest === null) {
            this.tail = node
        }
    }

    shift(): T | null {
        let node = this.head;
        if (node === null) {
            return null
        }
        this.head = node.next
        if (this.head === null) {
            this.tail = null
        }
        this.map.delete(node.data)
        return node.data
    }

    toList(): T[] {
        let ret: T[] = []
        for (let node = this.head; node !== null; node = node!.next) {
            ret.push(node.data)
        }
        return ret
    }
}
