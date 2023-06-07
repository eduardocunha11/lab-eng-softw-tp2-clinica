import { Component } from "@angular/core";

import {
	faEnvelope,
	faHeartbeat,
	faMapMarkerAlt,
	faMobileAlt
} from "@fortawesome/free-solid-svg-icons";

@Component({
	selector: "app-footer",
	templateUrl: "./footer.component.html",
	styleUrls: ["./footer.component.scss"]
})
export class FooterComponent {
	public faEnvelope = faEnvelope;
	public faHeartbeat = faHeartbeat;
	public faMapMarkerAlt = faMapMarkerAlt;
	public faMobileAlt = faMobileAlt;

	constructor () { }
}
