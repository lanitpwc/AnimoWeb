import { Component, OnInit,NgZone ,OnDestroy, ViewChild } from '@angular/core';
import { MensajeTemporalComponent } from '../components/mensaje-temporal/mensaje-temporal.component';
import { Router } from '@angular/router';
import { NoticiaBackService } from '../service/noticia-back.service';
import { BackService } from '../service/back.service';

@Component({
  selector: 'app-noticias-usuario',
  templateUrl: './noticias-usuario.component.html',
  styleUrls: ['./noticias-usuario.component.css'],
  providers: [NoticiaBackService]
})
export class NoticiasUsuarioComponent implements OnDestroy {

  // -----------------------------------------------------------------
	// Atributos
	// -----------------------------------------------------------------

	listaNoticias = []
	noticias = {}
	empresa: string
	keyNoticia: string
	subscripcion: any

	@ViewChild(MensajeTemporalComponent)
	mensTem: MensajeTemporalComponent

  // -----------------------------------------------------------------
	// Constructor
	// -----------------------------------------------------------------
	constructor(public noticiaBack: NoticiaBackService, private userBack: BackService, private zone:NgZone, private router: Router) {
		this.empresa = this.userBack.datosUsuario.empresa
		this.noticiaBack.darNoticias(this.userBack.dataBase, this.userBack.datosUsuario.los, this.userBack.datosUsuario.empresa)
		this.subscripcion = this.noticiaBack.observadorNoticias.subscribe(send => {
			this.noticias = send.noticias
			this.zone.run(()=>{
				this.listaNoticias = send.listaKey
			})
		})
		
	}

  // -----------------------------------------------------------------
	// Metodos
	// -----------------------------------------------------------------

	ngOnDestroy(){
		this.subscripcion.unsubscribe()
		console.log('salio componente')
  }
  
  /**
	 * Metodo para calificar una noticia
	 * @param {string} key id de la noticia
	 * @memberOf NoticiasPage
	 */
	calificar(key:string, valor:string){
		debugger
		let anteior = (!this.userBack.datosUsuario.calificadas) ? null : this.userBack.datosUsuario.calificadas[key]
		this.noticiaBack.calificarNoticia(this.userBack.dataBase, valor, anteior, key, this.userBack.datosUsuario.empresa, this.userBack.uid)
		this.mensTem.setText('Gracias por dejarnos tu reacción a la noticia.',3000)
	}

	abrir(key:string){
		if(this.keyNoticia)
			this.cerrar(this.keyNoticia)
		this.keyNoticia = key
		document.getElementById('text-'+key).classList.remove('texto')

	}

	cerrar(key:string){
		document.getElementById('text-'+key).classList.add('texto')
		this.keyNoticia = null
	}

	validarCont(calif,key){
		let misn = this.userBack.datosUsuario.calificadas
		if(misn){
			return misn[key] == calif
		}
		else
			return false
	}

  
	openEstadisticas(){
		 this.router.navigate(['/emociones']);
	}

}
