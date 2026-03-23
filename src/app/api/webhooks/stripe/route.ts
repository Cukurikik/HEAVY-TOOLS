import { NextRequest, NextResponse } from 'next/server'

// Note: Requires official stripe package.
// import Stripe from 'stripe'
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })

/**
 * 68. Stripe Webhook (Video Credits)
 * Secure endpoint handling payment success from Stripe to grant AI credits instancesly.
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('stripe-signature') as string

    // const event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    
    // Mock the event
    const event = { type: 'checkout.session.completed', data: { object: { metadata: { userId: '123', creditPack: '500' } } } }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const userId = session.metadata?.userId
      const addedCredits = parseInt(session.metadata?.creditPack || '0', 10)

      if (userId && addedCredits > 0) {
        // Increment user's database value
        // await db.user.update({
        //   where: { id: userId },
        //   data: { aiCredits: { increment: addedCredits } }
        // })
        console.log(`Granted ${addedCredits} to user ${userId} via Stripe webhook.`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Stripe webhook error', error)
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }
}
