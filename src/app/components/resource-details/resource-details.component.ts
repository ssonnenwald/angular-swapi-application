import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { PropertiesComponent } from '../properties/properties.component';
import { ResourceDataComponent } from '../resource-data/resource-data.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resource-details',
  imports: [
    MatTabGroup,
    MatTab,
    MatTabLabel,
    MatIcon,
    PropertiesComponent,
    ResourceDataComponent,
  ],
  templateUrl: './resource-details.component.html',
  styleUrl: './resource-details.component.scss',
})
export class ResourceDetailsComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);

  public resources: string[] = [
    'people',
    'films',
    'planets',
    'species',
    'starships',
    'vehicles',
  ];

  public constructor() {}

  public ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const resource: string = params.get('resource') || '';
      const resourceId: string = params.get('id') || '';
    });
  }
}
