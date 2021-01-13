import { Component, OnInit } from '@angular/core';
import { ChartsBackService } from '../service/charts-back.service';
import { BackService } from '../service/back.service';

declare var google: any;
declare var $ : any

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
  providers: [ChartsBackService]
})
export class ChartsComponent implements OnInit {



  // -----------------------------------------------------------------
	// Atributos
	// -----------------------------------------------------------------
	chartVector: Array<{ number: string}>;
	miAnimoEmpresayo
	miAnimoEmpresa
	val = 2
	pushRecibidos
	pushContestados

	// Variables con la información capturada para poner los emoticones
	emojisVector = []

	// variables para los charts circulares con los promedios de felicidad, estrés y motivación
	globalFelicidad
	globalEstres
	globalMotivacion
	

	minDate: number = 2018
  maxDate: number = 2025
  
  dateFrom: number;
  dateTo: number;


	// -----------------------------------------------------------------
	// Constructor
	// -----------------------------------------------------------------
	constructor(private chartBack: ChartsBackService, private userBack: BackService) { }

	// -----------------------------------------------------------------
	// Metodos
	// -----------------------------------------------------------------
	ngOnInit() {

		let d1 = new Date(2017,0,1)
		let d2 = new Date(2017,2,12)

		this.chartBack.estadisticasDiarias('felicidad').then(data=>console.log(data))
		// this.chartBack.estadisticasDiarias(d1,d2,'felicidad').then(data=>console.log(data))

		this.chartBack.promedioEmocion('felicidad').then(data=> this.globalFelicidad = data)
		this.chartBack.promedioEmocion('estres').then(data=> this.globalEstres = data)
		this.chartBack.promedioEmocion('motivacion').then(data=> {this.globalMotivacion = data; this.pushDataPie()})
		this.chartBack.promedioEmocion('felicidad',d1,d2).then(data=>console.log(data))

		


		// ------------------------------------------------------------------------------------
		// Retorna valor de la felicidad en la empresa y le asigna el emoticón correspondiente
		// ------------------------------------------------------------------------------------		
		this.chartBack.promedioEmpresa('felicidad',this.userBack.datosUsuario,this.userBack.datosUsuario.empresa).then(data => {
			this.emojisVector.push({title : "empresa", user : data.usuario.toFixed(), others : data.empresa.toFixed()})		
		})
		this.chartBack.promedioEmpresa('felicidad',this.userBack.datosUsuario,this.userBack.datosUsuario.empresa,d1,d2).then(data => console.log(data))


		// ------------------------------------------------------------------------------------
		// Retorna valor de la felicidad en la línea de servicio y le asigna el emoticón correspondiente
		// ------------------------------------------------------------------------------------
		this.chartBack.promedioAreas('felicidad',this.userBack.datosUsuario,this.userBack.datosUsuario.empresa).then(data => {
			this.emojisVector.push({title : "línea de servicio", user : data.usuario.toFixed(), others : data.empresa.toFixed()})	
		})
		this.chartBack.promedioAreas('felicidad',this.userBack.datosUsuario,this.userBack.datosUsuario.empresa,d1,d2).then(data => console.log(data))


		// ------------------------------------------------------------------------------------
		// Retorna valor de la felicidad según el rango de edad y le asigna el emoticón correspondiente
		// ------------------------------------------------------------------------------------
		this.chartBack.promedioEdades('felicidad',this.userBack.datosUsuario,this.userBack.datosUsuario.empresa).then(data => {
			this.emojisVector.push({title : "rango de edad", user : data.usuario.toFixed(), others : data.empresa.toFixed()})
		})
		this.chartBack.promedioEdades('felicidad',this.userBack.datosUsuario,this.userBack.datosUsuario.empresa,d1,d2).then(dat => console.log(dat))
		

		// -----------------------------------------------------------------------
		// Captura la cantidad de push enviados y los que el usuario ha respondido
		// -----------------------------------------------------------------------
		this.pushRecibidos = this.userBack.datosUsuario.pushRecividos
		this.pushContestados = this.userBack.datosUsuario.pushContestados

		this.chartVector =[
			{number : "two"},
			{number : "one"},
			{number : "there"},
			{number : "zero"},
			{number : "two"},
			{number : "one"},
			{number : "zero"},
			{number : "zero"},
			{number : "zero"},
			{number : "zero"},
			{number : "two"},
			{number : "zero"},
			{number : "zero"},
			{number : "three"}
		]
		this.evaluarFrecuenciaRespuesta()
	}


	/**
	 * Evalua los push enviados y los contestados para inyectar el porcentaje en la gráfica circular que aparece de primera
	 * @memberOf ChartsPage
	 */
	evaluarFrecuenciaRespuesta():void{
		let tres = (this.pushContestados*100)/this.pushRecibidos
		console.log(tres)
		if(this.pushContestados == 0 && this.pushRecibidos == 0){
			$('.pieGeneral').asPieProgress({goal : 100});		
		} else {
			$('.pieGeneral').asPieProgress({goal : tres});
		}
		$('.pie_progress').asPieProgress('start');
	}


	/**
	 *  Inyecta valores a las gráficas circulares sobre las emociones
	 * @memberOf ChartsPage
	 */
	pushDataPie(){
		$('.motivacion').asPieProgress({goal : this.globalMotivacion});		
		$('.felicidad').asPieProgress({goal : this.globalFelicidad});		
		$('.estres').asPieProgress({goal : this.globalEstres});
		$('.pie_progress').asPieProgress('start');		
	}


	/**
	 * Datos sobre los push recibidos
	 * @returns {{re:number,en:number,pr:number}} re = numero de push recibidos, en = numero de push envíados, pr= porcentaje de push
	 * @memberOf ChartsPage
	 */
	datosPushRespondidos():{re:number,en:number,pr:number} {
		let recividos = this.userBack.datosUsuario.pushRecividos
		let enviados = this.userBack.datosUsuario.pushContestados
		if (enviados != 0) {
			let obj = {
				re : recividos,
				en : enviados,
				pr : 100*(enviados/recividos)
			}
			return obj
		}
		else{
			let obj = {
				re : 0,
				en : 0,
				pr : 0
			}
			return obj
		}
	}

	drawChart() {
		// Create the data table.
		let data = google.visualization.arrayToDataTable([
			['Element', 'Nivel de emoción', { role: 'style' }, { role: 'annotation' }],
			['', 1.3, '#fc7100', ''],
			['', 1.5, '#fc7100', ''],
			['', 2, '#fc7100', ''],
			['', 1.5, '#fc7100', ''],
			['', 2.5, '#fc7100', ''],
			['', 2.6, '#fc7100', ''],
			['', 3.1, '#fc7100', ''],
			['', 3.4, '#fc7100', '']
		]);

		// Set chart options
		let options = {
			'width': 'auto',
			'height': 'auto'
		};

		// Instantiate and draw our chart, passing in some options.
		let chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
		chart.draw(data, options);
	}

}
