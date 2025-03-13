

//#region [rgba(2, 196, 15, 0.2)]

//TODO Server actions(они endpoints) ==> как POST, GET, PUT, DELETE
//TODO + 'use server'

//#endregion


"use server"

//#region [rgba(0, 100, 255, 0.2)]

//import { CreateCategoryParams } from "@/types"
import { CreateCategoryParams } from "@/types"
import { handleError } from "../utils"
import { connectToDatabase } from "../database"
import Category from "../database/models/category.model"

//#endregion


// to components/shared/Dropdown.tsx
export const createCategory = async ({ categoryName }: CreateCategoryParams) => {// : CreateCategoryParams это type для TypeScript
  try {
    await connectToDatabase();

    const newCategory = await Category.create({ name: categoryName });

    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    handleError(error)
  }
}


// to components/shared/Dropdown.tsx
export const getAllCategories = async () => {
  try {
    await connectToDatabase();

    const categories = await Category.find();

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error)
  }
}