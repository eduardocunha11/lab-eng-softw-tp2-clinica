export interface ILoggedUser {
	dataContrato: string | Date;
	pessoa: {
		codigo: number;
		nome: string;
		email: string;
	};
	medico: {
		especialidade: string;
		crm: string;
	}
};
