import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import * as _ from 'underscore';

@Injectable()
export class FiltrosService {

    db: any
    empresa: string


    constructor() {
        this.db = firebase.database()
    }

    estadisticasAreas(emocion: string, area: string, empresa: string): Promise<any>;
    estadisticasAreas(emocion: string, area: string, empresa: string, d1: Date, d2: Date): Promise<any>;
    estadisticasAreas(): Promise<any> {
        let num = arguments.length
        let emocion = arguments[0]
        let area = arguments[1]
        let empresa = arguments[2]
        let d1 = arguments[3]
        let d2 = arguments[4]
        return new Promise(data => {
            switch (num) {
                case 3:
                    let pat1 = this.db.ref('estadisticas/' + empresa + '/' + area + '/' + emocion + '/fechas')
                    pat1.orderByKey().limitToLast(7).once('value', snap => {
                        data(snap.val())
                    })
                    break;

                case 5:
                    let pat2 = this.db.ref('estadisticas/' + empresa + '/' + area + '/' + emocion + '/fechas')
                    pat2.orderByKey().startAt(this.convertDate(d1)).endAt(this.convertDate(d2)).once('value', snap => {
                        data(snap.val())
                    })
                    break;
            }
        })
    }

    estadisticasDiarias(emocion: string, fInicial: Date, fFinal: Date): Promise<any>;
    estadisticasDiarias(emocion: string): Promise<any>;
    estadisticasDiarias(): Promise<any> {
        let num = arguments.length
        let emocion = arguments[0]
        let d1 = arguments[1]
        let d2 = arguments[2]
        return new Promise((data, err) => {
            switch (num) {
                case 3:
                    if (d1 && d2) {
                        if (d1.getTime() <= d2.getTime()) {
                            let ref = this.db.ref('empresas/' + this.empresa + '/emociones/' + emocion + '/fechas')
                            ref.orderByKey().startAt(this.convertDate(d1)).endAt(this.convertDate(d2)).once('value', snap => {
                                data(snap.val())
                            })
                        }
                        else {
                            err('Fecha inicial debe ser menos a la final')
                        }
                    }
                    else {
                        err('Infre fechas validas')
                    }
                    break;

                case 1:
                    let ref = this.db.ref('empresas/' + this.empresa + '/emociones/' + emocion + '/fechas')
                    ref.orderByKey().limitToLast(7).once('value', snap => {
                        data(snap.val())
                    })
                    break;
            }
        })
    }



    promedioAreas(emocion: string, area: string, empresa: string): Promise<any>;
    promedioAreas(emocion: string, area: string, empresa: string, f1: Date, f2: Date): Promise<any>;
    promedioAreas(): Promise<any> {
        let num = arguments.length

        let emocion = arguments[0]
        let area = arguments[1]
        let empresa = arguments[2]
        let d1 = arguments[3]
        let d2 = arguments[4]

        return new Promise(data => {
            switch (num) {
                case 3:
                    let pat = 'estadisticas/' + empresa + '/' + area + '/' + emocion + '/global/promedio'
                    this.datosGlobal(pat, emocion, data, area)
                    break;
                case 5:
                    let pat1 = 'estadisticas/' + empresa + '/' + area + '/' + emocion + '/fechas'
                    this.datosFecha(pat1, d1, d2, emocion, data, area)
                    break;
            }
        })
    }



    /**
       * Retorna el formato de la fecha dd-mm-yyyy
       * @private
       * @param {Date} d Fecha dar formato
       * @returns {string} Formato nuevo
       * @memberOf HomeBack
       */
    private convertDate(d: Date): string {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        return [d.getUTCFullYear(), pad(d.getUTCMonth() + 1), pad(d.getUTCDate())].join('-');
    }


    private datosGlobal(path, emocion, data, area) {
        this.db.ref(path).once('value', snap => {
            data({
                area: area,
                promedio: snap.val(),
                emocion: emocion
            })
        })
    }


    private datosFecha(path, d1, d2, emocion, data, area) {
        let ref = this.db.ref(path)
        ref.orderByKey().startAt(this.convertDate(d1)).endAt(this.convertDate(d2)).once('value', snap => {
            let lista = snap.val()
            let porm = this.promedioFechas(lista)
            data({
                area: area,
                promedio: porm
            })
        })
    }


    private promedioFechas(listaFechas: Array<any>): number {
        let prom = 0
        let total = 0
        _.each(listaFechas, v => {
            prom += v['promedio']
            total++
        })
        let resp = (prom == 0) ? 0 : prom / total
        return resp
    }
}
