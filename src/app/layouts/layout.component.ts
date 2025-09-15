import { Component, OnInit } from '@angular/core';

import { EventService } from '../core/services/event.service';
import { LAYOUT } from './layout.model';
import { SettingsService } from '../pages/settings/settings.service';
import { Branch } from '../pages/system-users/models';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})

/**
 * Layout Component
 */
export class LayoutComponent implements OnInit {

  branches: Branch[] = [];



  layoutType!: string;

  constructor(private eventService: EventService, private settingsService: SettingsService) { }

  ngOnInit(): void {
    this.layoutType = LAYOUT;

    // listen to event and change the layout, theme, etc
    this.eventService.subscribe('changeLayout', (layout) => {
      this.layoutType = layout;
    });

    // this.getBranches();

  }

  /**
  * Check if the vertical layout is requested
  */
  isVerticalLayoutRequested() {
    return this.layoutType === 'vertical';
  }

  getBranches() {
    this.settingsService.fetchAllBranches().subscribe((data: any) => {
      this.branches = data.data.info;
      sessionStorage.setItem('branches', JSON.stringify(this.branches));
    });
  }

}
