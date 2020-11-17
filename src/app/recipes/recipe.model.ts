import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
  // name: string;
  // description: string;
  // imagePath: string;

  constructor(
    public name: string,
    public description: string,
    public imagePath: string,
    public ingredients: Ingredient[]
  ) {
    // this.name = name;
    // this.description = desc;
    // this.imagePath = imagePath;
  }
}
