import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { IAgendamento } from "src/app/interfaces/agendamento";

import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class AppointmentsService {
	constructor (private readonly http: HttpClient) { }

	public getAppointments (): Observable<IAgendamento[]> {
		return this.http.get<IAgendamento[]>(`${environment.API_URL}/v1/agendamentos`);
	}

	public getUserAppointments (): Observable<IAgendamento[]> {
		return this.http.get<IAgendamento[]>(`${environment.API_URL}/v1/agendamentos/usuario`);
	}

	public saveAppointment (appointment: IAgendamento): Observable<IAgendamento> {
		return this.http.post<IAgendamento>(`${environment.API_URL}/v1/agendamentos`, appointment);
	}
}
