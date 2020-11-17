import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent {
  // private _recipeSelectedSub$: Subscription;
  // selectedRecipe: Recipe;
  // constructor(private _recipeService: RecipeService) {}
  // ngOnInit(): void {
  //   this._recipeSelectedSub$ = this._recipeService.recipeSelected.subscribe(
  //     (recipe: Recipe) => (this.selectedRecipe = recipe)
  //   );
  // }
  // ngOnDestroy() {
  //   this._recipeSelectedSub$.unsubscribe();
  // }
}
