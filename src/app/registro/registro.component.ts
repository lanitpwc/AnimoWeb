import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';

import { default as swal } from 'sweetalert2';

import { BackService } from 'app/service/back.service';
import { environment } from '../../environments/environment';
import * as Data from '../data/data';

import * as firebase from 'firebase';
import { Router } from '../../../node_modules/@angular/router';
import { any } from 'underscore';
import { empresaModel } from '../models/empresa.model';

var _ = require('underscore');

@Component({
	selector: 'app-registro',
	templateUrl: './registro.component.html',
	styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
	/**********************************
	 * 			VARIABLES
	 **********************************/
	empresa: any
	registration = {
		'nombre': '',
		'sexo': '',
		'bussines_units': '',
		'ciudad': '',
		'sede': '',
		'apodo': '',
		'correo': '',
		'password': '',
		'password_v': '',
		'age_range': '',
		'area': '',
		'sub_area': '',
		'cargo': '',
		'empresa':''
	}
	empresa_nombre = ''
	notyf: any

	// RELATED TO DROPDOWNS
	edades = Data.Edades
	areas = Data.LOS_SUBLOS_BUSSINESS_UNITS
	subareas = []
	bussines_units = []

	cargos = Data.Cargos
	ciudades = Data.Ciudades
	empresas = Data.Empresas

	sexos = Data.Sexos
	sedes = []

	

	// VARIABLES
	submitted: boolean = false
	terms: boolean = false

	// RELATED TO FORMS
	forma: FormGroup
	found: boolean = false

	constructor(
		private form: FormBuilder,
		private back: BackService,
        private http: Http,
        private router: Router
	) {

		/*this.back.darEmpresas()
			.subscribe( resp =>{
				debugger
				this.empresas = resp;
				console.log('resp en servicio:', resp);
				console.log('var empresas dentro del subscribe: ', this.empresas);
		});	

		console.log('var empresas: ', this.empresas);*/

		this.forma = form.group({
			'nombre': [null, [this.back.isRequired, this.back.validHumanName]],
			'sexo': [null, [this.back.isRequired]],
			'bussines_units': [null],
			'ciudad': [null, [this.back.isRequired]],
			'sede': [null, [this.back.isRequired]],
			'apodo': [null, [this.back.isRequired, this.back.validNickname.bind(this)]],
			'correo': [null, [this.back.isRequired, this.back.validEmail]],
			'password': [null, [this.back.isRequired, this.back.passwordLength]],
			'password_v': [null, [this.back.isRequired, this.back.passwordLength]],
			'age_range': [null, [this.back.isRequired]],
			'area': [null, [this.back.isRequired]],
			'sub_area': [null, [this.back.isRequired]],
			'cargo': [null, [this.back.isRequired]],
			'empresa': [null, [this.back.isRequired]]
		})
		
		
	}

	ngOnInit() {
		document.getElementById('navbar').style.display = 'none';
		document.getElementById('page-wrapper').removeAttribute('style')
		document.getElementById('page-wrapper').removeAttribute('id')
		document.body.setAttribute('style', 'background-color: #dddddd !important')
		
    }

	/** * * * * * * * * *
	 *     METODOS
	 * * * * * * * * * **/
	/**
	 * FIELD VALIDATIONS AND PERSISTING DATA TO FIREBASE
	 *
	 * @memberof RegistroComponent
	 */
	submitRegistration() {
		this.submitted = true
		this.forma.setValue(this.registration)
		this.forma.updateValueAndValidity()

		if (this.forma.valid) {
			if (this.registration.password !== this.registration.password_v) {
				this.forma.controls['password'].setErrors({ valid: false, message: 'Las claves no coinciden' })
				this.forma.controls['password_v'].setErrors({ valid: false, message: 'Las claves no coinciden' })
				this.forma.updateValueAndValidity()
			} else {
				swal({
					title: 'Espere..',
					text: 'Estamos llevando a cabo su registro',
					type: 'info',
					showCancelButton: false,
					showConfirmButton: false,
					onOpen: () => {
						swal.showLoading()
					}
				});

				/**
				 * this.found es la variable que contiene la variable si la direccion de correo es la apropiada
				 */
				if(this.found) {
					// Creating the current user
					firebase.auth().createUserWithEmailAndPassword(this.registration.correo, this.registration.password).then(user => {
						user.sendEmailVerification().then(x => {

							// everything with form its okay, lets check user mail
							this.http.get(environment.url_servidor_dev + "correo/bienvenida/" + this.registration.correo)

							let usuario = {
								anonimo: {
									apodo: this.registration.apodo,
									area: this.registration.area,
									cargo: this.registration.cargo,
									edad: this.registration.age_range,
								},
								nombre: this.registration.nombre,
								cargo: this.registration.cargo,
								los: this.registration.area,
								sublos: this.registration.sub_area,
								business_unit: this.registration.bussines_units,
								ciudad: this.registration.ciudad,
								sede: this.registration.sede,
								sexo: this.registration.sexo,
								fec_nacimiento: this.registration.age_range,
								email: this.registration.correo,
								//empresa: this.empresa_nombre,
								empresa: this.registration.empresa,
								pushRecividos: 0,
								pushContestados: 0,
								ultimoIngreso: new Date().getTime(),
								emociones: {
									felicidad: {
										date: 0,
										global: {
											acum: 0,
											promedio: 0,
											total: 0
										}
									},
									estres: {
										date: 0,
										global: {
											acum: 0,
											promedio: 0,
											total: 0
										}
									},
									motivacion: {
										date: 0,
										global: {
											acum: 0,
											promedio: 0,
											total: 0
										}
									},
									extra: {
										date: 0,
										global: {
											acum: 0,
											promedio: 0,
											total: 0
										}
									}
								}
							}

							let finalUser = {}
							usuario["key"] = user.uid
							finalUser[user.uid] = usuario
							firebase.database().ref("usuarios/").update(finalUser)

							swal({
								title: 'Muy bien',
								text: 'Su cuenta ha sido creada. Te hemos enviado un correo electrónico de confirmación.',
								type: 'success',
							}).then(x => {
								firebase.auth().signOut().then(x => {
                                    // location.reload()
                                    // Lo envio a la pagina de registro exitoso
                                    this.router.navigateByUrl('/welcome')
								})
							})
						})

					}).catch(error => {
						console.log(error)
						if (error.code == 'auth/weak-password') {
							swal({
								title: 'Error',
								text: 'La contraseña que eligio es muy débil. Por favor elija otra',
								type: 'error',
							})
						}

						if (error.code == 'auth/email-already-in-use') {
							swal({
								title: 'Error',
								text: 'La cuenta de correo que ha seleccionado se encuentra en uso',
								type: 'error',
							})
						}

					});
				}else{
					swal({
						title: 'Disculpe',
						text: 'Verifique su dirección de correo electronico para continuar con el registro',
						type: 'warning',
						showCancelButton: false,
						showConfirmButton: false,
						onOpen: () => {
							swal.showLoading()
						}
					});
				}

			}
		}
	}

	/**
	 * The next set of 'OnChange...' functions are use to set the choosen value for each dropdown, its not efficient but it does the job
	 *
	 * @param {any} value
	 * @memberof RegistroComponent
	 */

	// Set age range to the value
	setAgeRange(value) {
		this.registration.age_range = value
		this.forma.updateValueAndValidity()
	}

	onChangeSexo(value) {
		if (value === 'null') {
			this.registration.sexo = null
		} else {
			this.registration.sexo = value
		}
		this.forma.updateValueAndValidity()
	}

	onChangeArea(event) {
		if (event.target.value === 'null') {
			this.subareas = []
			this.bussines_units = []
			this.registration.sub_area = null
			this.registration.bussines_units = null
		} else {
			this.registration.area = event.target.value
			this.subareas = this.areas[event.target.selectedIndex - 1].sublos
		}
		this.forma.updateValueAndValidity()
	}

	onChangeSubArea(event) {
		if (event.target.value === 'null') {
			this.bussines_units = []
			this.registration.sub_area = null
			this.registration.bussines_units = null
		} else {
			this.registration.sub_area = event.target.value
			this.bussines_units = this.subareas[event.target.selectedIndex - 1].business_units
		}
		this.forma.updateValueAndValidity()
	}

	onChangeBussinesUnit(event) {
		if (event.target.value === 'null') {
			this.registration.bussines_units = null
		} else {
			this.registration.bussines_units = event.target.value
		}
		this.forma.updateValueAndValidity()
	}

	onChangeEmpresa(value){
		this.registration.empresa = value
		this.forma.updateValueAndValidity()
	}

	onChangeCargo(value) {
		this.registration.cargo = value
		this.forma.updateValueAndValidity()
	}

	onChangeCiudad(event) {
		if (event.target.value === 'null') {
			// this.registration.ciudad = null
		} else {
			this.registration.ciudad = event.target.value
			this.sedes = this.ciudades[event.target.selectedIndex - 1].sedes
		}
		this.forma.updateValueAndValidity()
	}

	onChangeSede(event) {
		if (event.target.value === 'null') {
			// this.registration.sede = null
		} else {
			this.registration.sede = event.target.value
		}
		this.forma.updateValueAndValidity()
	}

	/**
	 * This functions its trigger after the mail field is modified
	 * Checks if the provided email is a co.pwc.com domain, if its not registration cannot continue
	 *
	 * @param {any} mail
	 * @memberof RegistroComponent
	 */
	getDomain(mail) {
		console.log('el mail ha cambiado')
		console.log(mail)

		let partes = mail.split('@')
		if (partes.length === 2) {
			let domain = partes[1] // the last part of mail
			console.log(domain)

			// domain = domain.replace('.', '')
			// domain = domain.replace('.', '')
			// domain = domain.replace('#', '')
			// domain = domain.replace('$', '')
			// domain = domain.replace('[', '')
			// domain = domain.replace(']', '')

			// Para admitir correos de este unico dominio
			//if(domain === 'co.pwc.com') {
			//	domain = 'copwccom'
			//}else{
			//	domain = ''
			//}

			let parteDominio= domain.split('.');

			let parteDominioSp= parteDominio[0].concat(parteDominio[1]);

			let empresanueva = parteDominio[0];

			let dom_name = '@' + parteDominioSp

			if (dom_name !== '') {

				this.back.addNewDomain(dom_name,empresanueva);

				this.back.darEmpresaFromDomain(dom_name).then(empresa => {
					if (empresa) {
						// a partir del dominio obtengo el nombre de la empresa
						this.empresa_nombre = String(empresa)
						this.found = true

						// this.edades = Object.keys(edades).map(function(k) { return edades[k] })
						this.back.darEmpresa(empresa).then((bussines:any) => {
							if (bussines) {
								this.empresa = Object.assign(bussines)
							}
						}).then(x => {
							// this.areas = Object.keys(this.empresa['area'])
							// this.cargos = this.empresa['cargos']
							// this.ciudades = this.empresa['ciudades']
						})
					} else {
						console.log('no encontro la empresa')
						this.resetArrays()
						this.forma.updateValueAndValidity()
						this.forma.controls['correo'].setErrors({ valid: false, message: 'Su cuenta no puede ser enlazada a nuestro sistema' })
						swal(
							'Lo sentimos',
							'No hemos encontrado su cuenta en nuestro sistema. Asegurate de usar tu cuenta de correo corporativa.',
							'warning'
						)

					}
				})
			}
		} else {
			// something about mail is wrong
			this.resetArrays()
			this.forma.updateValueAndValidity()
			this.forma.controls['correo'].setErrors({ valid: false, message: 'Debe ingresar una cuenta de correo corporativo válida' })
		}
	}

	/**
	 * When a dropdown with dependencies is changes its dependencies must changed
	 */
	resetArrays() {
		this.found = false
		this.empresa_nombre = ''
		Object.assign(this.registration, {
			'nombre': '',
			'sexo': '',
			'bussines_units': '',
			'ciudad': '',
			'sede': '',
			'apodo': '',
			'correo': '',
			'password': '',
			'password_v': '',
			'age_range': '',
			'area': '',
			'sub_area': '',
			'cargo': '',
		})
		this.forma.setValue(this.registration)
		this.forma.updateValueAndValidity()
	}

	/**
	 * Function to persist necessary data structure to the app and dashboard, its heavly linked to the admin site and mobile app
	 * and its also necessary for its proper work.
	 *
	 * @memberof RegistroComponent
	 */
	addArea() {
		let obj: any
		let areas = []
		let sub_areas = []
		let empresa = 'pwc'
		// en empresas > pwc > area

		areas['Administración'] = {
			nombre: 'Administración',
			subArea: ['Finanzas', 'GTS', 'Human Capital', 'Other Infrastructure']
		};
		sub_areas['Finanzas'] = {
			nombre: 'Finanzas',
			subArea: ['Contabilidad', 'Finanzas', 'Tesoreria', 'Estadistica', 'Analisis y Presupuestos']
		}
		sub_areas['GTS'] = {
			nombre: 'GTS',
			subArea: ['GTS']
		}
		sub_areas['Human Capital'] = {
			nombre: 'Human Capital',
			subArea: ['HR', 'L&E']
		}
		sub_areas['Other Infrastructure'] = {
			nombre: 'Other Infrastructure',
			subArea: ['Administración', 'B&C', 'C&M', 'CDD', 'OGC', 'QMS', 'Responsabilidad Social Corporativa']
		}

		areas['Advisory'] = {
			nombre: 'Advisory',
			subArea: ['AESCC', 'Analytics', 'CP&I', 'Deals', 'FS', 'GAF', 'Health', 'Knowledge Solutions', 'MC', 'Outsourcing', 'P&O', 'RAS', 'RCS', 'TC']
		};
		sub_areas['AESCC'] = {
			nombre: 'AESCC',
			subArea: ['AESCC']
		}
		sub_areas['Analytics'] = {
			nombre: 'Analytics',
			subArea: ['Analytics']
		}
		sub_areas['CP&I'] = {
			nombre: 'CP&I',
			subArea: ['CP&I']
		}
		sub_areas['Deals'] = {
			nombre: 'Deals',
			subArea: ['Deals']
		}
		sub_areas['FS'] = {
			nombre: 'FS',
			subArea: ['FS']
		}
		sub_areas['GAF'] = {
			nombre: 'GAF',
			subArea: ['GAF']
		}
		sub_areas['Health'] = {
			nombre: 'Health',
			subArea: ['Health']
		}
		sub_areas['Knowledge Solutions'] = {
			nombre: 'Knowledge Solutions',
			subArea: ['Knowledge Solutions']
		}
		sub_areas['MC'] = {
			nombre: 'MC',
			subArea: ['MS', 'PI', 'SCM', 'M&G', 'ST&']
		}
		sub_areas['Outsourcing'] = {
			nombre: 'Outsourcing',
			subArea: ['MBO-BOOKEEPING-FAS', 'MBO-BOOKEEPING-HRO', 'MBO-BOOKEEPING-AFS', 'MBO-BOOKEEPING-IOS', 'MBO-BOOKEEPING-SOF']
		}
		sub_areas['P&O'] = {
			nombre: 'P&O',
			subArea: ['P&O']
		}
		sub_areas['RAS'] = {
			nombre: 'RAS',
			subArea: ['RAS']
		}
		sub_areas['RCS'] = {
			nombre: 'RCS',
			subArea: ['CIS', 'ITS', 'ITS Consulting', 'RS', 'ERP', 'Forensics', 'Sostenibilidad']
		}
		sub_areas['TC'] = {
			nombre: 'TC',
			subArea: ['ECA', 'BTO', 'CS&P', 'IT Strategy', 'PAS', 'SAP']
		}

		areas['Assurance'] = {
			nombre: 'Assurance',
			subArea: ['Assurance']
		}
		sub_areas['Assurance'] = {
			nombre: 'Assurance',
			subArea: ['Assurance', 'SAT', 'Expanded Assurance', 'FSIP', 'Capital Markets']
		}

		areas['TLS'] = {
			nombre: 'TLS',
			subArea: ['Consulting', 'Legal', 'Support Attest']
		}
		sub_areas['Consulting'] = {
			nombre: 'Consulting',
			subArea: ['Consulting', 'SAT', 'Expanded Assurance', 'FSIP', 'Capital Markets']
		}
		sub_areas['Legal'] = {
			nombre: 'Legal',
			subArea: ['CIAC', 'Legal']
		}
		sub_areas['Support Attest'] = {
			nombre: 'Support Attest',
			subArea: ['Assurance', 'SAT', 'Expanded Assurance', 'FSIP', 'Capital Markets']
		}

		firebase.database().ref('empresas/' + empresa + '/area').set(areas)
		firebase.database().ref('empresas/' + empresa + '/sub_area').set(sub_areas)

		let cargos = Data.Cargos
		firebase.database().ref('empresas/' + empresa + '/cargos').set(cargos)
		_.each(cargos, v => {
			let url = 'cargos/' + empresa + '/' + v
			this.generarGlobal(url)
		})

		//-----------------------------------------------------------------
		// Estadisticas Areas
		//-----------------------------------------------------------------
		let los = Data.LOS_SUBLOS_BUSSINESS_UNITS
		_.each(los, l => {
			console.log(l.name)
			this.generarGlobal("estadisticas/" + empresa + '/' + l.name)
			if (l.sublos) {
				_.each(l.sublos, s => {
					console.log(s.name)
					this.generarGlobal("estadisticas/" + empresa + '/' + l.name + "/subArea/" + s.name)
					if (s.business_units) {
						_.each(s.business_units, b => {
							console.log(b.name)
							this.generarGlobal("estadisticas/" + empresa + '/' + l.name + "/subArea/" + s.name + "/subArea/" + b.name)
						})
					}
				})
			}
		})
	}

	/**
	 * this function its only called by addArea() to serve that function purpose
	 *
	 * @param {any} url
	 * @memberof RegistroComponent
	 */
	generarGlobal(url) {
		firebase.database().ref(url + "/felicidad/global").set({
			v1: 0,
			v2: 0,
			v3: 0,
			v4: 0,
			v5: 0,
			promedio: 0,
			total: 0
		})

		firebase.database().ref(url + "/motivacion/global").set({
			v1: 0,
			v2: 0,
			v3: 0,
			v4: 0,
			v5: 0,
			promedio: 0,
			total: 0
		})

		firebase.database().ref(url + "/estres/global").set({
			v1: 0,
			v2: 0,
			v3: 0,
			v4: 0,
			v5: 0,
			promedio: 0,
			total: 0
		})

		firebase.database().ref(url + "/extra/global").set({
			v1: 0,
			v2: 0,
			v3: 0,
			v4: 0,
			v5: 0,
			promedio: 0,
			total: 0
		})
	}

	/**
	 * Displays terms and conditions in a swal modal
	 *
	 * @memberof RegistroComponent
	 */
	termsAndConditions() {
		swal({
			title: '<i style="font-family: Georgia, \'Times New Roman\', Times !important;">POLÍTICA DE PRIVACIDAD Y TÉRMINOS DE USO</i>',
			html:
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Introducci&oacute;n </span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><span style="color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">PricewaterhouseCoopers Asesores Gerenciales LTDA, sociedad comercial identificada con Nit. 860.046.645&ndash;9, es una organizaci&oacute;n global que tiene plena conciencia de la privacidad y se encuentra fuertemente comprometida a preservar dicho derecho. Nuestra pol&iacute;tica de privacidad sigue los lineamientos establecidos por la &ldquo;Alianza para la Protecci&oacute;n de la Privacidad en L&iacute;nea&rdquo; y las exigencias previstas en la legislaci&oacute;n local e internacional sobre protecci&oacute;n de datos. Al ingresar sus datos e informaci&oacute;n, los visitantes y usuarios de nuestro sitio Web expresan y otorgan su consentimiento para el uso de dichos datos por parte de PricewaterhouseCoopers, quien act&uacute;a como responsable del Tratamiento de Datos conforme se describe en esta Pol&iacute;tica de Privacidad. No obstante, en caso de tener consultas o inquietudes al respecto, no dude en contactarnos al siguiente correo</span><span style="color: #ff0000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">: </span><span style="color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">pwc_habeasdata@co.pwc.com</span></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">La Misi&oacute;n de PricewaterhouseCoopers para la Protecci&oacute;n de la Privacidad. </span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Generalmente, PricewaterhouseCoopers s&oacute;lo recoge y recibe informaci&oacute;n personal que es espec&iacute;fica y voluntariamente suministrada por un visitante de nuestra aplicaci&oacute;n web o sitio. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Un visitante de nuestro sitio puede decidir suministrar esta informaci&oacute;n para registrarse o incluir informaci&oacute;n. Cuando un visitante nos brinda este tipo de informaci&oacute;n personal, la utilizamos exclusivamente para el registro en la aplicaci&oacute;n de Mi &Aacute;nimo. Reconocemos que la informaci&oacute;n personal es valiosa y adoptamos todas las medidas razonablemente necesarias conforme las exigencias legales, con el fin de proteger dicha informaci&oacute;n y evitar su p&eacute;rdida, adulteraci&oacute;n, uso o acceso no autorizados mientras se encuentra a nuestro cuidado. Sin perjuicio de ello, el visitante debe ser consciente de que las medidas de seguridad en Internet no son infalibles. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">En todos los casos, la informaci&oacute;n ser&aacute; mantenida con car&aacute;cter confidencial, salvo que su divulgaci&oacute;n fuera requerida por resoluci&oacute;n judicial y/o cuando medien razones fundadas relativas a la seguridad p&uacute;blica, la defensa nacional o la salud p&uacute;blica. Dicha informaci&oacute;n podr&aacute; ser compartida por PricewaterhouseCoopers con miembros de la firma a nivel mundial para fines de medici&oacute;n del clima organizacional. &nbsp;</span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">PricewaterhouseCoopers es l&iacute;der global en el desarrollo e implementaci&oacute;n de servicios de seguridad de privacidad y de servicios de verificaci&oacute;n de terceros. Nuestro liderazgo se establece no s&oacute;lo por el rango de experiencia que tenemos en el desarrollo y seguridad de pol&iacute;ticas de privacidad, sino tambi&eacute;n por nuestro propio ejemplo: Dado que nuestro sitio tiene &aacute;reas en las cuales las personas pueden suministrar informaci&oacute;n personal, hemos desarrollado nuestra Pol&iacute;tica de Privacidad para informar a los visitantes sobre nuestras pol&iacute;ticas y pr&aacute;cticas con respecto a dicha informaci&oacute;n. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><span style="color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"></span><span style="color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Nuestro compromiso de proteger la privacidad de los consumidores tanto en l&iacute;nea como fuera de ella es continuo, por ejemplo, a trav&eacute;s de nuestra participaci&oacute;n en las siguientes iniciativas de protecci&oacute;n de la privacidad en los Estados Unidos: </span></span></p>'
			+
			'<ul style="margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">'
			+
			'<li style="list-style-type: disc; font-size: 11pt; font-family: \'Noto Sans Symbols\'; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; margin-left: 18pt;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Auditor&iacute;as y e-Assurance (e-Seguridad) de Protecci&oacute;n de Privacidad de PricewaterhouseCoopers. </span></li>'
			+
			'<li style="list-style-type: disc; font-size: 11pt; font-family: \'Noto Sans Symbols\'; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; margin-left: 18pt;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Alianza para la protecci&oacute;n de la privacidad en l&iacute;nea. </span></li>'
			+
			'<li style="list-style-type: disc; font-size: 11pt; font-family: \'Noto Sans Symbols\'; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; margin-left: 18pt;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">TRUSTe (CONFIANZA en l&iacute;nea). </span></li>'
			+
			'<li style="list-style-type: disc; font-size: 11pt; font-family: \'Noto Sans Symbols\'; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; margin-left: 18pt;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Privacidad y Negocios. </span></li>'
			+
			'<li style="list-style-type: disc; font-size: 11pt; font-family: \'Noto Sans Symbols\'; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; margin-left: 18pt;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">BBBOnline. </span></li>'
			+
			'<li style="list-style-type: disc; font-size: 11pt; font-family: \'Noto Sans Symbols\'; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; margin-left: 18pt;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Confianza en la Web por parte de los Contadores P&uacute;blicos matriculados del AICPA. </span></li>'
			+
			'</ul>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">PricewaterhouseCoopers recomienda a todos los visitantes revisar estas iniciativas de certificado de garant&iacute;a de la Web, investigar los programas, y buscar activamente un sello o certificado de seguridad en todos los sitios que usted visite y en los cuales suministre informaci&oacute;n personal. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Recolecci&oacute;n y uso de informaci&oacute;n personal. </span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Los datos e informaci&oacute;n que PricewaterhouseCoopers en la aplicaci&oacute;n pueden llegar a ser compartidos con otros miembros de la firma a nivel mundial. En todo caso, dichos datos no ser&aacute;n suministrados, compartidos ni entregados a terceros diferentes de dichos miembros. En nuestra aplicaci&oacute;n web, recolectamos y recogemos informaci&oacute;n del usuario necesaria para las gestiones relativas a cada caso (Ej.: correo electr&oacute;nico, profesi&oacute;n, direcci&oacute;n, tel&eacute;fonos de contacto, etc.), dicha informaci&oacute;n puede ser recibida por el env&iacute;o de un mensaje de datos (email) por parte del visitante a un correo de nuestra firma o directamente a trav&eacute;s de nuestra aplicaci&oacute;n web en espacios determinados espec&iacute;ficamente para la recolecci&oacute;n de informaci&oacute;n. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Nuestra pol&iacute;tica es limitar la recolecci&oacute;n de esta informaci&oacute;n al m&iacute;nimo requerido para cada caso y evitar el exceso de informaci&oacute;n irrelevante, as&iacute; mismo evitar el uso de informaci&oacute;n personal para actividades de env&iacute;o y recibo de correo no solicitado. En todo caso si usted est&aacute; en desacuerdo con la informaci&oacute;n solicitada en nuestra aplicaci&oacute;n web o el uso dado a la misma, le agradecemos contactarnos a pwc.markets@co.pwc.com. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Si la informaci&oacute;n recibida en alg&uacute;n momento llegare a ser compartida con terceras personas diferentes a miembros de la firma PricewaterhouseCoopers o diferentes de terceros clientes de PricewaterhouseCoopers; el consentimiento y autorizaci&oacute;n de quien ha suministrado la informaci&oacute;n ser&aacute; requerido antes de compartir la informaci&oacute;n con dichos terceros. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Nuestra pol&iacute;tica de privacidad establece el suministro de informaci&oacute;n a terceros bajo las siguientes circunstancias: 1) Con autorizaci&oacute;n expresa del usuario, 2) Por requerimiento de ley o de autoridad, 3) Cuando se requiera para el env&iacute;o de publicaciones o materiales solicitados por el visitante o usuario. En cualquier caso el usuario acepta que al suministrar informaci&oacute;n est&aacute; dando su consentimiento expreso para compartir su informaci&oacute;n en la forma arriba expuesta y para recibir cualquier tipo de informaci&oacute;n, publicidad y anuncios de miembros de la red PricewaterhouseCoopers. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><span style="color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"></span><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Modificaciones, cambios, actualizaci&oacute;n o retiro de informaci&oacute;n personal. </span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Si una vez ingresada su informaci&oacute;n, el visitante desea efectuar cambios, actualizaciones, retirar dicha informaci&oacute;n o no recibir m&aacute;s correos o informaci&oacute;n de PricewaterhouseCoopers, el visitante podr&aacute; comunicarse a pwc.markets@co.pwc.com para cualquiera de dichos prop&oacute;sitos. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">De la manera m&aacute;s razonable procuraremos registrar cualquier novedad comunicada por los usuarios. En cualquier caso, PricewaterhouseCoopers no responde por la veracidad, integridad ni exactitud de la informaci&oacute;n suministrada por visitantes y usuarios. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Los visitantes de esta aplicaci&oacute;n web podr&aacute;n ejercer los derechos de acceso, rectificaci&oacute;n u supresi&oacute;n de los datos personales por ellos suministrados, conforme lo dispuesto por la legislaci&oacute;n local vigente. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Uso de cookies. </span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Es posible que en nuestra aplicaci&oacute;n web se usen &ldquo;cookies&rdquo;; &eacute;stas son peque&ntilde;os archivos de texto ubicados en su harddrive que nos ayudan a proveer una visita m&aacute;s personalizada en nuestro sitio. Por ejemplo, una &ldquo;cookie&rdquo; puede ser usada para archivar informaci&oacute;n en un &aacute;rea del sitio de manera tal que un visitante o usuario no necesita reingresar sucesivas veces a esa especifica &aacute;rea en cada visita. Nuestra pol&iacute;tica es usar &ldquo;cookies&rdquo; con el prop&oacute;sito de facilitar la visita y navegaci&oacute;n en nuestro sitio Web, as&iacute; como cualquier proceso de registro en dicho sitio. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Si usted tiene inquietudes sobre el tema de &ldquo;cookies&rdquo; tenga en cuenta que la mayor&iacute;a de computadores permiten evitar o suspender el uso de &ldquo;cookies&rdquo;, en la mayor&iacute;a de los casos aunque usted rechace el uso de estos dispositivos, podr&aacute; seguir accediendo y navegando en nuestro sitio Web. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Para poder administrar y manejar adecuadamente nuestro sitio Web es posible que de manera an&oacute;nima introduzcamos informaci&oacute;n en nuestros sistemas operacionales e identifiquemos categor&iacute;as de visitantes por rubros como dominios y tipo de &ldquo;browsers&rdquo;. Estas estad&iacute;sticas e informaci&oacute;n pueden ser introducidas en nuestros Webmasters. Lo anterior nos permite garantizar que nuestro sitio Web facilita una experiencia &oacute;ptima de navegaci&oacute;n para nuestros visitantes y es una fuente efectiva de informaci&oacute;n. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Enlaces o links a otras p&aacute;ginas.</span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Nuestro sitio s&oacute;lo presenta enlaces a sitios de miembros de nuestra firma en otras partes del mundo. En todo caso, si usted sale de la red local (Colombia) de PricewaterhouseCoopers nuestra pol&iacute;tica de privacidad aqu&iacute; descrita no tendr&aacute; validez, por ende, le recomendamos leer la pol&iacute;tica de privacidad y los t&eacute;rminos legales de cada sitio Web que visite. PricewaterhouseCoopers no se hace responsable por visitas ni navegaciones hechas en otros sitios Web. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Seguridad. </span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">PricewaterhouseCoopers ha implementado sistemas y est&aacute;ndares de tecnolog&iacute;a y de seguridad operacional generalmente aceptados con el fin de proteger informaci&oacute;n personal de p&eacute;rdida, usos no debidos, alteraciones o destrucci&oacute;n. Adicionalmente, todos nuestros empleados est&aacute;n conminados a respetar pol&iacute;ticas de confidencialidad y seguridad de informaci&oacute;n. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Menores de edad.</span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">PricewaterhouseCoopers entiende la importancia de proteger a menores de edad en especial en ambientes virtuales como Internet. Nuestro sitio no est&aacute; dirigido ni recomendado para menores de edad, ni esperamos recoger o recibir informaci&oacute;n de menores de edad en ning&uacute;n caso. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Modificaciones y enmiendas a esta pol&iacute;tica de privacidad. </span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">PricewaterhouseCoopers se reserva el derecho a hacer cambios, modificaciones y enmiendas a esta pol&iacute;tica en cualquier tiempo sin previo aviso. En dicho caso informaremos a nuestros visitantes de cualquier cambio o modificaci&oacute;n, los que se entender&aacute;n efectivos y en vigencia a partir del momento que sean publicados en nuestro sitio Web. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Aceptaci&oacute;n de estos t&eacute;rminos. </span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Al ingresar o acceder a nuestro Sitio el usuario acepta todo el contenido de estos t&eacute;rminos legales y de nuestra pol&iacute;tica de privacidad, por eso es indispensable que antes de hacer uso de cualquiera de las facilidades, servicios o aplicaciones de nuestro Sitio, usted lea con cuidado y atenci&oacute;n los siguientes t&eacute;rminos que rigen la relaci&oacute;n establecida entre el usuario y PricewaterhouseCoopers, as&iacute; como nuestra pol&iacute;tica de privacidad. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Si no est&aacute; de acuerdo con estos t&eacute;rminos o no los comparte, por favor no haga uso de esta aplicaci&oacute;n web y comun&iacute;quese con nosotros por los medios tradicionalmente empleados (tel&eacute;fono, fax, correo tradicional, atenci&oacute;n en nuestras oficinas, etc.). </span></p>'
			+
			'<p style="text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Cuentas de usuario </span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">El nombre de usuario y contrase&ntilde;a es personal e intransferible, por lo que el usuario acepta que ser&aacute; la &uacute;nica persona autorizada para utilizarlo y se obliga a no compartir la suscripci&oacute;n con otras personas naturales o jur&iacute;dicas, y a evitar que terceros tengan acceso a sus datos de logeo. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">El Usuario es responsable de notificar a PricewaterhouseCoopers de cualquier uso no autorizado de su nombre de usuario y ser&aacute; responsable de cualquier da&ntilde;o y perjuicio, as&iacute; como de los costos que se incurran por raz&oacute;n del mismo incluyendo las costas extrajudiciales y/o judiciales. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">En caso de que nuestro equipo identifique un acceso no autorizado o varios accesos simult&aacute;neos, nos reservamos el derecho a bloquear su acceso temporal o definitivamente. El acceso simult&aacute;neo ser&aacute; considerado como una compra individual realizada por el Usuario cuyo nombre de usuario y contrase&ntilde;a se haya usado, y PricewaterhouseCoopers quedar&aacute; facultada para facturar y exigir el pago de estas compras individuales o, en su defecto, cancelar la suscripci&oacute;n y reclamar por los da&ntilde;os y perjuicios ocasionados. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">En caso de bloqueo temporal, deber&aacute; comunicarse al correo pwc.markets@co.pwc.com para reactivar su cuenta de usuario. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Est&aacute; prohibida la creaci&oacute;n de cuentas de usuarios con datos falsos. Si PricewaterhouseCoopers detecta una cuenta de usuario con informaci&oacute;n falsa, se reserva el derecho de cancelarla o bloquearla. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Derechos de autor y protecci&oacute;n marcaria. </span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Toda la informaci&oacute;n, textos, gr&aacute;ficas, presentaci&oacute;n y dise&ntilde;o de la aplicaci&oacute;n web, de la aplicaci&oacute;n, as&iacute; como el software, los c&oacute;digos fuente y en general el programa de ordenador que constituye y soporta la aplicaci&oacute;n web, tienen protecci&oacute;n de Derechos de Autor de acuerdo con la legislaci&oacute;n nacional y con normas internacionales y son de propiedad exclusiva de PricewaterhouseCoopers. Igualmente todos los signos distintivos de la aplicaci&oacute;n web (marcas, logotipos, archivos de video, combinaci&oacute;n de colores, presentaci&oacute;n de contenidos y su estructura, botones o &ldquo;banners&rdquo;) gozan de protecci&oacute;n marcaria y son propiedad exclusiva de PricewaterhouseCoopers. Por lo tanto, ninguno de los elementos anteriormente mencionados podr&aacute; ser reproducido, comunicado, distribuido, copiado, utilizado, transmitido, vendido o comercializado de ning&uacute;n modo sin la previa autorizaci&oacute;n escrita de PricewaterhouseCoopers. As&iacute; pues, est&aacute; totalmente prohibida la reproducci&oacute;n total o parcial de cualquier parte de esta aplicaci&oacute;n web sin la expresa autorizaci&oacute;n previa de PricewaterhouseCoopers. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">En ning&uacute;n caso debe entenderse que PricewaterhouseCoopers otorga o garantiza autorizaciones o licencias de uso de sus signos distintivos. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Algunos contenidos, art&iacute;culos, textos o informaci&oacute;n espec&iacute;ficos pueden tener autores diversos y en &eacute;stos se refleja la opini&oacute;n, investigaci&oacute;n o interpretaci&oacute;n de dichos autores sobre diferentes temas de inter&eacute;s. En ese caso, los autores responden por el contenido de su obra y PricewaterhouseCoopers no se responsabiliza por el criterio u opini&oacute;n reflejada en dichas obras ni por las conclusiones o decisiones que se puedan tomar con base en esos contenidos. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Contenido e informaci&oacute;n de la aplicaci&oacute;n web.</span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">El contenido de la aplicaci&oacute;n web tiene como prop&oacute;sito el recolectar informaci&oacute;n sobre el estado de &aacute;nimo de cada usuario que se registre, posteriormente se realizara para que este pueda hacer un seguimiento de las estad&iacute;sticas que este genera, as&iacute; como de compartir informaci&oacute;n sobre eventos de la Firma.</span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">PricewaterhouseCoopers no se hace responsable por decisiones o conclusiones que puedan tomarse con base en la informaci&oacute;n publicada o suministrada en la aplicaci&oacute;n web. La aplicaci&oacute;n e impacto de las leyes pueden variar ampliamente con base en hechos espec&iacute;ficos relacionados con cada caso. Dada la naturaleza cambiante de las leyes, normas y reglamentos, y los riesgos inherentes a la comunicaci&oacute;n electr&oacute;nica, podr&iacute;an existir demoras, retrasos, omisiones o inexactitudes en la informaci&oacute;n contenida en este Sitio. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">En consecuencia, la informaci&oacute;n en este Sitio se brinda bajo el entendido que los autores y editores no se encuentran restando ni comprometi&eacute;ndose a la prestaci&oacute;n de servicios legales, contables, impositivos u otro tipo de asesoramiento y servicios profesionales y que dicha informaci&oacute;n no se ofrece como prestaci&oacute;n de ninguno de los servicios anteriormente aludidos. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Aunque se ha intentado asegurar que la informaci&oacute;n contenida en este Sitio ha sido obtenida de fuentes confiables, PricewaterhouseCoopers no se responsabiliza por ning&uacute;n error ni omisi&oacute;n, ni por los resultados obtenidos del uso de esta informaci&oacute;n, ni por la interpretaci&oacute;n de la misma. Toda la informaci&oacute;n contenida en este Sitio se brinda "en el estado en que se encuentra", sin garant&iacute;a de suficiencia, pertinencia, exactitud u oportunidad, ni de los resultados obtenidos del uso de esta informaci&oacute;n, y sin garant&iacute;a de ning&uacute;n tipo, expresa o impl&iacute;cita, que incluya, entre otras, garant&iacute;as de cumplimiento, comerciabilidad e idoneidad para un fin en particular. En ning&uacute;n caso PricewaterhouseCoopers, sus sociedades o corporaciones vinculadas, ni los socios, agentes o empleados del mismo, ser&aacute;n responsables ante el usuario ni ante ninguna otra persona de ninguna decisi&oacute;n o medida tomada confiando en la informaci&oacute;n contenida en este Sitio, ni de ning&uacute;n da&ntilde;o directo, indirecto, especial o similar, aun si existiese notificaci&oacute;n de la posibilidad de sufrir dichos da&ntilde;os. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">En ning&uacute;n caso PricewaterhouseCoopers est&aacute; oblig&aacute;ndose o comprometi&eacute;ndose con contratos de trabajo, acuerdos de trabajo ni garantiza que los usuarios obtengan acceso a ning&uacute;n cargo u ocupaci&oacute;n laboral. Tampoco se garantiza que el acceso a la aplicaci&oacute;n web o el suministro de informaci&oacute;n por parte del usuario como informaci&oacute;n personal, informaci&oacute;n sobre su estado de &aacute;nimo, etc.; implique para PricewaterhouseCoopers obligaci&oacute;n alguna como la de comunicarse con el usuario.</span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">El usuario autoriza a PricewaterhouseCoopers a utilizar a nivel mundial dentro de los miembros de la firma PricewaterhouseCoopers los datos del usuario sin limitaci&oacute;n alguna y as&iacute; mismo autoriza a compartir dicha informaci&oacute;n con terceros clientes de PricewaterhouseCoopers que sean destinatarios o interesados de procesos liderados por PricewaterhouseCoopers.</span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Estado de &aacute;nimo: Mi &aacute;nimo contiene una funcionalidad denominada &ldquo;Mis notas&rdquo; dise&ntilde;ada para que el usuario escriba las notas que considere pertinentes sobre cada estado de &aacute;nimo seleccionado. Las notas son guardadas en la cuenta de cada usuario por lo que &uacute;nicamente &eacute;ste y el administrador de la aplicaci&oacute;n tendr&aacute;n acceso a ellas. Para el efecto, hemos implementado los esquemas de seguridad inform&aacute;tica necesarios para tener resguardada la informaci&oacute;n de nuestros usuarios. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Funcionamiento y efectividad de la aplicaci&oacute;n web. </span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">PricewaterhouseCoopers se reserva el derecho de hacer cambios y modificaciones de cualquier tipo a esta aplicaci&oacute;n web y a la aplicaci&oacute;n y no se responsabiliza por demoras, suspensiones o inconvenientes del sistema de comunicaci&oacute;n o conexi&oacute;n a trav&eacute;s de estas. Por tanto PricewaterhouseCoopers podr&aacute; con o sin previo aviso modificar o discontinuar temporal o permanentemente el servicio y los contenidos de esta aplicaci&oacute;n web. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">PricewaterhouseCoopers no se responsabiliza de la existencia de virus, gusanos o ning&uacute;n tipo de dispositivo o elemento que pueda afectar al Usuario, a su software o a su hardware. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Compromisos y obligaciones del usuario. </span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Es compromiso y responsabilidad del usuario seguir paso a paso y de manera exacta las instrucciones de procedimientos y requisitos comunicados por PricewaterhouseCoopers. De no seguirlas de manera fiel y exacta, PricewaterhouseCoopers no se har&aacute; responsable por la agilidad, resultado, respuesta, desarrollo, ni efectos de los servicios e instrucciones que se comuniquen o faciliten a trav&eacute;s de esta aplicaci&oacute;n web. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">El usuario debe en todo momento respetar la ley, la moral y las buenas costumbres mientras hace uso de esta aplicaci&oacute;n web. No podr&aacute; por tanto utilizarse esta aplicaci&oacute;n web de ning&uacute;n modo para fines il&iacute;citos, contrarios a la moral o que en cualquier forma puedan limitar, vulnerar o violar derechos de terceros. Tampoco podr&aacute; el usuario realizar actos o acciones que afecten la funcionalidad de esta aplicaci&oacute;n web, la sobrecarguen, deterioren, da&ntilde;en o impidan de cualquier forma su normal funcionamiento. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">El usuario s&oacute;lo podr&aacute; acceder a los contenidos de esta aplicaci&oacute;n web de la manera indicada y de acuerdo siempre con las instrucciones de PricewaterhouseCoopers. Cualquier reproducci&oacute;n de los contenidos, signos, gr&aacute;ficas, fotograf&iacute;as o cualquier elemento de la aplicaci&oacute;n web &nbsp;deber&aacute; hacerse con la previa autorizaci&oacute;n de PricewaterhouseCoopers.</span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">El usuario se compromete a actualizar sus datos personales en caso que estos hayan cambiado. Se entiende y acepta de manera expresa que la direcci&oacute;n de correo electr&oacute;nico suministrada por el usuario es v&aacute;lida para cualquier tipo de comunicaci&oacute;n que haga PricewaterhouseCoopers y que el usuario responde en todo caso por comunicaciones hechas a dicha direcci&oacute;n y que hace parte de la base de correos de PricewaterhouseCoopers. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">El usuario no podr&aacute; en ning&uacute;n caso reflejar los contenidos de esta aplicaci&oacute;n web y aplicaci&oacute;n (&ldquo;mirror&rdquo;) en ninguna otra aplicaci&oacute;n web o servidor sin el previo consentimiento de PricewaterhouseCoopers. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">El usuario se obliga a utilizar los contenidos de esta aplicaci&oacute;n web para prop&oacute;sitos personales sin una finalidad de lucro. El uso de la informaci&oacute;n suministrada por nosotros est&aacute; limitada a fines privados y personales, cualquier uso para un prop&oacute;sito diferente, como la obtenci&oacute;n de un beneficio econ&oacute;mico, ser&aacute; considerado irregular y estar&aacute; sujeto al inicio de las acciones legales pertinentes. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">La relaci&oacute;n entre PricewaterhouseCoopers y el usuario. </span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Para todos los efectos legales, la relaci&oacute;n entre el usuario y PricewaterhouseCoopers estar&aacute; regulada por los presentes t&eacute;rminos de uso, la pol&iacute;tica de privacidad de PricewaterhouseCoopers, el contenido e informaci&oacute;n de cada servicio ofrecido, cualquier condici&oacute;n comunicada por PricewaterhouseCoopers al usuario por cualquier medio y la normatividad colombiana aplicable. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Para todos los efectos legales se entender&aacute; que el lugar de env&iacute;o de los mensajes de PricewaterhouseCoopers es Bogot&aacute; &ndash; Colombia y el lugar de env&iacute;o de los mensajes del usuario es aquel que es suministrado por &eacute;ste como domicilio en la declaraci&oacute;n de informaci&oacute;n personal hecha en esta aplicaci&oacute;n web o en cualquier otro documento o comunicaci&oacute;n dirigido a PricewaterhouseCoopers. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">En ning&uacute;n caso existe obligaci&oacute;n de PricewaterhouseCoopers de responder mensajes enviados por el usuario a trav&eacute;s de la aplicaci&oacute;n web o de la aplicaci&oacute;n. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">PricewaterhouseCoopers y el usuario se someten de manera expresa a la jurisdicci&oacute;n y Tribunales competentes de la ciudad de Bogot&aacute; D.C. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">En ning&uacute;n caso PricewaterhouseCoopers responde por inexactitud en la informaci&oacute;n suministrada por el usuario, ni siquiera en cuanto a la verificaci&oacute;n sobre la correspondencia del usuario con la identidad y datos que declare en la aplicaci&oacute;n web. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Procedimiento en caso de denuncias o quejas relacionadas con violaci&oacute;n de derechos de autor, competencia desleal o cualquier tipo de violaci&oacute;n de la ley. </span></strong><span style="color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Si el usuario o cualquier tercero encuentran cualquier tipo de violaci&oacute;n o vulneraci&oacute;n de la ley en el uso de este Sitio, el procedimiento que deber&aacute;n seguir para poner dicha situaci&oacute;n en conocimiento de PricewaterhouseCoopers es el siguiente: </span></span></p>'
			+
			'<ol style="text-align: justify;">'
			+
			'<li style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0.2pt; margin-left:  18px;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"> Remitir comunicaci&oacute;n que contenga Identificaci&oacute;n del reclamante que incluya tel&eacute;fono, direcci&oacute;n, direcci&oacute;n de correo electr&oacute;nico y nombre completo. </span></li>'
			+
			'<li style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0.2pt; margin-left:  18px;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"> Firma aut&eacute;ntica o equivalente del titular de los derechos vulnerados o autorizaci&oacute;n de &eacute;ste al reclamante para actuar en su nombre. </span></li>'
			+
			'<li style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0.2pt; margin-left:  18px;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"> Especificaci&oacute;n y descripci&oacute;n de la situaci&oacute;n de vulneraci&oacute;n o violaci&oacute;n de derechos con indicaci&oacute;n clara de los contenidos comprometidos en esa situaci&oacute;n que hagan parte de la aplicaci&oacute;n web. </span></li>'
			+
			'<li style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; margin-left:  18px;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"> Declaraci&oacute;n expresa del reclamante en el sentido que la situaci&oacute;n descrita se ha presentado u ocurrido sin la expresa autorizaci&oacute;n del titular de los respectivos derechos. </span></li>'
			+
			'</ol>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Dicha comunicaci&oacute;n debe ser remitida a pwc.markets@co.pwc.com PricewaterhouseCoopers responder&aacute; esta comunicaci&oacute;n en un t&eacute;rmino prudencial de por los menos quince d&iacute;as h&aacute;biles a la direcci&oacute;n declarada por el reclamante en la comunicaci&oacute;n enunciada en el punto 1 anterior. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Actualizaciones de la aplicaci&oacute;n m&oacute;vil </span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">PricewaterhouseCoopers puede solicitar a los Usuarios que actualicen su versi&oacute;n de la Aplicaci&oacute;n M&oacute;vil en cualquier momento. A pesar de que haremos las gestiones necesarias y/o por conservar las configuraciones y preferencias personales de los Usuarios, seguir&aacute; existiendo la posibilidad de que las mismas se pierdan. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">PricewaterhouseCoopers no garantiza las actualizaciones que el usuario necesite o que sean compatibles con la versi&oacute;n de iOS/Android instalada en su dispositivo. No obstante, el usuario garantiza que aceptar&aacute; todas las actualizaciones de la aplicaci&oacute;n cuando se le ofrezcan. Tambi&eacute;n es posible que deje de ofrecerse la aplicaci&oacute;n y se interrumpa su uso en cualquier momento sin previo aviso. A menos que se indique lo contrario, tras la terminaci&oacute;n: (a) cesar&aacute;n los derechos y las licencias concedidos mediante los presentes t&eacute;rminos; (b) deber&aacute; suspender el uso de la aplicaci&oacute;n y, si fuera necesario, eliminarla de su dispositivo. </span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Consumo de datos </span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica; color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Los productos ofrecidos en esta aplicaci&oacute;n web requieren el uso de internet. A menos de que el Usuario est&eacute; utilizando una red Wi-Fi, el acceso a los contenidos aqu&iacute; incluidos desde dispositivos m&oacute;viles contar&aacute; contra el saldo sus datos (&ldquo;Consumo de Datos&rdquo;), momento a partir del cual se aplicar&aacute;n los t&eacute;rminos del contrato con su proveedor de servicios de red m&oacute;vil. PricewaterhouseCoopers no se hace responsable de los cargos por los datos consumidos durante la conexi&oacute;n al acceder a nuestra aplicaci&oacute;n, as&iacute; como otros cargos de terceros, incluidos los cargos por los datos de roaming.</span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><span style="color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"></span><strong><span style="color: #000000; background-color: transparent; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">AVISO DE PRIVACIDAD </span></strong></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><span style="color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">PRICEWATERHOUSECOOPERS </span><span style="color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;"> hace referencia a las entidades jur&iacute;dicas independientes y separadas que hacen parte de la red global de PRICEWATERHOUSECOOPERS en Colombia. Para PRICEWATERHOUSECOOPERS es importante salvaguardar la informaci&oacute;n que nos ha sido confiada para la prestaci&oacute;n de nuestros servicios, y en consecuencia damos aplicaci&oacute;n a la ley 1581 de 2012, Decreto reglamentario 1377 de 2013 y dem&aacute;s normas que regulan el tema de protecci&oacute;n de datos personales. &nbsp;</span></span></p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;">&nbsp;</p>'
			+
			'<p style="line-height: 0.9; margin-top: 0pt; margin-bottom: 0pt; text-align: justify;"><span style="font-size: 10pt; font-family: helvetica;"><span style="color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">Al responder la siguiente encuesta, usted nos da su consentimiento previo, expreso e informado como titular del dato, para llevar a cabo el tratamiento de datos personales, teniendo en cuenta que sus derechos como titular de los datos son los previstos en la Constituci&oacute;n y la ley, especialmente el derecho de conocer, actualizar, rectificar y suprimir su informaci&oacute;n personal, as&iacute; como el derecho a revocar el consentimiento otorgado para el tratamiento de Datos Personales, cuyo procedimiento encontrara en la pol&iacute;tica de protecci&oacute;n de datos personales de PRICEWATERHOUSECOOPERS la cual podr&aacute; consultar &nbsp;en la siguiente enlace web: </span><a style="text-decoration: none;" href="http://www.pwc.com/co/es/politica-de-tratamiento-de-datos-personales.html"><span style="color: #0563c1; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: underline; vertical-align: baseline; white-space: pre-wrap;">http://www.pwc.com/co/es/politica-de-tratamiento-de-datos-personales.html</span></a><span style="color: #000000; background-color: transparent; font-weight: 400; font-variant: normal; text-decoration: none; vertical-align: baseline; white-space: pre-wrap;">.</span></span></p>',

			showCloseButton: true,
			showCancelButton: true,
			focusConfirm: false,
			cancelButtonColor: '#7e051d',
			confirmButtonColor: '#ef6d2f',

			confirmButtonText:
			'<i class="fa fa-thumbs-up"></i> Acepto',
			confirmButtonAriaLabel: 'Thumbs up, great!',
			cancelButtonText:
			'<i class="fa fa-thumbs-down"></i> No acepto',
			cancelButtonAriaLabel: 'Thumbs down',

		}).then((result) => {
			if (result) {
				this.terms = true
				swal({
					title: 'Muy bien!',
					text: 'Estás de acuerdo con nuestros términos y condiciones de uso',
					type: 'success',
					confirmButtonColor: '#ef6d2f',
					confirmButtonText: "Continuar registro",
				})
			}
		})
	}

	reload() { location.reload() }

	/**
	 * This function could be usefull in the future to add new dominios/empresa values
	 */
	addDomain(domain = '@co.pwc.com', empresa = 'pwc') {
	  // Firebase no admite los siguientes caracteres
	  // ".", "#", "$", "[", or "]"
	  domain = domain.replace('.', '')
	  domain = domain.replace('.', '')
	  domain = domain.replace('#', '')
	  domain = domain.replace('$', '')
	  domain = domain.replace('[', '')
	  domain = domain.replace(']', '')

	  //creates
	    // domain
	          // @copwccom
	              //empresa: 'pwc'
	  this.back.addNewDomain(domain, empresa)
	}

	/**
	 * Since there is no way to linked a admin user to the administrator site, this functions helps to linked it crating a new entry to firebase, using new user's UID and company
	 *
	 * @param {string} uid
	 * @memberof RegistroComponent
	 */
	addProfile(uid: string) {
		// la cadena despues del slash es el UID del usuario
		firebase.database().ref('admin-user/GqQBgbtnZkdsAvHdODhtZtWY6RC2').set({
			'company': 'pwc',
			'name': 'Soporte PWC'
		})
	}
}
