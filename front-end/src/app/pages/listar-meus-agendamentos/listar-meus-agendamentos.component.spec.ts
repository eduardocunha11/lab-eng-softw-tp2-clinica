import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListarMeusAgendamentosComponent } from "./listar-meus-agendamentos.component";

describe("ListarMeusAgendamentosComponent", () => {
	let component: ListarMeusAgendamentosComponent;
	let fixture: ComponentFixture<ListarMeusAgendamentosComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ListarMeusAgendamentosComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListarMeusAgendamentosComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
