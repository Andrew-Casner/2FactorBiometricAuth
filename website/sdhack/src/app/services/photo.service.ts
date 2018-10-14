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

  uploadPhoto(file) {
    AWS.config.region = 'us-west-2';
    AWS.config.accessKeyId = 'AKIAJGRZDIA3AW5G2UFQ';
    AWS.config.secretAccessKey = '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';
    const bucket = new AWS.S3({params: {Bucket: 'sdhack'}});
    const params = {Key: file.name , Body: file};
    let up = bucket.upload(params);
    up.send(function(err, data) { console.log(err, data) });
  }
}
