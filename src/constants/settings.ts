import { solution } from '../lib/words'

export const MAX_WORD_LENGTH = solution.length
export const MAX_CHALLENGES = 3
export const BASE_SCORE = 100
export const ALERT_TIME_MS = 2000
export const REVEAL_TIME_MS = 350
export const GAME_LOST_INFO_DELAY = (MAX_WORD_LENGTH + 1) * REVEAL_TIME_MS
export const WELCOME_INFO_MODAL_MS = 350
export const MAX_QTY_USERS_PER_PAGE = 10
export const MAX_POINTS = MAX_CHALLENGES * BASE_SCORE
