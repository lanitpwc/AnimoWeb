import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';

@Pipe({
  name: 'notasArea'
})
export class AreaNotasPipe implements PipeTransform {

  transform(lista: any[], listaAreas: any[], listaNoticias:any): any {
    if (listaAreas.length == 0)
			return lista
		else {

			return lista.filter(item=>{
				let noticia = listaNoticias[item]
				let areaNoticias = noticia.area
				let condicion = _.contains(listaAreas,areaNoticias)
				return condicion
			})
		}
  }

}

@Pipe({
	name: 'fecha'
})
export class FechaNotaPipe implements PipeTransform{
	
	transform(lista:Array<any>, listaNoticias:any, dat1:Date, dat2: Date): any{
		if( dat1==null || dat2 == null )
			return lista
		else{
			return lista.filter(v=>{
				let noticia = listaNoticias[v]
        let datos = noticia.fecha.split('-')
        let fecha  = new Date(Number(datos[0]),Number(datos[1])-1,Number(datos[2]))
				if (dat1.getTime() <= fecha.getTime() && fecha.getTime() <= dat2.getTime())
					return true
				else
					return false		
			})
		}
	}
}


@Pipe({
	name: 'fechaNoticias'
})
export class FechaNoticiasPipe implements PipeTransform{
	
	transform(lista:Array<any>, listaNoticias:any, dat1:Date, dat2: Date): any{
		if( dat1==null || dat2 == null )
			return lista
		else{
			return lista.filter(v=>{
				let noticia = listaNoticias[v]
        let datos = noticia.fecha.split('/')
        let fecha  = new Date(Number(datos[0]),Number(datos[2])-1,Number(datos[1]))
				if (dat1.getTime() <= fecha.getTime() && fecha.getTime() <= dat2.getTime())
					return true
				else
					return false		
			})
		}
	}
}



@Pipe({
	name: 'edad'
})
export class EdadNotaPipe implements PipeTransform{
  
	transform(lista:Array<any>, listaNoticias:any, edad:string): any{
		if( edad == 'none' ||  edad == 'todos' )
			return lista
		else{
			return lista.filter(v=>{
				let noticia = listaNoticias[v]
        return noticia.edad == edad
			})
		}
	}
}


@Pipe({
  name: 'filtroConte'
})
export class FiltroContenidoPipe implements PipeTransform {

  transform(lista:Array<any>, texto: string, listaNoticias:any): any {
    if (texto == null || texto == '')
      return lista
    else
      return lista.filter(item => {
        let nota = listaNoticias[item]
        let arg = texto.toLowerCase()
				let cont = (nota.msg==null)?'':nota.msg
				
        let r1 = cont.toLowerCase().indexOf(arg)
        return r1 != -1 
      });
  }
}

