import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { IFuncionario } from "src/app/interfaces/funcionario";
import { IMedico } from "src/app/interfaces/medico";
import { IPessoa } from "src/app/interfaces/pessoa";

import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class WorkersService {
	constructor (private readonly http: HttpClient) { }

	public getWorkers (): Observable<IPessoa[]> {
		return this.http.get<IPessoa[]>(`${environment.API_URL}/v1/funcionarios`);
	}

	public saveWorker (worker: IPessoa & IFuncionario & Partial<IMedico>): Observable<IPessoa> {
		return this.http.post<IPessoa>(`${environment.API_URL}/v1/funcionarios`, worker);
	}
}
