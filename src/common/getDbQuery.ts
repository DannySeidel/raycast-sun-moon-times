export function getDbQuery(searchText: string): string {
    if (searchText.length < 3) {
        return `SELECT id
                FROM cities
                WHERE name LIKE '----';`
    } else {
        return `SELECT id, name, country, lon, lat
                FROM cities
                WHERE name LIKE '%${searchText}%'
                ORDER BY population DESC;`
    }
}
