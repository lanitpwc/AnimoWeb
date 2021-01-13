import { Component, OnInit, NgModule } from '@angular/core';
import { BackService } from '../service/back.service'
import * as _ from 'underscore';
import { FiltrosService } from '../service/filtros.service'

declare var $: any
declare var jQuery: any

import * as firebase from 'firebase';
declare var Chartist: any

@Component({
    selector: 'app-areas',
    templateUrl: './areas.component.html',
    styleUrls: ['./areas.component.scss'],
    providers: [FiltrosService]
})

export class AreasComponent implements OnInit {

    company: string
    listaAreas: any
    listaAreasGeneral: any
    filtroArea = 'none'
    memocion = 'none'
    listaFiltroAreas = []
    listaEmociones = ['felicidad', 'motivacion', 'estres']

    d1: Date
    d2: Date

    constructor(
        private back: BackService,
        private filtro: FiltrosService
    ) {
        this.company = localStorage.getItem('company')
        this.listaAreas = this.back.listaAreas
        this.listaAreasGeneral = this.back.listaAreas
    }

    ngOnInit() {
        document.getElementById('areass').classList.add('activo')
        document.getElementById('franja').style.top = (document.getElementById('areass').offsetTop - 2) + 'px'

        firebase.database().ref('empresas/' + this.company + '/area/').once('value', snap => {
            let areas = snap.val()
            this.listaAreas = _.allKeys(areas)
            this.listaAreasGeneral = this.listaAreas
        });

        setTimeout(() => {
            $('#rango').daterangepicker({
                "opens": "left"
            }, (start, end, label) => {
                this.d1 = new Date(start)
                this.d2 = new Date(end)
                this.inicializar1()
                // this.inicializar2()
                this.inicializar3()
            });

            this.inicializar1()
            this.inicializar2()
        }, 3000);
    }

    // -----------------------------------------------------------------
    // INICIALIZADORES
    // -----------------------------------------------------------------
    generadorEstadisticas(listaEmociones: Array<any>, area, company, listaAcumulada, d1: Date, d2: Date): Promise<any> {
        let emocion = listaEmociones.shift()
        let lista = (listaAcumulada == null) ? {} : listaAcumulada
        return new Promise(dat => {
            if (!emocion)
                dat(lista)
            else if (d1 && d2) {
                this.filtro.estadisticasAreas(emocion, area, company, d1, d2).then(fechas => {
                    _.each(fechas, (v, k) => {
                        if (lista[k]) {
                            lista[k][emocion] = v['promedio']
                        }
                        else {
                            lista[k] = {}
                            lista[k][emocion] = v['promedio']
                        }
                        this.generadorEstadisticas(listaEmociones, area, company, lista, d1, d2).then(resul => {
                            dat(resul)
                        })
                    })
                })
            }
            else {
                this.filtro.estadisticasAreas(emocion, area, company).then(fechas => {
                    _.each(fechas, (v, k) => {
                        if (lista[k]) {
                            lista[k][emocion] = v['promedio']
                        }
                        else {
                            lista[k] = {}
                            lista[k][emocion] = v['promedio']
                        }
                        this.generadorEstadisticas(listaEmociones, area, company, lista, d1, d2).then(resul => {
                            dat(resul)
                        })
                    })
                })
            }

        })
    }

    inicializar1() {
        _.each(this.listaAreas, valu => {
            this.generadorEstadisticas(this.listaEmociones.slice(0), <string>valu, this.company, null, this.d1, this.d2).then(data => {
                let lab = []
                let datt1 = []
                let datt2 = []
                let datt3 = []
                _.each(data, (v, k) => {
                    let fe = k.toString().split('-')
                    let date = fe[2] + '/' + fe[1] + '/' + fe[0].slice(2, 4)
                    lab.unshift(date)
                    if (_.contains(this.listaEmociones, 'felicidad'))
                        datt1.unshift((v['felicidad']) ? v['felicidad'] : null)
                    if (_.contains(this.listaEmociones, 'motivacion'))
                        datt2.unshift((v['motivacion']) ? v['motivacion'] : null)
                    if (_.contains(this.listaEmociones, 'estres'))
                        datt3.unshift((v['estres']) ? v['estres'] : null)
                })
                //datt1 = datos naranja
                //datt2 = datos rosados
                //datt3 = datos vinotinto
                let datoslista = [
                    datt1,
                    datt2,
                    datt3
                ]
                setTimeout(() => {
                    this.generateBar(lab, datoslista, '.bar-' + <string>valu, <string>valu)
                }, 200);
            })
        })
    }


    inicializar2() {
        _.each(this.listaAreas, v => {

            this.filtro.promedioAreas('felicidad', <string>v, this.company).then(data => {
                setTimeout(() => {
                    this.generarPie('.f-' + data['area'] + '-char', 5, <number>data['promedio'], data['promedio'].toFixed(2), '100px')
                }, 300);
            })

            this.filtro.promedioAreas('motivacion', <string>v, this.company).then(data => {
                setTimeout(() => {
                    this.generarPie('.m-' + data['area'] + '-char', 5, <number>data['promedio'], data['promedio'].toFixed(2), '100px')
                }, 300);
            })

            this.filtro.promedioAreas('estres', <string>v, this.company).then(data => {
                setTimeout(() => {
                    this.generarPie('.e-' + data['area'] + '-char', 5, <number>data['promedio'], data['promedio'].toFixed(2), '100px')
                }, 300);
            })
        })
    }

    inicializar3() {
        _.each(this.listaAreas, v => {

            this.filtro.promedioAreas('felicidad', <string>v, this.company, this.d1, this.d2).then(data => {
                setTimeout(() => {
                    this.generarPie('.f-' + data['area'] + '-char', 5, <number>data['promedio'], data['promedio'].toFixed(2), '100px')
                }, 300);
            })

            this.filtro.promedioAreas('motivacion', <string>v, this.company, this.d1, this.d2).then(data => {
                setTimeout(() => {
                    this.generarPie('.m-' + data['area'] + '-char', 5, <number>data['promedio'], data['promedio'].toFixed(2), '100px')
                }, 300);
            })

            this.filtro.promedioAreas('estres', <string>v, this.company, this.d1, this.d2).then(data => {
                setTimeout(() => {
                    this.generarPie('.e-' + data['area'] + '-char', 5, <number>data['promedio'], data['promedio'].toFixed(2), '100px')
                }, 300);
            })
        })
    }



    // -----------------------------------------------------------------
    // GENERADORES
    // -----------------------------------------------------------------

    generateBar(lab: Array<any>, dat, clase, area) {
        let total = lab.length
        let perc = total * 20
        try {
            document.getElementById('cont-' + area).style.width = perc + "%"
        } catch (error) { }
        let data = {
            labels: lab,
            series: dat
        };
        let option = {
            axisY: {
                offset: 10,
                scaleMinSpace: 30,
            },
            height: '30vh'
        }
        new Chartist.Bar(clase, data, option)
    }

    /**
     *
     * @param idc
     * @param totalData
     * @param actual
     * @param label
     * @param tam
     */
    generarPie(idc: string, totalData: number, actual: number, label: string, tam: string) {
        let rest = totalData - actual
        new Chartist.Pie(idc,
            {
                series: [actual, rest],
                labels: ['', '']
            }, {
                chartPadding: 2,

                width: tam,
                height: tam,
                donut: true,
                donutWidth: 2,
                startAngle: 0,
                total: totalData,
                showLabel: false,
                plugins: [
                    Chartist.plugins.fillDonut({
                        items: [{
                            content: '<span class="small">' + label + '<br>de ' + totalData + '</span>'
                        }]
                    })
                ],
            });
    }

    cambio(event) {
        if (event == 'todos') {
            console.log(this.listaFiltroAreas)
            console.log('todos, says the event', this.back)
            this.listaAreas = this.listaAreasGeneral
            // this.listaFiltroAreas = this.back.listaAreas.slice(0)
        }
        else {
            let contiene = _.contains(this.listaFiltroAreas, event)
            if (!contiene) {
                this.listaFiltroAreas.push(event)
                this.listaFiltroAreas = this.listaFiltroAreas.slice(0)
            }
        }
        window.setTimeout(() => {
            this.filtroArea = "none"
        }, 10)
        this.listaAreas = this.listaFiltroAreas
        this.inicializar1()
        this.inicializar2()

        // console.log(this.listaFiltroAreas)
    }

    eliminar(index) {
        this.listaFiltroAreas.splice(index, 1)
        this.listaFiltroAreas = this.listaFiltroAreas.slice(0)
        if (this.listaFiltroAreas.length == 0)
            this.listaAreas = this.back.listaAreas
        else
            this.listaAreas = this.listaFiltroAreas
        this.inicializar1()
        this.inicializar2()
    }

    cambioEmocion(event) {
        if (event == 'todos')
            this.listaEmociones = ['felicidad', 'motivacion', 'estres']
        else
            this.listaEmociones = [event]
        this.inicializar1()
        this.inicializar2()
    }

    reset() {
        this.d1 = null
        this.d2 = null
        this.inicializar1()
        this.inicializar2()
    }



}
