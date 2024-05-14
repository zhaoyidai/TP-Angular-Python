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

  interventionArr: Intervention[] = [];

  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
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

}
