import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'

import { db } from '@/lib/db'

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('CLERK_WEBHOOK_SECRET missing from .env')
    }

    // Get the headers
    const headerPayload = headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Headers missing svix headers', {
            status: 400
        })
    }

    const payload = await req.json()
    const body = JSON.stringify(payload)


    // Create a new Svix instance with your secret
    const wh = new Webhook(WEBHOOK_SECRET)

    let evt: WebhookEvent 

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id!,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook', err)
        return new Response('Error', {status: 500})
    }

    const { id } = evt.data
    const eventType = evt.type

    console.log({
        uname: payload.data.username,
        test: payload.data.username,
        eUid: payload.data.id,
        iUrl: payload.data.image_url,
    })

    // return new Response('', {status: 200});
    
    if (eventType === 'user.created') {
        await db.user.create({
            data: {
                externalUserId: payload.data.id,
                username: payload.data.username,
                imageUrl: payload.data.image_url
            }
        })
    } else if (eventType === 'user.updated') {
        const currUser = await db.user.findUnique({
            where: {
                externalUserId: payload.data.id
            }
        })

        if (!currUser) {
            return new Response('User not found.', {status: 404})
        }

        await db.user.update({
            where: {
                externalUserId: payload.data.id
            },
            data: {
                imageUrl: payload.data.image_url,
                username: payload.data.username
            }
        })
    } else if (eventType === 'user.deleted') {
        await db.user.delete({
            where: {
                externalUserId: payload.data.id
            }
        })
    }

    return new Response('', {status: 200})
}