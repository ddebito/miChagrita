import { group } from "@angular/animations";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IconsService } from "@shared/services/icons.service";
import { IconService } from "@visurel/iconify-angular";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

import { AlertService } from "@shared/services/alert.service";

@Component({
  selector: "vex-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  inputType = "password";
  visible = false;

  icVisibility = IconsService.prototype.getIcon("icVisibility");
  icVisibilityOff = IconsService.prototype.getIcon("icVisibilityOff");

  initForm(): void {
    this.form = this.fb.group({
      email: ["admin@gmail.com", [Validators.required]],
      password: ["201562", [Validators.required]],
    });
  }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private _alert: AlertService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  login(): void {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    this.authService.login(this.form.value, "Interno").subscribe((resp) => {
      if (resp.isSuccess) {
        this.router.navigate(["/"]);                
      }
      else
      {
        this._alert.warn("Atención", resp.message);
      }
    });
  }

  toggleVisibility() {
    if (this.visible) {
      this.inputType = "password";
      this.visible = false;
      this.cd.markForCheck();
    } else {
      this.inputType = "text";
      this.visible = true;
      this.cd.markForCheck();
    }
  }
}