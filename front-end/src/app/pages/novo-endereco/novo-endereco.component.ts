import { HttpErrorResponse } from "@angular/common/http";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { BlockUI, NgBlockUI } from "ng-block-ui";

import { AddressService } from "src/app/services/address/address.service";
import { AlertsService } from "src/app/services/alerts/alerts.service";
import { IEndereco } from "src/app/interfaces/endereco";
import { IValidations } from "src/app/components/visual-validator/visual-validator.component";
import { UtilsService } from "src/app/services/utils/utils.service";

@Component({
	selector: "app-novo-endereco",
	templateUrl: "./novo-endereco.component.html",
	styleUrls: ["./novo-endereco.component.scss"]
})
export class NovoEnderecoComponent {
	@BlockUI()
	private blockUI?: NgBlockUI;

	@ViewChild("cepInput")
	private cepInput?: ElementRef;

	public form: FormGroup;
	public validations: IValidations;

	public cepMask = [/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/];
	public estados: string[] = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

	constructor (
		private readonly formBuilder: FormBuilder,
		private readonly addressService: AddressService,
		private readonly alertsService: AlertsService,
		private readonly utilsService: UtilsService
	) {
		this.form = this.formBuilder.group({
			cep: ["", [Validators.required, this.utilsService.invalidCEP]],
			logradouro: ["", Validators.required],
			bairro: ["", Validators.required],
			cidade: ["", Validators.required],
			estado: [null, Validators.required]
		});

		this.validations = {
			form: this.form,
			fields: {
				cep: [
					{ key: "required" },
					{ key: "failedCEP" }
				],
				logradouro: [{ key: "required" }],
				bairro: [{ key: "required" }],
				cidade: [{ key: "required" }],
				estado: [{ key: "required" }]
			}
		};
	}

	public save (): void {
		if (this.form.invalid)
			return this.alertsService.show("Atenção", "O preenchimento do formulário não é válido.", "error");

		const endereco: IEndereco = {
			cep: this.form.get("cep")?.value,
			logradouro: this.form.get("logradouro")?.value,
			bairro: this.form.get("bairro")?.value,
			cidade: this.form.get("cidade")?.value,
			estado: this.form.get("estado")?.value
		};

		this.blockUI?.start("Salvando endereço...");
		this.addressService.saveAddress(endereco).subscribe(
			_ => {
				this.clear();
				this.blockUI?.stop();
				this.alertsService.show(
					"Endereço Cadastrado",
					"O endereço foi cadastrado com sucesso!",
					"success"
				);
			},
			(error: HttpErrorResponse) => {
				this.blockUI?.stop();
				this.alertsService.httpErrorAlert(
					"Erro ao Cadastrar Endereço",
					"Não foi possível realizar o cadastro, tente novamente.",
					error
				);
			}
		);
	}

	public clear (): void {
		this.form.reset();
		if (this.cepInput)
			this.cepInput.nativeElement.focus();
	}
}
