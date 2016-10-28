
import { Injectable} from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ServiceCompute {

  private computeURL = '/compute/';

  constructor(private http: Http) { }

  launchCompute() {
    console.log("\n-=-=-=-=-=-=-= compute launched -=-=-=-=-=-=-=\n");
    return this.http.get(this.computeURL)
      .map(this.extractData)
      .catch(this.handleError);
  }


  private extractData(res: Response) {
    let body = res.json();
    // from Julia: has to be parsed to object
    if ((typeof body) == "string") {
      body = JSON.parse(body)
    }
    return body || {};

  }


  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
