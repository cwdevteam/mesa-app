import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Receive the JSON payload
    const payload = req.body
    console.log('====================================')
    console.log(payload)
    if (
      payload.envelopeStatus &&
      payload.envelopeStatus.status === 'completed'
    ) {
      console.log('Envelope has been completed')
      // Process the event (e.g., update database or send email)
    }

    res.status(200).json({ message: 'Webhook received and processed' })
  } else {
    // Not a POST request
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
