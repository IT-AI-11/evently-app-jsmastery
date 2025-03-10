



import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
//import { clerkClient } from '@clerk/nextjs'    original  // теперь clerkClient асинхронный
import { clerkClient } from '@clerk/nextjs/server';// теперь clerkClient асинхронный
import { NextResponse } from 'next/server'

// из endpoints (функции actions как POST, GET, PUT, DELETE)
import { createUser, updateUser, deleteUser } from '@/lib/actions/user.actions'


export async function POST(req: Request) {
    const SIGNING_SECRET = process.env.SIGNING_SECRET

    if (!SIGNING_SECRET) {
        throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env')
    }

    // Create new Svix instance with secret
    const wh = new Webhook(SIGNING_SECRET)

    // Get headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing Svix headers', {
            status: 400,
        })
    }

    // Get body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    let evt: WebhookEvent

    // Verify payload with headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error: Could not verify webhook:', err)
        return new Response('Error: Verification error', {
            status: 400,
        })
    }



    // ЭТА ЧАСТЬ ВАЖНАЯ в ней все прописывается, ВВЕРХУ "поставил и забыл"
    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data
    const eventType = evt.type

    // console.log(`Received webhook with ID ${id} and event type of ${eventType}`)    original
    // console.log('Webhook payload:', body)   original


    //#1 start СОЗДАЕМ пользователя в MongoDB как только этот пользователь был создан в Clerk ==============================
    // пользователь/user создан в Clerk
    if (eventType === 'user.created') {
        // из Clerk созданный user, его данные
        const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

        // формиреум нового пользователя на основе данных пользователя полученных из Clerk
        const user = {
            clerkId: id,
            email: email_addresses[0].email_address,
            username: username!,
            firstName: first_name!,
            lastName: last_name!,
            photo: image_url,
        }
        // создаем нового пользователя через createUser()
         const newUser = await createUser(user); // это Server action, как POST endpoint запрос 
         console.log(newUser)

         const client = await clerkClient();// теперь clerkClient асинхронный нужно await

         if(newUser) {
            await client.users.updateUserMetadata(id, {
              publicMetadata: {
                userId: newUser._id
              }
            })
          }
          return NextResponse.json({ message: 'OK', user: newUser })
        //return new Response('Webhook received', { status: 200 })
    }
    //#1 end создаем пользователя в MongoDB как только этот пользователь был создан в Clerk ==============================


   // Редактируем пользователя в MongoDB как только этот пользователь был редактирован в Clerk
   //#2 start UPDATE пользователя ==============================================
    if (eventType === 'user.updated') {
        const {id, image_url, first_name, last_name, username } = evt.data
    
        const user = {
          firstName: first_name!,
          lastName: last_name!,
          username: username!,
          photo: image_url,
        }
        const updatedUser = await updateUser(id, user)
        return NextResponse.json({ message: 'OK', user: updatedUser })
      }
   //#2 end UPDATE пользователя ==============================================


  // Удаляем пользователя из MongoDB как только этот пользователь был удален в Clerk
  //#3 start DELETE пользователя ==============================================
   if (eventType === 'user.deleted') {
    const { id } = evt.data
    const deletedUser = await deleteUser(id!)
    return NextResponse.json({ message: 'OK', user: deletedUser })
  }
  //#3 end DELETE пользователя ==============================================


return new Response('Webhook received', { status: 200 })

}// export async function POST(req: Request) { 