import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailLaporanPage } from './detail-laporan.page';
import { ImagePopoverComponent } from 'src/app/components/image-popover/image-popover.component';

const routes: Routes = [
  {
    path: '',
    component: DetailLaporanPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailLaporanPage]
})
export class DetailLaporanPageModule {}
