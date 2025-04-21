import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';

@Component({
  selector: 'app-resource-details',
  imports: [MatTabGroup, MatTab, MatTabLabel, MatIcon],
  templateUrl: './resource-details.component.html',
  styleUrl: './resource-details.component.scss',
})
export class ResourceDetailsComponent implements OnInit {
  public constructor() {}

  public ngOnInit(): void {}
}
