import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExpdienteService } from 'src/app/main/inicio/service/expediente.service';
import { DialogoConfirmarComponent } from 'src/app/main/shared/components/dialogo-confirmar/dialogo-confirmar.component';
import { DialogoComponent } from 'src/app/main/shared/components/dialogo/dialogo.component';
import { ServerService } from 'src/app/main/shared/service/server.service';
import { iAntecedenteQuirurgico } from '../../../../interface/i-antecedente-quirurgico';
import { NuevoAntecedenteQuirurgicoComponent } from './nuevo-antecedente-quirurgico/nuevo-antecedente-quirurgico.component';


let ELEMENT_DATA: iAntecedenteQuirurgico[] =[];

@Component({
  selector: 'app-antecedente-quirurgico',
  templateUrl: './antecedente-quirurgico.component.html',
  styleUrls: ['./antecedente-quirurgico.component.scss']
})
export class AntecedenteQuirurgicoComponent implements OnInit {

  


  displayedColumns: string[] = ["IdAntQ","Descripcion", "Lugar",  "Fecha", "Accion"];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  clickedRows = new Set<iAntecedenteQuirurgico>();
  private _liveAnnouncer:any;

  private IdPaciente : Number = 0;
  private dialogRef: MatDialogRef<NuevoAntecedenteQuirurgicoComponent>;

  private _ExpdienteService: ExpdienteService;
  
  constructor(private ServerScv : ServerService, private _Dialog: MatDialog) {
 
    this._ExpdienteService = new ExpdienteService(this._Dialog);
   }

 
  
  announceSort(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  filtrar(event: Event) {
    const filtro = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  clickRow(evento : string, row : any){
  }
  

  f_Agregar_Fila() : void{

    this.dialogRef = this._Dialog.open(NuevoAntecedenteQuirurgicoComponent,
      {
        disableClose: true,
        panelClass: 'custom-modal'
      })

      this.dialogRef.afterOpened().subscribe(s =>{
        this.dialogRef.componentInstance.IdPaciente = this.IdPaciente;
      })
    
  }

  private Llenar(datos : any)
  {
    let _json = JSON.parse(datos);

    ELEMENT_DATA.splice(0, ELEMENT_DATA.length);
    ELEMENT_DATA = _json["d"]

    this.dataSource = new MatTableDataSource(ELEMENT_DATA);

  }


  public v_Editar(Fila : iAntecedenteQuirurgico): void
  {
    this.dialogRef = this._Dialog.open(NuevoAntecedenteQuirurgicoComponent,
      {
        disableClose: true,
        panelClass: 'custom-modal'
      })

      this.dialogRef.afterOpened().subscribe(s =>{
        this.dialogRef.componentInstance.val.ValForm.get("txtDescripcion")?.setValue(Fila.Descripcion);
        this.dialogRef.componentInstance.val.ValForm.get("txtLugar")?.setValue(Fila.Lugar);
        this.dialogRef.componentInstance.val.ValForm.get("txtFecha")?.setValue(Fila.Fecha);
        this.dialogRef.componentInstance.ID = Fila.IdAntQ;
        this.dialogRef.componentInstance.IdPaciente = this.IdPaciente;
      })
  
  }


  public v_Eliminar(Fila : iAntecedenteQuirurgico): void
  {

    let dialogo : MatDialogRef<DialogoConfirmarComponent> = this._Dialog.open(DialogoConfirmarComponent, { disableClose: true })

    dialogo.componentInstance.titulo = "Eliminar Registro";
    dialogo.componentInstance.mensaje = "Eliminar";
    dialogo.componentInstance.texto = Fila.Descripcion + " " + Fila.Lugar;

    dialogo.afterClosed().subscribe(s=>{

      if(dialogo.componentInstance.retorno=="1"){
       this._ExpdienteService.EliminarAntecedenteQuirurgico(Fila.IdAntQ);

      }
      
    });
  }

  ngOnInit(): void {



    this.ServerScv.change.subscribe(s => {
    
      if (s instanceof Array) {

        if (s[0] == "CerrarDialog" && s[1] == "frmAntecedenteQuirurgico") {
          this.dialogRef.close();
          this._ExpdienteService.BuscarAntecedenteQuirurgico(this.IdPaciente);
        }

        if(s[0] == "Menu Expediente"){
          this.IdPaciente =  s[1];
          this._ExpdienteService.BuscarAntecedenteQuirurgico(this.IdPaciente);
        }
        if(s[0] == "Cerrar Expediente") 
        {
          this.IdPaciente = 0
          this.dataSource.data.splice(0, this.dataSource.data.length);
        }

       
        
      }
    });


    this._ExpdienteService.change.subscribe(s => {

      if(s[0] == "Llenar_Antecedente_Quirurgico") this.Llenar(s[1] );


    });


    this._ExpdienteService.change.subscribe(

      s => {

        if (s[0] == "dato_Antecedente_Quirurgico_Eliminar") {

          if (s[1] == undefined) {

            let s: string = "{ \"d\":  [{ }],  \"msj\": " + "{\"Codigo\":\"" + 1 + "\",\"Mensaje\":\"" + "error al guardar" + "\"}" + ", \"count\":" + 0 + ", \"esError\":" + 1 + "}";
            let _json = JSON.parse(s);
            this._Dialog.open(DialogoComponent, {
              data: _json["msj"]
            });
            return;
          }


          this._Dialog.open(DialogoComponent, {
            data: s[1]["msj"]
          });
  
          this._ExpdienteService.BuscarAntecedenteQuirurgico(this.IdPaciente);
          
        }


      }
    );



    

    
  }

}