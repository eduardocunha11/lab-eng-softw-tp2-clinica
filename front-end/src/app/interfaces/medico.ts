import { IFuncionario } from "./funcionario";

export interface IMedico {
	codigo?: number;
	especialidade: string;
	crm: string;

	funcionario?: IFuncionario;
}
