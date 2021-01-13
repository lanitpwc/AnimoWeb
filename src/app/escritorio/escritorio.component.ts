import { Component, OnInit } from '@angular/core';
import { BackService } from '../service/back.service'
import { FiltrosService } from '../service/filtros.service'
import * as _ from 'underscore';

declare var $: any
declare var google: any

import * as firebase from 'firebase';
declare var Chartist: any

@Component({
    selector: 'app-escritorio',
    templateUrl: './escritorio.component.html',
    styleUrls: ['./escritorio.component.scss'],
    providers: [FiltrosService]
})
export class EscritorioComponent implements OnInit {

    empresa: string

    noticias = []
    indi1: number

    notas = []
    indi2: number

    felicidad = []
    motivacion = []
    estres = []

    date1
    date2

    idActual: number

    constructor(private back: BackService, private filtro: FiltrosService) {
        this.empresa = localStorage.getItem('company')
        

        firebase.database().ref('noticias/' + this.empresa).on('value', snap => {
            this.noticias = _.values(snap.val())
            this.indi1 = this.noticias.length - 1
        })

        firebase.database().ref('notas/' + this.empresa).on('value', snap => {
            this.notas = _.values(snap.val())
            this.indi2 = this.notas.length - 1
        })

        document.getElementById('principal').classList.add('activo')
        document.getElementById('franja').style.top = (document.getElementById('principal').offsetTop - 2) + 'px'
               
    }

    ngOnInit() {
       
        $('#rango').daterangepicker({
            "opens": "left"
        }, (start, end, label) => {
            this.date1 = new Date(start)
            this.date2 = new Date(end)
            this.actualizarDatos(this.date1, this.date2)
        });

        this.inicializador()
    }

    inicializador() {
        this.filtro.empresa = this.empresa
        let lista = {}
        this.filtro.estadisticasDiarias('felicidad').then(dat1 => {
            _.each(dat1, (v, k) => {
                if (lista[k]) {
                    lista[k].f = v['promedio']
                }
                else
                    lista[k] = {
                        f: v['promedio']
                    }
            })
            this.filtro.estadisticasDiarias('motivacion').then(dat2 => {
                _.each(dat2, (v, k) => {
                    if (lista[k]) {
                        lista[k].m = v['promedio']
                    }
                    else
                        lista[k] = {
                            m: v['promedio']
                        }
                })
                this.filtro.estadisticasDiarias('estres').then(dat3 => {
                    _.each(dat3, (v, k) => {
                        if (lista[k]) {
                            lista[k].e = v['promedio']
                        }
                        else
                            lista[k] = {
                                e: v['promedio']
                            }
                    })
                    let lab = []
                    let datt1 = []
                    let datt2 = []
                    let datt3 = []
                    _.each(lista, (v, k) => {
                        let fe = k.toString().split('-')
                        let date = fe[2] + '/' + fe[1] + '/' + fe[0].slice(2, 4)
                        lab.unshift(date)
                        datt1.unshift((v['f']) ? v['f'] : null)
                        datt2.unshift((v['m']) ? v['m'] : null)
                        datt3.unshift((v['e']) ? v['e'] : null)

                    })
                    let dat = [
                        datt1, datt2, datt3
                    ]
                    this.generateBar(lab, dat, '.global')

                })
            })
        })

        firebase.database().ref('estadisticas/' + this.empresa).on('value', snap => {
            let areas = snap.val()
            let llaves = _.allKeys(areas)

            this.darEstadisticasAreas(llaves.slice(0), 'felicidad').then(dat => {
                this.felicidad = _.sortBy(dat, (val) => {
                    return -val['promedio']
                })
                setTimeout(() => {
                    _.each(this.felicidad, v => {
                        let actual = <number>v['promedio']
                        this.generarPie('.' + v['area'] + '-pie-1', 5, actual, actual.toFixed(2))
                    })
                }, 1000);
            })


            this.darEstadisticasAreas(llaves.slice(0), 'motivacion').then(dat => {
                this.motivacion = _.sortBy(dat, (val) => {
                    return -val['promedio']
                })
                setTimeout(() => {
                    _.each(this.motivacion, v => {
                        let actual = <number>v['promedio']
                        this.generarPie('.' + v['area'] + '-pie-2', 5, actual, actual.toFixed(2))
                    })
                }, 1000);
            })


            this.darEstadisticasAreas(llaves.slice(0), 'estres').then(dat => {
                this.estres = _.sortBy(dat, (val) => {
                    return -val['promedio']
                })
                setTimeout(() => {
                    _.each(this.estres, v => {
                        let actual = <number>v['promedio']
                        this.generarPie('.' + v['area'] + '-pie-3', 5, actual, actual.toFixed(2))
                    })
                }, 1000);
            })
        })
    }



    darEstadisticasAreas(areas: Array<string>, emocion: string): Promise<Array<any>> {
        return new Promise(data => {
            let vector = []
            if (areas == null || areas.length == 0)
                data(vector)
            else {
                let area = areas.shift()
                this.filtro.promedioAreas(emocion, area, this.empresa).then(promedio => {
                    vector.push(promedio)
                    this.darEstadisticasAreas(areas, emocion).then(vector2 => {
                        let vector3 = vector.concat(vector2)
                        data(vector3)
                    })
                })
            }
        })
    }


    darEstadisticasAreasTiempo(areas: Array<string>, emocion: string, d1: Date, d2: Date): Promise<Array<any>> {
        return new Promise(data => {
            let vector = []
            if (areas == null || areas.length == 0)
                data(vector)
            else {
                let area = areas.shift()
                this.filtro.promedioAreas(emocion, area, this.empresa, d1, d2).then(promedio => {
                    vector.push(promedio)
                    this.darEstadisticasAreasTiempo(areas, emocion, d1, d2).then(vector2 => {
                        let vector3 = vector.concat(vector2)
                        data(vector3)
                    })
                })
            }
        })
    }


    actualizarDatos(d1: Date, d2: Date) {
        this.filtro.empresa = this.empresa
        let lista = {}
        this.filtro.estadisticasDiarias('felicidad', d1, d2).then(dat1 => {
            _.each(dat1, (v, k) => {
                if (lista[k]) {
                    lista[k].f = v['promedio']
                }
                else
                    lista[k] = {
                        f: v['promedio']
                    }
            })
            this.filtro.estadisticasDiarias('motivacion', d1, d2).then(dat2 => {
                _.each(dat2, (v, k) => {
                    if (lista[k]) {
                        lista[k].m = v['promedio']
                    }
                    else
                        lista[k] = {
                            m: v['promedio']
                        }
                })
                this.filtro.estadisticasDiarias('estres', d1, d2).then(dat3 => {
                    _.each(dat3, (v, k) => {
                        if (lista[k]) {
                            lista[k].e = v['promedio']
                        }
                        else
                            lista[k] = {
                                e: v['promedio']
                            }
                    })
                    let lab = []
                    let datt1 = []
                    let datt2 = []
                    let datt3 = []
                    _.each(lista, (v, k) => {
                        let fe = k.toString().split('-')
                        let date = fe[2] + '/' + fe[1] + '/' + fe[0].slice(2, 4)
                        lab.unshift(date)
                        datt1.unshift((v['f']) ? v['f'] : null)
                        datt2.unshift((v['m']) ? v['m'] : null)
                        datt3.unshift((v['e']) ? v['e'] : null)

                    })
                    let dat = [
                        datt1, datt2, datt3
                    ]
                    this.generateBar(lab, dat, '.global')

                })
            })
        })



        firebase.database().ref('estadisticas/' + this.empresa).on('value', snap => {
            let areas = snap.val()
            let llaves = _.allKeys(areas)

            this.darEstadisticasAreasTiempo(llaves.slice(0), 'felicidad', d1, d2).then(dat => {
                this.felicidad = _.sortBy(dat, (val) => {
                    return -val['promedio']
                })
                setTimeout(() => {
                    _.each(this.felicidad, v => {
                        let actual = <number>v['promedio']
                        this.generarPie('.' + v['area'] + '-pie-1', 5, actual, actual.toFixed(2))
                    })
                }, 500);
            })


            this.darEstadisticasAreasTiempo(llaves.slice(0), 'motivacion', d1, d2).then(dat => {
                this.motivacion = _.sortBy(dat, (val) => {
                    return -val['promedio']
                })
                setTimeout(() => {
                    _.each(this.motivacion, v => {
                        let actual = <number>v['promedio']
                        this.generarPie('.' + v['area'] + '-pie-2', 5, actual, actual.toFixed(2))
                    })
                }, 500);
            })


            this.darEstadisticasAreasTiempo(llaves.slice(0), 'estres', d1, d2).then(dat => {
                this.estres = _.sortBy(dat, (val) => {
                    return -val['promedio']
                })
                setTimeout(() => {
                    _.each(this.estres, v => {
                        let actual = <number>v['promedio']
                        this.generarPie('.' + v['area'] + '-pie-3', 5, actual, actual.toFixed(2))
                    })
                }, 500);
            })
        })

    }


    generateBar(lab: Array<any>, dat, clase) {
        let total = lab.length

        let perc = total * 11

        document.getElementById('cont').style.width = perc + "%"

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


    generarPie(idc: string, totalData: number, actual: number, label: string) {
        let rest = totalData - actual
        new Chartist.Pie(idc,
            {
                series: [actual, rest],
                labels: ['', '']
            }, {
                chartPadding: 2,

                width: '11vh',
                height: '11vh',
                donut: true,
                donutWidth: 2,
                startAngle: 0,
                total: totalData,
                showLabel: false,
                plugins: [
                    Chartist.plugins.fillDonut({
                        items: [{
                            content: '<span class="small">' + label + '</span>'
                        }]
                    })
                ],
            });
    }



    reset() {
        this.inicializador()
        this.date1 = null
        this.date2 = null
    }

}
