import { Component, OnInit, NgZone } from '@angular/core';
import { BackService } from '../service/back.service'
import * as _ from 'underscore';

declare var $: any
import * as firebase from 'firebase';

@Component({
	selector: 'app-notas',
	templateUrl: './notas.component.html',
	styleUrls: ['./notas.component.scss']
})
export class NotasComponent implements OnInit {

	//-----------------------------------------------------------------
	// Atributos
	//-----------------------------------------------------------------
	listaAreas = []

	filtroArea: string
	filtroEdad: string
	filtroFecha: any

	listaFiltroAreas = []

	keyNotas: any
	temp = []

	date1: Date
	date2: Date

	company: string
	//-----------------------------------------------------------------
	// Constructor
	//-----------------------------------------------------------------
	constructor(public back: BackService, public zone: NgZone) {
		this.company = localStorage.getItem('company')
		this.filtroArea = 'none'
		this.filtroEdad = 'none'
		this.listaAreas = back.listaAreas

		firebase.database().ref('notas/' + this.company).on('value', snap => {
			this.zone.run(() => {
				this.keyNotas = snap.val()
				this.temp = _.allKeys(this.keyNotas).reverse()
			})
		})
	}


	//-----------------------------------------------------------------
	// Metodos
	//-----------------------------------------------------------------
	ngOnInit() {
        document.getElementById('notas').classList.add('activo')
        document.getElementById('franja').style.top = (document.getElementById('notas').offsetTop - 2) + 'px'

		$('#rango').daterangepicker({
			"opens": "left"
		}, (start, end, label) => {
			this.date1 = new Date(start)
			this.date2 = new Date(end)
        });

        firebase.database().ref('empresas/' + this.company + '/area/').once('value', snap => {
            let areas = snap.val()
            this.listaAreas = _.allKeys(areas)
            // this.listaFiltroAreas = this.listaAreas
        });
    }

	cambio(event) {
		if (event == 'todos') {
			this.listaFiltroAreas = this.listaAreas.slice(0)
		}
		else {
			let contiene = _.contains(this.listaFiltroAreas, event)
			window.setTimeout(() => {
				this.filtroArea = "none"
			}, 10)
			if (!contiene) {
				this.listaFiltroAreas.push(event)
				this.listaFiltroAreas = this.listaFiltroAreas.slice(0)
			}

		}

		// console.log(this.listaFiltroAreas)
	}

	eliminar(index) {
		this.listaFiltroAreas.splice(index, 1)
		this.listaFiltroAreas = this.listaFiltroAreas.slice(0)
	}

}
