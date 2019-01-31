import { Component, OnInit, Input } from '@angular/core';
import { ItemVM } from '../item.viewmodel';

@Component({
  selector: 'app-business-card',
  templateUrl: './business-card.component.html'
})
export class BusinessCardComponent implements OnInit {

  @Input()
  item: ItemVM;
  
  constructor() { }

  ngOnInit() {
  }

}
