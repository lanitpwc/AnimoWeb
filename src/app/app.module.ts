import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Http, HttpModule } from '@angular/http';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { DataTableModule } from "angular2-datatable";
import { AppRoutingModule } from './app-routing/app-routing.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { BackService } from './service/back.service';
import { HomeBackService } from './service/home-back.service';
import { AuthGuard } from './guard/auth.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { NotasComponent } from './notas/notas.component'
import { UsuarioComponent } from './usuario/usuario.component'
import { AreasComponent } from './areas/areas.component';
import { EscritorioComponent } from './escritorio/escritorio.component';
import { RegistroComponent } from './registro/registro.component'
import { RegistroEndComponent } from './registro/registro-end/registro-end.component';

import { AreasPipe, FechaPipe, ReaccionPipe } from './pipe/areas.pipe';
import { AreaNotasPipe, FechaNotaPipe, EdadNotaPipe,FiltroContenidoPipe,FechaNoticiasPipe} from './pipe/notas.pipe';
import { AreaUsuarioPipe, EdadUsuarioPipe,FiltroNombrePipe } from './pipe/usuarios.pipe';

// Editor WHAT YOU SEE IS WHAT YOU GET
import { QuillEditorModule } from 'ngx-quill-editor';
import { HomeComponent } from './home/home.component';
import { ConfirmacionComponent } from './components/confirmacion/confirmacion.component';
import { ErrorComponent } from './components/error/error.component';
import { LoadComponent } from './components/load/load.component';
import { MensajeTemporalComponent } from './components/mensaje-temporal/mensaje-temporal.component';
import { NotaComponent } from './nota/nota.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ChartsComponent } from './charts/charts.component';
import { EmocionesComponent } from './emociones/emociones.component';
import { NoticiasUsuarioComponent } from './noticias-usuario/noticias-usuario.component';
import { MisNotasComponent } from './mis-notas/mis-notas.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EscritorioComponent,
    NoticiasComponent,
    UsuarioComponent,
    NotasComponent,
    AreasComponent,
    AreasPipe,
    FechaPipe,
    ReaccionPipe,
    AreaNotasPipe,
    FechaNotaPipe,
    EdadNotaPipe,
    FiltroContenidoPipe,
    FechaNoticiasPipe,
    AreaUsuarioPipe,
    EdadUsuarioPipe,
    FiltroNombrePipe,
    RegistroComponent,
    RegistroEndComponent,
    HomeComponent,
    ConfirmacionComponent,
    ErrorComponent,
    LoadComponent,
    MensajeTemporalComponent,
    NotaComponent,
    NavbarComponent,
    ChartsComponent,
    EmocionesComponent,
    NoticiasUsuarioComponent,
    MisNotasComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartsModule,
    DataTableModule,
    ReactiveFormsModule,
    CommonModule,
    QuillEditorModule,
    HttpClientModule
  ],
  providers: [
    BackService,
    HomeBackService,
    AuthGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
