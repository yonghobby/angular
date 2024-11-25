import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-test-concept',
  templateUrl: './test-concept.component.html',
  styleUrls: ['./test-concept.component.scss']
})
export class TestConceptComponent {
  allGames: any[] = []; 
  selectedGames: any[] = []; 

  dropdownOptions = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
  ];

  gameForm: FormGroup; // ฟอร์มสำหรับตรวจสอบข้อมูล

  constructor(private fb: FormBuilder) {
    this.gameForm = this.fb.group({
      selectedGames: this.fb.array([])  // ใช้ FormArray สำหรับจัดการ selectedGames
    });

    this.generateMockData(); 
  }

  generateMockData() {
    const gameNames = [
      "Black Myth: Wukong",
      "Assassin's Creed Shadows",
      "Helldivers 2",
      "DRAGON BALL Z : Sparkling Zero",
      "Warhammer 40,000: Space Marine 2",
      "Stellar Blade",
      "Yakuza 8 : Infinite Wealth",
      "Metaphor: ReFantazio",
      "Xenoblade Chronicles X",
      "Monster Hunter Wilds",
      "Pokémon Scarlet and Violet",
      "Final Fantasy XVI",
      "Hogwarts Legacy",
      "Resident Evil 4",
      "The Legend of Zelda: Tears of the Kingdom",
      "Street Fighter VI",
      "Baldur's Gate III",
      "Marvel's Spider-Man 2",
      "Armored Core VI: Fires of Rubicon",
      "Cyberpunk 2077: Phantom Liberty"
    ];

    gameNames.forEach((name, index) => {
      this.allGames.push({
        id: index + 1,
        name: name,
        publisherId: Math.floor(Math.random() * 10) + 1,
        isPc: false,
        isPS5XBSX: false,
        isNSwitch: false,
        remark: "",
        option: null // เพิ่มฟิลด์ใหม่สำหรับ dropdown
      });
    });
  }

  moveToLeft(index: number) {
    const game = this.allGames[index];
    this.selectedGames.push(game); 
    this.allGames.splice(index, 1); 
  }

  moveToRight(index: number) {
    const game = this.selectedGames[index];
    this.allGames.push(game);
    this.allGames.sort((a, b) => a.id - b.id);  
    this.selectedGames.splice(index, 1); 
  }

  moveToTop(index: number) {
    const game = this.selectedGames[index];
    this.selectedGames.splice(index, 1);
    this.selectedGames.unshift(game);
  }

  onSubmit() {
    // ตรวจสอบการกรอกหมายเหตุ
    let isValid = true;
    for (let game of this.selectedGames) {
      if (!game.remark.trim()) {
        // ถ้าหมายเหตุว่าง
        isValid = false;
        game.remarkError = 'กรุณากรอกหมายเหตุ'; // หมายเหตุ
      }
      if (!game.option) {
        isValid = false;
        game.optionError = 'กรุณาเลือกตัวเลือก'; // dropdown
      }
    }

    if (isValid) {
      console.log(this.selectedGames);
    } else {
      // แจ้งเตือนว่าไม่สามารถ submit ได้
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }

  onRemarkChange(game: any) {
    if (game.remark.trim()) {
      game.remarkError = ''; 
    }
  }
  
  onOptionChange(game: any) {
    if (game.option) {
      game.optionError = ''; 
    }
  }

  onDrop(event: any) {
    moveItemInArray(this.selectedGames, event.previousIndex, event.currentIndex);
  }
}
