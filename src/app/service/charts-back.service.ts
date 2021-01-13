import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
import * as _ from 'underscore';

@Injectable()
export class ChartsBackService {

  // -----------------------------------------------------------------
	// Atributos
	// -----------------------------------------------------------------

	db: firebase.database.Database

	user: firebase.User

	// -----------------------------------------------------------------
	// Constructor
	// -----------------------------------------------------------------
	constructor(public http: Http) {
		console.log('Hello ChartsBack Provider');
		this.db = firebase.database()
		this.user = firebase.auth().currentUser
	}

	// -----------------------------------------------------------------
	// Metodos
	// -----------------------------------------------------------------


	estadisticasDiarias(emocion: string,fInicial: Date, fFinal: Date): Promise<any>;
	estadisticasDiarias(emocion:string): Promise<any>;
	estadisticasDiarias(): Promise<any> {
		let num = arguments.length
		let emocion = arguments[0]
		let d1 = arguments[1]
		let d2 = arguments[2]
		return new Promise((data, err) => {
			switch (num) {
				case 3:
					if (d1 && d2) {
						if (d1.getTime() <= d2.getTime()) {
							let ref = this.db.ref('usuarios/' + this.user.uid + '/emociones/' + emocion + '/fechas')
							ref.orderByKey().startAt(this.convertDate(d1)).endAt(this.convertDate(d2)).once('value', snap => {
								data(snap.val())
							})
						}
						else {
							err('Fecha inicial debe ser menos a la final')
						}
					}
					else {
						err('Infre fechas validas')
					}
					break;

				case 1:
					let ref = this.db.ref('usuarios/' + this.user.uid + '/emociones/' + emocion + '/fechas')
					ref.orderByKey().limitToLast(7).once('value',snap=>{
						data(snap.val())
					})
					break;
			}
		})
	}


	

	promedioEmocion(emocion: string): Promise<any>;
	promedioEmocion(emocion: string, f1: Date, f2: Date): Promise<any>;
	promedioEmocion(): Promise<any> {
		let num = arguments.length
		let emocion = arguments[0]
		let d1 = arguments[1]
		let d2 = arguments[2]

		return new Promise((data, err) => {
			switch (num) {
				case 1:
					this.db.ref('usuarios/' + this.user.uid + '/emociones/' + emocion + '/global/promedio').once('value', snap => {
						data(snap.val())
					})
					break;
				case 3:
					let ref = this.db.ref('usuarios/' + this.user.uid + '/emociones/' + emocion + '/fechas')
					ref.orderByKey().startAt(this.convertDate(d1)).endAt(this.convertDate(d2)).once('value', snap => {
						let resp = this.promedioFechas(snap.val())
						data(resp)
					})
					break;
			}
		})
	}

	promedioEmpresa(emocion: string, datos: any, empresa: string): Promise<any>;
	promedioEmpresa(emocion: string, datos: any, empresa: string, f1: Date, f2: Date): Promise<any>;
	promedioEmpresa(): Promise<any> {
		let num = arguments.length

		let emocion = arguments[0]
		let datos = arguments[1]
		let empresa = arguments[2]
		let d1 = arguments[3]
		let d2 = arguments[4]

		return new Promise(data => {
			switch (num) {
				case 3:
					let pat = 'empresas/' + empresa + '/emociones/' + emocion + '/global/promedio'
					this.datosGloval(pat, datos, emocion, data)
					break;
				case 5:
					let pat1 = 'empresas/' + empresa + '/emociones/' + emocion + '/fechas'
					this.datosFecha(pat1, datos, d1, d2, emocion, data)
					break;
			}
		})
	}


	promedioAreas(emocion: string, datos: any, empresa: string): Promise<any>;
	promedioAreas(emocion: string, datos: any, empresa: string, f1: Date, f2: Date): Promise<any>;
	promedioAreas(): Promise<any> {
		let num = arguments.length

		let emocion = arguments[0]
		let datos = arguments[1]
		let empresa = arguments[2]
		let d1 = arguments[3]
		let d2 = arguments[4]

		return new Promise(data => {
			switch (num) {
				case 3:
					let pat = 'estadisticas/' + empresa + '/' + datos.anonimo.area + '/' + emocion + '/global/promedio'
					this.datosGloval(pat, datos, emocion, data)
					break;
				case 5:
					let pat1 = 'estadisticas/' + empresa + '/' + datos.anonimo.area + '/' + emocion + '/fechas'
					this.datosFecha(pat1, datos, d1, d2, emocion, data)
					break;
			}
		})
	}


	promedioEdades(emocion: string, datos: any, empresa: string): Promise<any>;
	promedioEdades(emocion: string, datos: any, empresa: string, f1: Date, f2: Date): Promise<any>;
	promedioEdades(): Promise<any> {
		let num = arguments.length

		let emocion = arguments[0]
		let datos = arguments[1]
		let empresa = arguments[2]
		let d1 = arguments[3]
		let d2 = arguments[4]

		return new Promise(data => {
			switch (num) {
				case 3:
					let pat1 = 'edades/' + empresa + '/' + datos.anonimo.edad + '/' + emocion + '/global/promedio'
					this.datosGloval(pat1, datos, emocion, data)
					break;
				case 5:
					let pat = 'edades/' + empresa + '/' + datos.anonimo.edad + '/' + emocion + '/fechas'
					this.datosFecha(pat, datos, d1, d2, emocion, data)
					break;
			}
		})
	}


	promedioCargo(emocion: string, datos: any, empresa: string): Promise<any>;
	promedioCargo(emocion: string, datos: any, empresa: string, f1: Date, f2: Date): Promise<any>;
	promedioCargo(): Promise<any> {
		let num = arguments.length

		let emocion = arguments[0]
		let datos = arguments[1]
		let empresa = arguments[2]
		let d1 = arguments[3]
		let d2 = arguments[4]

		return new Promise(data => {
			switch (num) {
				case 3:
					let pat1 = 'cargos/' + empresa + '/' + datos.anonimo.cargo + '/' + emocion + '/global/promedio'
					this.datosGloval(pat1, datos, emocion, data)
					break;
				case 5:
					let pat = 'cargos/' + empresa + '/' + datos.anonimo.cargo + '/' + emocion + '/fechas'
					this.datosFecha(pat, datos, d1, d2, emocion, data)
					break;
			}
		})
	}


	promedioSubArea(emocion: string, datos: any, empresa: string): Promise<any>;
	promedioSubArea(emocion: string, datos: any, empresa: string, f1: Date, f2: Date): Promise<any>;
	promedioSubArea(): Promise<any> {
		let num = arguments.length

		let emocion = arguments[0]
		let datos = arguments[1]
		let empresa = arguments[2]
		let d1 = arguments[3]
		let d2 = arguments[4]

		return new Promise(data => {
			switch (num) {
				case 3:
					let pat1 = 'estadisticas/' + empresa + '/' + datos.anonimo.area + '/subArea/'+ datos.anonimo.subArea + '/' + emocion + '/global/promedio'
					this.datosGloval(pat1, datos, emocion, data)
					break;
				case 5:
					let pat = 'estadisticas/' + empresa + '/' + datos.anonimo.area + '/subArea/'+ datos.anonimo.subArea + '/' + emocion + '/fechas'
					this.datosFecha(pat, datos, d1, d2, emocion, data)
					break;
			}
		})
	}

	promedioUnidadNegocio(emocion: string, datos: any, empresa: string): Promise<any>;
	promedioUnidadNegocio(emocion: string, datos: any, empresa: string, f1: Date, f2: Date): Promise<any>;
	promedioUnidadNegocio(): Promise<any> {
		let num = arguments.length

		let emocion = arguments[0]
		let datos = arguments[1]
		let empresa = arguments[2]
		let d1 = arguments[3]
		let d2 = arguments[4]

		return new Promise(data => {
			switch (num) {
				case 3:
					let pat1 = 'estadisticas/' + empresa + '/' + datos.anonimo.area + '/subArea/'+ datos.anonimo.subArea + '/subArea/'+ datos.anonimo.subSubArea + '/' + emocion + '/global/promedio'
					this.datosGloval(pat1, datos, emocion, data)
					break;
				case 5:
					let pat = 'estadisticas/' + empresa + '/' + datos.anonimo.area + '/subArea/'+ datos.anonimo.subArea + '/subArea/'+ datos.anonimo.subSubArea + '/' + emocion + '/fechas'
					this.datosFecha(pat, datos, d1, d2, emocion, data)
					break;
			}
		})
	}

	// -----------------------------------------------------------------
	// Metodos privados
	// -----------------------------------------------------------------

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

	private promedioFechas(listaFechas: Array<any>): number {
		let prom = 0
		let total = 0
		_.each(listaFechas, v => {
			prom += v['promedio']
			total++
		})
		let resp = (prom == 0) ? 0 : prom / total
		return resp
	}

	private datosGloval(pat, datos, emocion, data) {
		let proUsuario = datos.emociones[emocion].global.promedio
		this.db.ref(pat).once('value', snap => {
			let proEmpresa = snap.val()
			data({
				usuario: proUsuario,
				empresa: proEmpresa
			})
		})
	}

	private datosFecha(pathd, datos, d1, d2, emocion, data) {
		let lista = _.filter(datos.emociones[emocion].fechas, (v, k) => {
			if (this.convertDate(d1) <= k + '' && k + '' <= this.convertDate(d2))
				return true
			else
				return false
		})
		let promUsuario = this.promedioFechas(lista)
		let ref = this.db.ref(pathd)
		ref.orderByKey().startAt(this.convertDate(d1)).endAt(this.convertDate(d2)).once('value', snap => {
			let lista = snap.val()
			let porm = this.promedioFechas(lista)
			data({
				usuario: promUsuario,
				empresa: porm
			})
		})
	}


}
