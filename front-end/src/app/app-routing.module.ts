import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthenticationGuard } from "./guards/authentication/authentication.guard";
import { LoginGuard } from "./guards/login/login.guard";
import { PhysicianGuard } from "./guards/physician/physician.guard";

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

const routes: Routes = [
	// Public
	{ path: "home", component: HomeComponent },
	{ path: "galeria", component: GaleriaComponent },
	{ path: "novoEndereco", component: NovoEnderecoComponent },
	{ path: "agendamento", component: NovoAgendamentoComponent },
	{ path: "login", component: LoginComponent, canActivate: [LoginGuard] },

	// Restricted
	{ path: "novoFuncionario", component: NovoFuncionarioComponent, canActivate: [AuthenticationGuard] },
	{ path: "novoPaciente", component: NovoPacienteComponent, canActivate: [AuthenticationGuard] },
	{ path: "listarFuncionarios", component: ListarFuncionariosComponent, canActivate: [AuthenticationGuard] },
	{ path: "listarPacientes", component: ListarPacientesComponent, canActivate: [AuthenticationGuard] },
	{ path: "listarEnderecos", component: ListarEnderecosComponent, canActivate: [AuthenticationGuard] },
	{ path: "listarTodosAgendamentos", component: ListarTodosAgendamentosComponent, canActivate: [AuthenticationGuard] },
	{ path: "listarMeusAgendamentos", component: ListarMeusAgendamentosComponent, canActivate: [PhysicianGuard] },

	// No match
	{ path: "**", redirectTo: "home" }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
