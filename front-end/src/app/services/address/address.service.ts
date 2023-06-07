import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { IEndereco } from "src/app/interfaces/endereco";

import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class AddressService {
	constructor (private readonly http: HttpClient) { }

	public getAddresses (): Observable<IEndereco[]> {
		return this.http.get<IEndereco[]>(`${environment.API_URL}/v1/enderecos`);
	}

	public getAddress (cep: string): Observable<IEndereco | null> {
		return this.http.get<IEndereco | null>(`${environment.API_URL}/v1/enderecos/${cep}`);
	}

	public saveAddress (address: IEndereco): Observable<IEndereco> {
		return this.http.post<IEndereco>(`${environment.API_URL}/v1/enderecos`, address);
	}
}
