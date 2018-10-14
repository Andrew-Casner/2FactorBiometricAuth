import { Component, OnInit } from '@angular/core';
import { PhotoService } from './../services/photo.service';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  providers: [PhotoService]
})
export class LandingPageComponent implements OnInit {

file;
  constructor(private photoService: PhotoService, private http: HttpClient) { }

  photos;

  ngOnInit() {
    this.photoService.getAllPhotos().subscribe(data => this.load(data));
  }

  load(data){
    this.photos = data.photos;
  }

  fileSelect(event) {
    this.file = event.target.files[0];
  }

  upload(event) {
    this.photoService.uploadPhoto(this.file);
  }

  send() {
    console.log("Sending Consent Forms");
    this.photoService.getUserImageMatches('drew').subscribe(data => this.save(data));
    this.photoService.getUserImageMatches('nick').subscribe(data => this.save(data));
  }

  save(data) { 
  console.log(data.name);
    if ( data.name == 'drew' ){
        let payload = {
        'fullName': 'Drew Casner',
        'email': 'anca0444@colorado.edu',
        'TaggedIms': data.matches,
        'bucket': 'sdhack'
        }
        this.http.post('http://localhost:8080/sendDocument', payload).subscribe(data => this.sendDoc(data, 0));
    }
    else{
        let payload = {
        'fullName': 'Nick Erokhin',
        'email': 'nier7172@colorado.edu',
        'TaggedIms': data.matches,
        'bucket': 'sdhack'
        }
        this.http.post('http://localhost:8080/sendDocument', payload).subscribe(data => this.sendDoc(data, 0));
    }
  }

  sendDoc(data, itr) {
  console.log(data);
    if ( data.name === 'Drew Casner' ){
        let call = 'http://localhost:8080/getEnvelopeStatus?envelopeId=' + data.envelopeId;
        console.log(call);
        this.http.get(call).subscribe(data => this.finalSet(data, 'Drew Casner'));
    }
    else{ 
        let call = 'http://localhost:8080/getEnvelopeStatus?envelopeId=' + data.envelopeId;
        console.log(call);
        this.http.get(call).subscribe(data => this.finalSet(data, 'Nick Erohin'));
    }
  }

  finalSet(data, name) {
    console.log(name)
    console.log(data)
  }

}
