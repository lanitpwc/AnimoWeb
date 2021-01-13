import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss']
})
export class LoadComponent {

  text: string;
  
  constructor() {
    console.log('Hello Load Component');
    this.text = 'Hello World';
  }

}
