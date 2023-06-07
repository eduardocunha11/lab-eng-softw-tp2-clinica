import { Component } from "@angular/core";
import { Location } from "@angular/common";

import {
	faBars,
	faCalendar,
	faCalendarDay,
	faCalendarWeek,
	faHeartbeat,
	faHome,
	faHospitalUser,
	faImages,
	faMapMarkedAlt,
	faSignInAlt,
	faSignOutAlt,
	faTools,
	faUserCircle,
	faUserInjured,
	faUsers
} from "@fortawesome/free-solid-svg-icons";

import { ILoggedUser } from "src/app/interfaces/loggedUser";

import { AuthenticationService } from "src/app/services/authentication/authentication.service";

@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.scss"]
})
export class HeaderComponent {
	public faBars = faBars;
	public faCalendar = faCalendar;
	public faCalendarDay = faCalendarDay;
	public faCalendarWeek = faCalendarWeek;
	public faHeartbeat = faHeartbeat;
	public faHome = faHome;
	public faHospitalUser = faHospitalUser;
	public faImages = faImages;
	public faMapMarkedAlt = faMapMarkedAlt;
	public faSignInAlt = faSignInAlt;
	public faSignOutAlt = faSignOutAlt;
	public faTools = faTools;
	public faUserCircle = faUserCircle;
	public faUserInjured = faUserInjured;
	public faUsers = faUsers;

	public username: string = "";
	public isPhysician: boolean = false;

	public restrictedArea: boolean = false;
	public isMenuCollapsed: boolean = true;

	private restrictedURLs = [
		"/novoFuncionario",
		"/novoPaciente",
		"/listarFuncionarios",
		"/listarPacientes",
		"/listarEnderecos",
		"/listarTodosAgendamentos",
		"/listarMeusAgendamentos"
	]

	constructor (
		private readonly location: Location,
		private readonly authenticationService: AuthenticationService
	) {
		// Monitora login e logout
		this.authenticationService.$loggedClient.subscribe(user => {
			this.getUserInfo(user);
		});

		this.getUserInfo(this.authenticationService.getLoggedUser());
		this.location.onUrlChange(url => {
			this.restrictedArea = this.restrictedURLs.includes(url.split("?")[0]);
		});
	}

	public get isLoggedIn (): boolean {
		return this.authenticationService.isLoggedIn();
	}

	public logout (): void {
		this.authenticationService.signOut();
	}

	private getUserInfo (user: ILoggedUser | null): void {
		if (user) {
			const nomes = user.pessoa.nome.split(" ");
			this.username = nomes.filter((_, idx) => idx === 0 || idx === nomes.length - 1).join(" ");
			this.isPhysician = !!user.medico;
		}
	}
}
