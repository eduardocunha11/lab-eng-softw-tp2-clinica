import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { BlockUI, NgBlockUI } from "ng-block-ui";

import { IPessoa } from "src/app/interfaces/pessoa";

import { AlertsService } from "src/app/services/alerts/alerts.service";
import { PatientsService } from "src/app/services/patients/patients.service";
import { UtilsService } from "src/app/services/utils/utils.service";

@Component({
	selector: "app-listar-pacientes",
	templateUrl: "./listar-pacientes.component.html",
	styleUrls: ["./listar-pacientes.component.scss"]
})
export class ListarPacientesComponent implements OnInit, AfterViewInit, OnDestroy {
	@BlockUI()
	private blockUI?: NgBlockUI;

	@ViewChild(DataTableDirective, { static: true })
	private dataTable?: DataTableDirective;

	public patients: IPessoa[] = [];
	public formatAddress: (person: IPessoa) => string;

	public dtOptions: DataTables.Settings = { };
	public dtTrigger: Subject<any> = new Subject();

	constructor (
		private readonly alertsService: AlertsService,
		private readonly patientsService: PatientsService,
		private readonly utilsService: UtilsService
	) {
		this.dtOptions = {
			stateSave: true,
			language: this.utilsService.getDataTablesTranslation("Nenhum paciente cadastrado")
		};

		this.formatAddress = this.utilsService.formatAddress;
	}

	public ngOnInit (): void {
		this.blockUI?.start("Carregando pacientes...");
		this.getPatients();
	}

	public ngAfterViewInit (): void {
		this.dtTrigger.next();
	}

	public ngOnDestroy (): void {
	  this.dtTrigger.unsubscribe();
	}

	public getPatients (): void {
		this.patientsService.getPatients().subscribe(
			patients => {
				this.blockUI?.stop();
				this.patients = patients;
				this.rerenderDatatables();
			},
			(error: HttpErrorResponse) => {
				this.blockUI?.stop();
				this.alertsService.httpErrorAlert(
					"Erro ao Obter Pacientes",
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
}
