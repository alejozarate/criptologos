import { BaseModal } from './BaseModal'
import { SettingsToggle } from './SettingsToggle'
import {
    HIGH_CONTRAST_MODE_DESCRIPTION,
    TWITTER_ACCOUNT_DESCRIPTION,
} from '../../constants/strings'

type Props = {
    isOpen: boolean
    handleClose: () => void
    isHardMode: boolean
    handleHardMode: Function
    isDarkMode: boolean
    handleDarkMode: Function
    isHighContrastMode: boolean
    handleHighContrastMode: Function
    isTwitterEnabled: boolean
    handleTwitterUser: Function
}

export const SettingsModal = ({
    isOpen,
    handleClose,
    isDarkMode,
    handleDarkMode,
    isHighContrastMode,
    handleHighContrastMode,
    isTwitterEnabled,
    handleTwitterUser,
}: Props) => {
    return (
        <BaseModal
            title="Configuración"
            isOpen={isOpen}
            handleClose={handleClose}
        >
            <div className="flex flex-col mt-2 divide-y">
                <SettingsToggle
                    settingName="Modo oscuro"
                    flag={isDarkMode}
                    handleFlag={handleDarkMode}
                />
                <SettingsToggle
                    settingName="Modo de alto contraste"
                    flag={isHighContrastMode}
                    handleFlag={handleHighContrastMode}
                    description={HIGH_CONTRAST_MODE_DESCRIPTION}
                />
                <SettingsToggle
                    settingName="Twitter linkeado"
                    flag={isTwitterEnabled}
                    handleFlag={handleTwitterUser}
                    description={TWITTER_ACCOUNT_DESCRIPTION}
                />
            </div>
        </BaseModal>
    )
}
