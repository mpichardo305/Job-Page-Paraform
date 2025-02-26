import { NextResponse } from 'next/server'

interface CandidateResponse {
  id: number
  first_name: string
  last_name: string
  profile_url: string
}

export async function POST(request: Request) {
  try {
    const applicationData = await request.json()
    
    const requestBody: any = {
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
          "value": applicationData.candidate_information.phone_numbers[0],
          "type": "mobile"
        }
      ],
      social_media_addresses: [
        {
          "value": applicationData.candidate_information.custom_fields.linkedin_url
        }
      ],
      applications: [
        {
          "job_id": applicationData.job_id
        }
      ],
    }
    if (applicationData.attachment) {
      requestBody.attachments = [{
        filename: applicationData.attachment.filename,
        type: applicationData.attachment.type,
        content: applicationData.attachment.content,
        content_type: applicationData.attachment.content_type
      }]
    }

    const candidateResponse = await fetch(
      'https://harvest.greenhouse.io/v1/candidates',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from('f06b2b153e016f8e7c3632627af56b1d-7:').toString('base64')}`,
          'On-Behalf-Of': '4280249007'
        },
        body: JSON.stringify(requestBody)
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

    return NextResponse.json({
      id: candidateData.id,
      first_name: candidateData.first_name,
      last_name: candidateData.last_name,
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