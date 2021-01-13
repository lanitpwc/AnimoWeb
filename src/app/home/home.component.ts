import { Component, OnInit, NgZone, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { BackService } from 'app/service/back.service';
import { HomeBackService } from 'app/service/home-back.service';

import swal from 'sweetalert2';
import { ConfirmacionComponent } from '../components/confirmacion/confirmacion.component';
import { MensajeTemporalComponent } from '../components/mensaje-temporal/mensaje-temporal.component';
import { ErrorComponent } from '../components/error/error.component';
import { NotaComponent } from 'app/nota/nota.component';

import * as firebase from 'firebase';
import { FiltrosService } from '../service/filtros.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [FiltrosService]
})
export class HomeComponent {

   // -----------------------------------------------------------------
    // Atributos
    // -----------------------------------------------------------------

    felicidad = [
      {
          value: 5,
          name: 'Muy feliz'
      },
      {
          value: 4,
          name: 'Feliz'
      },
      {
          value: 3,
          name: 'Medio'
      },
      {
          value: 2,
          name: 'Triste'
      },
      {
          value: 1,
          name: 'Muy triste'
      }
    ]

    estres = [
        {
            value: 5,
            name: 'Sin estrés'
        },
        {
            value: 4,
            name: 'Bajo'
        },
        {
            value: 3,
            name: 'Medio'
        },
        {
            value: 2,
            name: 'Alto'
        },
        {
            value: 1,
            name: 'Muy alto'
        }
    ]
  
    motivacion = [
        {
            value: 5,
            name: 'Muy motivado'
        },
        {
            value: 4,
            name: 'Motivado'
        },
        {
            value: 3,
            name: 'Medio'
        },
        {
            value: 2,
            name: 'Poco motivado'
        },
        {
            value: 1,
            name: 'Desmotivado'
        }
    ]
  
  @ViewChild(MensajeTemporalComponent)
  mensTem: MensajeTemporalComponent


  @ViewChild(ConfirmacionComponent)
  confirm: ConfirmacionComponent

  @ViewChild(ErrorComponent)
  errmen: ErrorComponent

  @ViewChild(NotaComponent)
  nota: NotaComponent

  /*    ngOnChanges(){
            console.log('this.confirm:', this.confirm);  
       }*/

    name: string
    company: string
    value: string
    emocion: string
    idActual: number

    happiness: boolean = true
    stress: boolean = true
    motivation: boolean = true

    lastTimeHappiness: number
    lastTimeStress: number
    lastTimeMotivation: number

    swalalerta = '';


  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  

  constructor(private zone: NgZone, private userBack: BackService, private homeBack: HomeBackService) { 
    

    firebase.database().ref('usuarios/' + this.userBack.uid + '/').once('value', (snap) => {
        
        let valor = snap.val();		
        this.userBack.datosUsuario = valor;
   
   
   
            this.name = localStorage.getItem('name');
            this.company = localStorage.getItem('company')

        if(valor){
            let fecha_actual = new Date
                var hora_actual = fecha_actual.getHours(); // hora actual
                // aqui tengo la hora del dia, en formato 24 horas
            
                this.lastTimeHappiness = this.getDatesAsAnArray(this.userBack.datosUsuario.emociones['felicidad'].fechas)[0].acum
                let fromDate = this.userBack.datosUsuario.emociones['felicidad'].date
                let fecha_voto = new Date(fromDate)
        
                let hr_voto = fecha_voto.getHours()
                let dayDiff = this.dateDiffInDays(fecha_actual, fecha_voto)
        
              
        
                if (dayDiff === 0) {
                    // ya voto por felicidad
        
                    // que jornada es?
                    if (hora_actual >= 0 && hora_actual <= 12) {
                        //es la primera jornada
                        if (hr_voto >= 0 && hr_voto <= 12) {
                            //ya voto en esta jornada
                            this.happiness = false
                        } else { this.happiness = false }
                    } else {
                        //es la segunda jornada
                        if (hr_voto >= 0 && hr_voto <= 12) { this.happiness = false } else { this.happiness = false }
                    }
                }
        
                this.lastTimeStress = this.getDatesAsAnArray(this.userBack.datosUsuario.emociones['estres'].fechas)[0].acum
                fromDate = this.userBack.datosUsuario.emociones['estres'].date
                fecha_voto = new Date(fromDate)
                hr_voto = fecha_voto.getHours()
                dayDiff = this.dateDiffInDays(fecha_actual, fecha_voto)
        
                if (dayDiff === 0) {
                    // ya voto por estres
                    // que jornada es?
                    if (hora_actual >= 0 && hora_actual <= 12) {
                        //es la primera jornada
                        if (hr_voto >= 0 && hr_voto <= 12) {
                            //ya voto en esta jornada
                            this.stress = false
                        } else { this.stress = false }
                    } else {
                        //es la segunda jornada
                        if (hr_voto >= 0 && hr_voto <= 12) { this.stress = true } else { this.stress = false }
                    }
                }
        
                this.lastTimeMotivation = this.getDatesAsAnArray(this.userBack.datosUsuario.emociones['motivacion'].fechas)[0].acum
                fromDate = this.userBack.datosUsuario.emociones['motivacion'].date
                fecha_voto = new Date(fromDate)
                hr_voto = fecha_voto.getHours()
                dayDiff = this.dateDiffInDays(fecha_actual, fecha_voto)
        
                if (dayDiff === 0) {
                    // hoy voto por motivacion
                    // que jornada es?
                    if (hora_actual >= 0 && hora_actual <= 12) {
                        //es la primera jornada
                        if (hr_voto >= 0 && hr_voto <= 12) {
                            //ya voto en esta jornada
                            this.motivation = false
                        } else { this.motivation = false }
                    } else {
                        //es la segunda jornada
                        if (hr_voto >= 0 && hr_voto <= 12) { this.motivation = true } else { this.motivation = false }
                    }
                }
            }

           
        })
        debugger
        document.getElementById('home').classList.add('activo')
        document.getElementById('franja').style.top = (document.getElementById('home').offsetTop -2 ) + 'px'
        //this.seleccionar(<HTMLElement>(document.getElementsByClassName('activo')[0]), 0);
        
  }

    ngOnInit() {
        

    }

   

    getDatesAsAnArray(a: Array<any>): Array<any> {
      var arr: Array<any> = []
      if (a != undefined) {
          var keys = Object.keys(a)
          for (let i = 0; i < keys.length; i++) {
              const k = keys[i];
              arr[0] = a[k]
          }
      } else {
          arr = [{ 'enum': -1 }]
      }
      return arr;
  
    }
  
    
    ionViewDidEnter() {
      if (!this.happiness && !this.stress && !this.motivation) {
          // this.mensTem.dismissibleMessage('Felicitaciones por ingresar tu ánimo el día de hoy ahora puedes revisar: Estadísticas, Noticias y tus Notas.')
          //this.mensTem.setText('Felicitaciones por ingresar tu ánimo el día de hoy ahora puedes revisar: Estadísticas, Noticias y tus Notas.', 4000)
          swal('Felicitaciones por ingresar tu ánimo el día de hoy ahora puedes revisar: Estadísticas, Noticias y tus Notas.', this.swalalerta, 'success');
      }
    }

    dateDiffInDays(a, b) {
      let _MS_PER_DAY = 1000 * 60 * 60 * 24;
      // Discard the time and time-zone information.
      var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
      return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    puntear(emocion: string, value: string, index: number) {
        console.log('emocion:', emocion);
        console.log('booleano: ', this.stress);
        console.log('value: ', value);
        console.log('index: ', index);
      if (emocion === 'felicidad' && this.happiness) { this.puntear_alt(emocion, value, index) }
      if (emocion === 'estres' && this.stress) { this.puntear_alt(emocion, value, index) }
      if (emocion === 'motivacion' && this.motivation) { this.puntear_alt(emocion, value, index) }

      if (!this.happiness && !this.stress && !this.motivation) {
         // this.mensTem.setText('Felicitaciones por ingresar tu ánimo el día de hoy ahora puedes revisar: estadísticas, noticias y tus notas', 3000)
          swal('Felicitaciones por ingresar tu ánimo el día de hoy ahora puedes revisar: Estadísticas, Noticias y tus Notas.', this.swalalerta, 'success');
      }
  }

  // en caso de poder puntear podrá hacerlo
  puntear_alt(emocion: string, value: string, index: number) {
      // ------------------------------------------------------------------
      // Condicion de tiempo
      // -----------------------------------------------------------------
      let time = new Date()
      debugger
      let anterior = this.userBack.datosUsuario.emociones[emocion].date //real
      // let anterior = 3 //falso
      let resta = time.getTime() - new Date(anterior).getTime()
      let total = new Date(resta)

      //let horas = new Date(resta).getTime() / 1000 / 60 / 60
      let horas = new Date(resta).getTime() / 1000
      if (horas > 10) {
          this.value = value
          this.emocion = emocion
          let imagen: string
          if (emocion == 'felicidad')
              imagen = 'assets/img/emojis/' + value + '.svg'
          else
              imagen = 'assets/img/' + emocion + '/' + value + '.svg'
          let ok = () => {
              debugger
              this.calificar()
              let empresa = this.userBack.datosUsuario.empresa  //real
              // let empresa = 'pappcorn' //falso
              let nombre = this.userBack.datosUsuario.anonimo.apodo  //real
              // let nombre = 'don Fulanito' //falso
              /*this.navCtrl.setRoot(NotaPage, {
                  val: value,
                  name: nombre,
                  comp: empresa,
                  emoc: emocion,
                  area: this.userBack.datosUsuario.los, //real
                  // area: 'Yeah', //falso
                  edad: this.userBack.datosUsuario.fec_nacimiento
                  // edad: 28 //falso
              })*/
              //this.nota = new NotaComponent(value,nombre,empresa,emocion,this.userBack.datosUsuario.los,this.userBack.datosUsuario.fec_nacimiento);
              this.nota.iniciar(value,nombre,empresa,emocion,this.userBack.datosUsuario.los,this.userBack.datosUsuario.fec_nacimiento);
              console.log('ok');
          }

          let cnacel = () => {
              this.calificar()
              console.log('cancel: ', this.emocion)
              /*switch (this.emocion) {
                  case 'felicidad': this.happiness = false; break;
                  case 'estres': this.stress = false; break;
                  case 'motivacion': this.motivation = false; break;
                  default: break;
              }*/
              if(this.emocion == 'felicidad'){
                  this.happiness = false;
              }else if(this.emocion == 'estres'){
                  this.stress = false;
              }else{
                  this.motivation = false;
              }


          }
          let valor: string = ''
          switch (emocion) {
              case 'felicidad': valor = this.felicidad[index].name; break;
              case 'estres': valor = this.estres[index].name; break;
              case 'motivacion': valor = this.motivacion[index].name; break;
              default: break;
          }
          console.log('valor para confirm.iniciar: ', imagen,emocion,valor);
          
          debugger
          this.confirm.iniciar("¿Quieres dejar una nota de porqué te has sentido así?", imagen, ok, cnacel, emocion, valor)

      } else {
        swal('Debes esperar ' + total.getMinutes() + ' minutos y ' + total.getSeconds() + ' segundos para guardar tu ánimo')
      }
  }

  calificar() {
      let val = parseInt(this.value)
      let empresa = this.userBack.datosUsuario.empresa;
      let fecha = this.userBack.datosUsuario.fec_nacimiento;
      let area = this.userBack.datosUsuario.los;
      let sa = this.userBack.datosUsuario.sublos;
      let ssa = this.userBack.datosUsuario.business_unit;
      let cargo = this.userBack.datosUsuario.cargo;

      this.homeBack.calificarEmocion(this.emocion, area, sa, ssa, empresa, fecha, val, cargo)
     // this.mensTem.setText('¡Tu respuesta ha sido almacenada!', 3000)
     swal('¡Tu respuesta ha sido almacenada!', this.swalalerta, 'success');
  }

  
    setSelectedH(){
        this.happiness = false
    }

    setSelectedS(){
        this.stress = false
    }

    setSelectedM(){
        this.motivation = false
    }

}
