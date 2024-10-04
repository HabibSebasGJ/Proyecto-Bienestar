import { Component } from '@angular/core';
import { Actividad } from 'src/app/modelo/Actividad';
import { Inscripcion } from 'src/app/modelo/Inscripcion';
import { ActividadService } from 'src/app/servicios/actividad.service';
import { InscripcionService } from 'src/app/servicios/inscripcion.service';
import { Usuario } from 'src/app/modelo/Usuario';
import { SessionService } from 'src/app/servicios/session.service';

@Component({
  selector: 'app-mi-horario',
  templateUrl: './mi-horario.component.html',
  styleUrls: ['./mi-horario.component.scss']})
export class MiHorarioComponent {

  public actividades: Actividad[] = this.acti.actividades;
  public usuario: Usuario = new Usuario(0, "", "", "", "", "", "", "", "", ""); public MisIncripciones: Inscripcion[] = this.inscripcion.inscripcion;

  constructor(
    private acti: ActividadService,
    private inscripcion: InscripcionService,
    private session: SessionService
) { }
  ngOnInit() {
    this.listarActividades();
    this.listarIncripciones();
    this.usuario = this.session.getUser();
  }

  listarActividades(): void {
    this.acti.obtenerActividades().subscribe(
      (data) => {
        this.actividades = data;
      }
    );
  }

  listarIncripciones() {
    this.inscripcion.obtenerInscripcion().subscribe(
      (data) => {
        console.log(data);
        this.MisIncripciones = data;
      }
    );
  }

  eliminarActividad(idInsc: number): void {
    const confirmacion = window.confirm('¿Estás seguro que desea desvincular la actividad?');

    if (confirmacion) {
      this.inscripcion.eliminarInscripcion(idInsc).subscribe(
        (response) => {
          console.log('solicitud enviada:', response);
          // Actualiza la lista de inscripciones después de eliminar
          this.MisIncripciones = this.MisIncripciones.filter(inscripcion => inscripcion.id !== idInsc);
        },
        (error) => {
          console.error('Error al desvincular:', error);
        }
      );
    }
  }
}