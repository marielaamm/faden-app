import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/main/shared/service/server.service';
import { iSindromePredominante } from '../../../interface/i-sindromepredominante';

@Component({
  selector: 'app-consensomedico',
  templateUrl: './consensomedico.component.html',
  styleUrls: ['./consensomedico.component.scss']
})
export class ConsensomedicoComponent implements OnInit {

  
  constructor(private ServerScv : ServerService) { }
  public singleSelection(event: any) {
    if (event.added.length) {
        event.newSelection = event.added;
    }
}
   Cerrar() : void{
    
   this.ServerScv.CerrarFormulario();
}

  ngOnInit(): void {
  }

}
