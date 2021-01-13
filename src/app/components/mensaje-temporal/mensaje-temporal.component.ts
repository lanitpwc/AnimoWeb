import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mensaje-temporal',
  templateUrl: './mensaje-temporal.component.html',
  styleUrls: ['./mensaje-temporal.component.css']
})
export class MensajeTemporalComponent {

  text: string;

  mostar: boolean = false
  evento: any
  comp: any

  constructor(
    //private navCtrl: NavController
  ) {
    console.log('Hello MensajeTemporal Component');
    this.text = 'Hello World';
  }

  setText(msg: string, time: number, comp?: any) {
      if(comp) { this.comp = comp }else{ this.comp = null}
      this.mostar = true
      this.text = msg

      setTimeout(()=> {
        this.mostar = false
        //if(comp) { this.navCtrl.setRoot(comp) }
      }, time);

  }

  dismissibleMessage(msg: string) {
    this.mostar = true
    this.text = msg
    this.comp = null;
  }

  // para cerrarlo sin esperar el tiempo seleccionado
  cerrar(){
    this.mostar = false
    //if(this.comp !== null) { this.navCtrl.setRoot(this.comp) }  
  }


}
