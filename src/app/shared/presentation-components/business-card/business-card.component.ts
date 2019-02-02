import { Component, OnInit, Input } from '@angular/core';
import { CardItemVM } from './card-item.viewmodel';

@Component({
  selector: 'app-business-card',
  templateUrl: './business-card.component.html'
})
export class BusinessCardComponent implements OnInit {

  @Input()
  item: CardItemVM;
  
  constructor() { }

  ngOnInit() {
  }

}
