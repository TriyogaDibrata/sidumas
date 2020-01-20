import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-walkthrough',
  templateUrl: './walkthrough.page.html',
  styleUrls: ['./walkthrough.page.scss'],
})
export class WalkthroughPage implements OnInit {

  @ViewChild('wtslides', {static: false}) slides : IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    allowSlidePrev: true,
    allowSlideNext: true,
  };

  disablePrevBtn = true;
  disableNextBtn = false;

  constructor(private storage   : Storage,
              private router    : Router
             ) { }

  ngOnInit() {
  }

  async finish(){
    await this.storage.set('walkthroughComplete', true);
    this.router.navigateByUrl('/');
  }
  
  nextSlide(){
    this.slides.slideNext();
  }

  prevSlide(){
    this.slides.slidePrev();
  }

  doCheck() {
    let prom1 = this.slides.isBeginning();
    let prom2 = this.slides.isEnd();
  
    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? this.disablePrevBtn = true : this.disablePrevBtn = false;
      data[1] ? this.disableNextBtn = true : this.disableNextBtn = false;
    });
  }

}