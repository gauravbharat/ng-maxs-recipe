import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css'],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  private _editedItemIndex: number;
  private _editedItem: Ingredient;
  private _currentIndexSub$: Subscription;
  editMode = false;
  // @ViewChild('nameInput') nameInputRef: ElementRef;
  // @ViewChild('nameAmountInput') amountInputRef: ElementRef;
  @ViewChild('form') _form: NgForm;

  constructor(private _shoppingService: ShoppingService) {}

  ngOnInit(): void {
    this._currentIndexSub$ = this._shoppingService.startedEditing.subscribe(
      (index) => {
        this.editMode = true;
        this._editedItemIndex = index;
        this._editedItem = this._shoppingService.getIngredient(
          this._editedItemIndex
        );
        this._form.setValue({ ...this._editedItem });
      }
    );
  }

  ngOnDestroy() {
    this._currentIndexSub$.unsubscribe();
  }

  onSubmit(): void {
    const ingredient: Ingredient = new Ingredient(
      this._form.value.name,
      this._form.value.amount
    );
    if (this.editMode) {
      this._shoppingService.updateIngredient(this._editedItemIndex, ingredient);
    } else {
      this._shoppingService.addIngredient(ingredient);
    }
    this.onClearItem();
  }

  onDelete(): void {
    this._shoppingService.removeIngredient(this._editedItemIndex);
    this.onClearItem();
  }

  onClearItem(): void {
    this.editMode = false;
    this._editedItemIndex = null;
    this._editedItem = null;
    this._form.reset();
  }
}
