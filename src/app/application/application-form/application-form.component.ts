import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatInput} from "@angular/material/input";
import {MatCard} from "@angular/material/card";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatCheckbox} from "@angular/material/checkbox";
import {HeaderComponent, HeaderMenuItem} from "@src/app/shared/components/header/header.component";
import {ActivatedRoute} from "@angular/router";
import {UtilsService} from "@src/app/services/utils.service";
import {MatButton} from "@angular/material/button";

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
    MatCheckbox,
    MatInput,
    HeaderComponent,
    MatButton
  ],
  styleUrls: ['./application-form.component.scss']
})
export class ApplicationFormComponent implements OnInit {
  public isLoginPage = false;
  public headerMenuItems: HeaderMenuItem[] = [];
  public applicationForm: FormGroup;
  public isSubmitted = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private utils: UtilsService) {
    this.applicationForm = this.fb.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      jmbg: ['', [Validators.required, Validators.pattern('^[0-9]{13}$')]],
      nationality: ['', Validators.required],
      reason: ['', Validators.required],
      consent: [false, Validators.requiredTrue]
    });
    this.initializeHeaderMenu();
  }

  ngOnInit(): void {
    this.route.url.subscribe(urlSegment => {
      this.isLoginPage = urlSegment[0]?.path === 'login';
    });
  }

  public onSubmit(): void {
    if (this.applicationForm.valid) {
      this.isSubmitted = true;
      console.log('Form Submitted', this.applicationForm.value);
      // Simulate submission
      setTimeout(() => {
        // Reset or navigate
      }, 2000);
    }
  }

  private initializeHeaderMenu(): void {
    this.headerMenuItems = [
      {
        label: 'SUPPORT',
        action: () => { /* Support action */ }
      },
      {
        label: 'SIGN_UP',
        action: () => this.utils.navigateTo('register')
      },
      {
        label: 'SIGN_IN',
        action: () => this.utils.navigateTo('login')
      }
    ];
  }

  public handleAuthButtonClick(): void {
    if (this.isLoginPage) {
      this.utils.navigateTo('register');
    } else {
      this.utils.navigateTo('login');
    }
  }
}

