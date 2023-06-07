import { HttpErrorResponse } from "@angular/common/http";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { debounceTime } from "rxjs/operators";
import { BlockUI, NgBlockUI } from "ng-block-ui";

import { IPessoa } from "src/app/interfaces/pessoa";
import { IValidations } from "src/app/components/visual-validator/visual-validator.component";
import { IPaciente, TipoSanguineo } from "src/app/interfaces/paciente";

import { AddressService } from "src/app/services/address/address.service";
import { AlertsService } from "src/app/services/alerts/alerts.service";
import { PatientsService } from "src/app/services/patients/patients.service";
import { UtilsService } from "src/app/services/utils/utils.service";

@Component({
	selector: "app-novo-paciente",
	templateUrl: "./novo-paciente.component.html",
	styleUrls: ["./novo-paciente.component.scss"]
})
export class NovoPacienteComponent {
	@BlockUI()
	private blockUI?: NgBlockUI;

	@ViewChild("nomeInput")
	private nomeInput?: ElementRef;

	public form: FormGroup;
	public validations: IValidations;

	public cepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/];
	public estados: string[] = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
	public tiposSanguineo: TipoSanguineo[] = [
		TipoSanguineo["A+"],
		TipoSanguineo["A-"],
		TipoSanguineo["AB+"],
		TipoSanguineo["AB-"],
		TipoSanguineo["B+"],
		TipoSanguineo["B-"],
		TipoSanguineo["O+"],
		TipoSanguineo["O-"]
	];

	public telephoneMask: (rawValue: string) => Array<string | RegExp>;

	constructor (
		private readonly formBuilder: FormBuilder,
		private readonly addressService: AddressService,
		private readonly alertsService: AlertsService,
		private readonly patientsService: PatientsService,
		private readonly utilsService: UtilsService
	) {
		this.telephoneMask = this.utilsService.telephoneMask;

		this.form = this.formBuilder.group({
			nome: ["", Validators.required],
			email: ["", Validators.required],
			telefone: ["", [Validators.required, this.utilsService.invalidPhone]],
			cep: ["", [Validators.required, this.utilsService.invalidCEP]],
			logradouro: ["", Validators.required],
			bairro: ["", Validators.required],
			cidade: ["", Validators.required],
			estado: [null, Validators.required],
			peso: [0, [Validators.required, Validators.min(0.1)]],
			altura: [0, [Validators.required, Validators.min(0.1)]],
			tipoSanguineo: [null, Validators.required]
		});

		this.validations = {
			form: this.form,
			fields: {
				nome: [{ key: "required" }],
				email: [{ key: "required" }],
				telefone: [
					{ key: "required" },
					{ key: "failedPhone" }
				],
				cep: [
					{ key: "required" },
					{ key: "failedCEP" }
				],
				logradouro: [{ key: "required" }],
				bairro: [{ key: "required" }],
				cidade: [{ key: "required" }],
				estado: [{ key: "required" }],
				peso: [
					{ key: "required" },
					{ key: "min" }
				],
				altura: [
					{ key: "required" },
					{ key: "min" }
				],
				tipoSanguineo: [{ key: "required" }]
			}
		};

		this.form.get("cep")?.valueChanges
			.pipe(debounceTime(500))
			.subscribe(() => {
				if (this.form.get("cep")?.valid)
					this.loadCEP(this.form.get("cep")?.value);
			});
	}

	public loadCEP (cep: string): void {
		this.addressService.getAddress(cep).subscribe(
			address => {
				if (!address) return;
				this.form.get("logradouro")?.setValue(address.logradouro);
				this.form.get("bairro")?.setValue(address.bairro);
				this.form.get("cidade")?.setValue(address.cidade);
				this.form.get("estado")?.setValue(address.estado);
			},
			(error: HttpErrorResponse) => {
				this.alertsService.httpErrorAlert(
					"Erro ao Buscar CEP",
					"Não foi possível realizar a consulta, tente novamente.",
					error
				);
			}
		);
	}

	public save (): void {
		if (this.form.invalid)
			return this.alertsService.show("Atenção", "O preenchimento do formulário não é válido.", "error");

		const patient: IPessoa & IPaciente = {
			nome: this.form.get("nome")?.value,
			email: this.form.get("email")?.value,
			telefone: this.form.get("telefone")?.value,
			cep: this.form.get("cep")?.value,
			logradouro: this.form.get("logradouro")?.value,
			bairro: this.form.get("bairro")?.value,
			cidade: this.form.get("cidade")?.value,
			estado: this.form.get("estado")?.value,
			peso: this.form.get("peso")?.value,
			altura: this.form.get("altura")?.value,
			tipoSanguineo: this.form.get("tipoSanguineo")?.value
		};

		this.blockUI?.start("Salvando paciente...");
		this.patientsService.savePatient(patient).subscribe(
			_ => {
				this.clear();
				this.blockUI?.stop();
				this.alertsService.show(
					"Paciente Cadastrado",
					"O paciente foi cadastrado com sucesso!",
					"success"
				);
			},
			(error: HttpErrorResponse) => {
				this.blockUI?.stop();
				this.alertsService.httpErrorAlert(
					"Erro ao Cadastrar Paciente",
					"Não foi possível realizar o cadastro, tente novamente.",
					error
				);
			}
		);
	}

	public clear (): void {
		this.form.reset();
		if (this.nomeInput)
			this.nomeInput.nativeElement.focus();
	}
}
