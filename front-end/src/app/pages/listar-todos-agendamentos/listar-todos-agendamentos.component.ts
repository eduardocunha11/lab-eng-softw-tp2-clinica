import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { BlockUI, NgBlockUI } from "ng-block-ui";

import { IAgendamento } from "src/app/interfaces/agendamento";

import { AlertsService } from "src/app/services/alerts/alerts.service";
import { AppointmentsService } from "src/app/services/appointments/appointments.service";
import { UtilsService } from "src/app/services/utils/utils.service";

@Component({
	selector: "app-listar-todos-agendamentos",
	templateUrl: "./listar-todos-agendamentos.component.html",
	styleUrls: ["./listar-todos-agendamentos.component.scss"]
})
export class ListarTodosAgendamentosComponent implements OnInit, AfterViewInit, OnDestroy {
	@BlockUI()
	private blockUI?: NgBlockUI;

	@ViewChild(DataTableDirective, { static: true })
	private dataTable?: DataTableDirective;

	public appointments: IAgendamento[] = [];

	public dtOptions: DataTables.Settings = { };
	public dtTrigger: Subject<any> = new Subject();

	constructor (
		private readonly alertsService: AlertsService,
		private readonly appointmentsService: AppointmentsService,
		private readonly utilsService: UtilsService
	) {
		this.utilsService.createDateSortingType();

		this.dtOptions = {
			columnDefs: [{ targets: 0, type: "date-br" }],
			stateSave: true,
			language: this.utilsService.getDataTablesTranslation("Nenhum agendamento cadastrado")
		};
	}

	public ngOnInit (): void {
		this.blockUI?.start("Carregando agendamentos...");
		this.getAppointments();
	}

	public ngAfterViewInit (): void {
		this.dtTrigger.next();
	}

	public ngOnDestroy (): void {
	  this.dtTrigger.unsubscribe();
	}

	public getAppointments (): void {
		this.appointmentsService.getAppointments().subscribe(
			appointments => {
				this.blockUI?.stop();
				this.appointments = appointments;
				this.rerenderDatatables();
			},
			(error: HttpErrorResponse) => {
				this.blockUI?.stop();
				this.alertsService.httpErrorAlert(
					"Erro ao Obter Agendamentos",
					"Não foi possível realizar a consulta, tente novamente.",
					error
				);
			}
		);
	}

	public rerenderDatatables (): void {
		this.dataTable?.dtInstance.then((dtInstance: DataTables.Api) => {
			dtInstance.destroy();
			this.dtTrigger.next();
		});
	}

	public formatPhysicianData (appointment: IAgendamento): string {
		if (!appointment.medico)
			return "-";

		return `
			${appointment.medico.funcionario?.pessoa?.nome}<br/>
			CRM: ${appointment.medico.crm}
		`;
	}
}
