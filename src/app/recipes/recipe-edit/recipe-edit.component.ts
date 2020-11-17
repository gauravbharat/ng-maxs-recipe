import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  private _recipe: Recipe;

  constructor(
    private _route: ActivatedRoute,
    private _recipeService: RecipeService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._route.params.subscribe((params: Params) => {
      this.editMode = params['id'] != null;
      if (this.editMode) {
        this.id = +params['id'];
        this._recipe = this._recipeService.getRecipe(this.id);
      }
      this._initForm();
    });
  }

  onSubmit(): void {
    const newRecipe = new Recipe(
      this.recipeForm.value['name'],
      this.recipeForm.value['description'],
      this.recipeForm.value['imagePath'],
      this.recipeForm.value['ingredients']
    );
    if (this.editMode) {
      this._recipeService.updateRecipe(this.id, newRecipe);
    } else {
      this._recipeService.addRecipe(newRecipe);
    }

    this.onCancel();
  }

  onCancel(): void {
    // Go up one level
    this.recipeForm.reset();
    this._router.navigate(['../'], { relativeTo: this._route });
  }

  private _initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    // FormArray should be initialized with a default value of an empty array
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      recipeName = this._recipe.name;
      recipeImagePath = this._recipe.imagePath;
      recipeDescription = this._recipe.description;
      if (this._recipe['ingredients']) {
        for (let ingredient of this._recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/),
              ]),
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }

  get controls() {
    // a getter!
    // .controls won't be an accessible prop in a regular array, cast it to formarray
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onDeleteIngredient(index: number): void {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
