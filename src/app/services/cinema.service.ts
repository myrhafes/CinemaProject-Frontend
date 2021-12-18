import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CinemaService {
  public host : string = "http://localhost:9090";

  constructor(private httpClient : HttpClient) { }

  public getVilles(){
    return this.httpClient.get(this.host+"/villes");
  }

  public getCinemas(v:any){
    return this.httpClient.get(v._links.cinemas.href);
  }

  public getSalles(c:any){
    return this.httpClient.get(c._links.salles.href);
  }

  public getProjections(salle:any){
    let url = salle._links.projections.href.replace("{?projection}", "");
    return this.httpClient.get(url+"?projection=p1");
  }

  public getPlaces(p:any){
    let url = p._links.tickets.href.replace("{?projection}", "");
    return this.httpClient.get(url+"?projection=t1");
  }

  public payerTickets(dataForm){
    return this.httpClient.post(this.host+"/payerTickets", dataForm);
  }
}
