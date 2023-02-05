const gameStateKey = 'gameState'
const highContrastKey = 'highContrast'

type StoredGameState = {
    guesses: string[]
    solution: string
}

export const saveGameStateToLocalStorage = (gameState: StoredGameState) => {
    localStorage.setItem(gameStateKey, JSON.stringify(gameState))
}

export const loadGameStateFromLocalStorage = () => {
    const state = localStorage.getItem(gameStateKey)
    return state ? (JSON.parse(state) as StoredGameState) : null
}

const gameStatKey = 'gameStats'

export type GameStats = {
    winDistribution: number[]
    gamesFailed: number
    currentStreak: number
    bestStreak: number
    totalGames: number
    successRate: number
}

const UNSTOPPABLE_DATA_KEY = 'unstoppableData'

export type unstoppableObject = {
    displayName: string | null
    uid: string | null
}

export const saveUnstoppableUserToLocalStorage = (
    unstoppableUser: unstoppableObject
) => {
    const { displayName, uid } = unstoppableUser

    const objectData = {
        displayName,
        uid,
    }

    localStorage.setItem(UNSTOPPABLE_DATA_KEY, JSON.stringify(objectData))
}

export const deleteUnstoppableUserFromLocalStorage = () => {
    localStorage.removeItem(UNSTOPPABLE_DATA_KEY)
}

export const getUnstoppableUser = () => {
    const unstoppableUserLocal = JSON.parse(
        localStorage.getItem(UNSTOPPABLE_DATA_KEY) || '{}'
    )
    return unstoppableUserLocal
}

export type twitterObject = {
    displayName: string | null
    uid: string | null
}

export const saveStatsToLocalStorage = (gameStats: GameStats) => {
    localStorage.setItem(gameStatKey, JSON.stringify(gameStats))
}

export const loadStatsFromLocalStorage = () => {
    const stats = localStorage.getItem(gameStatKey)
    return stats ? (JSON.parse(stats) as GameStats) : null
}

export const setStoredIsHighContrastMode = (isHighContrast: boolean) => {
    if (isHighContrast) {
        localStorage.setItem(highContrastKey, '1')
    } else {
        localStorage.removeItem(highContrastKey)
    }
}

export const getStoredIsHighContrastMode = () => {
    const highContrast = localStorage.getItem(highContrastKey)
    return highContrast === '1'
}

export const saveTwitterUserToLocalStorage = (twitterUser: twitterObject) => {
    const { displayName, uid } = twitterUser

    const objectData = {
        displayName,
        uid,
    }
    localStorage.setItem('twitterData', JSON.stringify(objectData))
}

export const deleteTwitterUserFromLocalStorage = () => {
    localStorage.removeItem('twitterData')
}

export const getTwitterUser = () => {
    const twitterUserLocal = JSON.parse(
        localStorage.getItem('twitterData') || '{}'
    )
    return twitterUserLocal
}
