import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIcon} from "@angular/material/icon";
import {MatFormField} from "@angular/material/input";
import {MatCard} from "@angular/material/card";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatCheckbox} from "@angular/material/checkbox";

@Component({
  selector: 'app-application-form',
  templateUrl: './application-form.component.html',
  imports: [
    MatIcon,
    ReactiveFormsModule,
    MatFormField,
    MatCard,
    MatOption,
    MatSelect,
    MatCheckbox
  ],
  styleUrls: ['./application-form.component.css']
})
export class ApplicationFormComponent implements OnInit {
  applicationForm: FormGroup;
  isSubmitted = false;

  constructor(private fb: FormBuilder) {
    this.applicationForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      jmbg: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
      nationality: ['', Validators.required],
      reason: ['', Validators.required],
      consent: [false, Validators.requiredTrue]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.applicationForm.valid) {
      this.isSubmitted = true;
      console.log('Form Submitted', this.applicationForm.value);
      // Simulate submission
      setTimeout(() => {
        // Reset or navigate
      }, 2000);
    }
  }
}

