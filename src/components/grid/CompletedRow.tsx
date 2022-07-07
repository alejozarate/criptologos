import { Cell } from './Cell'
import { unicodeSplit } from '../../lib/words'

type Props = {
    guess: string
    isRevealing?: boolean
    cellStatus: string
}

export const CompletedRow = ({ guess, isRevealing, cellStatus }: Props) => {
    const splitGuess = unicodeSplit(guess)

    return (
        <div className="flex justify-center mb-1">
            {splitGuess.map((letter, i) => (
                <Cell
                    key={i}
                    value={letter}
                    status={cellStatus as 'absent' | 'correct'}
                    position={i}
                    isRevealing={isRevealing}
                    isCompleted
                />
            ))}
        </div>
    )
}
