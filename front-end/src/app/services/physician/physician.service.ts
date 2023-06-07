import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { environment } from "src/environments/environment";
import { IPessoa } from "src/app/interfaces/pessoa";

@Injectable({ providedIn: "root" })
export class PhysicianService {
	constructor (private readonly http: HttpClient) { }

	public getPhysicians (): Observable<IPessoa[]> {
		return this.http.get<IPessoa[]>(`${environment.API_URL}/v1/medicos`);
	}

	public getPhysiciansBySpecialty (specialty: string): Observable<IPessoa[]> {
		return this.http.get<IPessoa[]>(`${environment.API_URL}/v1/medicos/especialidade/${specialty}`);
	}

	public getAvailableAppointmentSlots (physicianCode: number, date: Date): Observable<number[]> {
		const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
		return this.http.get<number[]>(`${environment.API_URL}/v1/medicos/horariosDisponiveis/${physicianCode}/${formattedDate}`);
	}

	public getSpecialties (): Observable<string[]> {
		return this.http.get<string[]>(`${environment.API_URL}/v1/medicos/especialidades`);
	}
}
