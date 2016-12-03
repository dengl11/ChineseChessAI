
import { Injectable} from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
// import 'rxjs/add/operator/map'

@Injectable()
export class ComputeService {

    private computeURL = '/compute/';
    private headers = new Headers({ 'Content-Type': 'application/json' });

    constructor(private http: Http) { }

    launchCompute(state) {
        // console.log("\n-=-=-=-=-=-=-= compute launched -=-=-=-=-=-=-=\n", state);
        return this.http.put(this.computeURL, state)
            .toPromise()
            .then(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        return res.json();
    }
    private handleError(err: Response | any) {
        console.log(err)
    }
}
