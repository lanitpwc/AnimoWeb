import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes, Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { environment } from '../environments/environment'
import { BackService } from 'app/service/back.service';
import * as firebase from 'firebase';

declare var Notyf: any

/**
 * Componete principal donde se muestra el login de la pagina
 *
 * @export
 * @class AppComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    //-----------------------------------------------------------------
    // Atributos
    //-----------------------------------------------------------------

    idActual: number
    name: string
    nombre: string
    empresa: string
    company: string
    notyf: any


    /** div de la animacion del load */
    elementoAnimacion: HTMLElement

    /** variable para desplegar la animación del login */
    cargando: boolean = false

    //-----------------------------------------------------------------
    // Constructor
    //-----------------------------------------------------------------
    constructor(
        public back: BackService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private http: Http,
    ) {
       
        this.notyf = new Notyf({
           delay: 3000
        });
        this.activatedRoute.params.subscribe();
        this.name = localStorage.getItem('name');
        this.company = localStorage.getItem('company')

        firebase.initializeApp(environment.config);
        back.dataBase = firebase.database();
        
    }

    // -----------------------------------------------------------------
    // Metodos
    // -----------------------------------------------------------------


    userState() {
        if (!localStorage.getItem('auth')) {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {                    
                    debugger
                   // this.back.cargarPerfil(user.uid).then(resut => {
                   /* this.back.cargarPerfilUsuario(user.uid).then(result => {
                        setTimeout(() => {
                            //-----------------------------------------------------------------
                            // carga parametros de la empresa
                            //-----------------------------------------------------------------
                            debugger
                            this.nombre = this.back.name
                            this.empresa = this.back.company

                            document.getElementById('navbar').style.display = 'block'
                            location.reload()
                        }, 3000);
                    })*/
                    firebase.database().ref('usuarios/' + user.uid + '/').once('value', snap => {
                        if (snap.val()) {
                            this.back.user = user
                            this.back.cargarPerfilUsuario(user.uid).then(() => {
                                debugger
                                this.nombre = this.back.datosUsuario.anonimo.apodo
                                this.empresa = this.back.datosUsuario.empresa
                                
                            })
                        }
                    })
                }
            })
        } else {
            document.getElementById('navbar').style.display = 'block'
            this.router.navigate(['/login']);
        }
    }

    /**
     * Carga una libreria de javascript y responde una funcion cuando termina
     * @param {any} filename url de la libreria
     * @param {any} callback funcion de respuesta
     * @memberOf AppComponent
     */
    loadScript(filename, callback) {
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.onload = callback;
        fileref.setAttribute("src", filename);
        if (typeof fileref != "undefined") {
            document.getElementsByTagName("head")[0].appendChild(fileref)
        }
    }

    /**
     * Metodo que se llama al hacer click en una opcion del menu
     * @param {HTMLElement} elemento Elemento del dom que se retorna para el cambio de estilos
     * @memberOf AppComponent
     */
    seleccionar(elemento: HTMLElement, id: number) {
        let eleme = <HTMLElement>(document.getElementsByClassName('activo')[0])
        eleme.classList.remove('activo')
        elemento.classList.add('activo')
        document.getElementById('franja').style.top = (elemento.offsetTop - 2) + 'px'
        this.idActual = id
    }

    /**
     *
     * logout del usuario
     *
     * @memberOf AppComponent
     */
    salir() {
        firebase.auth().signOut().then(x => {
            // Sign-out successful.
            localStorage.clear()
            this.router.navigate(['/login'])
            document.getElementById('navbar').style.display = 'none'
        }, function (error) {
            // An error happened.
        });
    }

    enviarNot() {
        this.http.get(environment.url_servidor + "emocion/" + this.company).map((res: Response) => res.toString()).subscribe(
            res => {
                this.notyf.confirm('Notificación envíada');
            },
            err => {
                this.notyf.alert('Error en el servidor');
            }
        )
    }

}
