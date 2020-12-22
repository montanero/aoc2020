import {readLinesFromFile} from './reader'
import {difference, union, intersect} from './sets'

type Allergene= string
type Ingredient = string

class Rule {
    ingredients: Set<Ingredient>
    allergens: Set<Allergene>

    constructor(ingredients: Ingredient[], allergens: Allergene[]) {
        this.ingredients = new Set(ingredients)
        this.allergens = new Set(allergens)
    }
}

function readList(fileName: string): Rule[] {
    let rules: Rule[] = []
    const re = /^(.*) \(contains (.*)\)/
    readLinesFromFile(fileName, line => {
        const match = re.exec(line)
        if (!match) {
            throw "wrong input format"
        }
        rules.push(new Rule(match[1].split(/\s+/), match[2].split(/\s*,\s*/)))
    })
    return rules
}

export function resultA(fileName: string): number {
    let rules = readList(fileName)
    let allergens = rules.map(r=>r.allergens).reduce ((a,b)=> union (a,b))
    let ingredients = rules.map(r=>r.ingredients).reduce ((a,b)=> union (a,b))
    let possibly:Map<string, Set<string>> = new Map()

    for (const allergene of allergens){
        const possiblyContains = rules.filter(r=>r.allergens.has(allergene)).map(r=>r.ingredients).reduce ((a,b)=>intersect(a,b))
        possibly.set(allergene, possiblyContains)
    }
    let dangerousIngredients = [...possibly.values()].reduce((a,b)=>union(a,b))
    let safeIngredients = difference (ingredients, dangerousIngredients)

    return rules.map(r=>r.ingredients).map(is=>intersect(is, safeIngredients).size).reduce((a,b)=>a+b)
}

export function resultB(fileName: string): string {
    let rules = readList(fileName)
    let allergens = rules.map(r => r.allergens).reduce((a, b) => union(a, b))
    let ingredients = rules.map(r => r.ingredients).reduce((a, b) => union(a, b))
    let possibly: Map<string, Set<string>> = new Map()
    for (const allergene of allergens) {
        const possiblyContains = rules.filter(r => r.allergens.has(allergene)).map(r => r.ingredients).reduce((a, b) => intersect(a, b))
        possibly.set(allergene, possiblyContains)
    }

    let known: Map<string, string> = new Map()

    while (possibly.size > 0) {
        [...possibly].filter(([k, v]) => v.size == 1).forEach(([allergen, v]) => {
            const ingredient = [...v][0]
            possibly.delete(allergen)
            known.set(allergen, ingredient);
            [...possibly.values()].forEach(ingreds => {
                ingreds.delete(ingredient)
            })
        })
    }
    return [...allergens].sort((a, b) => a < b ? -1 : 1).map(a => known.get(a)).join(",")
}