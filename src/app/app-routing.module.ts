import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Assignment1Component } from './exercise/assignment1/assignment1.component';
import { Assignment2Component } from './exercise/assignment2/assignment2.component';
import { Assignment3Component } from './exercise/assignment3/assignment3.component';
import { Assignment4Component } from './exercise/assignment4/assignment4.component';
import { Assignment5Component } from './exercise/assignment5/assignment5.component';
import { Assignment6Component } from './exercise/assignment6/assignment6.component';
import { Assignment7Component } from './exercise/assignment7/assignment7.component';
import { CounterComponent } from './exercise/counter/counter.component';
import { LoanFormComponent } from './exercise/loan-form/loan-form.component';
import { TodoListComponent } from './exercise/todo-list/todo-list.component';
import { Intermediate1Component } from './exercise/intermediate1/intermediate1.component';
import { MapLocatorComponent } from './exercise/map-locator/map-locator.component';
import { TestConceptComponent } from './exercise/test-concept/test-concept.component';
import { TestConcept2Component } from './exercise/test-concept2/test-concept2.component';
import { RegExrComponent } from './exercise/reg-exr/reg-exr.component';
import { ShareFacebookComponent } from './exercise/share-facebook/share-facebook.component';

const routes: Routes = [
  { path: 'assignment1', component: Assignment1Component },
  { path: 'assignment2', component: Assignment2Component },
  { path: 'assignment3', component: Assignment3Component },
  { path: 'assignment4', component: Assignment4Component },
  { path: 'assignment5', component: Assignment5Component },
  { path: 'assignment6', component: Assignment6Component },
  { path: 'assignment7', component: Assignment7Component },
  { path: 'assignment8', component: CounterComponent },
  { path: 'assignment9', component: LoanFormComponent },
  { path: 'assignment10', component: TodoListComponent },
  { path: 'assignment11', component: Intermediate1Component },
  { path: 'assignment12', component: MapLocatorComponent },
  { path: 'assignment13', component: TestConceptComponent },
  { path: 'assignment14', component: TestConcept2Component },
  { path: 'assignment15', component: RegExrComponent },
  { path: 'assignment16', component: ShareFacebookComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
