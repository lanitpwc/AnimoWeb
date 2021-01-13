import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import * as _ from 'underscore';
import { Http } from '@angular/http';

@Injectable()
export class NoticiaBackService {

  // -----------------------------------------------------------------
	// Atributos
	// -----------------------------------------------------------------

	private noticiasSource = new Subject<any>();
	observadorNoticias = this.noticiasSource.asObservable();

	noticias: {}
	listaKeyNoticias = []
	ref2: firebase.database.Reference
	ref1: firebase.database.Reference

  // -----------------------------------------------------------------
	// Constructor+
	// -----------------------------------------------------------------
	constructor(public http: Http) {
		console.log('inicio');
		
	}

	// -----------------------------------------------------------------
	// Metodos
	// -----------------------------------------------------------------

	ngOnDestroy(){
		console.log('murio');
		this.ref1.off()
		this.ref2.off()
  }
  
  /**
	 * Descarga las noticias del usuario y renponde al observador
	 * @param {firebase.database.Database} db Instancia de base de datos de firebase
	 * @param {string} uid id del usuario
	 * @memberOf NoticiaBack
	 */
	darNoticias(db: firebase.database.Database, area: string, empresa: string) {
		this.ref2 = db.ref('empresas/' + empresa + '/areas/'+area+'/noticias')
		this.ref1 = db.ref('noticias/' + empresa)


		this.ref1.orderByChild('estado').equalTo('on').on('value', snap => {
			this.noticias = snap.val()
			let send = {
				noticias: this.noticias,
				listaKey: this.listaKeyNoticias
			}
			this.noticiasSource.next(send)
		})

		
		
		this.ref2.on('value', snap => {
			let mNoticia = snap.val()
			this.listaKeyNoticias = _.values(mNoticia)
			this.listaKeyNoticias = this.listaKeyNoticias.reverse()

			let send = {
				noticias: this.noticias,
				listaKey: this.listaKeyNoticias
			}
			this.noticiasSource.next(send)
		})
	}

	/**
	 * Califica una noticia
	 * 
	 * @param {firebase.database.Database} db Instancia de base de datos Firebase
	 * @param {string} nuevo valor al cual se va a calificar (c1,c2,c3,c4,c5)
	 * @param {string} anterior valor anterior si el usuario ya habia calificado
	 * @param {string} key id de la noticia 
	 * @param {string} empresa empresa del usuario
	 * @param {string} id id del usuario
	 * 
	 * @memberOf NoticiaBack
	 */
	calificarNoticia(db:firebase.database.Database, nuevo:string, anterior:string, key:string,empresa:string, id:string){
		db.ref('noticias/'+empresa+'/'+key).transaction(not=>{
			if(not){
				if(anterior){
					not[anterior] = not[anterior] - 1
					not[anterior] = (not[anterior] < 0) ? 0 : not[anterior]
				}
				else{
					not['total'] ++
				}
				not[nuevo] = not[nuevo] + 1
				db.ref('usuarios/' + id + '/calificadas').child(key).set(nuevo)
			}
			return not
		})
	}

}
