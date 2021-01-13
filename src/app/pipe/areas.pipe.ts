import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';

@Pipe({
	name: 'areas'
})
export class AreasPipe implements PipeTransform {
	
	/**
	 * Filtro de noticias por areas
	 * @param {any[]} lista lista de llaves de las noticias
	 * @param {any[]} listaAreas lista de areas
	 * @param {*} listaNoticias lista de noticias
	 * @returns {*} sublista de noticias filtradas 
	 * @memberOf AreasPipe
	 */
	transform(lista: any[], listaAreas: any[], listaNoticias:any)  : any {
		if (listaAreas.length == 0)
			return lista
		else {

			return lista.filter(item=>{
				let noticia = listaNoticias[item]
				let areaNoticias:Array<any> = noticia.area
				let condicion = false
				areaNoticias.forEach(v=>{
					let cont =  _.contains(listaAreas,v)
					if (cont){
						condicion = cont
						return true
					}
						
				})
				return condicion
			})
		}
	}

}

@Pipe({
	name: 'fecha'
})
export class FechaPipe implements PipeTransform{
	
	transform(lista:Array<any>, listaNoticias:any, dat1:Date, dat2: Date): any{
		
		if( dat1==null || dat2 == null )
			return lista
		else{
			return lista.filter(v=>{
				let noticia = listaNoticias[v]
				if (dat1.getTime() <= noticia.date && noticia.date <= dat2.getTime())
					return true
				else
					return false		
			})
		}
	}
}

@Pipe({
	name: 'reaccion'
})
export class ReaccionPipe implements PipeTransform{

	transform(lista:Array<any>, listaNoticias:any,numero:string){
		if(numero == 'none' || numero =='-1')
			return lista
		else{
			let valorExc = Number(numero)
			return lista.filter(v=>{
				let noticia = listaNoticias[v]
				let maxim = -1
				for(let i = 0; i<5;i++){
					let valor = noticia['c'+(i+1)]
					if(valor>= maxim)
						maxim = valor
				}

				return maxim == noticia['c'+valorExc]
			})
		}

	}
}

