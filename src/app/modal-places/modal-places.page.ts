import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-places',
  templateUrl: './modal-places.page.html',
  styleUrls: ['./modal-places.page.scss'],
})
export class ModalPlacesPage implements OnInit {

  constructor(public modalCtrl      : ModalController) { }

  ngOnInit() {
  }

  async closeModal(){
    await this.modalCtrl.dismiss();
  }

}
