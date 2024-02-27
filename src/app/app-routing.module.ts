import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule } from "@angular/router";
import { VexRoutes } from "src/@vex/interfaces/vex-route.interface";
import { CustomLayoutComponent } from "./custom-layout/custom-layout.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { AuthGuard } from "@shared/guards/auth.guard";
import { AdminGuard } from "@shared/guards/admin.guard";

const childrenRoutes: VexRoutes = [
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home/home.module").then(
        (m) => m.HomeModule
      ),
    data: {
      containerEnabled: true,      
    },
  },
  {
    path: "tienda",
    loadChildren: () =>
      import("./pages/shop/shop.module").then(
        (m) => m.ShopModule
      ),
    data: {
      containerEnabled: true,      
    },
  },
  {
    path: "categorias",
    loadChildren: () =>
      import("./pages/category/category.module").then((m) => m.CategoryModule),
    data: {
      containerEnabled: true,
    },
    canActivate: [AdminGuard],
  },
  {
    path: "proveedores",
    loadChildren: () =>
      import("./pages/provider/provider.module").then((m) => m.ProviderModule),
      canActivate: [AdminGuard],
  },
  {
    path: "almacenes",
    loadChildren: () =>
      import("./pages/warehouse/warehouse.module").then(
        (m) => m.WarehouseModule
      ),
      canActivate: [AdminGuard],
  },
  {
    path: "productos",
    loadChildren: () =>
      import("./pages/product/product.module").then((m) => m.ProductModule),
      canActivate: [AdminGuard],
  },
  {
    path: "proceso-compras",
    loadChildren: () =>
      import("./pages/purcharse/purcharse.module").then((m) => m.PurcharseModule),
      canActivate: [AdminGuard],
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];

const routes: VexRoutes = [
  // {
  //   path: "",
  //   redirectTo: "estadisticas",
  //   pathMatch: "full",
  // },
  {
       path: "",
       redirectTo: "home",
       pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () =>
      import("./pages/auth/auth.module").then((m) => m.AuthModule),
    data: {
      containerEnabled: true,
    },
  },
  {
    path: "",
    component: CustomLayoutComponent,
    children: childrenRoutes,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      scrollPositionRestoration: "enabled",
      relativeLinkResolution: "corrected",
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
