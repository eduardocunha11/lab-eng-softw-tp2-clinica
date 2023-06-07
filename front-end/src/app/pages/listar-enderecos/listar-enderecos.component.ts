import { HttpErrorResponse } from "@angular/common/http";
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";

import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { BlockUI, NgBlockUI } from "ng-block-ui";

import { IEndereco } from "src/app/interfaces/endereco";

import { AddressService } from "src/app/services/address/address.service";
import { AlertsService } from "src/app/services/alerts/alerts.service";
import { UtilsService } from "src/app/services/utils/utils.service";

@Component({
	selector: "app-listar-enderecos",
	templateUrl: "./listar-enderecos.component.html",
	styleUrls: ["./listar-enderecos.component.scss"]
})
export class ListarEnderecosComponent implements OnInit, AfterViewInit, OnDestroy {
	@BlockUI()
	private blockUI?: NgBlockUI;

	@ViewChild(DataTableDirective, { static: true })
	private dataTable?: DataTableDirective;

	public addresses: IEndereco[] = [];

	public dtOptions: DataTables.Settings = { };
	public dtTrigger: Subject<any> = new Subject();

	constructor (
		private readonly addressService: AddressService,
		private readonly alertsService: AlertsService,
		private readonly utilsService: UtilsService
	) {
		this.utilsService.createDateSortingType();

		this.dtOptions = {
			stateSave: true,
			language: this.utilsService.getDataTablesTranslation("Nenhum endereço cadastrado")
		};
	}

	public ngOnInit (): void {
		this.blockUI?.start("Carregando funcionários...");
		this.getAddresses();
	}

	public ngAfterViewInit (): void {
		this.dtTrigger.next();
	}

	public ngOnDestroy (): void {
	  this.dtTrigger.unsubscribe();
	}

	public getAddresses (): void {
		this.addressService.getAddresses().subscribe(
			addresses => {
				this.blockUI?.stop();
				this.addresses = addresses;
				this.rerenderDatatables();
			},
			(error: HttpErrorResponse) => {
				this.blockUI?.stop();
				this.alertsService.httpErrorAlert(
					"Erro ao Obter Endereços",
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
