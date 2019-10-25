import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.page.html',
  styleUrls: ['./modal-image.page.scss'],
})
export class ModalImagePage implements OnInit {

  image : any;

  constructor(private navParams: NavParams, 
              private modalController: ModalController) { }

  ngOnInit() {
    this.image = this.navParams.get('image');
  }

  closeModal(){
    this.modalController.dismiss();
  }

}
