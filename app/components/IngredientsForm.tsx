import React, { useState } from "react";

type Ingredient = { name: string; amount: string };

export default function IngredientsForm() {
  const [ingredient, setIngredient] = useState("");
  const [amount, setAmount] = useState("");
  const [ingredientList, setIngredientList] = useState<Ingredient[]>([]);

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();

    setIngredientList((prev) => [
      ...prev,
      { name: ingredient, amount: amount },
    ]);

    setIngredient("");
    setAmount("");
  };

  const handleRemoveIngredient = (idx: number) => {
    setIngredientList((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <>
      <span className="flex gap-2">
        <p className=" w-2/3">
          <label className="flex flex-col">
            Ingredient
            <input
              className="bg-antiquewhite rounded-sm p-2"
              placeholder="oat milk"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
            />
          </label>
        </p>
        <p className=" w-1/3">
          <label className="flex flex-col">
            Amount
            <input
              className="bg-antiquewhite rounded-sm p-2"
              placeholder="1 cup(s)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
        </p>
        <button
          className="place-self-end my-8 px-2 rounded-sm bg-antiquewhite"
          type="button"
          onClick={(e) => handleAddIngredient(e)}
        >
          +
        </button>
      </span>
      <ul className="grid grid-cols-3 justify-items-center">
        {ingredientList.map((ingredient, idx) => (
          <li key={idx} className="my-2">
            <span>
              {ingredient.amount} {ingredient.name}
            </span>
            <span>
              <button
                className="mx-2 px-2 rounded-sm bg-pink"
                type="button"
                onClick={() => handleRemoveIngredient(idx)}
              >
                x
              </button>
            </span>
          </li>
        ))}
      </ul>

      <input
        type="hidden"
        name="ingredientsJSON"
        value={JSON.stringify(ingredientList)}
      />
    </>
  );
}
