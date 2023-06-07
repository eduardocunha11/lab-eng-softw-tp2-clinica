import { AbstractControl, FormGroup } from "@angular/forms";
import { AfterContentInit, Component, ElementRef, Input } from "@angular/core";

export interface IValidations {
	form: FormGroup;
	fields: {
		[field: string]: Array<{
			key: string
			message?: string
		}>
	}
}

@Component({
	selector: "app-visual-validator",
	templateUrl: "./visual-validator.component.html",
	styleUrls: ["./visual-validator.component.scss"]
})
export class VisualValidatorComponent implements AfterContentInit {
	@Input()
	public config?: IValidations;

	@Input()
	public field?: string;

	private input?: HTMLElement;

	constructor (private readonly elementRef: ElementRef) { }

	public ngAfterContentInit (): void {
		this.input = this.elementRef.nativeElement.childNodes[0];
		if (this.input && !this.input.classList.contains("form-control"))
			this.input.classList.add("form-field");
	}

	public get formControl (): AbstractControl | { value: null, errors: null } {
		const control = this.field && this.config && this.config.form ? this.config.form.controls[this.field] : { value: null, errors: null };
		if (this.input) {
			if (this.controlIsDirty) {
				if (control.errors) {
					this.input.classList.add("is-invalid");
					this.input.classList.remove("is-valid");
				} else {
					this.input.classList.add("is-valid");
					this.input.classList.remove("is-invalid");
				}
			} else {
				this.input.classList.remove("is-valid", "is-invalid");
			}
		}

		return control;
	}

	public get controlIsDirty (): boolean {
		const control = this.field && this.config && this.config.form ? this.config.form.controls[this.field] : { value: false };
		return this.input ? this.input.classList.contains("ng-dirty") || Boolean(control.value) : false;
	}

	public getDefaultMessage (key: string): string {
		switch (key) {
			case "required":
				return "Este campo é obrigatório";
			case "email":
				return "Este campo deve ser um e-mail válido";
			case "min":
				return "Este campo deve ter um valor maior";
			case "max":
				return "Este campo deve ter um valor menor";
			case "minlength":
				return "Este campo deve ser maior";
			case "maxlength":
				return "Este campo deve ser menor";
			case "failedPhone":
				return "Este campo deve ser um telefone válido";
			case "failedCPF":
				return "Este campo deve ser um CPF válido";
			case "failedCEP":
				return "Este campo deve ser um CEP válido";
			default:
				return "Preenchimento inválido";
		}
	}
}
