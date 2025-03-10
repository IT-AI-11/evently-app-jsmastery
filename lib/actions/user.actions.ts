

// Server actions(они endpoints) ==> как POST, GET, PUT, DELETE
'use server'

import { connectToDatabase } from "../database"
import { CreateUserParams, UpdateUserParams } from "@/types"// from types/index.ts
import { handleError } from "../utils"
import User from "../database/models/user.model"
import Order from "../database/models/order.model"
import Event from "../database/models/event.model"


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
  export async function updateUser(clerkId: string, user: UpdateUserParams) {
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