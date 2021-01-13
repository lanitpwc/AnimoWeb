import { Component, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.css']
})
export class ConfirmacionComponent implements OnInit {
  text: string;
  emocion: string;
  nivel: string;
  intensidad: string;

  urlIcon: string



  ok: any
  cancel: any
  evento: any

  constructor(private zone: NgZone) {
    console.log('Hello Confirmacion Component');
    this.text = 'ConfirmationComponent';
  }

  ngOnInit() {
    console.log('Hello Confirmacion Component ngOnInit');
    document.getElementById('contenedor').style.display = 'none'
  }

  iniciar(msg: string, murl: string, confirm: any, pcancel: any, emocion?: string, nivel?: string) {
    this.text = msg
    this.urlIcon = murl
    this.ok = confirm
    this.cancel = pcancel

    if(emocion === 'felicidad')
      this.emocion = 'Felicidad'
    if(emocion === 'estres')
      this.emocion = 'Estrés'
    if(emocion === 'motivacion')
      this.emocion = 'Motivación'
    
    this.nivel = nivel
    
    document.getElementById('contenedor').style.display = 'block'
    setTimeout(() => {

      this.evento = (e) => {
        if (document.getElementById('panel').contains(<Node>e.target)) {
        } else {
          document.getElementById('contenedor').style.display = 'none'
          window.removeEventListener('click',this.evento)
        }
      }
      window.addEventListener('click', this.evento);
    }, 10);

  }

  confirmacion() {
    document.getElementById('contenedor').style.display = 'none'
    window.removeEventListener('click',this.evento)
    this.ok()
  }

  cancelacion() {
    document.getElementById('contenedor').style.display = 'none'
    window.removeEventListener('click',this.evento)
    this.cancel()
  }
  
  cerrar(){
     document.getElementById('contenedor').style.display = 'none'
     window.removeEventListener('click',this.evento)
  }

}
