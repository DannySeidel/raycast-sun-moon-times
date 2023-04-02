import { LocalStorage, showToast, Toast } from "@raycast/api"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { CityItem } from "../../types/CityItem"

interface FavoritesContextProps {
    favorites: CityItem[]
    addToFavorites: (cityInfo: CityItem) => Promise<void>
    removeFromFavorites: (geonameId: number) => Promise<void>
}

interface FavoritesProviderProps {
    children?: ReactNode
}

const initialFavoritesContext: FavoritesContextProps = {
    favorites: [],
    addToFavorites: () => new Promise(() => Promise<object>),
    removeFromFavorites: () => new Promise(() => Promise<object>),
}

const FavoritesContext = createContext<FavoritesContextProps>(initialFavoritesContext)

export const FavoritesProvider = ({ children }: FavoritesProviderProps) => {
    const [favorites, setFavorites] = useState<CityItem[]>(initialFavoritesContext.favorites)

    useEffect(() => {
        async function getFavorites() {
            const favorites = await LocalStorage.getItem("favorites")
            if (favorites) {
                setFavorites(JSON.parse(favorites.toString()))
            }
        }

        getFavorites()
    }, [])

    async function addToFavorites(cityInfo: CityItem): Promise<void> {
        if (favorites.some((favorite: CityItem) => favorite.geonameId === cityInfo.geonameId)) {
            await showToast({
                style: Toast.Style.Failure,
                title: `${cityInfo.name} is already in your favorites`,
            })
        } else {
            const newFavorites = [...favorites, cityInfo]
            await LocalStorage.setItem("favorites", JSON.stringify(newFavorites))
            setFavorites(newFavorites)
        }
    }

    async function removeFromFavorites(geonameId: number): Promise<void> {
        if (favorites.some((favorite: CityItem) => favorite.geonameId === geonameId)) {
            const newFavorites = favorites.filter((favorite: CityItem) => favorite.geonameId !== geonameId)
            await LocalStorage.setItem("favorites", JSON.stringify(newFavorites))
            setFavorites(newFavorites)
        }
    }

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export const useFavorites = () => {
    const context = useContext(FavoritesContext)
    if (!context) {
        throw new Error("useFavorites must be used within a FavoritesProvider")
    }
    return context
}
