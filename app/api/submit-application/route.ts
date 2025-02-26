import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const applicationData = await request.json()

    const response = await fetch(
      'https://harvest.greenhouse.io/v1/candidates/4280249007/applications',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from('f06b2b153e016f8e7c3632627af56b1d-7:').toString('base64')}`,
          'On-Behalf-Of': '4280249007'
        },
        body: JSON.stringify(applicationData)
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to submit to Greenhouse' }, 
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}