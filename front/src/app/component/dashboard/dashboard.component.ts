import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { Intervention } from '../../model/intervention'; // imported the Intervention model
import { error } from 'console';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  interventionObj:Intervention = new Intervention;
  interventionArr: Intervention[] = [];

  addLibelleValue : string = '';
  editLibelleValue : string = '';
  addDescriptionValue : string = '';
  editDescriptionValue : string = '';
  addNom_intervenantValue : string = '';
  editNom_intervenantValue : string = '';
  addLieuValue : string = '';
  editLieuValue : string = '';
  addDateValue : string = '';
  editDateValue : string = '';

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
    this.addLibelleValue = '';
    this.editLibelleValue = '';
    this.addDescriptionValue = '';
    this.editDescriptionValue = '';
    this.addNom_intervenantValue = '';
    this.editNom_intervenantValue = '';
    this.addLieuValue = '';
    this.editLieuValue = '';
    this.addDateValue = '';
    this.editDateValue = '';
    this.interventionObj=new Intervention();
    this.interventionArr=[];
    this.getAllIntervention(); // Call the method to fetch interventions when component initializes
  }

  getAllIntervention() {
    this.crudService.getAllIntervention().subscribe(
      (data: Intervention[]) => {
        this.interventionArr = data; // Assign the received data to the interventionArr array
        // console.log(this.interventionArr); // Log the received data to the console
      },
      error => {
        console.error('Error fetching interventions:', error); // Log any errors to the console
      }
    );
  }

  deleteIntervention(eintervention : Intervention) {
    this.crudService.deleteIntervention(eintervention).subscribe(
      res=>{
        this.ngOnInit();
        console.log(res);
      },error=>{
        
        console.error('Error fetching interventions:', error);
      }
    )
  }

  addIntervention(){
    this.interventionObj.libelle = this.addLibelleValue;
    this.interventionObj.description = this.addDescriptionValue;
    this.interventionObj.nom_intervenant = this.addNom_intervenantValue;
    this.interventionObj.lieu = this.addLieuValue;
    this.interventionObj.date_intervention = this.addDateValue;
    this.crudService.addIntervention(this.interventionObj).subscribe(
      res=>{
        this.ngOnInit();
        this.addLibelleValue = '';
        this.addDescriptionValue = '';
        this.addNom_intervenantValue = '';
        this.addLieuValue = '';
        this.addDateValue = '';
        // console.log(res);
      },err =>{
        alert(err.name);
      }
    )
  }

  editIntervention(){
    this.interventionObj.libelle = this.editLibelleValue;
    this.interventionObj.description = this.editDescriptionValue;
    this.interventionObj.nom_intervenant = this.editNom_intervenantValue;
    this.interventionObj.lieu = this.editLieuValue;
    this.interventionObj.date_intervention = this.editDateValue;
    this.crudService.editIntervention(this.interventionObj).subscribe(res=>{
      this.ngOnInit();
    },err=>{
      alert("Failed to update");
    })
  } 

  call(eintervention : Intervention) {
    this.interventionObj = eintervention;
    this.editLibelleValue =eintervention.libelle;
    this.editDescriptionValue = eintervention.description;
    this.editNom_intervenantValue = eintervention.nom_intervenant;
    this.editLieuValue = eintervention.lieu;
    this.editDateValue = eintervention.date_intervention;
  }
 
 

}
