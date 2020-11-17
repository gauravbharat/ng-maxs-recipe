import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  /** Empty path is route of every path,
   * only redirect when the full path is empty by adding pathMatch */
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  {
    path: 'recipes',
    loadChildren: () =>
      import('./recipes/recipes.module').then((m) => m.RecipesModule),
  },
  {
    path: 'shopping-list',
    loadChildren: () =>
      import('./shopping-list/shopping-list.module').then(
        (m) => m.ShoppingListModule
      ),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  // Optimize lazy loading: Preload lazy modules, using the {preloadingStrategy: PreloadAllModules} option to the forRoot() method
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
