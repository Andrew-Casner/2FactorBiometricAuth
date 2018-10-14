import { Component, OnInit, Input } from '@angular/core';
import { PhotoService } from './../services/photo.service';

@Component({
  selector: 'app-photo-box',
  templateUrl: './photo-box.component.html',
  styleUrls: ['./photo-box.component.css'],
  providers: [PhotoService]
})
export class PhotoBoxComponent implements OnInit {

@Input() image: string;
@Input() key: string;
users = []
  constructor(private photoService: PhotoService) { }

  ngOnInit() {
    this.photoService.getUsers(this.key).subscribe(data => this.load(data));
  }

  load(data) {
    this.users = data.users;
  }
}
