import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
//import { AlertController } from 'ionic-angular';
//import { LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class ComunServiceService {

  constructor(public http: Http) { }

  /**
   * Muestra un mensaje
   * @param {string} title
   * @param {string} msg
   * @memberOf UnregisteredPage
   */
	showAlert(title: string, msg: string) {
	/*	let alert = this.alertCtrl.create({
			title: title,
			message: msg,
			buttons: ["Aceptar"]
		})
		alert.present()*/
	}


	/**
	 * Muestra una ventana de cargando
	 * @param {string} msg
	 * @returns {Loading} isntancia de la ventana de cargando
	 * @memberOf ComunService
	 */
/*	showLoad(msg: string): Loading {
		let loader = this.loadingCtrl.create({
			content: msg,
		});
		return loader
	}*/

	/**
	 * Muestra una ventana de confirmación
	 * @param {string} title Titulo de la ventana
	 * @param {string} msg Mensaje de la ventana
	 * @param {string} name1 Nombre del primer boton de 
	 * @param {()=> any} acc1 Accion del primer boton
	 * @param {string} name2 Nombre del segundo boton
	 * @param {()=> any} acc2 Accion del segundo boton
	 * @memberOf ComunService
	 */
	showConfirm(title: string, msg: string, name1: string, acc1: () => any, name2: string, acc2: () => any) {
	/*	let confirm = this.alertCtrl.create({
			title: title,
			message: msg,
			buttons: [
				{
					text: name1,
					handler: acc1
				},
				{
					text: name2,
					handler: acc2
				}
			]
		});
		confirm.present();*/
	}

	/**
	 * Muestra un radio Show
	 * @param {radioShow[]} campos Campos del radioShow
	 * @param {string} title Titulo del mensaje 
	 * @returns {Promise<any>}
	 * @memberOf ComunService
	 */
	showRadio(campos: radioShow[], title: string):Promise<any> {
		return new Promise(resul => {
			/*let alert = this.alertCtrl.create();
			alert.setTitle(title);
			campos.forEach(v=>{
				alert.addInput(v);
			})
			alert.addButton({
				text: 'Cancel',
				handler: () => {
					resul(null)
				}
			});
			alert.addButton({
				text: 'OK',
				handler: data => {
					resul(data)
				}
			});
			alert.present();*/
		})

	}

}

/**
 * Interface para el componente de los parametros del radio show
 * @interface radioShow
 */
interface radioShow {
	type: string;
	label: string;
	value: string;
	checked: boolean;
}
