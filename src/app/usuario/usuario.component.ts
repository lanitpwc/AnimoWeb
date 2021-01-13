import { Component, OnInit, NgZone, NgModule } from '@angular/core';
import * as _ from 'underscore';
import { BackService } from '../service/back.service';
import { environment } from '../../environments/environment';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

declare var $: any
import * as firebase from 'firebase';
declare var Notyf: any

@Component({
    selector: 'app-usuario',
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {

    usersKey = []
    users
    data;
    filterQuery = "";
    rowsOnPage = 10;
    listaAreas = []
    listaEdad = ['25-30', '26-30', '31-35', '36-40', '41-45', '46-50', '51-55', '56-60', '61-65', '66-70']
    editMenu: boolean = false // Poder editar los campos
    // Campos editables
    editUserKey: any
    editMailTxt: any
    editAreaTxt: any
    filtroEdad = 'none'
    filtroArea = 'none'
    filtroTexto: string

    listaFiltroAreas = []

    time: number

    notyf: any
    company: string

    constructor(
        private zone: NgZone,
        private back: BackService,
        private http: Http,
    ) {
        this.notyf = new Notyf({
            delay: 3000
        });
        this.company = localStorage.getItem('company')
        back.getAreas().then(areas => {
            this.listaAreas = areas
        })
        this.time = new Date().getTime()
    }

    ngOnInit() {
        document.getElementById('usuarios').classList.add('activo')
        document.getElementById('franja').style.top = (document.getElementById('usuarios').offsetTop - 2) + 'px'

        $('#dat1').datepicker();
        let option = {
            hoverState: 'hover-state',
            title: 'Hora'
        }
        this.reload()
    }

    editUser(item) {
        this.editMenu = true
        this.editUserKey = item
        this.editMailTxt = this.users[item].correo
        this.editAreaTxt = this.users[item].areas
    }

    saveEditUser() {
        firebase.database().ref('empresas/' + this.company + '/usuarios/' + this.editUserKey).update({
            correo: this.editMailTxt,
            areas: [this.editAreaTxt]
        })
        this.editMenu = false
        this.reload()
    }

    cancelEdit() {
        this.editMenu = false
    }

    reload() {
        firebase.database().ref('usuarios/').orderByChild('empresa').equalTo(this.company).once('value', data => {
            this.zone.run(() => {
                this.users = data.val()
                this.usersKey = _.allKeys(data.val())
                this.data = data.val()
                // console.log(data[0])
            })
        })
    }

    //   deleteUser(item){
    //     this.http.get(environment.url_servidor_dev + "eliminar/usuario/" + item)
    //     .map((res: Response) => res.toString())
    //     .subscribe(
    //       res => {
    //         // falta eliminar de firebase auth
    //         firebase.database().ref('usuarios/'+ item).remove()
    //         this.notyf.confirm('Se ha eliminado el usuario de forma correcta');
    //         this.reload()
    //       },
    //       err => {
    //         this.notyf.alert('Error en el servidor');
    //       }
    //     )
    //   }

    subirArcghivo() {
        debugger
        let file = (<HTMLInputElement>document.getElementById('input')).files[0]
        console.log(file)

        var storageRef = firebase.storage().ref();
        var uploadTask = storageRef.child('images/' + file.name).put(file);
        uploadTask.on('state_changed', (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // See below for more detail
        }, (error) => {
            // Handle unsuccessful uploads
        }, () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            var downloadURL = uploadTask.snapshot.downloadURL;
            console.log(downloadURL);

        });
    }

    cambio(event) {

        let contiene = _.contains(this.listaFiltroAreas, event)
        window.setTimeout(() => {
            this.filtroArea = "none"
        }, 10)
        if (!contiene) {
            this.listaFiltroAreas.push(event)
            this.listaFiltroAreas = this.listaFiltroAreas.slice(0)
        }

        console.log(this.listaFiltroAreas)
    }

    eliminar(index) {
        this.listaFiltroAreas.splice(index, 1)
        this.listaFiltroAreas = this.listaFiltroAreas.slice(0)
    }


}
