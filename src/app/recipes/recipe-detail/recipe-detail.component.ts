import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;
  constructor(
    private _recipeService: RecipeService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // At the time of loading
    // this.id = this._route.snapshot.params['id'];

    // On each route change
    this._route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.recipe = this._recipeService.getRecipe(this.id);
    });
  }

  toShoppingList(): void {
    /** Instead of directly injecting the Shopping Service inside this component related to Recipe,
     * inject the Recipe service instead and handle the Shopping Service related requirements within
     * the related service i.e. the Recipe service in this case
     */
    this._recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe(): void {
    /** Send relative path since we are already inside /recipes/:id */
    this._router.navigate(['edit'], { relativeTo: this._route });

    // Alternative for passing a different or same ID
    // this._router.navigate(['../', this.id, 'edit'], {relativeTo: this._route});
  }

  onDeleteRecipe(): void {
    this._recipeService.deleteRecipe(this.id);
    // go up one level
    this._router.navigate(['../'], { relativeTo: this._route });
  }
}
