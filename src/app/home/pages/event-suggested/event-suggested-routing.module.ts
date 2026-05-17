import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventSuggestedPage } from './event-suggested.page';

const routes: Routes = [
  {
    path: '',
    component: EventSuggestedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventSuggestedPageRoutingModule {}
