import { Component, OnInit, ViewChild } from '@angular/core';
import { default as swal } from 'sweetalert2';
import { BackService } from '../service/back.service'
import { Router } from '@angular/router';

import * as firebase from 'firebase';
import { result } from 'underscore';
import { NavbarComponent } from '../components/navbar/navbar.component';
declare var Notyf: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  
    // -----------------------------------------------------------------
    // Atributos
    // -----------------------------------------------------------------

    /** div de la animacion del load */
    elementoAnimacion: HTMLElement

    /** variable para desplegar la animación del login */
    cargando: boolean = false

    /** Correo de l usuario */
    correo: string

    /** Contraseña del usuario */
    contrasena: string

    /** variable para la libreria de notificaciónes */
    notyf: any

    nombre: string

    empresa: string

    name: string

    company: string

    band = false;

    user: firebase.User;

    bandAdmin = false;

    // -----------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------
    constructor(
        private back: BackService,
        private router: Router,
    ) {
        this.notyf = new Notyf({
            delay: 3500
        });
        document.getElementById('navbar').style.display = 'none';
    }

    // -----------------------------------------------------------------
    // Metodos
    // -----------------------------------------------------------------

	/**
	 * Metodo que se llama al cargar el componente
	 * @memberOf AppComponent
	 */
    ngOnInit() {

        this.userAdminState()
        
    }

    userAdminState() {


        if (!localStorage.getItem('auth')) {
            firebase.auth().onAuthStateChanged(user => {
                if (user) {                    
                    this.back.cargarPerfil(user.uid).then(result => {
                                //-----------------------------------------------------------------
                                // carga parametros de la empresa
                                //-----------------------------------------------------------------
                                this.user = user;
                                console.log('resultado:', result);
                                debugger
                                if(result){  
                                    //document.getElementById('navbar').style.display = 'block'
                                    localStorage.setItem('bandAdmin', 'true')
                                   
                           
                                    location.reload()
                                    document.getElementById('home').style.display = 'none'
                                    document.getElementById('estadisticas').style.display = 'none'
                                    document.getElementById('noticiasuser').style.display = 'none'
                                    document.getElementById('notasuser').style.display = 'none'
                                }
                                else{
                                    this.userState( ); 
                                }
                                                                      
                    })                      
                }
            })

        
        }        
        else {
          
           
            if (!localStorage.getItem('bandAdmin')) {            
                this.userState( );            
            }
            else{          
            document.getElementById('navbar').style.display = 'block'
            document.getElementById('home').style.display = 'none'
            document.getElementById('estadisticas').style.display = 'none'
            document.getElementById('noticiasuser').style.display = 'none'
            document.getElementById('notasuser').style.display = 'none'
            this.router.navigate(['/escritorio']);
            }
        }
    }

    userState( ){
     
            firebase.auth().onAuthStateChanged(user => {
                this.back.cargarPerfilUsuario(user.uid).then(result => {
                    setTimeout(() => {
                        //-----------------------------------------------------------------
                        // carga parametros de la empresa
                        //-----------------------------------------------------------------
                       
                        this.nombre = this.back.name
                        this.empresa = this.back.company
    
                        if(result){
                            document.getElementById('navbar').style.display = 'block'
                            document.getElementById('principal').style.display = 'none'
                            document.getElementById('usuarios').style.display = 'none'
                            document.getElementById('areass').style.display = 'none'
                            document.getElementById('noticias').style.display = 'none'
                            document.getElementById('notas').style.display = 'none'
                            this.router.navigate(['/home']);
                        }
                        
                    }, 3000);
                
                })
            }) 
                             
    }

    

	/**
	 * Metodo que logea un usuario en el sistema
	 * @memberOf AppComponent
	 */
    load(micorreo: HTMLElement, micontrasena: HTMLElement) {
        document.getElementById('inicio').classList.add('boton-animate')
        document.getElementById('tesxtoBoton').style.display = 'none'
        document.getElementById('loadAnimation').style.display = 'block'

        this.cargando = true
        let correcto = true

        if (this.correo == null) {
            micorreo.classList.add('error')
            correcto = false
        }
        else
            micorreo.classList.remove('error')


        if (this.contrasena == null) {
            micontrasena.classList.add('error')
            correcto = false
        }
        else
            micontrasena.classList.remove('error')

        if (correcto) {
            firebase.auth().signInWithEmailAndPassword(this.correo, this.contrasena).then(
                user => {
                    localStorage.setItem('auth', 'true')
                    setTimeout(() => {
                        //document.getElementById('navbar').style.display = 'block';
                       
                       // document.getElementById('navbar').style.display = 'block';
                       // this.router.navigate(['/escritorio']);
                    }, 3000);
                }
            ).catch(
                error => {
                    if (error.code == 'auth/wrong-password')
                        this.notyf.alert('Usuario o contraseña invalida');
                    else if (error.code == 'auth/invalid-email' || error.code == 'auth/user-not-found')
                        this.notyf.alert('Ingrese un correo valido')
                    else
                        this.notyf.alert('Error al antrar')
                    document.getElementById('inicio').classList.remove('boton-animate')
                    document.getElementById('loadAnimation').style.display = 'none'
                    document.getElementById('tesxtoBoton').style.display = 'block'
                    this.cargando = false
                })
        }
        else {
            document.getElementById('inicio').classList.remove('boton-animate')
            this.cargando = false
            document.getElementById('loadAnimation').style.display = 'none'
            document.getElementById('tesxtoBoton').style.display = 'block'
        }
    }
    recuperarContrasena() {
        swal({
            title: 'Ingrese el correo de su cuenta',
            input: 'email',
            showCancelButton: true,
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            preConfirm: () => new Promise((resolve, reject) => {
                let val = (<HTMLInputElement>document.getElementsByClassName('swal2-input')[0]).value
                firebase.auth().sendPasswordResetEmail(val).then(
                    () => {
                        resolve()
                    },
                    erro => {
                        reject(erro.message)
                    }
                )
            })
        }).then(
            email => {
                swal({
                    type: 'success',
                    title: 'Correo enviado',
                    html: 'Se ha enviado un correo para reestablecer la contraseña a: ' + email
                })
            }
        )
    }

}
