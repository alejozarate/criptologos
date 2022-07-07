import { BaseModal } from './BaseModal'

type Props = {
    isOpen: boolean
    handleClose: () => void
}

export const InfoModal = ({ isOpen, handleClose }: Props) => {
    const maxWidth = '60%'
    return (
        <BaseModal
            title="¿Cómo jugar criptólogos?"
            isOpen={isOpen}
            handleClose={handleClose}
        >
            <p className="text-sm text-gray-500 dark:text-gray-300">
                Tenés 3 intentos para descubrir el logo cripto del día. Después
                de cada intento erróneo, el logo va a volverse más definido para
                que sea más fácil adivinarlo.
            </p>

            <div className="flex gap-2 items-center justify-center mt-6 mb-6">
                <div className="flex items-center justify-center">
                    <img
                        src="/solow.png"
                        alt="Solow Criptólogos"
                        style={{
                            filter: 'blur(8px)',
                            maxWidth: maxWidth,
                        }}
                    />
                </div>
                <div className="flex items-center justify-center">
                    <img
                        src="/solow.png"
                        alt="Solow Criptólogos"
                        style={{
                            filter: 'blur(4px)',
                            maxWidth: maxWidth,
                        }}
                    />
                </div>
                <div className="flex items-center justify-center">
                    <img
                        src="/solow.png"
                        alt="Solow Criptólogos"
                        style={{
                            filter: 'blur(0px)',
                            maxWidth: maxWidth,
                        }}
                    />
                </div>
            </div>
        </BaseModal>
    )
}
