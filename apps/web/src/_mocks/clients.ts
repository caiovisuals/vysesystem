import { Client } from "@vysesystem/types"

export const clients: Client[] = [
	{
		id: "1",
		name: "Rafael Souza Farias Filho",
		phone: "+55 (71) 91234-5678",
		cpf: "37846520008",
		address: "Rua 157",
		neighborhood: "Centro",
		email: "razzinhobarril@gmail.com",
		tag: "frequent",
	},
    {
		id: "2",
		name: "Caio Oliveira da Silva",
		phone: "+55 (25) 91234-5678",
		cpf: "48949158043",
		address: "Rua 60",
		neighborhood: "Praia",
		email: "caioteemaildeexemplo@gmail.com",
		tag: "inactive",
	},
	{
		id: "3",
		name: "João Carlos", 
		phone: "+55 (11) 91234-5678",
		cpf: "40557823064",
		address: "Rua Roberto Carrlos",
		neighborhood: "Casa Nova",
		email: "joaozinho@gmail.com",
		tag: "new",
	},
	{
		id: "4",
		name: "Raul Sena de Souza", 
		phone: "+55 (61) 91234-5678",
		cpf: "87197327083",
		address: "Avenida Brasil",
		neighborhood: "Centro",
		email: "raulsouza2001@gmail.com",
		tag: "new",
	},
]

export const clientTags: { label: string; value: string }[] = [
  	{ label: "Frequente", value: "frequent" },
  	{ label: "Inativo", value: "inactive" },
  	{ label: "Novo", value: "new" },
]