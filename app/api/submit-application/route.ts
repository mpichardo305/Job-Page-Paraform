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
    
    // Create the candidate
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
          social_media_addresses: [
            {
                "value": applicationData.candidate_information.custom_fields.linkedin_url
            }
        ],
        attachments: [
          {
              "filename": "John_Locke_Offer_Packet_09_27_2017.pdf",
              "url": "https://prod-heroku.s3.amazonaws.com/",
              "type": "offer_packet",
              "created_at": "2020-09-27T18:45:27.137Z"
          }
      ],
          applications: [{
            "job_id": applicationData.job_id
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

    // Return only candidate data
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