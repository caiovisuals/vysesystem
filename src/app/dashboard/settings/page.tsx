"use client"

import { useState } from "react"

import MyAccountMain from "@/components/SettingsUi/SettingsOpitions/MyAccountMain"
import DataAndPrivacyMain from "@/components/SettingsUi/SettingsOpitions/DataAndPrivacyMain"
import NotificationsMain from "@/components/SettingsUi/SettingsOpitions/NotificationsMain"
import DevicesMain from "@/components/SettingsUi/SettingsOpitions/DevicesMain"
import AppearanceMain from "@/components/SettingsUi/SettingsOpitions/AppearanceMain"
import LanguageMain from "@/components/SettingsUi/SettingsOpitions/LanguageMain"
import ExitMain from "@/components/SettingsUi/SettingsOpitions/ExitMain"

import MenuItemButton from "@/components/SettingsUi/MenuItemButton"

export default function Settings() {
    const [activeMain, setActiveMain] = useState("MyAccount")

    const renderMain = () => {
            switch (activeMain) {
                case "MyAccount":
                    return <MyAccountMain />
                case "DataAndPrivacy":
                    return <DataAndPrivacyMain />
                case "Notifications":
                    return <NotificationsMain />
                case "Devices":
                    return <DevicesMain />
                case "Appearance":
                    return <AppearanceMain />
                case "Language":
                    return <LanguageMain />
                case "Exit":
                    return <ExitMain />
                default:
                    return null
        }
    }

    return (
        <div className="w-full h-full p-4 flex flex-row gap-8">
            <div className="w-[20%] h-full flex flex-col gap-[5px]">
                <div className="flex flex-col gap-1">  
                    <label className="text-[var(--sub-text)]">Configurações do Usuário</label>
                    <MenuItemButton 
                        onClick={() => setActiveMain("MyAccount")} 
                        label="Minha Conta" 
                        active={activeMain === "MyAccount"} 
                        icon={
                            <>
                                <path d="M18 21a6 6 0 0 0-12 0"/>
                                <circle cx="12" cy="11" r="4"/>
                                <rect width="18" height="18" x="3" y="3" rx="2"/>
                            </>
                        }
                    />
                    <MenuItemButton 
                        onClick={() => setActiveMain("DataAndPrivacy")} 
                        label="Dados e Privacidade" 
                        active={activeMain === "DataAndPrivacy"}
                        icon={
                            <>
                                <path d="M12 14v4"/>
                                <path d="M14.172 2a2 2 0 0 1 1.414.586l3.828 3.828A2 2 0 0 1 20 7.828V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
                                <path d="M8 14h8"/>
                                <rect x="8" y="10" width="8" height="8" rx="1"/>
                            </>
                        }
                    />
                    <MenuItemButton 
                        onClick={() => setActiveMain("Notifications")} 
                        label="Notificações" 
                        active={activeMain === "Notifications"}
                        icon={
                            <>
                                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
                                <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
                            </>
                        }
                    />
                </div>
                <div className="flex flex-col gap-1">  
                    <label className="text-[var(--sub-text)]">Configurações da Plataforma</label>
                    <MenuItemButton 
                        onClick={() => setActiveMain("Devices")} 
                        label="Dispositivos" 
                        active={activeMain === "Devices"}
                        icon={
                            <>
                                <rect width="10" height="14" x="3" y="8" rx="2"/>
                                <path d="M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4"/>
                                <path d="M8 18h.01"/>
                            </>
                        }
                    />
                    <MenuItemButton 
                        onClick={() => setActiveMain("Appearance")} 
                        label="Aparência" 
                        active={activeMain === "Appearance"}
                        icon={
                            <>
                                <path d="M10.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5"/>
                                <path d="m14.3 19.6 1-.4"/>
                                <path d="M15 3v7.5"/>
                                <path d="m15.2 16.9-.9-.3"/>
                                <path d="m16.6 21.7.3-.9"/>
                                <path d="m16.8 15.3-.4-1"/>
                                <path d="m19.1 15.2.3-.9"/>
                                <path d="m19.6 21.7-.4-1"/>
                                <path d="m20.7 16.8 1-.4"/>
                                <path d="m21.7 19.4-.9-.3"/>
                                <path d="M9 3v18"/>
                                <circle cx="18" cy="18" r="3"/>
                            </>
                        }
                    />
                    <MenuItemButton 
                        onClick={() => setActiveMain("Language")} 
                        label="Idioma" 
                        active={activeMain === "Language"}
                        icon={
                            <>
                                <path d="m5 8 6 6"/>
                                <path d="m4 14 6-6 2-3"/>
                                <path d="M2 5h12"/>
                                <path d="M7 2h1"/>
                                <path d="m22 22-5-10-5 10"/>
                                <path d="M14 18h6"/>
                            </>
                        }
                    />
                </div>
                <div className="flex flex-col gap-1">  
                    <label className="text-[var(--sub-text)]">Outros</label>
                    <MenuItemButton 
                        onClick={() => setActiveMain("Exit")} 
                        label="Sair" 
                        active={activeMain === "Exit"}
                        icon={
                            <>
                                <path d="m16 17 5-5-5-5"/>
                                <path d="M21 12H9"/>
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            </>
                        }
                    />
                </div>
            </div>
            <div className="w-[80%] h-full">
                {renderMain()}
            </div>
		</div>
    )
}