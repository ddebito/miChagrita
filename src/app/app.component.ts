import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { Platform } from "@angular/cdk/platform";
import { DOCUMENT } from "@angular/common";
import { Component, Inject, LOCALE_ID, Renderer2, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { IconsService } from "@shared/services/icons.service";
import { Settings } from "luxon";
import { filter, map } from "rxjs/operators";
import { ConfigName } from "../@vex/interfaces/config-name.model";
import { ConfigService } from "../@vex/services/config.service";
import { NavigationService } from "../@vex/services/navigation.service";
import { Style, StyleService } from "../@vex/services/style.service";
import { AuthService } from "./pages/auth/services/auth.service";

@Component({
  selector: "vex-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],  
})
export class AppComponent {
  title = "vex";
  userName = false;

  constructor(
    private configService: ConfigService,
    private styleService: StyleService,
    private renderer: Renderer2,
    private platform: Platform,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) private localeId: string,
    private route: ActivatedRoute,    
  ) {       

    Settings.defaultLocale = this.localeId;

    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, "is-blink");
    }

    this.configService.updateConfig({
      sidenav: {
        title: "MENÚ",
        imageUrl: "/assets/img/menu.svg",
        showCollapsePin: true,
      },
    });

    this.route.queryParamMap
      .pipe(
        map(
          (queryParamMap) =>
            queryParamMap.has("rtl") &&
            coerceBooleanProperty(queryParamMap.get("rtl"))
        )
      )
      .subscribe((isRtl) => {
        this.document.body.dir = isRtl ? "rtl" : "ltr";
        this.configService.updateConfig({
          rtl: isRtl,
        });
      });

    this.route.queryParamMap
      .pipe(filter((queryParamMap) => queryParamMap.has("layout")))
      .subscribe((queryParamMap) =>
        this.configService.setConfig(queryParamMap.get("layout") as ConfigName)
      );

    this.route.queryParamMap
      .pipe(filter((queryParamMap) => queryParamMap.has("style")))
      .subscribe((queryParamMap) =>
        this.styleService.setStyle(queryParamMap.get("style") as Style)
      );    
  }  
}
