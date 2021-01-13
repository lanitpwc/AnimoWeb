import { Component, OnInit } from '@angular/core';
import { ChartsBackService } from '../service/charts-back.service';
import { BackService } from '../service/back.service';
import * as _ from 'underscore';

declare var Chartist: any

@Component({
  selector: 'app-emociones',
  templateUrl: './emociones.component.html',
  styleUrls: ['./emociones.component.css'],
  providers: [ChartsBackService]
})
export class EmocionesComponent implements OnInit {

  charObj: any
  piePush: any
  piePrincipal: any

  emocion: string

  total: number
  respond: number

  empresa: string
  condEmpresa: boolean
  numEmpresa: number = 0

  tieneLinea: boolean
  condLinea: boolean
  numArea: number = 0

  tieneEdad: boolean
  condEdad: boolean
  numEdad: number = 0

  tieneCargo: boolean
  condCargo: boolean
  numCargo: number = 0

  tieneSubArea: boolean
  condSubArea: boolean
  numSubArea: number = 0

  tieneNegocio: boolean
  condNegocio: boolean
  numNegocio: number = 0

  date1
  date2

  emociones = {
      felicidad: 'felicidad',
      estres: 'estrés',
      motivacion: 'motivación'
  }

  texto: any
  dateFrom: any
  dateTo: any

  constructor(private chartBack: ChartsBackService, private userBack: BackService) { 
    this.emocion = 'felicidad'
    this.empresa = this.userBack.datosUsuario.empresa

    this.texto = {
      empresa: {
          positivo: {
              felicidad: 'Estás más feliz que ' + this.empresa,
              estres: 'Estás menos estresado que ' + this.empresa,
              motivacion: 'Estás más motivado que ' + this.empresa
          },
          negativo: {
              felicidad: 'Estás menos feliz que ' + this.empresa,
              estres: 'Estás más estresado que ' + this.empresa,
              motivacion: 'Estás menos motivado que ' + this.empresa
          }
      },
      linea: {
          positivo: {
              felicidad: 'Estás más feliz que tu línea de trabajo',
              estres: 'Estás menos estresado que tu línea de trabajo',
              motivacion: 'Estás más motivado que tu línea de trabajo'
          },
          negativo: {
              felicidad: 'Estás menos feliz que tu línea de trabajo',
              estres: 'Estás más estresado que tu línea de trabajo',
              motivacion: 'Estás menos motivado que tu línea de trabajo'
          }
      },
      edad: {
          positivo: {
              felicidad: 'Estás más feliz que tu rango de edad',
              estres: 'Estás menos estresado que tu rango de edad',
              motivacion: 'Estás más motivado que tu rango de edad'
          },
          negativo: {
              felicidad: 'Estás menos feliz que tu rango de edad',
              estres: 'Estás más estresado que tu rango de edad',
              motivacion: 'Estás menos motivado que tu rango de edad'
          }
      },
      cargo: {
          positivo: {
              felicidad: 'Estás más feliz que tu cargo',
              estres: 'Estás menos estresado que tu cargo',
              motivacion: 'Estás más motivado que tu cargo'
          },
          negativo: {
              felicidad: 'Estás menos feliz que tu cargo',
              estres: 'Estás más estresado que tu cargo',
              motivacion: 'Estás menos motivado que tu cargo'
          }
      },
      sublinea: {
          positivo: {
              felicidad: 'Estás más feliz que tu sub línea de servicio',
              estres: 'Estás menos estresado que tu sub línea de servicio',
              motivacion: 'Estás más motivado que tu sub línea de servicio'
          },
          negativo: {
              felicidad: 'Estás menos feliz que tu sub línea de servicio',
              estres: 'Estás más estresado que tu sub línea de servicio',
              motivacion: 'Estás menos motivado que tu sub línea de servicio'
          }
      },
      negocio: {
          positivo: {
              felicidad: 'Estás más feliz que tu unidad de negocio',
              estres: 'Estás menos estresado que tu unidad de negocio',
              motivacion: 'Estás más motivado que tu unidad de negocio'
          },
          negativo: {
              felicidad: 'Estás menos feliz que tu unidad de negocio',
              estres: 'Estás más estresado que tu unidad de negocio',
              motivacion: 'Estás menos motivado que tu unidad de negocio'
          }
      }
    }
  }

  

  ngOnInit() {
    // -----------------------------------------------------------------
    // push respondidos
    // -----------------------------------------------------------------
    this.total = this.userBack.datosUsuario.pushRecividos
    this.respond = this.userBack.datosUsuario.pushContestados
    debugger
    let perc = '0%';
    if (this.total != 0)
        perc = ((this.respond / this.total) * 100).toFixed() + '%'
    this.generarPie('.ct-chart', this.piePush, this.total, this.respond, perc)

    this.iniciarEstadisticas()

  }

  iniciarEstadisticas() {

    // -----------------------------------------------------------------
    // Bar graficas emocion
    // -----------------------------------------------------------------
    this.chartBack.estadisticasDiarias(this.emocion).then(data => {
        let lab = []
        let dat = []
        _.each(data, (v, k) => {
            let fe = k.toString().split('-')
            let date = fe[2] + '/' + fe[1] + '/' + fe[0].slice(2, 4)
            lab.unshift(date)
            dat.unshift(v['promedio'])
        })
        this.generateBar(this.charObj, lab, dat, '.' + this.emocion + '-bar')
    })

    // -----------------------------------------------------------------
    // paie emociones
    // -----------------------------------------------------------------
    this.chartBack.promedioEmocion('felicidad').then(data => {
        let tem = Number(data).toFixed(2)
        this.generarPie('.felicidad-pie', this.piePrincipal, 5, Number(tem), tem)
    })

    this.chartBack.promedioEmocion('estres').then(data => {
        let tem = Number(data).toFixed(2)
        this.generarPie('.estres-pie', this.piePrincipal, 5, Number(tem), tem)
    })

    this.chartBack.promedioEmocion('motivacion').then(data => {
        let tem = Number(data).toFixed(2)
        this.generarPie('.motivacion-pie', this.piePrincipal, 5, Number(tem), tem)
    })

    // -----------------------------------------------------------------
    // Empresa
    // -----------------------------------------------------------------
    this.chartBack.promedioEmpresa(this.emocion, this.userBack.datosUsuario, this.empresa).then(data => {
        let usuario = data['usuario']
        let empresa = data['empresa']
        this.condEmpresa = usuario >= empresa
        this.numEmpresa = Math.round(usuario)
    })

    // -----------------------------------------------------------------
    // linea de servicio
    // -----------------------------------------------------------------
    this.tieneLinea = this.userBack.datosUsuario.anonimo['area'] != null
    if (this.tieneLinea) {
        this.chartBack.promedioAreas(this.emocion, this.userBack.datosUsuario, this.userBack.datosUsuario.empresa).then(data => {
            let usuario = data['usuario']
            let empresa = data['empresa']
            this.condLinea = usuario >= empresa
            this.numArea = Math.round(usuario)
        })
    }

    // -----------------------------------------------------------------
    // rango edad
    // -----------------------------------------------------------------
    this.tieneEdad = this.userBack.datosUsuario.anonimo['edad'] != null
    if (this.tieneEdad) {
        this.chartBack.promedioEdades('felicidad', this.userBack.datosUsuario, this.userBack.datosUsuario.empresa).then(data => {
            let usuario = data['usuario']
            let empresa = data['empresa']
            this.condEdad = usuario >= empresa
            this.numEdad = Math.round(usuario)
        })
    }

    // -----------------------------------------------------------------
    // cargo
    // -----------------------------------------------------------------
    this.tieneCargo = this.userBack.datosUsuario.anonimo['cargo'] != null
    if (this.tieneCargo) {
        this.chartBack.promedioCargo(this.emocion, this.userBack.datosUsuario, this.userBack.datosUsuario.empresa).then(data => {
            let usuario = data['usuario']
            let empresa = data['empresa']
            this.condCargo = usuario >= empresa
            this.numCargo = Math.round(usuario)
        })
    }

    // -----------------------------------------------------------------
    // SubArea
    // -----------------------------------------------------------------
    this.tieneSubArea = this.userBack.datosUsuario.anonimo['subArea'] != null
    if (this.tieneSubArea) {
        this.chartBack.promedioSubArea(this.emocion, this.userBack.datosUsuario, this.userBack.datosUsuario.empresa).then(data => {
            let usuario = data['usuario']
            let empresa = data['empresa']
            this.condSubArea = usuario >= empresa
            this.numSubArea = Math.round(usuario)
        })
    }


    // -----------------------------------------------------------------
    // Unidad de negocio
    // -----------------------------------------------------------------
    this.tieneNegocio = this.userBack.datosUsuario.anonimo['subSubArea'] != null
    if (this.tieneNegocio) {
        this.chartBack.promedioUnidadNegocio(this.emocion, this.userBack.datosUsuario, this.userBack.datosUsuario.empresa).then(data => {
            let usuario = data['usuario']
            let empresa = data['empresa']
            this.condNegocio = usuario >= empresa
            this.numNegocio = Math.round(usuario)
        })
    }

  }

  generateBar(char, lab: Array<any>, dat, clase) {
    let total = lab.length

    let perc = total * 11

    document.getElementById('cont').style.width = perc + "%"

    let data = {
        labels: lab,
        series: [
            dat
        ]
    };

    let option = {

        axisY: {
            offset: 10,
        },
        axisX: {
            offset: 15,
        },
        high: 5,
        low: 0,

    }

    char = new Chartist.Bar(clase, data, option)

  }

  generarPie(idc: string, char, totalData: number, actual: number, label: string) {
    let rest = totalData - actual
    char = new Chartist.Pie(idc,
        {
            series: [actual, rest],
            labels: ['', '']
        }, {
            chartPadding: 2,

            width: '100%',
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

    char.on('draw', (data) => {
        if (data.type === 'slice' && data.index == 0) {
            // Get the total path length in order to use for dash array animation
            var pathLength = data.element._node.getTotalLength();

            // Set a dasharray that matches the path length as prerequisite to animate dashoffset
            data.element.attr({
                'stroke-dasharray': pathLength + 'px ' + pathLength + 'px'
            });

            // Create animation definition while also assigning an ID to the animation for later sync usage
            var animationDefinition = {
                'stroke-dashoffset': {
                    id: 'anim' + data.index,
                    dur: 3200,
                    from: -pathLength + 'px',
                    to: '0px',
                    easing: Chartist.Svg.Easing.easeOutQuint,
                    fill: 'freeze'
                }
            };

            // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us
            data.element.attr({
                'stroke-dashoffset': -pathLength + 'px'
            });

            // We can't use guided mode as the animations need to rely on setting begin manually
            // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
            data.element.animate(animationDefinition, true);
        }
    });

  }

  cambiarEmocion(emocio: string) {
    console.log('Emocion en cambiarEmocion: ', emocio);
    console.log('Emocion en this.emocion: ', this.emocion);
    if (this.emocion != emocio) {
        this.emocion = emocio
        setTimeout(() => {
            if (!this.dateTo || !this.dateFrom)
                this.iniciarEstadisticas()
            else
                this.filtrarFecha()
        }, 50);

    }
  }


  filtrarFecha() {
    let f1 = this.dateFrom.split('-')
    let d1 = new Date(Number(f1[0]), Number(f1[1]) - 1, Number(f1[2]))

    let f2 = this.dateTo.split('-')
    let d2 = new Date(Number(f2[0]), Number(f2[1]) - 1, Number(f2[2]))

    if (d1 && d2 && d1.getTime() <= d2.getTime()) {
        // -----------------------------------------------------------------
        // Bar graficas emocion
        // -----------------------------------------------------------------
        this.chartBack.estadisticasDiarias(this.emocion, d1, d2).then(data => {
            let lab = []
            let dat = []
            _.each(data, (v, k) => {
                let fe = k.toString().split('-')
                let date = fe[2] + '/' + fe[1] + '/' + fe[0].slice(2, 4)
                lab.unshift(date)
                dat.unshift(v['promedio'])
            })
            this.generateBar(this.charObj, lab, dat, '.' + this.emocion + '-bar')
        })

        // -----------------------------------------------------------------
        // paie emociones
        // -----------------------------------------------------------------
        this.chartBack.promedioEmocion('felicidad', d1, d2).then(data => {
            let tem = Number(data).toFixed(2)
            this.generarPie('.felicidad-pie', this.piePrincipal, 5, Number(tem), tem)
        })

        this.chartBack.promedioEmocion('estres', d1, d2).then(data => {
            let tem = Number(data).toFixed(2)
            this.generarPie('.estres-pie', this.piePrincipal, 5, Number(tem), tem)
        })

        this.chartBack.promedioEmocion('motivacion', d1, d2).then(data => {
            let tem = Number(data).toFixed(2)
            this.generarPie('.motivacion-pie', this.piePrincipal, 5, Number(tem), tem)
        })

        // -----------------------------------------------------------------
        // Empresa
        // -----------------------------------------------------------------
        this.chartBack.promedioEmpresa(this.emocion, this.userBack.datosUsuario, this.empresa, d1, d2).then(data => {
            let usuario = data['usuario']
            let empresa = data['empresa']
            this.condEmpresa = usuario >= empresa
            this.numEmpresa = Math.round(usuario)
        })

        // -----------------------------------------------------------------
        // linea de servicio
        // -----------------------------------------------------------------
        this.tieneLinea = this.userBack.datosUsuario.anonimo['area'] != null
        if (this.tieneLinea) {
            this.chartBack.promedioAreas(this.emocion, this.userBack.datosUsuario, this.userBack.datosUsuario.empresa, d1, d2).then(data => {
                let usuario = data['usuario']
                let empresa = data['empresa']
                this.condLinea = usuario >= empresa
                this.numArea = Math.round(usuario)
            })
        }

        // -----------------------------------------------------------------
        // rango edad
        // -----------------------------------------------------------------
        this.tieneEdad = this.userBack.datosUsuario.anonimo['edad'] != null
        if (this.tieneEdad) {
            this.chartBack.promedioEdades('felicidad', this.userBack.datosUsuario, this.userBack.datosUsuario.empresa, d1, d2).then(data => {
                let usuario = data['usuario']
                let empresa = data['empresa']
                this.condEdad = usuario >= empresa
                this.numEdad = Math.round(usuario)
            })
        }

        // -----------------------------------------------------------------
        // cargo
        // -----------------------------------------------------------------
        this.tieneCargo = this.userBack.datosUsuario.anonimo['cargo'] != null
        if (this.tieneCargo) {
            this.chartBack.promedioCargo(this.emocion, this.userBack.datosUsuario, this.userBack.datosUsuario.empresa, d1, d2).then(data => {
                let usuario = data['usuario']
                let empresa = data['empresa']
                this.condCargo = usuario >= empresa
                this.numCargo = Math.round(usuario)

            })
        }

        // -----------------------------------------------------------------
        // SubArea
        // -----------------------------------------------------------------
        this.tieneSubArea = this.userBack.datosUsuario.anonimo['subArea'] != null
        if (this.tieneSubArea) {
            this.chartBack.promedioSubArea(this.emocion, this.userBack.datosUsuario, this.userBack.datosUsuario.empresa, d1, d2).then(data => {
                let usuario = data['usuario']
                let empresa = data['empresa']
                this.condSubArea = usuario >= empresa
                this.numSubArea = Math.round(usuario)
            })
        }


        // -----------------------------------------------------------------
        // Unidad de negocio
        // -----------------------------------------------------------------
        this.tieneNegocio = this.userBack.datosUsuario.anonimo['subSubArea'] != null
        if (this.tieneNegocio) {
            this.chartBack.promedioUnidadNegocio(this.emocion, this.userBack.datosUsuario, this.userBack.datosUsuario.empresa, d1, d2).then(data => {
                let usuario = data['usuario']
                let empresa = data['empresa']
                this.condNegocio = usuario >= empresa
                this.numNegocio = Math.round(usuario)
            })
        }

    }

  }

  pruebaTest() {
    console.log('hola');
    //this.navCtrl.push(AnimoCheckPage)
  }

  /*setRoot(str: string) {
    switch (str) {
        case 'estadisticas': this.app.getRootNav().setRoot(EmocionesPage); break;
        case 'noticias': this.app.getRootNav().setRoot(NoticiasPage); break;
        case 'notas': this.app.getRootNav().setRoot(MisNotasPage); break;
        case 'perfil': this.app.getRootNav().setRoot(PerfilPage); break;
        default: break;
    }
  }*/

  

}
