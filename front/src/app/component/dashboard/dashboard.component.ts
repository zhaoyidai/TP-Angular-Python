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
  sortAscending : boolean = true;
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
    // console.log(this.interventionArr);
    // this.sortInterventions();
    // console.log(this.interventionArr);
  }

  getAllIntervention() {
    this.crudService.getAllIntervention().subscribe(
      (data: Intervention[]) => {
        this.interventionArr = data; // Assign the received data to the interventionArr array
        // console.log(this.interventionArr); // Log the received data to the console
        this.sortInterventions();
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
 
  sortInterventions(): void {
    // Toggle the sorting order
    this.sortAscending = !this.sortAscending;
  
    // Sort the interventions array based on the date_intervention property
    this.interventionArr.sort((a, b) => {
      // Parse date strings to Date objects, handling empty dates
      const dateA = a.date_intervention ? this.getDateFromString(a.date_intervention) : new Date(0);
      const dateB = b.date_intervention ? this.getDateFromString(b.date_intervention) : new Date(0);
        
      let result: number;
      if (dateA < dateB) {
        result = -1;
      } else if (dateA > dateB) {
        result = 1;
      } else {
        result = 0;
      }
  
      // Inverse the result if sorting in descending order
      return this.sortAscending ? result : -result;
    });
  }
  
  

  getDateFromString(date_intervention: string): Date {
    // Check if the date string is empty
    if (!date_intervention) {
      return new Date(0); // Return a default value of new Date(0) or another default value as needed
    }
  
    // Split the date string into day, month, and year parts
    const [day, month, year] = date_intervention.split('/').map(Number);
  
    // Create a new Date object using the year, month, and day parts
    // Note: Months are 0-indexed in JavaScript Dates, so we subtract 1 from the month
    return new Date(year, month - 1, day);
  }
  
  

}
