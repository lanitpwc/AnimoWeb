import { Component, OnInit, ViewChild } from '@angular/core';
import { MensajeTemporalComponent } from '../components/mensaje-temporal/mensaje-temporal.component';
import { ConfirmacionComponent } from '../components/confirmacion/confirmacion.component';
import { ComunServiceService } from '../service/comun-service.service';
import { HomeBackService } from '../service/home-back.service';
import { BackService } from '../service/back.service';
import { Router } from '@angular/router';

import swal from 'sweetalert2';

@Component({
  selector: 'app-nota',
  templateUrl: './nota.component.html',
  styleUrls: ['./nota.component.scss'],
  providers: [HomeBackService,BackService]
})
export class NotaComponent implements OnInit {

  // -----------------------------------------------------------------
	// Atributos
	// -----------------------------------------------------------------

	nota: string

	showNota: boolean

	notas: any

	textoNota: string

	valor
	nombre
	empresa
	emocion
	area
	edad
	ok
	cancel

	value: string;
	nivel: string;
	intensidad: string;
	evento: any

	notificacion

  urlIcon: string

  swalalerta = '';
  
  @ViewChild(MensajeTemporalComponent)
	mensTem: MensajeTemporalComponent

	@ViewChild(ConfirmacionComponent)
	confirm: ConfirmacionComponent
  

  toggle: boolean = false
	// Para mostrar el textarea enseguida
	mostAreaa: boolean = true

  textofinal: string

  private comun : ComunServiceService;
  //private homeBack: HomeBackService;
  private router: Router;
  
  constructor(private homeBack: HomeBackService ) {
		

  }
  
  ngOnInit() {
        

  }

 // -----------------------------------------------------------------
	// Metodos
  // -----------------------------------------------------------------
  
  iniciar(valor:string, nombre:any, empresa:any, emocion:string, los: any, fecha_nac:any){

    this.showNota = false
		this.notas = [
			'El clima de hoy me gusta mucho! ',
			'Mi jefe me felicitó por lo que hice.',
			'El tráfico en la ciudad estuvo muy relajado.',
			'Mi equipo de trabajo ha funcionado muy bien.',
			'Logré cumplir mis metas.',
			'No ha pasado nada diferente en el trabajo.',
			'El día ha pasado sin ninguna novedad',
			'Un día normal laboral',
			'Siento que es muy monótono el trabajo.',
			'El clima no ayuda.',
			'Mi equipo de trabajo no funciona bien.',
			'Mi jefe no valora mi trabajo',
			'Tengo algunos problemas personales que afectan mi día normal.',
			'Otra'
		]
		this.valor = valor;
		this.nombre = nombre;
		this.empresa = empresa;
		this.emocion = emocion;
		this.area = los;
		//this.notificacion = navParams.get('noti')?
    this.edad = fecha_nac;
    document.getElementById('contenedorNota').style.display = 'block'

  }
	ionViewDidLoad() {
		console.log('ionViewDidLoad NotaPage');
	}

	opciones() {
		let opc = [{
			type: 'radio',
			label: 'Nota1',
			value: 'Nota1',
			checked: false
		}, {
			type: 'radio',
			label: 'Nota2',
			value: 'Nota2',
			checked: false
		}, {
			type: 'radio',
			label: 'Otra',
			value: 'Otra',
			checked: false
		}]
		this.comun.showRadio(opc, 'Opciones').then(dat => {
			if (dat || this.nota) {
				this.nota = (dat) ? dat : this.nota
				this.textoNota = this.notas[this.nota]
				this.showNota = true
			}

		})
	}

	enviar() {
		this.homeBack.enviarNota(this.valor, this.empresa, this.textoNota, this.nombre, this.emocion, this.area, this.edad)
    //this.mensTem.setText('¡Tu respuesta ha sido almacenada!', 2000, HomePage)
    swal('¡Tu respuesta ha sido almacenada!', this.swalalerta, 'success');
    this.router.navigate(['/home']);
	}

	selNota(item: string) {
		if (item == 'Otra') {
			this.toggle = false
			this.mostAreaa = true
		}
		else {
			let ok = () => {
				this.homeBack.enviarNota(this.valor, this.empresa, item, this.nombre, this.emocion, this.area, this.edad)
        //this.mensTem.setText('¡Tu respuesta ha sido almacenada!', 2000, HomePage)
        swal('¡Tu respuesta ha sido almacenada!', this.swalalerta, 'success');
         this.router.navigate(['/home']);
			}
			let cancel = () => { }
			this.confirm.iniciar('¿Estás seguro que deseas enviar esta nota?', '/assets/img/logoPopup.png', ok, cancel)
		}
	}

	guardarNota() {
		debugger
		if (this.textoNota == "" || this.textoNota == undefined) {
			this.mensTem.setText('¡Escribe una comentario sobre tu estado de ánimo', 2500)

		} else {
		//	Keyboard.close()
			this.homeBack.enviarNota(this.valor, this.empresa, this.textoNota + '', this.nombre, this.emocion, this.area, this.edad)
      //this.mensTem.setText('¡Tu respuesta ha sido almacenada!', 2000, HomePage)
      swal('¡Tu respuesta ha sido almacenada!', this.swalalerta, 'success');
      //this.router.navigate(['/home']);
      document.getElementById('contenedorNota').style.display = 'none'
		}

	}

}
