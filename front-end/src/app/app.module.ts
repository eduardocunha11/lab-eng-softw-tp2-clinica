import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import localePt from "@angular/common/locales/pt";
import { registerLocaleData } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";

import { BlockUIModule } from "ng-block-ui";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { DataTablesModule } from "angular-datatables";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxCurrencyModule } from "ngx-currency";
import { TextMaskModule } from "angular2-text-mask";
import { defineLocale, ptBrLocale } from "ngx-bootstrap/chronos";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";

import { RequestInterceptor } from "./services/authentication/request.interceptor";

import { GaleriaComponent } from "./pages/galeria/galeria.component";
import { HomeComponent } from "./pages/home/home.component";
import { ListarEnderecosComponent } from "./pages/listar-enderecos/listar-enderecos.component";
import { ListarFuncionariosComponent } from "./pages/listar-funcionarios/listar-funcionarios.component";
import { ListarMeusAgendamentosComponent } from "./pages/listar-meus-agendamentos/listar-meus-agendamentos.component";
import { ListarPacientesComponent } from "./pages/listar-pacientes/listar-pacientes.component";
import { ListarTodosAgendamentosComponent } from "./pages/listar-todos-agendamentos/listar-todos-agendamentos.component";
import { LoginComponent } from "./pages/login/login.component";
import { NovoAgendamentoComponent } from "./pages/novo-agendamento/novo-agendamento.component";
import { NovoEnderecoComponent } from "./pages/novo-endereco/novo-endereco.component";
import { NovoFuncionarioComponent } from "./pages/novo-funcionario/novo-funcionario.component";
import { NovoPacienteComponent } from "./pages/novo-paciente/novo-paciente.component";

defineLocale("pt-br", ptBrLocale);
registerLocaleData(localePt);

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		GaleriaComponent,
		NovoEnderecoComponent,
		NovoAgendamentoComponent,
		LoginComponent,
		NovoFuncionarioComponent,
		NovoPacienteComponent,
		ListarFuncionariosComponent,
		ListarPacientesComponent,
		ListarEnderecosComponent,
		ListarTodosAgendamentosComponent,
		ListarMeusAgendamentosComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FontAwesomeModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		DataTablesModule,
		BlockUIModule,
		NgSelectModule,
		TextMaskModule,
		ComponentsModule,
		CarouselModule.forRoot(),
		NgxCurrencyModule,
		BsDatepickerModule.forRoot(),
		BrowserAnimationsModule
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
		{ provide: LOCALE_ID, useValue: "pt-BR" }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
