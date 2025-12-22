"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

interface ComboboxProps {
	items: { label: string; value: string }[]
	entity: string
	translatedEntity: string
	placeholder?: string
	emptyMessage?: string
	value?: string
	onValueChange?: (value: string) => void
}

export default function Combobox({
	items,
	entity,
	translatedEntity,
	placeholder = "Tag de Cliente",
	emptyMessage = `Nenhum ${translatedEntity} encontrado`,
	value,
	onValueChange,
}: ComboboxProps) {
	const [open, setOpen] = useState(false)
	const [search, setSearch] = useState("")
	const [internalValue, setInternalValue] = useState("")

	const dropdownRef = useRef<HTMLDivElement | null>(null)

	const controlledValue = value !== undefined ? value : internalValue

	const filteredItems = items.filter((item) =>
		item.label.toLowerCase().includes(search.toLowerCase())
	)

	const selectedLabel = items.find((item) => item.value === controlledValue)?.label

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setOpen(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => {
			document.removeEventListener("mousedown", handleClickOutside)
		}
	}, [])

	return (
		<div ref={dropdownRef} className="relative w-[200px]">
			<button
				type="button"
				role="combobox"
				aria-expanded={open}
				className="w-full border-2 border-[var(--foreground)] hover:border-[var(--middleground)] transition-all duration-300 ease-in-out outline-none rounded-[15px] px-[15px] py-[5px] text-left"
				onClick={() => setOpen((prev) => !prev)}
			>
				{selectedLabel || placeholder}
			</button>

			<div
				className={cn(
					"absolute mt-2.5 w-full border-2 border-[var(--foreground)] hover:border-[var(--middleground)] transition-all duration-300 ease-in-out rounded-[15px] bg-[var(--background)] z-10 shadow-lg",
					open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
				)}
			>
				<input
					type="text"
					placeholder={`Pesquisar ${translatedEntity}`}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full px-3 py-2 border-b-2 border-[var(--foreground)] outline-none rounded-t-[15px]"
				/>

				<div className="max-h-60 overflow-auto rounded-b-[12px]">
					{filteredItems.length === 0 ? (
						<div className="px-3 py-2 text-sm text-gray-500">{emptyMessage}</div>
					) : (
						filteredItems.map((item) => (
							<div
								key={item.value}
								onClick={() => {
									const newValue = item.value === controlledValue ? "" : item.value
									if (onValueChange) onValueChange(newValue)
									else setInternalValue(newValue)
									setOpen(false)
									setSearch("")
								}}
								className={cn(
									"px-3 py-2 transition-all duration-300 ease-in-out cursor-pointer hover:bg-[var(--foreground)]",
									item.value === controlledValue && "font-medium bg-[var(--middleground)]"
								)}
							>
								{item.label}
							</div>
						))
					)}
				</div>
			</div>
		</div>
	)
}
