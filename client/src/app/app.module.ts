import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { loadStripe } from '@stripe/stripe-js';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        FormlyModule.forRoot(),
    ],
})
export class AppModule { }