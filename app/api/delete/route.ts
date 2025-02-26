import { NextResponse } from 'next/server'

export async function DELETE() {
  try {
    const CANDIDATE_ID = '41109047007'
    const API_KEY = 'f06b2b153e016f8e7c3632627af56b1d-7'
    const ON_BEHALF_OF = '4280249007'
    
    // Create Base64 encoded credentials
    const base64Credentials = Buffer.from(`${API_KEY}:`).toString('base64')
    
    // Log request details for debugging
    console.log('Request details:', {
      url: `https://harvest.greenhouse.io/v1/candidates/${CANDIDATE_ID}`,
      candidateId: CANDIDATE_ID,
      authHeader: `Basic ${base64Credentials}`,
      onBehalfOf: ON_BEHALF_OF
    })

    const response = await fetch(
      `https://harvest.greenhouse.io/v1/candidates/${CANDIDATE_ID}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Basic ${base64Credentials}`,
          'On-Behalf-Of': ON_BEHALF_OF,
          'Accept': 'application/json'
        }
      }
    )

    // Log full response details
    console.log({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('API Error:', {
        status: response.status,
        error: errorData
      })
      
      return NextResponse.json(
        { 
          error: 'Failed to delete candidate',
          status: response.status,
          details: errorData
        },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        message: `Successfully deleted candidate ${CANDIDATE_ID}` 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}