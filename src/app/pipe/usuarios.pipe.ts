import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'underscore';
@Pipe({
  name: 'usuarioArea'
})
export class AreaUsuarioPipe implements PipeTransform {

  transform(lista: any[], listaAreas: any[], listaNoticias:any): any {
    if (listaAreas.length == 0)
			return lista
		else {

			return lista.filter(item=>{
				let noticia = listaNoticias[item]
				let areaNoticias = noticia.los
				let condicion = _.contains(listaAreas,areaNoticias)
				return condicion
			})
		}
  }

}


@Pipe({
	name: 'edadUsuario'
})
export class EdadUsuarioPipe implements PipeTransform{
  
	transform(lista:Array<any>, listaNoticias:any, edad:string): any{
		if( edad == 'none' ||  edad == 'todos' )
			return lista
		else{
			return lista.filter(v=>{
				let noticia = listaNoticias[v]
        return noticia.fec_nacimiento == edad
			})
		}
	}
}

@Pipe({
  name: 'filtroNombre'
})
export class FiltroNombrePipe implements PipeTransform {

  transform(items: any[], texto: string, lista: any): any {
    if (texto == null || texto == '')
      return items
    else
      return items.filter(item => {
        let usuario = lista[item]
        let r4
        let arg = texto.toLowerCase()

        if (usuario.anonimo){
          let apodo =  usuario.anonimo.apodo.toLowerCase()
          r4 = apodo.indexOf(arg)
        }
        else{
          r4 = -1
        }

        let nombre = usuario.nombre.toLowerCase()
        let area  = usuario.los.toLowerCase()
        let email = usuario.email.toLowerCase()

        
        let r1 = nombre.indexOf(arg)
        let r2 = area.indexOf(arg)
        let r3 = email.indexOf(arg)
        return r1 != -1 || r2 != -1 || r3 != -1 || r4 != -1
      });
  }

}
