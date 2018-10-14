import { Component, OnInit } from '@angular/core';
import { PhotoService } from './../services/photo.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [PhotoService]
})
export class HeaderComponent implements OnInit {

  constructor(private photoService: PhotoService) { }

  ngOnInit() {
  }

  sendForms(){
    this.photoService.getUserImageMatches('drew').subscribe(data => this.load(data));
    this.photoService.getUserImageMatches('nick').subscribe(data => this.load(data));
  }

  load(data) {  }
}
