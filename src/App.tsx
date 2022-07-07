import { useState, useEffect, useContext } from 'react'
import { Grid } from './components/grid/Grid'
import { Keyboard } from './components/keyboard/Keyboard'
import { InfoModal } from './components/modals/InfoModal'
import { StatsModal } from './components/modals/StatsModal'
import { SettingsModal } from './components/modals/SettingsModal'
import { RankingModal } from './components/modals/RankingModal'

import {
    WIN_MESSAGES,
    GAME_COPIED_MESSAGE,
    NOT_ENOUGH_LETTERS_MESSAGE,
    WORD_NOT_FOUND_MESSAGE,
    CORRECT_WORD_MESSAGE,
    HARD_MODE_ALERT_MESSAGE,
    GAME_TITLE,
} from './constants/strings'
import {
    MAX_WORD_LENGTH,
    MAX_CHALLENGES,
    REVEAL_TIME_MS,
    GAME_LOST_INFO_DELAY,
    WELCOME_INFO_MODAL_MS,
} from './constants/settings'
import {
    isWordInWordList,
    isWinningWord,
    solution,
    findFirstUnusedReveal,
    unicodeLength,
} from './lib/words'
import { addStatsForCompletedGame, loadStats } from './lib/stats'
import {
    loadGameStateFromLocalStorage,
    saveGameStateToLocalStorage,
    setStoredIsHighContrastMode,
    getStoredIsHighContrastMode,
} from './lib/localStorage'
import { default as GraphemeSplitter } from 'grapheme-splitter'

import './App.css'
import { AlertContainer } from './components/alerts/AlertContainer'
import { useAlert } from './context/AlertContext'
import { Navbar } from './components/navbar/Navbar'
import { updateScore } from './lib/firebaseActions'
import { TwitterCtx } from './context/TwitterContext'

function App() {
    const twitterContext = useContext(TwitterCtx)
    const prefersDarkMode = window.matchMedia(
        '(prefers-color-scheme: dark)'
    ).matches

    const { showError: showErrorAlert, showSuccess: showSuccessAlert } =
        useAlert()
    const [currentGuess, setCurrentGuess] = useState('')
    const [isGameWon, setIsGameWon] = useState(false)
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false)
    const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
    const [isRankingModalOpen, setIsRankingModalOpen] = useState(false)
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
    const [currentRowClass, setCurrentRowClass] = useState('')
    const [isGameLost, setIsGameLost] = useState(false)
    const [isTwitterEnabled, setIsTwitterEnabled] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem('theme')
            ? localStorage.getItem('theme') === 'dark'
            : prefersDarkMode
            ? true
            : false
    )
    const [isHighContrastMode, setIsHighContrastMode] = useState(
        getStoredIsHighContrastMode()
    )
    const [isRevealing, setIsRevealing] = useState(false)
    const [guesses, setGuesses] = useState<string[]>(() => {
        const loaded = loadGameStateFromLocalStorage()
        if (loaded?.solution !== solution) {
            return []
        }
        const gameWasWon = loaded.guesses.includes(solution)
        if (gameWasWon) {
            setIsGameWon(true)
        }
        if (loaded.guesses.length === MAX_CHALLENGES && !gameWasWon) {
            setIsGameLost(true)
            showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
                persist: true,
            })
        }

        return loaded.guesses
    })

    const [stats, setStats] = useState(() => loadStats())
    const [imageHash, setImageHash] = useState('')

    const [isHardMode, setIsHardMode] = useState(
        localStorage.getItem('gameMode')
            ? localStorage.getItem('gameMode') === 'hard'
            : false
    )

    const hash = async (string: string) => {
        const utf8 = new TextEncoder().encode(string)
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray
            .map((bytes) => bytes.toString(16).padStart(2, '0'))
            .join('')
        return hashHex
    }

    useEffect(() => {
        // if no game state on load,
        // show the user the how-to info modal
        if (!loadGameStateFromLocalStorage()) {
            setTimeout(() => {
                setIsInfoModalOpen(true)
            }, WELCOME_INFO_MODAL_MS)
        }
        const initHash = async () => {
            setImageHash(await hash(solution))
        }
        initHash()
    }, [])

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

        if (isHighContrastMode) {
            document.documentElement.classList.add('high-contrast')
        } else {
            document.documentElement.classList.remove('high-contrast')
        }
    }, [isDarkMode, isHighContrastMode])

    const handleDarkMode = (isDark: boolean) => {
        setIsDarkMode(isDark)
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
    }

    const handleHardMode = (isHard: boolean) => {
        if (
            guesses.length === 0 ||
            localStorage.getItem('gameMode') === 'hard'
        ) {
            setIsHardMode(isHard)
            localStorage.setItem('gameMode', isHard ? 'hard' : 'normal')
        } else {
            showErrorAlert(HARD_MODE_ALERT_MESSAGE)
        }
    }

    const handleTwitterUser = (isTwitterEnabled: boolean) => {
        setIsTwitterEnabled(isTwitterEnabled)
        if (isTwitterEnabled) {
            twitterContext?.twitterSignIn()
        }

        if (!isTwitterEnabled) {
            twitterContext?.twitterSignOut()
        }
    }

    const handleHighContrastMode = (isHighContrast: boolean) => {
        setIsHighContrastMode(isHighContrast)
        setStoredIsHighContrastMode(isHighContrast)
    }

    const clearCurrentRowClass = () => {
        setCurrentRowClass('')
    }

    useEffect(() => {
        saveGameStateToLocalStorage({ guesses, solution })
    }, [guesses])

    useEffect(() => {
        if (isGameWon) {
            const winMessage =
                WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)]
            const delayMs = REVEAL_TIME_MS * MAX_WORD_LENGTH

            showSuccessAlert(winMessage, {
                delayMs,
                onClose: () => setIsStatsModalOpen(true),
            })
        }

        if (isGameLost) {
            setTimeout(() => {
                setIsStatsModalOpen(true)
            }, GAME_LOST_INFO_DELAY)
        }
    }, [isGameWon, isGameLost, showSuccessAlert])

    useEffect(() => {
        setIsTwitterEnabled(twitterContext?.authenticated ? true : false)
    }, [twitterContext?.authenticated])

    const onChar = (value: string) => {
        if (
            unicodeLength(`${currentGuess}${value}`) <= MAX_WORD_LENGTH &&
            guesses.length < MAX_CHALLENGES &&
            !isGameWon
        ) {
            setCurrentGuess(`${currentGuess}${value}`)
        }
    }

    const onDelete = () => {
        setCurrentGuess(
            new GraphemeSplitter()
                .splitGraphemes(currentGuess)
                .slice(0, -1)
                .join('')
        )
    }

    const onEnter = () => {
        if (isGameWon || isGameLost) {
            return
        }

        if (!(unicodeLength(currentGuess) === MAX_WORD_LENGTH)) {
            setCurrentRowClass('jiggle')
            return showErrorAlert(NOT_ENOUGH_LETTERS_MESSAGE, {
                onClose: clearCurrentRowClass,
            })
        }

        if (!isWordInWordList(currentGuess)) {
            setCurrentRowClass('jiggle')
            return showErrorAlert(WORD_NOT_FOUND_MESSAGE, {
                onClose: clearCurrentRowClass,
            })
        }

        // enforce hard mode - all guesses must contain all previously revealed letters
        if (isHardMode) {
            const firstMissingReveal = findFirstUnusedReveal(
                currentGuess,
                guesses
            )
            if (firstMissingReveal) {
                setCurrentRowClass('jiggle')
                return showErrorAlert(firstMissingReveal, {
                    onClose: clearCurrentRowClass,
                })
            }
        }

        setIsRevealing(true)
        // turn this back off after all
        // chars have been revealed
        setTimeout(() => {
            setIsRevealing(false)
        }, REVEAL_TIME_MS * MAX_WORD_LENGTH)

        const winningWord = isWinningWord(currentGuess)

        if (
            unicodeLength(currentGuess) === MAX_WORD_LENGTH &&
            guesses.length < MAX_CHALLENGES &&
            !isGameWon
        ) {
            setGuesses([...guesses, currentGuess])
            setCurrentGuess('')

            if (winningWord) {
                updateScore(guesses.length)
                setStats(addStatsForCompletedGame(stats, guesses.length))
                return setIsGameWon(true)
            }

            if (guesses.length === MAX_CHALLENGES - 1) {
                setStats(addStatsForCompletedGame(stats, guesses.length + 1))
                setIsGameLost(true)
                updateScore(6)
                showErrorAlert(CORRECT_WORD_MESSAGE(solution), {
                    persist: true,
                    delayMs: REVEAL_TIME_MS * MAX_WORD_LENGTH + 1,
                })
            }
        }
    }

    return (
        <div className="flex flex-col h-screen">
            <Navbar
                setIsInfoModalOpen={setIsInfoModalOpen}
                setIsStatsModalOpen={setIsStatsModalOpen}
                setIsRankingModalOpen={setIsRankingModalOpen}
                setIsSettingsModalOpen={setIsSettingsModalOpen}
            />
            <div className="items-center mb-4 text-xl font-bold text-center sm:hidden dark:text-white">
                <div className="flex justify-center">
                    <span>
                        <a
                            href="https://discord.gg/kHvSC9WHzC"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            <img
                                src="./solow.png"
                                alt="Solow"
                                className="sLogo"
                            />
                        </a>
                    </span>
                    <span>{GAME_TITLE}</span>
                </div>
            </div>
            <p className="text-center dark:text-white navbar">
                ¿Cuál es el logo cripto de hoy?
            </p>
            <div className="mt-6 mb-8 flex items-center justify-center">
                {imageHash && (
                    <img
                        src={`/logos/${imageHash}.png`}
                        style={{
                            filter: `blur(${
                                isGameWon ? 0 : 9 - guesses.length * 3
                            }px)`,
                            transition: '0.3s all linear',
                        }}
                        width={80}
                        height={80}
                        alt="Criptólogos"
                    />
                )}
            </div>
            <div className="flex flex-col w-full px-1 pt-2 pb-8 mx-auto md:max-w-7xl sm:px-6 lg:px-8 grow">
                <div className="pb-6 grow">
                    <Grid
                        guesses={guesses}
                        currentGuess={currentGuess}
                        isRevealing={isRevealing}
                        currentRowClassName={currentRowClass}
                        isGameWon={isGameWon}
                    />
                </div>
                <Keyboard
                    onChar={onChar}
                    onDelete={onDelete}
                    onEnter={onEnter}
                    guesses={guesses}
                    isRevealing={isRevealing}
                />
                <InfoModal
                    isOpen={isInfoModalOpen}
                    handleClose={() => setIsInfoModalOpen(false)}
                />
                <StatsModal
                    isOpen={isStatsModalOpen}
                    handleClose={() => setIsStatsModalOpen(false)}
                    guesses={guesses}
                    gameStats={stats}
                    isGameLost={isGameLost}
                    isGameWon={isGameWon}
                    handleShareToClipboard={() =>
                        showSuccessAlert(GAME_COPIED_MESSAGE)
                    }
                    isHardMode={isHardMode}
                    isDarkMode={isDarkMode}
                    isHighContrastMode={isHighContrastMode}
                    numberOfGuessesMade={guesses.length}
                />
                <SettingsModal
                    isOpen={isSettingsModalOpen}
                    handleClose={() => setIsSettingsModalOpen(false)}
                    isHardMode={isHardMode}
                    handleHardMode={handleHardMode}
                    isDarkMode={isDarkMode}
                    handleDarkMode={handleDarkMode}
                    isHighContrastMode={isHighContrastMode}
                    handleHighContrastMode={handleHighContrastMode}
                    isTwitterEnabled={isTwitterEnabled}
                    handleTwitterUser={handleTwitterUser}
                />
                <RankingModal
                    isOpen={isRankingModalOpen}
                    handleClose={() => setIsRankingModalOpen(false)}
                />

                <AlertContainer />
            </div>
        </div>
    )
}

export default App
