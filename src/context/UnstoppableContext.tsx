import { useState, createContext, ReactNode, useEffect } from 'react'
import {
    saveUnstoppableUserToLocalStorage,
    deleteUnstoppableUserFromLocalStorage,
    getUnstoppableUser,
} from '../lib/localStorage'
import { postUserToDb } from '../lib/firebaseActions'
import { useAlert } from './AlertContext'
import UAuth from '@uauth/js'

interface AppContextInterface {
    authenticated: boolean
    setAuthenticated: (authenticated: boolean) => void
    displayName: string | false
    unstoppableSignIn: () => void
    unstoppableSignOut: () => void
    checkUserAuth: () => void
}

const UnstoppableProps = {
    authenticated: false,
    setAuthenticated: () => {},
    displayName: '',
    unstoppableSignIn: () => {},
    unstoppableSignOut: () => {},
    checkUserAuth: () => {},
}

export const UnstoppableCtx =
    createContext<AppContextInterface>(UnstoppableProps)

// Provider in your app

const REACT_APP_UNSTOPPABLE_REDIRECT_URI =
    process.env.REACT_APP_UNSTOPPABLE_REDIRECT_URI!

type Props = {
    children?: ReactNode
}

export const UnstoppableProvider = ({ children }: Props) => {
    const [authenticated, setAuthenticated] = useState<boolean>(false)
    const [displayName, setDisplayName] = useState<string | false>(false)

    const uauth = new UAuth({
        clientID: 'ff01e377-0d1b-41a1-adbe-b1f4e562002a',
        redirectUri: REACT_APP_UNSTOPPABLE_REDIRECT_URI || '',
        scope: 'openid wallet',
    })

    const unstoppableSignIn = async () => {
        if (authenticated) return

        try {
            const authorization = await uauth.loginWithPopup()
            console.log(authorization)
            const displayName = authorization.idToken.sub
            const uid = authorization.idToken.wallet_address || ''

            setAuthenticated(true)
            setDisplayName(displayName)

            saveUnstoppableUserToLocalStorage({
                displayName,
                uid,
            })

            postUserToDb({ displayName, uid })
        } catch (error) {
            console.error(error)
        }
    }

    const unstoppableSignOut = async () => {
        try {
            await uauth.logout()
            setAuthenticated(false)

            setDisplayName('')
            deleteUnstoppableUserFromLocalStorage()
        } catch (e) {
            showErrorAlert(`Ups, hubo un error cerrando tu sesión.`)
        }
    }

    const { showError: showErrorAlert } = useAlert()

    const checkUserAuth = () => {
        const unstoppableData = getUnstoppableUser()
        const { displayName, uid } = unstoppableData

        if (displayName || uid) {
            setAuthenticated(true)
            setDisplayName(displayName)
            postUserToDb({ displayName, uid })
        } else {
            console.log('Usuario no autenticado, intente nuevamente')
        }
    }

    useEffect(() => {
        checkUserAuth()
    }, [])

    return (
        <UnstoppableCtx.Provider
            value={{
                authenticated,
                setAuthenticated,
                displayName,
                unstoppableSignIn,
                unstoppableSignOut,
                checkUserAuth,
            }}
        >
            {children}
        </UnstoppableCtx.Provider>
    )
}
