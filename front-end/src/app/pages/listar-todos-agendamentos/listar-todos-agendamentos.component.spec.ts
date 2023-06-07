import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListarTodosAgendamentosComponent } from "./listar-todos-agendamentos.component";

describe("ListarTodosAgendamentosComponent", () => {
	let component: ListarTodosAgendamentosComponent;
	let fixture: ComponentFixture<ListarTodosAgendamentosComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ListarTodosAgendamentosComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ListarTodosAgendamentosComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
