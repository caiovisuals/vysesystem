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
                    return <MyAccountMain/>
                case "DataAndPrivacy":
                    return <DataAndPrivacyMain/>
                case "Notifications":
                    return <NotificationsMain/>
                case "Devices":
                    return <DevicesMain/>
                case "Appearance":
                    return <AppearanceMain/>
                case "Language":
                    return <LanguageMain/>
                case "Exit":
                    return <ExitMain/>
                default:
                    return null
        }
    }

    return (
        <div className="w-full h-full p-4 flex flex-row">
            <div className="w-[25%] h-full flex flex-col gap-[5px]">
                <MenuItemButton onClick={() => setActiveMain("MyAccount")} label="Minha Conta" active={activeMain === "MyAccount"}/>
                <MenuItemButton onClick={() => setActiveMain("DataAndPrivacy")} label="Dados e Privacidade" active={activeMain === "DataAndPrivacy"}/>
                <MenuItemButton onClick={() => setActiveMain("Notifications")} label="Notificações" active={activeMain === "Notifications"}/>
                <MenuItemButton onClick={() => setActiveMain("Devices")} label="Dispositivos" active={activeMain === "Devices"}/>
                <MenuItemButton onClick={() => setActiveMain("Appearance")} label="Aparência" active={activeMain === "Appearance"}/>
                <MenuItemButton onClick={() => setActiveMain("Language")} label="Idioma" active={activeMain === "Language"}/>
                <MenuItemButton onClick={() => setActiveMain("Exit")} label="Sair" active={activeMain === "Exit"}/>
            </div>
            <div className="w-[75%] h-full">
                {renderMain()}
            </div>
		</div>
    )
}