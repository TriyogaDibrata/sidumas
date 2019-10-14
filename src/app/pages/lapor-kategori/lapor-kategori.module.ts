import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LaporKategoriPage } from './lapor-kategori.page';

const routes: Routes = [
  {
    path: '',
    component: LaporKategoriPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LaporKategoriPage]
})
export class LaporKategoriPageModule {}
