import { Component, OnInit } from '@angular/core';
import * as _ from 'underscore';
import * as firebase from 'firebase';
import { BackService } from '../service/back.service';

@Component({
  selector: 'app-mis-notas',
  templateUrl: './mis-notas.component.html',
  styleUrls: ['./mis-notas.component.css']
})
export class MisNotasComponent implements OnInit {

  listaNotas = []
  notas = {}
  keyNoticia:string

  constructor( private userBack: BackService) {
    firebase.database().ref('notas/' + this.userBack.datosUsuario.empresa).once('value', sna => {
      this.notas = sna.val()
      firebase.database().ref('usuarios/' + this.userBack.user.uid + '/notas').once('value', snap => {
        let datos = snap.val()
        this.listaNotas = _.allKeys(datos).reverse()
      })
    })
  }

  ngOnInit() {
  }

  abrir(key: string) {
    if (this.keyNoticia)
      this.cerrar(this.keyNoticia)
    this.keyNoticia = key
    document.getElementById('text-' + key).classList.remove('texto')

  }

  cerrar(key: string) {
    document.getElementById('text-' + key).classList.add('texto')
    this.keyNoticia = null
  }



}
