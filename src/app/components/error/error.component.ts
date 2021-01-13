import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {

   
  text: string;

  mostar: boolean;



  constructor() {
    console.log('Hello Error Component');
  }

  setText(msg:string){
    this.text = msg
    this.mostar = true
  }

  cerrar(){
    this.mostar = false
  }

}
