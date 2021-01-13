import { Component, OnInit } from '@angular/core';
import { default as swal } from 'sweetalert2'
import { BackService } from '../service/back.service'
import * as _ from 'underscore';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { environment } from '../../environments/environment'

declare var $: any
declare var moment: any
declare var Notyf: any
import * as firebase from 'firebase';

@Component({
    selector: 'app-noticias',
    templateUrl: './noticias.component.html',
    styleUrls: ['./noticias.component.scss']
})
export class NoticiasComponent implements OnInit {

    //-----------------------------------------------------------------
    // Atributos
    //-----------------------------------------------------------------

    /** variable que contiene el filtro por areas */
    filtroArea: string

    /** variable que contiene el filtro por fechas */
    filtroFecha: string

    /** variable que contiene el filtro por reaccion */

    /** variable para la libreria de notificaciónes */
    notyf: any

    filtroReaccion: string

    fecha: string

    hora: string

    area: string

    texto: string

    listaAreas = []

    listaNoticiasSinPublicar = []
    listaNoticiasPublicadas = []
    listaNoticias: any

    noticiasPublicadas = true

    company: string

    textoBoton = 'Ver noticias programadas'

    listaFiltroAreas = []

    listaFiltroAreas2 = []

    date1: Date
    date2: Date

    public WYSIWYGOptions = {
        placeholder: "inserte contenido..."
    };

    //-----------------------------------------------------------------
    // Constructor
    //-----------------------------------------------------------------
    constructor(private back: BackService, private http: Http) {
        this.company = localStorage.getItem('company')
        this.noticiasPublicadas = true
        this.filtroArea = 'none'
        this.filtroReaccion = 'none'
        this.area = 'none'
        this.notyf = new Notyf({
            delay: 3000
        });

        this.back.getAreas().then(areas => { this.listaAreas = areas });

        firebase.database().ref('noticias/' + this.company).on('value', snap => {
            this.listaNoticias = snap.val()
        })

        firebase.database().ref('noticias/' + this.company).orderByChild('estado').equalTo('off').on('value', snap => {
            this.listaNoticiasSinPublicar = _.allKeys(snap.val())
        })

        firebase.database().ref('noticias/' + this.company).orderByChild('estado').equalTo('on').on('value', snap => {
            this.listaNoticiasPublicadas = _.allKeys(snap.val())
            this.listaNoticiasSinPublicar = this.listaNoticiasPublicadas.reverse()
        })

    }

    //-----------------------------------------------------------------
    // Metodos
    //-----------------------------------------------------------------

	/**
	 * Metodo que se llama al cargar el componente
	 * @memberOf NoticiasComponent
	 */
    ngOnInit() {
        document.getElementById('noticias').classList.add('activo')
        document.getElementById('franja').style.top = (document.getElementById('noticias').offsetTop - 2) + 'px'

        $('#dat1').datepicker({
            format: 'yyyy/dd/mm'
        });
        let option = {
            hoverState: 'hover-state',
            title: 'Hora',
            twentyFour: true
        }
        $('#time').wickedpicker(option);
        $('#time').val("");

        $('#rango').daterangepicker({
            "opens": "left"
        }, (star, end, label) => {
            this.date1 = new Date(star)
            this.date2 = new Date(end)
        });

        $('#rango').val("");
        $('#cancel').tooltip()
        $('#borrar').tooltip()

        let marco = document.getElementById('marco')
        let tamano = window.innerHeight - marco.getBoundingClientRect().top - 18
        marco.style.height = tamano + 'px'
        document.getElementById('area').style.height = (tamano - 158 - 59) + 'px'

        document.getElementById('contededor').style.height = (tamano - 70) + 'px'

        document.getElementById('not2').style.display = 'none'
    }

	/**
	 * Elimina los filtros de busqueda
	 * @memberOf NoticiasComponent
	 */
    borrarFiltros() {
        this.filtroArea = 'none'
        this.date1 = null
        this.date2 = null
        this.filtroReaccion = 'none'
    }


    borrarNoticia(item) {
        let noticia = this.listaNoticias[item]
        _.each(noticia.area, v => {
            firebase.database().ref('empresas/' + this.company + '/areas/' + v + '/noticias').once('value', snap => {
                let lista = snap.val()
                let area = v
                _.each(lista, (v, k) => {
                    if (v == item)
                        firebase.database().ref('empresas/' + this.company + '/areas/' + area + '/noticias/' + k).remove()
                })
            })
        })
        firebase.database().ref('noticias/' + this.company + '/' + item).remove()

    }

	/**
	 * programa una noticas
	 * @memberOf NoticiasComponent
	 */
    ptogramarNoticia() {
        this.fecha = $('#dat1').val()
        this.hora = $('#time').val()

        if (this.listaFiltroAreas.length == 0)
            this.notyf.alert('Debe seleccionar una Área');
        else if (this.fecha == '')
            this.notyf.alert('Debe seleccionar una fecha');
        else if (this.hora == '')
            this.notyf.alert('Debe seleccionar una hora');
        else if (this.texto == null)
            this.notyf.alert('Coloque un texto a la notica');
        else {
            let path = firebase.database().ref('noticias/' + this.company).push()

            let fecha = this.fecha.split("/")
            let hora = this.hora.replace(" ", "").split(":")
            let dat = new Date(Number(fecha[0]), Number(fecha[2]) - 1, Number(fecha[1]), Number(hora[0]), Number(hora[1])).getTime()

            let noticia = {
                fecha: this.fecha,
                area: this.listaFiltroAreas,
                texto: this.texto,
                estado: 'off',
                date: dat,
                total: 0,
                c1: 0,
                c2: 0,
                c3: 0,
                c4: 0,
                c5: 0,
                key: path.key
            }

            path.set(noticia).then(() => {
                this.area = 'none'
                this.listaFiltroAreas = []
                this.texto = null
                this.fecha = null
                this.hora = null
                this.http.get(environment.url_servidor + "agendar_noticias/" + path.key + "/" + this.company).map((res: Response) => res.toString())
                    .subscribe(
                        res => {
                            this.notyf.confirm('Noticia subída');
                        },
                        err => {
                            this.notyf.alert('Error en el servidor');
                            firebase.database().ref('noticias/' + this.company + "/" + path.key).remove()
                        }
                    )
            })
        }
    }

	/**
	 * Cambia entre las noticas publicadas y por publicar
	 * @memberOf NoticiasComponent
	 */
    cambiarNoticias() {
        this.noticiasPublicadas = !this.noticiasPublicadas
        if (this.noticiasPublicadas) {
            this.textoBoton = 'Ver noticias programadas'
            document.getElementById('not1').style.display = 'block'
            document.getElementById('not2').style.display = 'none'
            let marco = document.getElementById('marco')
            let tamano = window.innerHeight - marco.getBoundingClientRect().top - 18
            document.getElementById('contededor').style.height = (tamano - 65) + 'px'
        }
        else {
            this.textoBoton = 'Ver noticias enviadas'
            document.getElementById('not2').style.display = 'block'
            document.getElementById('not1').style.display = 'none'
            let marco = document.getElementById('marco')
            let tamano = window.innerHeight - marco.getBoundingClientRect().top - 18
            document.getElementById('contededor2').style.height = tamano + 'px'
        }
    }

	/**
	 * Detecta el cambio del un selector
	 * @param {any} event
	 * @memberOf NoticiasComponent
	 */
    cambio(event) {
        if (event == "todas")
            this.listaFiltroAreas = this.listaAreas.slice(0)
        else {
            let contiene = _.contains(this.listaFiltroAreas, event)
            if (!contiene)
                this.listaFiltroAreas.push(event)
        }
        window.setTimeout(() => {
            this.area = "none"
            let ancho = document.getElementById('divTarjetas').offsetHeight
            let marco = document.getElementById('marco')
            let tamano = window.innerHeight - marco.getBoundingClientRect().top - 18
            document.getElementById('area').style.height = (tamano - 158 - 59 - ancho) + 'px'
        }, 10)



    }

    eliminar(index) {
        this.listaFiltroAreas.splice(index, 1)
        if (this.listaFiltroAreas.length == 0) {
            this.area = "none"
        }
        window.setTimeout(() => {
            let ancho = 0
            if (document.getElementById('divTarjetas')) {
                ancho = document.getElementById('divTarjetas').offsetHeight
            }

            let marco = document.getElementById('marco')
            let tamano = window.innerHeight - marco.getBoundingClientRect().top - 18

            let dim = tamano - 158 - 59 - ancho
            document.getElementById('area').style.height = (dim) + 'px'
        }, 10)

    }

    // -----------------------------------------------------------------
    // Segundo filtro
    // -----------------------------------------------------------------
    cambioFiltro2(event) {
        let contiene = _.contains(this.listaFiltroAreas2, event)
        window.setTimeout(() => {
            this.filtroArea = "none"
        }, 10)
        if (!contiene) {
            this.listaFiltroAreas2.push(event)
            this.listaFiltroAreas2 = this.listaFiltroAreas2.slice(0)
        }

        console.log(this.listaFiltroAreas2)
    }

    eliminar2(i) {
        this.listaFiltroAreas2.splice(i, 1)
        this.listaFiltroAreas2 = this.listaFiltroAreas2.slice(0)
    }



}
