import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { IPaciente } from "src/app/interfaces/paciente";
import { IPessoa } from "src/app/interfaces/pessoa";

import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class PatientsService {
	constructor (private readonly http: HttpClient) { }

	public getPatients (): Observable<IPessoa[]> {
		return this.http.get<IPessoa[]>(`${environment.API_URL}/v1/pacientes`);
	}

	public savePatient (patient: IPessoa & IPaciente): Observable<IPessoa> {
		return this.http.post<IPessoa>(`${environment.API_URL}/v1/pacientes`, patient);
	}
}
