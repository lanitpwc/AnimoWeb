import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-registro',
    templateUrl: './registro-end.component.html',
    styleUrls: ['./registro-end.component.css']
})
export class RegistroEndComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        document.getElementById('navbar').style.display = 'none';
        document.getElementById('page-wrapper').removeAttribute('style')
        document.getElementById('page-wrapper').removeAttribute('id')
        document.body.setAttribute('style', 'background-color: #dddddd !important')
    }

	/** * * * * * * * * *
	 *     METODOS
	 * * * * * * * * * **/

    reload() { location.reload() }
}
