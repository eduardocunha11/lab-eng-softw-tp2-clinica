import { AbstractControl } from "@angular/forms";
import { Injectable } from "@angular/core";

import { IPessoa } from "src/app/interfaces/pessoa";

@Injectable({ providedIn: "root" })
export class UtilsService {
	constructor () { }

	public getDataTablesTranslation (emptyLabel: string = "Nenhum registro"): DataTables.LanguageSettings {
		return {
			emptyTable: emptyLabel,
			info: "Mostrando _START_ até _END_ de _TOTAL_ registros",
			infoEmpty: "Mostrando 0 até 0 de 0 registros",
			infoFiltered: "(Filtrados de _MAX_ registros)",
			infoPostFix: "",
			thousands: ".",
			lengthMenu: "_MENU_ resultados por página",
			loadingRecords: "Carregando...",
			processing: "Processando...",
			zeroRecords: "Nenhum registro encontrado",
			search: "Pesquisar:",
			paginate: {
				next: "Próximo",
				previous: "Anterior",
				first: "Primeiro",
				last: "Último"
			},
			aria: {
				sortAscending: ": Ordenar colunas de forma ascendente",
				sortDescending: ": Ordenar colunas de forma descendente"
			}
		};
	}

	public createDateSortingType (): void {
		const jFn: any = jQuery.fn;
		jQuery.extend(jFn.dataTableExt.oSort, {
			"date-br-pre" (value: string): number {
				if (value == null || value == "")
					return 0;

				const brDate: string[] = value.split("/");
				return parseInt(brDate[2] + brDate[1] + brDate[0]);
			},

			"date-br-asc" (a: number, b: number) {
				return (a < b) ? -1 : ((a > b) ? 1 : 0);
			},

			"date-br-desc" (a: number, b: number) {
				return (a < b) ? 1 : ((a > b) ? -1 : 0);
			}
		});
	}

	public telephoneMask (rawValue: string): Array<string | RegExp> {
		rawValue = rawValue.replace(/[()_-\s]/g, "");
		if (rawValue.length <= 10)
			return ["(", /[1-9]/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];

		return ["(", /[1-9]/, /\d/, ")", " ", /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/];
	}

	public invalidCEP (control: AbstractControl): { "failedCEP": boolean } | null {
		if (control.value && control.value.indexOf("_") !== -1)
			return { failedCEP: true };

		return null;
	}

	public invalidPhone (control: AbstractControl): { "failedPhone": boolean } | null {
		if (control.value && control.value.indexOf("_") !== -1)
			return { failedPhone: true };

		return null;
	}

	public formatAddress (person: IPessoa): string {
		return `
			${person.logradouro}, ${person.bairro}<br/>
			${person.cep}, ${person.cidade} - ${person.estado}
		`;
	}
}
