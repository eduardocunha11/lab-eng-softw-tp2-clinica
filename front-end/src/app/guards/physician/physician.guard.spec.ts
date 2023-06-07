import { TestBed } from "@angular/core/testing";

import { PhysicianGuard } from "./physician.guard";

describe("PhysicianGuard", () => {
	let guard: PhysicianGuard;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		guard = TestBed.inject(PhysicianGuard);
	});

	it("should be created", () => {
		expect(guard).toBeTruthy();
	});
});
