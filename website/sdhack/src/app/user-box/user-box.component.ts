import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.css']
})
export class UserBoxComponent implements OnInit {

@Input() nameFull: string;
@Input() img: string;
  constructor() { }

  ngOnInit() {
  }

}
