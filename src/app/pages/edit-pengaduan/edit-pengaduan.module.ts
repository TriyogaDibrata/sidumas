import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditPengaduanPage } from './edit-pengaduan.page';

const routes: Routes = [
  {
    path: '',
    component: EditPengaduanPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditPengaduanPage]
})
export class EditPengaduanPageModule {}
