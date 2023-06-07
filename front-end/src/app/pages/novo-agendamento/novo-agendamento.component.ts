import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { debounceTime } from "rxjs/operators";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { BsDaterangepickerConfig, BsLocaleService } from "ngx-bootstrap/datepicker";
import { merge, Observable } from "rxjs";

import { IAgendamento } from "src/app/interfaces/agendamento";
import { IPessoa } from "src/app/interfaces/pessoa";
import { IValidations } from "src/app/components/visual-validator/visual-validator.component";

import { AlertsService } from "src/app/services/alerts/alerts.service";
import { AppointmentsService } from "src/app/services/appointments/appointments.service";
import { PhysicianService } from "src/app/services/physician/physician.service";
import { UtilsService } from "src/app/services/utils/utils.service";

@Component({
	selector: "app-novo-agendamento",
	templateUrl: "./novo-agendamento.component.html",
	styleUrls: ["./novo-agendamento.component.scss"]
})
export class NovoAgendamentoComponent implements OnInit {
	@BlockUI()
	private blockUI?: NgBlockUI;

	public form: FormGroup;
	public validations: IValidations;
	public bsConfig: Partial<BsDaterangepickerConfig>;

	public especialidades: string[] = [];
	public medicos: IPessoa[] = [];
	public horarios: number[] = [];
	public telephoneMask: (rawValue: string) => Array<string | RegExp>;

	constructor (
		private readonly formBuilder: FormBuilder,
		private readonly localeService: BsLocaleService,
		private readonly alertsService: AlertsService,
		private readonly appointmentsService: AppointmentsService,
		private readonly physicianService: PhysicianService,
		private readonly utilsService: UtilsService
	) {
		this.telephoneMask = this.utilsService.telephoneMask;

		this.form = this.formBuilder.group({
			especialidade: [null, Validators.required],
			medico: [null, Validators.required],
			dataConsulta: [null, Validators.required],
			horario: [null, Validators.required],
			nome: ["", Validators.required],
			email: ["", Validators.required],
			telefone: ["", [Validators.required, this.utilsService.invalidPhone]]
		});

		this.validations = {
			form: this.form,
			fields: {
				especialidade: [{ key: "required" }],
				medico: [{ key: "required" }],
				dataConsulta: [{ key: "required" }],
				horario: [{ key: "required" }],
				nome: [{ key: "required" }],
				email: [{ key: "required" }],
				telefone: [
					{ key: "required" },
					{ key: "failedPhone" }
				]
			}
		};

		this.localeService.use("pt-br");
		this.bsConfig = {
			isAnimated: true,
			minDate: (new Date()).getHours() >= 17 ? new Date(Date.now() + (24 * 3600 * 1000)) : new Date(),
			showWeekNumbers: false,
			selectFromOtherMonth: true
		};

		this.form.get("medico")?.disable();
		this.form.get("horario")?.disable();

		this.form.get("especialidade")?.valueChanges
			.pipe(debounceTime(500))
			.subscribe(() => {
				this.form.get("medico")?.setValue(null);
				if (this.form.get("especialidade")?.valid) {
					this.form.get("medico")?.enable();
					this.loadPhysicians(this.form.get("especialidade")?.value);
				} else {
					this.form.get("medico")?.disable();
				}
			});

		merge(
			this.form.get("medico")?.valueChanges as Observable<any>,
			this.form.get("dataConsulta")?.valueChanges as Observable<any>
		)
			.pipe(debounceTime(500))
			.subscribe(() => {
				this.form.get("horario")?.setValue(null);
				if (this.form.get("medico")?.valid && this.form.get("dataConsulta")?.valid) {
					this.form.get("horario")?.enable();
					this.loadAppointmentSlots(this.form.get("medico")?.value, this.form.get("dataConsulta")?.value);
				} else {
					this.form.get("horario")?.disable();
				}
			});
	}

	public ngOnInit (): void {
		this.blockUI?.start("Carregando especialidades...");
		this.physicianService.getSpecialties().subscribe(
			specialties => {
				this.blockUI?.stop();
				this.especialidades = specialties;
			},
			(error: HttpErrorResponse) => {
				this.blockUI?.stop();
				this.alertsService.httpErrorAlert(
					"Erro ao Buscar Especialidades",
					"Não foi possível realizar a consulta, tente novamente.",
					error
				);
			}
		);
	}

	public loadPhysicians (specialty: string): void {
		this.physicianService.getPhysiciansBySpecialty(specialty).subscribe(
			physicians => this.medicos = physicians,
			(error: HttpErrorResponse) => {
				this.alertsService.httpErrorAlert(
					"Erro ao Buscar Médicos",
					"Não foi possível realizar a consulta, tente novamente.",
					error
				);
			}
		);
	}

	public loadAppointmentSlots (physicianCode: number, date: Date): void {
		this.physicianService.getAvailableAppointmentSlots(physicianCode, date).subscribe(
			slots => this.horarios = slots,
			(error: HttpErrorResponse) => {
				this.alertsService.httpErrorAlert(
					"Erro ao Buscar Horários Disponíveis",
					"Não foi possível realizar a consulta, tente novamente.",
					error
				);
			}
		);
	}

	public save (): void {
		if (this.form.invalid)
			return this.alertsService.show("Atenção", "O preenchimento do formulário não é válido.", "error");

		const dt: Date = this.form.get("dataConsulta")?.value;
		const appointment: IAgendamento = {
			codigoMedico: this.form.get("medico")?.value,
			data: `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")}`,
			horario: this.form.get("horario")?.value,
			nome: this.form.get("nome")?.value,
			email: this.form.get("email")?.value,
			telefone: this.form.get("telefone")?.value
		};

		this.blockUI?.start("Salvando agendamento...");
		this.appointmentsService.saveAppointment(appointment).subscribe(
			_ => {
				this.clear();
				this.blockUI?.stop();
				this.alertsService.show(
					"Agendamento Cadastrado",
					"O agendamento foi cadastrado com sucesso!",
					"success"
				);
			},
			(error: HttpErrorResponse) => {
				this.blockUI?.stop();
				this.alertsService.httpErrorAlert(
					"Erro ao Cadastrar Agendamento",
					"Não foi possível realizar o cadastro, tente novamente.",
					error
				);
			}
		);
	}

	public clear (): void {
		this.form.reset();
	}
}
