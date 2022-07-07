import { MAX_CHALLENGES } from '../../constants/settings'
import { CompletedRow } from './CompletedRow'
import { CurrentRow } from './CurrentRow'
import { EmptyRow } from './EmptyRow'

type Props = {
    guesses: string[]
    currentGuess: string
    isRevealing?: boolean
    currentRowClassName: string
    isGameWon: boolean
}

export const Grid = ({
    guesses,
    currentGuess,
    isRevealing,
    currentRowClassName,
    isGameWon,
}: Props) => {
    const empties =
        guesses.length < MAX_CHALLENGES - 1
            ? Array.from(Array(MAX_CHALLENGES - 1 - guesses.length))
            : []

    return (
        <>
            {guesses.map((guess, i) => (
                <CompletedRow
                    key={i}
                    guess={guess}
                    cellStatus={
                        guesses.length - 1 === i && isGameWon
                            ? 'correct'
                            : 'absent'
                    }
                    isRevealing={isRevealing && guesses.length - 1 === i}
                />
            ))}
            {guesses.length < MAX_CHALLENGES && (
                <CurrentRow
                    guess={currentGuess}
                    className={currentRowClassName}
                />
            )}
            {empties.map((_, i) => (
                <EmptyRow key={i} />
            ))}
        </>
    )
}
