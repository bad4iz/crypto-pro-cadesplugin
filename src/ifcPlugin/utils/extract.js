export const extract = (from, what) => {
    if (!extract.cache) {
        extract.cache = {}
    }
    if (!extract.cache[from]) {
        extract.cache[from] = from.split(',').reduce((accum, current) => {
            const [name, value] = current.split('=').map((item) => item.trim())
            accum[name] = value
            return accum
        }, {})
    }
    return extract.cache[from][what.replace(/=$/, '')] || ''
}
