import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { fadeInItems } from '@angular/material';
import { AvatarItem, SimpleItem } from '../../github.viewmodel';

@Component({
  selector: 'app-simple-list',
  templateUrl: './simple-list.component.html',
  styleUrls: ['./simple-list.component.scss']
})
export class SimpleListComponent {
  @Input()
  limit;
  @Input()
  items: AvatarItem | SimpleItem [];

  @Output()
  itemSelected = new EventEmitter();

  constructor() { }

  onClicked($event) {
    this.itemSelected.emit($event);
  }
}
