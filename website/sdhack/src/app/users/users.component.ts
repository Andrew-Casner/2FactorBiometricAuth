import { Component, OnInit } from '@angular/core';
import { PhotoService } from './../services/photo.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [PhotoService]
})
export class UsersComponent implements OnInit {

  users;
  constructor(private photoService: PhotoService) { }

  ngOnInit() {
    this.photoService.getAllUsers().subscribe(data => this.load(data));
  }

  load(data){
    this.users = data.users;
  }
}
