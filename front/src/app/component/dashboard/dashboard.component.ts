import { Component, OnInit } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { Intervention } from '../../model/intervention';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  interventionObj:Intervention = new Intervention; // Objet intervention pour add
  interventionArr: Intervention[] = []; // Tableau pour stocker les interventions récupérées
  interventionObjedit:Intervention = new Intervention; // Objet intervention pour edit
  
  // Indicateur pour le tri ascendant/descendant
  sortAscending : boolean = true;
  errorMessage: string = '';
  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
    // Méthode exécutée à l'initialisation du composant
    // Initialisation des objets et du tableau
    this.errorMessage = '';
    this.interventionObj=new Intervention();
    this.interventionArr=[];
    // Récupérer toutes les interventions
    this.getAllIntervention(); 
  }

  // Méthode pour récupérer toutes les interventions
  getAllIntervention() {
    this.errorMessage = '';
    this.crudService.getAllIntervention().subscribe(
      (data: Intervention[]) => {
        this.interventionArr = data; // Assign the received data to the interventionArr array
        // Tri des interventions
        this.sortInterventions();
        

      },
      (error: string) => {
        this.errorMessage = error;
      }
    );
  }

  // Méthode pour supprimer une intervention
  deleteIntervention(eintervention : Intervention) {
    this.errorMessage = '';
    this.crudService.deleteIntervention(eintervention).subscribe(
      res=>{
        // Recharger des interventions après suppression
        this.ngOnInit();
        console.log(res);
      },error=>{
        this.errorMessage = error;
        console.error('Error deleting interventions:', error.error.message);
      }
    )
  }

  // Méthode pour ajouter une intervention
  addIntervention(){
    this.errorMessage = '';
    this.crudService.addIntervention(this.interventionObj).subscribe(
      res=>{
        // Recharger des interventions après ajout
        this.ngOnInit();
        alert(res.message);
      },err =>{
        this.errorMessage = err;
        alert(err.error.message);
      }
    )
  }

  // Méthode pour éditer une intervention
  editIntervention(){
    this.errorMessage = '';
    this.crudService.editIntervention(this.interventionObjedit).subscribe(res=>{
      // Rechargement des interventions après édition
      this.ngOnInit();
      alert(res.message);
    },err=>{
      this.errorMessage = err;
      console.log(err)
      alert("Failed to update");
    })
  } 

  // Méthode pour préparer popup edit
  call(eintervention : Intervention) {
    this.interventionObjedit = eintervention;
    this.sortAscending=!this.sortAscending;
  }
 
  // Méthode pour trier les interventions
  sortInterventions(): void {
    // Trie le tableau interventionArr en fonction de la date d'intervention
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

  isDateBeforeToday(date_intervention: string): boolean {
    // Parse the date string to a Date object
    const interventionDate = this.getDateFromString(date_intervention);
    if (!interventionDate || interventionDate.getTime() === 0) {
      return false;
    }
    // Create a new Date object for today's date
    const today = new Date();
  
    // Set the time parts of today's date to 0 (midnight)
    today.setHours(0, 0, 0, 0);
  
    // Set the time parts of the intervention date to 0 (midnight)
    interventionDate.setHours(0, 0, 0, 0);
  
    // Compare the intervention date with today's date
    return interventionDate < today;
  }

  getBadgeInfo(intervention: Intervention): { text: string, class: string } {
    if (!intervention.libelle || !intervention.description || !intervention.nom_intervenant || !intervention.lieu || !intervention.date_intervention) {
      return { text: 'Brouillon', class: 'text-bg-secondary' };
    }

    
    if (this.isDateBeforeToday(intervention.date_intervention)) {
      return { text: 'Terminé', class: 'text-bg-primary' };
    } else {
      return { text: 'Validé', class: 'text-bg-success' };
    }
  }
  
  
  

}
