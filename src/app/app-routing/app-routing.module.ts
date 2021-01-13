import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegistroComponent } from 'app/registro/registro.component';

import { AuthGuard } from '../guard/auth.guard';
import { AreasComponent } from 'app/areas/areas.component';
import { EscritorioComponent } from 'app/escritorio/escritorio.component';
import { UsuarioComponent } from 'app/usuario/usuario.component';
import { NoticiasUsuarioComponent } from 'app/noticias-usuario/noticias-usuario.component';
import { NotasComponent } from 'app/notas/notas.component';
import { RegistroEndComponent } from '../registro/registro-end/registro-end.component';
import { HomeComponent } from '../home/home.component';
import { ChartsComponent } from '../charts/charts.component';
import { EmocionesComponent } from '../emociones/emociones.component';
import { MisNotasComponent } from '../mis-notas/mis-notas.component';
import { NoticiasComponent } from '../noticias/noticias.component';

export const routes: Routes = [
    {
        path: '', component: LoginComponent,
    },
    {
        path: 'login', component: LoginComponent,
    },
    {
        path: 'registro', 
        component: RegistroComponent
    },
    {
        path: 'areas',
        component: AreasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'usuarios',
        component: UsuarioComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'noticias',
        component: NoticiasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'noticiasuser',
        component: NoticiasUsuarioComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'notas',
        component: NotasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'misnotas',
        component: MisNotasComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'escritorio',
        component: EscritorioComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'estadisticas',
        component: EmocionesComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'welcome',
        component: RegistroEndComponent,
    },
    { path: '**', pathMatch: 'full', redirectTo: 'login' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    declarations: []
})
export class AppRoutingModule { }
