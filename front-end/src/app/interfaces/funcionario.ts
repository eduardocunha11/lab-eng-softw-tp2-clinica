import { IMedico } from "./medico";
import { IPessoa } from "./pessoa";

export interface IFuncionario {
	codigo?: number;
	dataContrato: string | Date;
	salario: number;
	senhaHash?: string;

	pessoa?: IPessoa;
	medico?: IMedico;
}
