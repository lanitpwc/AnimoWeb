import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import { EstadisticasDiarias, Estadistica } from '../../class/Estadisticas';


@Injectable()
export class HomeBackService {

 // -----------------------------------------------------------------
	// Atributos
	// -----------------------------------------------------------------

	db: firebase.database.Database

	user: firebase.User

	// -----------------------------------------------------------------
	// Constructor
	// -----------------------------------------------------------------
	constructor(public http: Http) {
		console.log('Hello HomeBack Provider');
		this.db = firebase.database()
		this.user = firebase.auth().currentUser
  }
  
  	// -----------------------------------------------------------------
	// Metodos
	// -----------------------------------------------------------------


	/**
	 * Califica una emocion de un usuario
	 * @param {string} emocion Emocion que se va a calificar
	 * @param {string} area Área de un usuario
	 * @param {string} subArea Sub área de un usuario
	 * @param {string} subsubarea Sub sub área de un usuario
	 * @param {string} empresa Empresa del usuario
	 * @param {string} fecha fecha del usuario
	 * @param {number} valor Valor de la calificación
	 * @param {string} cargo Cargo del usuario
	 * @memberOf HomeBack
	 */
	calificarEmocion(emocion: string, area: string, subArea: string, subsubarea: string, empresa: string, fecha: string, valor: number, cargo: string) {
		this.db.ref('usuarios/' + this.user.uid + '/emociones/' + emocion).transaction(data => { //real
		// this.db.ref('usuarios/' + '0DZEape1OKYeuhEniGNzrb6U4np1'+ '/emociones/' + emocion).transaction(data => { //Falso
			if (data) {
				let time = new Date()
				data['date'] = time.getTime()
				// -----------------------------------------------------------------
				// Datos globales del usuario
				// -----------------------------------------------------------------
				let datos = new EstadisticasDiarias()
				if (data['global'])
					datos.cargarDatos(data['global'])
				datos.calificar(valor)
				data['global'] = datos
				// -----------------------------------------------------------------
				// Datos diarios del usuario
				// -----------------------------------------------------------------
				let fecha = this.convertDate(time)
				let datos2 = new EstadisticasDiarias()
				let fechas = (data['fechas']) ? data['fechas'] : {}
				if (fechas[fecha])
					datos2.cargarDatos(fechas[fecha])
				datos2.calificar(valor)
				fechas[fecha] = datos2
				data['fechas'] = fechas

			}
			return data
		})

		let pat6 = 'cargos/' + empresa + '/' + cargo + '/' + emocion
		this.transaccion(pat6, valor)

		let pat5 = 'estadisticas/' + empresa + '/' + area + '/' + emocion
		this.transaccion(pat5, valor)

		let pat4 = 'empresas/' + empresa + '/emociones/' + emocion
		this.transaccion(pat4, valor)

		let pat3 = 'edades/' + empresa + '/' + fecha + '/' + emocion
		this.transaccion(pat3, valor)


		if (subArea) {
			let pat2 = 'estadisticas/' + empresa + '/' + area + '/subArea/' + subArea + '/' + emocion
			this.transaccion(pat2, valor)
		}

		if (subsubarea) {
			let pat = 'estadisticas/' + empresa + '/' + area + '/subArea/' + subArea + '/subArea/' + subsubarea + '/' + emocion
			this.transaccion(pat, valor)
		}
   }

   /**
	 * Genera una nota despues de hacer una calificación de una emoción
	 * 
	 * @param {number} valor Numero de 1 a 5
	 * @param {string} empresa Empresa que califica
	 * @param {string} msg Mensaje de la nota
	 * @param {string} nombre Nombre del usuario
	 * 
	 * @memberOf HomeBack
	 */
	enviarNota(valor: number, empresa: string, msg: string, nombre: string, emocion:string, area:string, edad:string) {
		debugger
		console.log('Estoy en enviarnota');
		let time = new Date()
		let dato = {
			valor: valor,
			msg: msg,
			fecha: this.convertDate(time),
			nombre: nombre,
			emocion: emocion,
			area:area,
			edad :  edad
		}
		console.log('a punto de llamar la bd en tabla notas..');
		let pat = this.db.ref('notas/' + empresa ).push(dato)
		console.log('user:', this.user.uid);
		this.db.ref('usuarios/'+this.user.uid+'/notas/'+pat.key).set(true)
	}
  
  /**
	 * Retorna el formato de la fecha dd-mm-yyyy
	 * @private
	 * @param {Date} d Fecha dar formato
	 * @returns {string} Formato nuevo
	 * @memberOf HomeBack
	 */
	private convertDate(d: Date): string {
		function pad(s) { return (s < 10) ? '0' + s : s; }
		return [d.getUTCFullYear(), pad(d.getUTCMonth() + 1), pad(d.getUTCDate())].join('-');
  }
  
  transaccion(dire: string, valor: number) {
		this.db.ref(dire).transaction(data => {
			if (data) {
				// -----------------------------------------------------------------
				// Datos globales de la Empresa
				// -----------------------------------------------------------------
				let datos = new Estadistica()
				if (data['global'])
					datos.cargarDatos(data['global'])
				datos.calificar(valor)
				data['global'] = datos
				// -----------------------------------------------------------------
				// Datos diarios de la Empresa
				// -----------------------------------------------------------------
				let time = new Date()
				let fecha = this.convertDate(time)
				let datos2 = new EstadisticasDiarias()
				let fechas = (data['fechas']) ? data['fechas'] : {}
				if (fechas[fecha])
					datos2.cargarDatos(fechas[fecha])
				datos2.calificar(valor)
				fechas[fecha] = datos2
				data['fechas'] = fechas
			}
			return data
		})

	}

}
