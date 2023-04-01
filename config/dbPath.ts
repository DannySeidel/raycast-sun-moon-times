import { homedir } from "os"
import { resolve } from "path"

export const dbPath = resolve(homedir() + "/development/private/sun-moon-times/assets/cities.db")
