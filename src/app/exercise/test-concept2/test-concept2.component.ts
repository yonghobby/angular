import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-test-concept2',
  templateUrl: './test-concept2.component.html',
  styleUrls: ['./test-concept2.component.scss']
})
export class TestConcept2Component {
  allBusinesses: any[] = []; 
  selectedBusinesses: any[] = []; 

  dropdownOptions = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 }
  ];

  businessForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.businessForm = this.fb.group({
      selectedBusinesses: this.fb.array([])  // ใช้ FormArray สำหรับจัดการ selectedBusinesses
    });

    this.generateMockData(); 
  }

  generateMockData() {
    const businessTypes = [
      { name: "โรงงานบ่มใบชา", parts: ["ภาค 1", "ภาค 2"] },
      { name: "โรงงานผลิตผลเกษตรกรรม", parts: ["การต้ม นึ่ง หรืออบพืช", "การบด ป่น หรือย่อยพืช"] },
      { name: "โรงงานผลิตหิน กรวด ทราย", parts: ["การโม่ บด หรือย่อยหิน", "การขุดหรือลอกกรวด ทราย"] },
      { name: "โรงงานผลิตหิน กรวด ทราย", parts: ["การโม่ บด หรือย่อยหิน", "การขุดหรือลอกกรวด ทราย"] },
      { name: "โรงงานผลิตหิน กรวด ทราย", parts: ["การโม่ บด หรือย่อยหิน", "การขุดหรือลอกกรวด ทราย"] },
      { name: "โรงงานผลิตหิน กรวด ทราย", parts: ["การโม่ บด หรือย่อยหิน", "การขุดหรือลอกกรวด ทราย"] },
      { name: "โรงงานผลิตหิน กรวด ทราย", parts: ["การโม่ บด หรือย่อยหิน", "การขุดหรือลอกกรวด ทราย"] },
      { name: "โรงงานผลิตหิน กรวด ทราย", parts: ["การโม่ บด หรือย่อยหิน", "การขุดหรือลอกกรวด ทราย"] },
      { name: "โรงงานผลิตหิน กรวด ทราย", parts: ["การโม่ บด หรือย่อยหิน", "การขุดหรือลอกกรวด ทราย"] },
      { name: "โรงงานผลิตหิน กรวด ทราย", parts: ["การโม่ บด หรือย่อยหิน", "การขุดหรือลอกกรวด ทราย"] },
      { name: "โรงงานผลิตหิน กรวด ทราย", parts: ["การโม่ บด หรือย่อยหิน", "การขุดหรือลอกกรวด ทราย"] },
      { name: "โรงงานผลิตหิน กรวด ทราย", parts: ["การโม่ บด หรือย่อยหิน", "การขุดหรือลอกกรวด ทราย"] },
      { name: "โรงงานผลิตหิน กรวด ทราย", parts: ["การโม่ บด หรือย่อยหิน", "การขุดหรือลอกกรวด ทราย"] },
      { name: "โรงงานผลิตหิน กรวด ทราย", parts: ["การโม่ บด หรือย่อยหิน", "การขุดหรือลอกกรวด ทราย"] },
      { name: "โรงงานผลิตหิน กรวด ทราย", parts: ["การโม่ บด หรือย่อยหิน", "การขุดหรือลอกกรวด ทราย"] },
    ];

    businessTypes.forEach((business, index) => {
      this.allBusinesses.push({
        id: index + 1,
        name: business.name,
        businessTypeId: Math.floor(Math.random() * 10) + 1,
        parts: business.parts,
        isExpanded: false, 
        remark: "",
        option: null,
        parentId: null
      });
    });
  }

  // moveToLeft(index: number) {
  //   const business = this.allBusinesses[index];
  //   this.selectedBusinesses.push(business); 
  //     business.parts.forEach((part: string) => {
  //       this.selectedBusinesses.push({ ...business, name: part });
  //     }); 
  //   this.allBusinesses.splice(index, 1); 
  // }
  moveToLeft(index: number) {
    const business = this.allBusinesses[index];
    this.selectedBusinesses.push(business);
  
    // เพิ่มภาคต่าง ๆ ที่เป็นข้อมูลย่อย
    business.parts.forEach((part: string) => {
      this.selectedBusinesses.push({
        ...business,
        name: part,
        parentId: business.id, // ตั้งค่า parentId ให้เป็น id ของ business หลัก
        remark: "", // ค่าหมายเหตุเริ่มต้นเป็นค่าว่าง
        option: null // ค่าตัวเลือกเริ่มต้นเป็น null
      });
    });
  
    this.allBusinesses.splice(index, 1);
  }
  
  moveToRight(index: number) {
    const business = this.selectedBusinesses[index];
    
    // ลบภาคย่อยที่เชื่อมโยงกับ business หลักออกจาก selectedBusinesses
    if (business.parts && business.parts.length > 0) {
      this.selectedBusinesses = this.selectedBusinesses.filter(item => item.parentId !== business.id);
    }
  
    // ย้าย business หลักไปยัง allBusinesses
    this.allBusinesses.push(business);
    this.allBusinesses.sort((a, b) => a.id - b.id);
  
    // ลบ business หลักจาก selectedBusinesses
    this.selectedBusinesses.splice(index, 1);
  }
  

  moveToTop(index: number) {
    const business = this.selectedBusinesses[index];
    this.selectedBusinesses.splice(index, 1);
    this.selectedBusinesses.unshift(business);
  }

  onSubmit() {
    let isValid = true;
    for (let business of this.selectedBusinesses) {
      if (!business.remark.trim()) {
        isValid = false;
        business.remarkError = 'กรุณากรอกหมายเหตุ'; 
      }
      if (!business.option) {
        isValid = false;
        business.optionError = 'กรุณาเลือกตัวเลือก'; 
      }
    }

    if (isValid) {
      console.log(this.selectedBusinesses);
    } else {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }

  onRemarkChange(business: any) {
    if (business.remark.trim()) {
      business.remarkError = ''; 
    }
  }

  onOptionChange(business: any) {
    if (business.option) {
      business.optionError = ''; 
    }
  }

  toggleExpand(index: number) {
    const business = this.allBusinesses[index];
    business.isExpanded = !business.isExpanded;
  
    // if (business.isExpanded) {
    //   this.selectedBusinesses.push(business); 
    //   business.parts.forEach((part: string) => {
    //     this.selectedBusinesses.push({ ...business, name: part });
    //   });
    // } else {
    //   const businessIndex = this.selectedBusinesses.findIndex(b => b.id === business.id);
    //   if (businessIndex !== -1) {
    //     this.selectedBusinesses.splice(businessIndex, 1);
    //   }

    //   business.parts.forEach((part: string) => {
    //     const partIndex = this.selectedBusinesses.findIndex(b => b.name === part);
    //     if (partIndex !== -1) {
    //       this.selectedBusinesses.splice(partIndex, 1);
    //     }
    //   });
    // }
  }

  onDrop(event: any) {
    moveItemInArray(this.selectedBusinesses, event.previousIndex, event.currentIndex);
  }
}
