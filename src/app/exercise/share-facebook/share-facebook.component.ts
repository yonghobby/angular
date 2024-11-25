import { Component } from '@angular/core';

@Component({
  selector: 'app-share-facebook',
  templateUrl: './share-facebook.component.html',
  styleUrls: ['./share-facebook.component.scss']
})
export class ShareFacebookComponent {
  shareOnFacebook(): void {
    const url = encodeURIComponent(window.location.href); // ใช้ URL ของหน้าเว็บปัจจุบัน
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    
    // เปิดลิงก์ในแท็บใหม่
    window.open(facebookUrl, '_blank');
  }
}
