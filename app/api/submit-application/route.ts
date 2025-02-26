import { NextResponse } from 'next/server'

interface CandidateResponse {
  id: number
  application_id: number
  external_id?: string
  profile_url: string
}

export async function POST(request: Request) {
  try {
    const applicationData = await request.json()
    
    // 1. Create the candidate
    const candidateResponse = await fetch(
      'https://harvest.greenhouse.io/v1/candidates',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from('f06b2b153e016f8e7c3632627af56b1d-7:').toString('base64')}`,
          'On-Behalf-Of': '4280249007'
        },
        body: JSON.stringify({
          first_name: applicationData.candidate_information.first_name,
          last_name: applicationData.candidate_information.last_name,
         email_addresses: [
            {
              "value": applicationData.candidate_information.email,
              "type": "work"
            }
          ],
          phone_numbers: [
            {
              "value": applicationData.candidate_information.phone_numbers,
              "type": "mobile"
            }
          ],
          "applications": [
          {
            "job_id": applicationData.job_id,
          }
        ]
        })
      }
    )

    const candidateData = await candidateResponse.json()
    console.log('Candidate Data:', candidateData)
    if (!candidateResponse.ok) {
      console.error('Failed to create candidate:', candidateData)
      return NextResponse.json(
        { error: 'Failed to create candidate' },
        { status: candidateResponse.status }
      )
    }

    // 2. Submit the application using the new candidate ID
    const applicationResponse = await fetch(
      `https://harvest.greenhouse.io/v1/candidates/${candidateData.id}/applications`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from('f06b2b153e016f8e7c3632627af56b1d-7:').toString('base64')}`,
          'On-Behalf-Of': '4280249007'
        },
        body: JSON.stringify({
          job_id: applicationData.job_id,
          source_id: applicationData.source_id,
          initial_stage_id: applicationData.initial_stage_id,
          referrer: applicationData.referrer
        })
      }
    )

    const applicationResult = await applicationResponse.json()
    
    if (!applicationResponse.ok) {
      console.error('Failed to submit application:', applicationResult)
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: applicationResponse.status }
      )
    }

    // Return combined response with candidate and application data
    return NextResponse.json({
      id: candidateData.id,
      application_id: applicationResult.id,
      profile_url: candidateData.profile_url
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}