import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CinemaService } from 'src/app/services/cinema.service';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {

  villes : any;
  cinemas : any;
  salles : any;
  currentCinema : string =""
  currentVille : string = "";
  currentProjection : any ;
  selectedTickets : any;

  constructor(public cinemaService : CinemaService) { }

  ngOnInit(): void {
    this.cinemaService.getVilles()
        .subscribe(data => {
          this.villes = data;
        }, err => {
          console.log(err);
        })
  }

  onGetCinemas(v:any){
    this.salles = undefined;
    this.cinemaService.getCinemas(v)
        .subscribe(data => {
          this.cinemas = data;
        }, err => {
          console.log(err);
        })   
    this.currentVille = v;    
  }

  onGetSalles(c:any){
    this.cinemaService.getSalles(c)
        .subscribe(data => {
          this.salles = data;
          this.salles._embedded.salles.forEach((salle) => {
            this.cinemaService.getProjections(salle)
                .subscribe(data => {
                  salle.projections = data;
                }, err => {
                  console.log(err);
                })
          });
        }, err => {
          console.log(err);
        })
        this.currentCinema = c;
  }

  onGetTicketPlaces(p:any){
    this.currentProjection = p;
    this.cinemaService.getPlaces(p)
        .subscribe(data => {
          this.currentProjection.tickets = data;
          this.selectedTickets = [];
        }, err => {
          console.log(err);
        })
  }

  onSelectTicket(t:any){
    if(!t.selected){
      t.selected = true;
      this.selectedTickets.push(t);
    }else{
      t.selected = false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t),1);
    }
  }

  getTicketsClass(t:any) : String{
    let str ="btn";
    if(t.reservee){
      str+=" btn-danger"
    }else if(t.selected){
      str+=" btn-warning"
    }else{
      str+=" btn-primary";
    }

    return str;
  }

  onPayTickets(dataForm){
    let tickets = [] as any;
    this.selectedTickets.forEach(t=> {
      tickets.push(t.id);
    })
    dataForm.tickets = tickets;

    this.cinemaService.payerTickets(dataForm)
      .subscribe(data => {
        alert("tickets reserves !");
        this.onGetTicketPlaces(this.currentProjection);
      },err => {
        console.log(err);
      })
  }
}
