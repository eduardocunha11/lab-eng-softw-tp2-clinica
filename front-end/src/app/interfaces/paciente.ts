export enum TipoSanguineo {
	"A+" = "A+",
	"A-" = "A-",
	"B+" = "B+",
	"B-" = "B-",
	"AB+" = "AB+",
	"AB-" = "AB-",
	"O+" = "O+",
	"O-" = "O-"
}

export interface IPaciente {
	codigo?: number;
	peso: number;
	altura: number;
	tipoSanguineo: TipoSanguineo;
}
