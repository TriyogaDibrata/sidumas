import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LaporTinjauPage } from './lapor-tinjau.page';

const routes: Routes = [
  {
    path: '',
    component: LaporTinjauPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LaporTinjauPage]
})
export class LaporTinjauPageModule {}
