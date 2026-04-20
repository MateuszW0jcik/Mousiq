/* eslint-disable react-refresh/only-export-components */
import React, {createContext, useContext, useState, type ReactNode} from 'react';

interface LoginRegisterModalContextType {
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
}

const LoginRegisterModalContext = createContext<LoginRegisterModalContextType | undefined>(undefined);

interface LoginRegisterModalProviderProps {
    children: ReactNode;
}

export const LoginRegisterModalProvider: React.FC<LoginRegisterModalProviderProps> = ({children}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const value: LoginRegisterModalContextType = {
        isModalOpen,
        openModal,
        closeModal
    };

    return (
        <LoginRegisterModalContext.Provider value={value}>
            {children}
        </LoginRegisterModalContext.Provider>
    );
};

export const useLoginRegisterModal = (): LoginRegisterModalContextType => {
    const context = useContext(LoginRegisterModalContext);
    if (!context) {
        throw new Error('useLoginRegisterModal must be used within a LoginRegisterModalProvider');
    }
    return context;
};