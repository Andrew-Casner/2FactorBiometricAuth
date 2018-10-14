import { Component, OnInit } from '@angular/core';
import { PhotoService } from './../services/photo.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  providers: [PhotoService]
})
export class LandingPageComponent implements OnInit {

  constructor(private photoService: PhotoService) { }

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
}
