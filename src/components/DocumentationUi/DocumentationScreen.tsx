"use client"

import { useState } from "react"

import SidebarItemButton from "@/components/DocumentationUi/SidebarItemButton"

import Introduction from "@/components/DocumentationUi/DocumentationSections/Introduction"
import Authentication from "@/components/DocumentationUi/DocumentationSections/Authentication"
import SecurityRequirements from "@/components/DocumentationUi/DocumentationSections/SecurityRequirements"

import Sellers from "@/components/DocumentationUi/DocumentationSections/Sellers"
import Products from "@/components/DocumentationUi/DocumentationSections/Products"
import Clients from "@/components/DocumentationUi/DocumentationSections/Clients"
import Suppliers from "@/components/DocumentationUi/DocumentationSections/Suppliers"
import Employees from "@/components/DocumentationUi/DocumentationSections/Employees"

import ReportsAndRecords from "@/components/DocumentationUi/DocumentationSections/ReportsAndRecords"
import BusinessAndFunnels from "@/components/DocumentationUi/DocumentationSections/BusinessAndFunnels"

export default function DocumentationScreen() {
    const [activeMain, setActiveMain] = useState("Introduction")
    
    const renderMain = () => {
        switch (activeMain) {
            case "Introduction":
                return <Introduction category="Introdução e aspectos gerais" />
            case "Authentication":
                return <Authentication category="Introdução e aspectos gerais" />
            case "SecurityRequirements":
                return <SecurityRequirements category="Introdução e aspectos gerais" />
            case "Sellers":
                return <Sellers category="Cadastro e credenciamento" />
            case "Products":
                return <Products category="Cadastro e credenciamento" />
            case "Clients":
                return <Clients category="Cadastro e credenciamento" />
            case "Suppliers":
                return <Suppliers category="Cadastro e credenciamento" />
            case "Employees":
                return <Employees category="Cadastro e credenciamento" />
            case "ReportsAndRecords":
                return <ReportsAndRecords category="Outros" />
            case "BusinessAndFunnels":
                return <BusinessAndFunnels category="Outros" />
            default:
                return null
        }
    }

    return (
        <section className="flex flex-col px-32 py-16 gap-8 min-h-[calc(100vh-96px)]">
            <h2 className="text-[32px]">Documentação</h2>
            <div className="flex flex-row gap-16">
                <section className="flex flex-col gap-4 stable-scrollbar-gutter overflow-y-visible">
                    <nav className="flex flex-col gap-2">
                        <label>
                            Introdução e aspectos gerais
                        </label>
                        <div className="flex flex-col gap-2">
                            <SidebarItemButton 
                                onClick={() => setActiveMain("Introduction")} 
                                label="Introdução ao Vyse" 
                                active={activeMain === "Introduction"}
                                icon={
                                    <>
                                        <path d="m2 2 8 8"/>
                                        <path d="m22 2-8 8"/>
                                        <ellipse cx="12" cy="9" rx="10" ry="5"/>
                                        <path d="M7 13.4v7.9"/>
                                        <path d="M12 14v8"/>
                                        <path d="M17 13.4v7.9"/>
                                        <path d="M2 9v8a10 5 0 0 0 20 0V9"/>
                                    </>
                                }
                            />
                            <SidebarItemButton 
                                onClick={() => setActiveMain("Authentication")} 
                                label="Autenticação" 
                                active={activeMain === "Authentication"}
                                icon={
                                    <>
                                        <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/>
                                        <path d="M14 13.12c0 2.38 0 6.38-1 8.88"/>
                                        <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/>
                                        <path d="M2 12a10 10 0 0 1 18-6"/>
                                        <path d="M2 16h.01"/>
                                        <path d="M21.8 16c.2-2 .131-5.354 0-6"/>
                                        <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/>
                                        <path d="M8.65 22c.21-.66.45-1.32.57-2"/>
                                        <path d="M9 6.8a6 6 0 0 1 9 5.2v2"/>
                                    </>
                                }
                            />
                            <SidebarItemButton 
                                onClick={() => setActiveMain("SecurityRequirements")} 
                                label="Requisitos de segurança" 
                                active={activeMain === "SecurityRequirements"}
                                icon={
                                    <>
                                        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
                                        <path d="M12 8v4"/>
                                        <path d="M12 16h.01"/>
                                    </>
                                }
                            />
                        </div>
                    </nav>
                    <nav className="flex flex-col gap-2">
                        <label>
                            Cadastro e credenciamento
                        </label>
                        <div className="flex flex-col gap-2">
                            <SidebarItemButton 
                                onClick={() => setActiveMain("Sellers")} 
                                label="Vendedores" 
                                active={activeMain === "Sellers"}
                                icon={
                                    <>
                                        <path d="M2 21a8 8 0 0 1 13.292-6"/>
                                        <circle cx="10" cy="8" r="5"/>
                                        <path d="M19 16v6"/>
                                        <path d="M22 19h-6"/>
                                    </>
                                }
                            />
                            <SidebarItemButton 
                                onClick={() => setActiveMain("Products")} 
                                label="Produtos" 
                                active={activeMain === "Products"}
                                icon={
                                    <>
                                        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                                        <path d="m3.3 7 8.7 5 8.7-5"/>
                                        <path d="M12 22V12"/>
                                    </>
                                }
                            />
                            <SidebarItemButton 
                                onClick={() => setActiveMain("Clients")} 
                                label="Clientes" 
                                active={activeMain === "Clients"}
                                icon={
                                    <>
                                        <path d="M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"/>
                                        <path d="M8 15H7a4 4 0 0 0-4 4v2"/>
                                        <circle cx="10" cy="7" r="4"/>
                                    </>
                                }
                            />
                            <SidebarItemButton 
                                onClick={() => setActiveMain("Suppliers")} 
                                label="Fornecedores" 
                                active={activeMain === "Suppliers"}
                                icon={
                                    <>
                                        <path d="M12 22v-9"/>
                                        <path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"/>
                                        <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"/>
                                        <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z"/>
                                    </>
                                }
                            />
                            <SidebarItemButton 
                                onClick={() => setActiveMain("Employees")} 
                                label="Funcionários" 
                                active={activeMain === "Employees"}
                                icon={
                                    <>
                                        <path d="M18 21a8 8 0 0 0-16 0"/>
                                        <circle cx="10" cy="8" r="5"/>
                                        <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>
                                    </>
                                }
                            />
                        </div>
                    </nav>
                    <nav className="flex flex-col gap-2">
                        <label>
                            Outros
                        </label>
                        <div className="flex flex-col gap-2">
                            <SidebarItemButton 
                                onClick={() => setActiveMain("ReportsAndRecords")} 
                                label="Relatórios e registros" 
                                active={activeMain === "ReportsAndRecords"}
                                icon={
                                    <>
                                        <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"/>
                                        <path d="M14 2v5a1 1 0 0 0 1 1h5"/>
                                        <path d="M10 9H8"/>
                                        <path d="M16 13H8"/>
                                        <path d="M16 17H8"/>
                                    </>
                                }
                            />
                            <SidebarItemButton 
                                onClick={() => setActiveMain("BusinessAndFunnels")} 
                                label="Negócios e funis" 
                                active={activeMain === "BusinessAndFunnels"}
                                icon={
                                    <>
                                        <path d="M12 12h.01"/>
                                        <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                                        <path d="M22 13a18.15 18.15 0 0 1-20 0"/>
                                        <rect width="20" height="14" x="2" y="6" rx="2"/>
                                    </>
                                }
                            />
                        </div>
                    </nav>
                </section>
                <div>
                    {renderMain()}
                </div>
            </div>
        </section>
    )
}