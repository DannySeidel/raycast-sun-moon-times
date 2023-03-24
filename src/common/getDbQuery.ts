export function getDbQuery(searchText: string): string {
    // display saved cities if no search text
    if (searchText.length === 0) {
        return `SELECT id
                FROM cities
                WHERE name like '----';`
    }

    // display cities with population > 100,000 if search text is 2 characters or less to avoid heap overflow
    if (searchText.length < 3) {
        return `SELECT id, name, country, timezone, lon, lat
                FROM cities
                WHERE name LIKE '${searchText}%'
                  AND population > 100000
                ORDER BY population DESC;`
    }

    // display cities if search text is 3 characters or more
    return `SELECT id, name, country, timezone, lon, lat
            FROM cities
            WHERE name LIKE '${searchText}%'
            ORDER BY population DESC;`
}
