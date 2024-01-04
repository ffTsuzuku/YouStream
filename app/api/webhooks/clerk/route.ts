import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'


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

    console.log({
        svix_id,
        svix_timestamp,
        svix_signature
    })
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

    console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
    console.log('Webhook body', body)

    return new Response('', {status: 200})
}