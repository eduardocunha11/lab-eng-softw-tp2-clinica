import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { BlockUI, NgBlockUI } from "ng-block-ui";

import { IPessoa } from "src/app/interfaces/pessoa";

import { AlertsService } from "src/app/services/alerts/alerts.service";
import { UtilsService } from "src/app/services/utils/utils.service";
import { WorkersService } from "src/app/services/workers/workers.service";

@Component({
	selector: "app-listar-funcionarios",
	templateUrl: "./listar-funcionarios.component.html",
	styleUrls: ["./listar-funcionarios.component.scss"]
})
export class ListarFuncionariosComponent implements OnInit, AfterViewInit, OnDestroy {
	@BlockUI()
	private blockUI?: NgBlockUI;

	@ViewChild(DataTableDirective, { static: true })
	private dataTable?: DataTableDirective;

	public workers: IPessoa[] = [];
	public formatAddress: (person: IPessoa) => string;

	public dtOptions: DataTables.Settings = { };
	public dtTrigger: Subject<any> = new Subject();

	constructor (
		private readonly alertsService: AlertsService,
		private readonly workersService: WorkersService,
		private readonly utilsService: UtilsService
	) {
		this.utilsService.createDateSortingType();

		this.dtOptions = {
			columnDefs: [{ targets: 4, type: "date-br" }],
			stateSave: true,
			language: this.utilsService.getDataTablesTranslation("Nenhum funcionário cadastrado")
		};

		this.formatAddress = this.utilsService.formatAddress;
	}

	public ngOnInit (): void {
		this.blockUI?.start("Carregando funcionários...");
		this.getWorkers();
	}

	public ngAfterViewInit (): void {
		this.dtTrigger.next();
	}

	public ngOnDestroy (): void {
	  this.dtTrigger.unsubscribe();
	}

	public getWorkers (): void {
		this.workersService.getWorkers().subscribe(
			workers => {
				this.blockUI?.stop();
				this.workers = workers;
				this.rerenderDatatables();
			},
			(error: HttpErrorResponse) => {
				this.blockUI?.stop();
				this.alertsService.httpErrorAlert(
					"Erro ao Obter Funcionários",
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

	public formatPhysicianData (person: IPessoa): string {
		if (!person.funcionario?.medico)
			return "-";

		return `
			${person.funcionario.medico.especialidade}<br/>
			CRM: ${person.funcionario.medico.crm}
		`;
	}
}
