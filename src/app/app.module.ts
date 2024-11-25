import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomeComponent } from './core/home/home.component'
import { LoadingComponent } from './core/loading/loading.component'
import { Assignment1Component } from './exercise/assignment1/assignment1.component'
import { Assignment2Component } from './exercise/assignment2/assignment2.component'
import { Assignment3Component } from './exercise/assignment3/assignment3.component'
import { Assignment4Component } from './exercise/assignment4/assignment4.component'
import { Assignment5Component } from './exercise/assignment5/assignment5.component'
import { Assignment6Component } from './exercise/assignment6/assignment6.component'
import { Assignment7Component } from './exercise/assignment7/assignment7.component'
import { CounterComponent } from './exercise/counter/counter.component'
import { LoanFormComponent } from './exercise/loan-form/loan-form.component'
import { TodoListComponent } from './exercise/todo-list/todo-list.component'
import { Intermediate1Component } from './exercise/intermediate1/intermediate1.component';
import { MapLocatorComponent } from './exercise/map-locator/map-locator.component';
import { TestConceptComponent } from './exercise/test-concept/test-concept.component';
import { TestConcept2Component } from './exercise/test-concept2/test-concept2.component';
import { RegExrComponent } from './exercise/reg-exr/reg-exr.component';
import { ShareFacebookComponent } from './exercise/share-facebook/share-facebook.component';
import { PanelModule } from 'primeng/panel'
import { DropdownModule } from 'primeng/dropdown'
import { ButtonModule } from 'primeng/button'
import { TableModule } from 'primeng/table'
import { CheckboxModule } from 'primeng/checkbox'
import { InputTextModule } from 'primeng/inputtext'
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { TreeTableModule } from 'primeng/treetable';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        LoadingComponent,

        Assignment1Component,
        Assignment2Component,
        Assignment3Component,
        Assignment4Component,
        Assignment5Component,
        Assignment6Component,
        Assignment7Component,
        CounterComponent,
        LoanFormComponent,
        TodoListComponent,
        Intermediate1Component,
        MapLocatorComponent,
        TestConceptComponent,
        TestConcept2Component,
        RegExrComponent,
        ShareFacebookComponent,
        
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        DragDropModule,
        FormsModule,
        CheckboxModule,
        ReactiveFormsModule,
        AppRoutingModule,
        PanelModule,
        ButtonModule,
        DropdownModule,
        TableModule,
        InputTextModule,
        InputNumberModule,
        ToastModule,
        CardModule,
        TreeTableModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
