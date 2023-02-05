import {
    ChartBarIcon,
    CogIcon,
    InformationCircleIcon,
    StarIcon,
} from '@heroicons/react/outline'
import { useContext } from 'react'
import { GAME_TITLE } from '../../constants/strings'
import { UnstoppableCtx } from '../../context/UnstoppableContext'
import Signout from '../icons/signout'

type Props = {
    setIsInfoModalOpen: (value: boolean) => void
    setIsStatsModalOpen: (value: boolean) => void
    setIsRankingModalOpen: (value: boolean) => void
    setIsSettingsModalOpen: (value: boolean) => void
}

export const Navbar = ({
    setIsInfoModalOpen,
    setIsStatsModalOpen,
    setIsRankingModalOpen,
    setIsSettingsModalOpen,
}: Props) => {
    const unstoppableCtx = useContext(UnstoppableCtx)

    const {
        unstoppableSignIn,
        unstoppableSignOut,
        displayName,
        authenticated,
    } = unstoppableCtx
    return (
        <div className="navbar">
            <div className="px-5 navbar-content">
                <div className="flex">
                    <InformationCircleIcon
                        className="w-6 h-6 mr-2 cursor-pointer dark:stroke-white"
                        onClick={() => setIsInfoModalOpen(true)}
                    />
                    <ChartBarIcon
                        className="w-6 h-6 mr-3 cursor-pointer dark:stroke-white"
                        onClick={() => setIsStatsModalOpen(true)}
                    />
                    <CogIcon
                        className="w-6 h-6 mr-3 cursor-pointer dark:stroke-white"
                        onClick={() => setIsSettingsModalOpen(true)}
                    />
                </div>
                <p className="absolute items-center hidden text-xl font-bold sm:flex ml-center dark:text-white">
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
                </p>
                <div className="right-icons">
                    <StarIcon
                        onClick={() => setIsRankingModalOpen(true)}
                        className="w-6 h-6 mr-3 cursor-pointer dark:stroke-white"
                    />
                    {!authenticated && (
                        <button
                            onClick={() => unstoppableSignIn()}
                            className="dark:text-white"
                        >
                            Login with Unstoppable
                        </button>
                    )}
                    {authenticated && (
                        <div className="flex gap-4 items-center">
                            <p className="dark:text-white">{displayName}</p>
                            <div
                                className="dark:text-white w-[18px] h-[18px] cursor-pointer"
                                onClick={() => unstoppableSignOut()}
                            >
                                <Signout />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <hr></hr>
        </div>
    )
}
