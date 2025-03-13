

//#region [rgba(2, 196, 15, 0.2)]

//TODO Server actions(они endpoints) ==> как POST, GET, PUT, DELETE
//TODO + 'use server'

//#endregion


'use server'

//#region [rgba(0, 100, 255, 0.2)]

import { connectToDatabase } from "../database"
import { CreateUserParams, UpdateUserParams } from "@/types"// from types/index.ts
import { handleError } from "../utils"
import User from "../database/models/user.model"
import Order from "../database/models/order.model"
import Event from "../database/models/event.model"

//#endregion


// CREATE user
// создает пользователя/user в MongoDB
// to api/webhook/clerk/route.ts
export async function createUser(user: CreateUserParams) {// CreateUserParams from types/index.ts
    try {
      await connectToDatabase()
  
      const newUser = await User.create(user)
      return JSON.parse(JSON.stringify(newUser))

    } catch (error) {
      // кастомная функция отлова ошибок, она приходит из lib/utils.ts
      handleError(error)
    }
  }



  // UPDATE user
  // to api/webhook/clerk/route.ts
  export async function updateUser(clerkId: string, user: UpdateUserParams) {// : UpdateUserParams это type для TypeScript
    try {
      await connectToDatabase()
  
      const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })
  
      if (!updatedUser) throw new Error('User update failed')
      return JSON.parse(JSON.stringify(updatedUser))
    } catch (error) {
      handleError(error)
    }
  }



  // DELETE user
  // to api/webhook/clerk/route.ts
  export async function deleteUser(clerkId: string) {
    try {
      await connectToDatabase()
  
      // Find user to delete
      const userToDelete = await User.findOne({ clerkId })
  
      if (!userToDelete) {
        throw new Error('User not found')
      }
  
    //   // Unlink relationships
    //   await Promise.all([
    //     // Update the 'events' collection to remove references to the user
    //     Event.updateMany(
    //       { _id: { $in: userToDelete.events } },
    //       { $pull: { organizer: userToDelete._id } }
    //     ),
  
    //     // Update the 'orders' collection to remove references to the user
    //     Order.updateMany({ _id: { $in: userToDelete.orders } }, { $unset: { buyer: 1 } }),
    //   ])
  
      // Delete user
      const deletedUser = await User.findByIdAndDelete(userToDelete._id)
      //revalidatePath('/')
  
      return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null

    } catch (error) {
      handleError(error)
    }
  }






