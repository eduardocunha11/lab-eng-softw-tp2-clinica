import { IMedico } from "./medico";

export interface IAgendamento {
	codigo?: number;
	data: Date | string;
	horario: number;
	nome: string;
	email: string;
	telefone: string;
	codigoMedico: number;

	medico?: IMedico;
}
