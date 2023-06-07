import { HttpErrorResponse } from "@angular/common/http";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { debounceTime } from "rxjs/operators";
import { sha512 } from "js-sha512";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsDaterangepickerConfig, BsLocaleService } from "ngx-bootstrap/datepicker";

import { IValidations } from "src/app/components/visual-validator/visual-validator.component";

import { IFuncionario } from "src/app/interfaces/funcionario";
import { IMedico } from "src/app/interfaces/medico";
import { IPessoa } from "src/app/interfaces/pessoa";

import { AddressService } from "src/app/services/address/address.service";
import { AlertsService } from "src/app/services/alerts/alerts.service";
import { UtilsService } from "src/app/services/utils/utils.service";
import { WorkersService } from "src/app/services/workers/workers.service";

@Component({
	selector: "app-novo-funcionario",
	templateUrl: "./novo-funcionario.component.html",
	styleUrls: ["./novo-funcionario.component.scss"]
})
export class NovoFuncionarioComponent {
	@BlockUI()
	private blockUI?: NgBlockUI;

	@ViewChild("nomeInput")
	private nomeInput?: ElementRef;

	public form: FormGroup;
	public validations: IValidations;
	public bsConfig: Partial<BsDaterangepickerConfig>;

	public cepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/];
	public estados: string[] = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];
	public telephoneMask: (rawValue: string) => Array<string | RegExp>;

	constructor (
		private readonly formBuilder: FormBuilder,
		private readonly localeService: BsLocaleService,
		private readonly addressService: AddressService,
		private readonly alertsService: AlertsService,
		private readonly utilsService: UtilsService,
		private readonly workersService: WorkersService
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
			dataContrato: [new Date(), Validators.required],
			salario: [0, [Validators.required, Validators.min(0.01)]],
			senha: ["", Validators.required],
			medico: [false],
			especialidade: [""],
			crm: [""]
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
				dataContrato: [{ key: "required" }],
				salario: [
					{ key: "required" },
					{ key: "min" }
				],
				senha: [{ key: "required" }],
				especialidade: [],
				crm: []
			}
		};

		this.localeService.use("pt-br");
		this.bsConfig = {
			isAnimated: true,
			maxDate: new Date(),
			showWeekNumbers: false,
			selectFromOtherMonth: true
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

		const dt: Date = this.form.get("dataContrato")?.value;
		const worker: IPessoa & IFuncionario & Partial<IMedico> = {
			nome: this.form.get("nome")?.value,
			email: this.form.get("email")?.value,
			telefone: this.form.get("telefone")?.value,
			cep: this.form.get("cep")?.value,
			logradouro: this.form.get("logradouro")?.value,
			bairro: this.form.get("bairro")?.value,
			cidade: this.form.get("cidade")?.value,
			estado: this.form.get("estado")?.value,
			dataContrato: `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")}`,
			salario: this.form.get("salario")?.value,
			senhaHash: sha512(this.form.get("senha")?.value)
		};

		if (this.form.get("medico")?.value) {
			worker.especialidade = this.form.get("especialidade")?.value;
			worker.crm = this.form.get("crm")?.value;
		}

		this.blockUI?.start("Salvando funcionário...");
		this.workersService.saveWorker(worker).subscribe(
			_ => {
				this.clear();
				this.blockUI?.stop();
				this.alertsService.show(
					"Funcionário Cadastrado",
					"O funcionário foi cadastrado com sucesso!",
					"success"
				);
			},
			(error: HttpErrorResponse) => {
				this.blockUI?.stop();
				this.alertsService.httpErrorAlert(
					"Erro ao Cadastrar Funcionário",
					"Não foi possível realizar o cadastro, tente novamente.",
					error
				);
			}
		);
	}

	public clear (): void {
		this.form.reset();
		this.form.get("dataContrato")?.setValue(new Date());
		if (this.nomeInput)
			this.nomeInput.nativeElement.focus();
	}
}
