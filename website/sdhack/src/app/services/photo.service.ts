import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
declare var AWS: any;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private http: HttpClient) { }

  api = 'https://cev0pg42c5.execute-api.us-west-2.amazonaws.com/v1';

  getAllUsers(): Observable<any> {
      return this.http.get(this.api + '/getallusers');
  }

  getUsers(key): Observable<any> {
      return this.http.get(this.api + '/getusers?photo=' + key);
  }

  getAllPhotos(): Observable<any> {
      return this.http.get(this.api + '/getphotos');
  }
}
