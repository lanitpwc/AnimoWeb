import { Injectable } from '@angular/core';
import * as _ from 'underscore';
import { FormControl } from '@angular/forms';
import { reject } from 'q';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import * as firebase from 'firebase';
import { map, delay } from 'rxjs/operators';
import { any } from 'underscore';
import { empresaModel } from '../models/empresa.model';

@Injectable()
export class BackService {
	//-----------------------------------------------------------------
	// Atributos
	//-----------------------------------------------------------------

	uid: string
	name: string
	company: string

	listaAreas: Array<any>
	areas: any

	listaUsuarios: Array<any>
	usuarios: any

	datosUsuario: any
	user: firebase.User
    dataBase: firebase.database.Database
	keyRegister: string
	
	private url = 'https://pwc-dev-425c7.firebaseio.com';


	//-----------------------------------------------------------------
	// Constructor
	//-----------------------------------------------------------------
	constructor(
        public http: Http, private httpClient: HttpClient
    ) {
        console.log('Hello BackUser Provider');
    }

	//-----------------------------------------------------------------
	// Metodos
	//-----------------------------------------------------------------

	cargarPerfil(uid: string) {
		return new Promise(result => {
			this.uid = uid	
			
			firebase.database().ref('admin-user/' + uid + '/').once('value', (snap) => {
				let valor = snap.val();
				console.log('valor:', valor);
				if(valor){
					localStorage.setItem('company', valor.company)
					localStorage.setItem('name', valor.name)
				}
				result(valor)
			})
		})
	}

	cargarPerfilUsuario(uid: string) {
		return new Promise(result => {
			this.uid = uid			
			firebase.database().ref('usuarios/' + uid + '/').once('value', (snap) => {
				debugger
				let valor = snap.val();		
				this.datosUsuario = snap.val()
				this.name = valor.nombre
				this.company = valor.empresa

				localStorage.setItem('company', valor.empresa)
				localStorage.setItem('name', valor.nombre)
				
				result(valor)
			})
			this.dataBase.ref('usuarios/' + uid + '/').on('value', snap => {
                this.datosUsuario = snap.val()
            })
		})
	}

	darAreas() {
		firebase.database().ref('empresas/' + this.company + '/area/').once('value', snap => {
			this.areas = snap.val()
			this.listaAreas = _.allKeys(this.areas)
		})
	}

	getAreas(): Promise<any> {
		return new Promise(function(yes, no) {
			firebase.database().ref('empresas/' + localStorage.getItem('company') + '/area/').once('value', snap => {
				if(snap.val() !== null) {
					yes(_.allKeys(snap.val()))
				}
			})
		})
	}
	
	darUsuarios() {
		firebase.database().ref('empresas/' + this.company + '/usuarios').once('value', snap => {
			this.usuarios = snap.val()
			this.listaAreas = _.allKeys(this.usuarios)
		})
	}

	/**
	 * New functions were added from here and on
	 */

	/**
	 * Dada la dominio/empresa del correo de registro se devuelven las edades
	 */
	darEdades(empresa) {
		return new Promise(result => {
			firebase.database().ref('edades/' + empresa).once('value', snap => {
				let val = snap.val()
				if(val !== null) {
					let edades = _.allKeys(val)
					result(edades)
				}else{
					result(null)
				}
			})
		})
	}

	// devuelve todos los detalles de un elemento del nodo empresa
	darEmpresa(empresa) {
		return new Promise(result => {
			firebase.database().ref('empresas/' + empresa).once('value', snap => {
				let val = snap.val()
				result(val)
			})
		})
	}

	// devuelve todas las empresas de la tabla empresas
	darEmpresas() {
		return this.httpClient.get(`${this.url}/empresas.json`)
		.pipe(
			map( resp => this.crearArreglo( resp )),
			delay(1500)
			
		);
	}

	private crearArreglo ( empresasObj : object){

		const empresas: empresaModel[] = [];

		//if( empresas === null){ return []; }

		Object.keys(empresasObj).forEach( key =>{
			const empresa: empresaModel = empresasObj[key];
			
			empresa.name = key
			empresas.push(empresa);
		})

		return empresas;
	}

	// regresa el nombre de la emprea segun el dominio registrado
	darEmpresaFromDomain(dominio) {
		return new Promise(result => {
			firebase.database().ref('dominios/' + dominio + '/empresa').once('value', snap => {
				let val = snap.val()
				result(val)
			}).catch(error => {
				console.log(error)
			})
		})
	}

	validEmail(c: FormControl) {
		let EMAIL_REGEXP = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		return EMAIL_REGEXP.test(c.value) ? null : {
			valid: false,
			message: "Formato de correo no válido"
		};
	}

	validNickname(c: FormControl) {
		let EMAIL_REGEXP = /^[A-Za-z]*[A-Za-z0-9][A-Za-z0-9_.]*$/i;
		return EMAIL_REGEXP.test(c.value) ? null : {
			valid: false,
			message: "Apodo no válido"
		};
	}

	validHumanName(c: FormControl) {
		let EMAIL_REGEXP = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/i;
		return EMAIL_REGEXP.test(c.value) ? null : {
			valid: false,
			message: "Su nombre no puede contener números"
		};
	}

	isRequired(c: FormControl) {
		if(c.value === ''){
			return {
				valid: false,
				message: 'Este campo es obligatorio'
			}
		}else{
			return null
		}
	}

	passwordLength(c: FormControl) {
		if (String(c.value).length <= 6) {
			return {
				valid: false,
				message: 'La contraseña debe tener al menos 7 caracteres'
			}
		} else {
			return null
		}
	}

	// this function is not needed
	addNewDomain(domain, empresa) {	
		return new Promise(result => {
			firebase.database().ref('dominios/'+domain).set({ empresa : empresa })
			result()
		})
	}
}
