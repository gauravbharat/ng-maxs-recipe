import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  private _refreshRecipesSub$: Subscription;

  constructor(
    private _recipeService: RecipeService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.recipes = this._recipeService.getRecipes();
    // console.log(this.recipes);

    this._refreshRecipesSub$ = this._recipeService.refreshRecipes.subscribe(
      (recipes: Recipe[]) => {
        // console.log(recipes);
        this.recipes = recipes;
      }
    );
  }

  ngOnDestroy(): void {
    this._refreshRecipesSub$.unsubscribe();
  }

  onNewRecipe(): void {
    // Use relative route since we are already on '/recipes', hence pass the current route
    this._router.navigate(['new'], { relativeTo: this._route });
  }
}
