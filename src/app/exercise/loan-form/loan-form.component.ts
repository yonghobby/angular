import { Component } from '@angular/core';

interface Type {
  label: string;
  value: string;
}

@Component({
  selector: 'app-loan-form',
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.css']
})
export class LoanFormComponent {
  borrowerName: string = '';
  principal: number | null = null;
  interestRate: number | null = null; 
  noOfYears: number | null = null; 
  types: Type[] = [];
  selectedTypes: Type | null = null;
  totalInterest: number = 0;
  loans: any[] = [];
  expectedInterestIncome: number = 0;

  constructor() {
    this.types = [
      { label: 'Annually', value: 'Annually' },
      { label: 'Monthly', value: 'Monthly' }
    ];
  }

  // Method to calculate simple interest
  calculateInterest() {
    console.log('Borrower Name:', this.borrowerName);
    console.log('Principal:', this.principal);
    console.log('Interest Rate:', this.interestRate);
    console.log('No. of Years:', this.noOfYears);
    console.log('Selected Types:', this.selectedTypes);

    if (this.principal && this.interestRate && this.noOfYears) {
      let interest = this.principal * (this.interestRate / 100) * this.noOfYears;
      if (this.selectedTypes && this.selectedTypes.value   === 'Monthly') {
        interest = interest * 12; 
      }
      
      this.totalInterest = parseFloat(interest.toFixed(2));

      // Add loan details to the list
      this.loans.push({
        borrowerName: this.borrowerName,
        principal: this.principal,
        interestRate: this.interestRate,
        noOfYears: this.noOfYears,
        totalInterest: this.totalInterest,
        interestType: this.selectedTypes ? this.selectedTypes.value : ''
      });

      console.log('Loan Added:', this.loans);

      this.expectedInterestIncome += this.totalInterest;
      this.resetForm();
    }
  }

  // Reset form fields
  resetForm() {
    this.borrowerName = '';
    this.principal = null;
    this.interestRate = null;
    this.noOfYears = null;
    this.selectedTypes  = null;
  }

  // Remove loan and update expected interest income
  removeLoan(index: number) {
    this.expectedInterestIncome -= this.loans[index].totalInterest;
    this.loans.splice(index, 1);
  }
}
