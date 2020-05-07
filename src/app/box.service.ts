import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Box } from './box';
import { Observable } from 'rxjs';
import { Bin } from './bin';
import { Arrangement } from './arrangement';



@Injectable({
  providedIn: 'root'
})

export class BoxService {
  private arrangementsUrl = 'http://packageapp-env.pumdxt3sbe.us-east-1.elasticbeanstalk.com/arrangements/1/';
  public boxes: Box[];
  public boxString: String;
  public arrangement: Arrangement;


  constructor(private http: HttpClient) {}

  getArrangement (): Observable<Arrangement> {
    
    console.log(this.arrangementsUrl)

    return this.http.get<Arrangement>(this.arrangementsUrl);
  }


  addArrangement (bins: Bin[], boxes: Box[]): Observable<Arrangement> {
    boxes.forEach(box => {
      this.boxString =+ box.width.toString()+'x'+box.height.toString()+'x'+box.length.toString()
    });
    console.log(this.boxString)
  

    
    var body = {
      bins: "3x3x3",
      boxes: "1x1x1"
    }
 
    return this.http.post<Arrangement>(this.arrangementsUrl, JSON.stringify(body))
  }



}
