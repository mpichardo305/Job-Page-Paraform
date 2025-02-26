import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Add types for form data
interface FormData {
  firstName: string
  lastName: string
  preferredName?: string
  phone: string
  email: string
  linkedinProfile?: string
  resume?: FileList
  gender?: string
  hispanicLatino?: string
}

interface JobApplicationFormProps {
  defaultValues?: {
    firstName: string
    lastName: string
    preferredName?: string
    phone: string
    email: string
    linkedinProfile?: string
    resume?: FileList
    gender?: string
    hispanicLatino?: string
  }
}

export default function JobApplicationForm({ defaultValues }: JobApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      // Convert resume to base64 if provided
      let resumeAttachment = undefined
      if (data.resume?.[0]) {
        const base64Resume = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(data.resume![0])
          reader.onload = () => resolve(reader.result)
          reader.onerror = error => reject(error)
        })
        
        resumeAttachment = {
          filename: data.resume[0].name,
          type: "resume",
          content: (base64Resume as string).split(',')[1],
          content_type: data.resume[0].type
        }
      }

      // Prepare application payload
      const applicationData = {
        prospect: false,
        job_id: 4285367007,
        source_id: 7,
        attachments: resumeAttachment ? [resumeAttachment] : undefined,
        custom_fields: {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          preferred_name: data.preferredName,
          linkedin_url: data.linkedinProfile,
          gender: data.gender,
          hispanic_latino: data.hispanicLatino
        }
      }

      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to submit application: ${JSON.stringify(errorData)}`)
      }

      alert('Application submitted successfully!')
      
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl mx-auto space-y-8 p-6 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xs rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs">
      <div className="flex items-center justify-center">
        <img 
          src="https://logo.clearbit.com/paraform.com" 
          alt="Company Logo" 
          className="h-24 object-contain"
        />
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName" className="text-zinc-700 dark:text-zinc-300">
              First Name
            </Label>
            <Input
              {...register("firstName", { required: true })}
              id="firstName"
              placeholder="Enter your first name"
              className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName" className="text-zinc-700 dark:text-zinc-300">
              Last Name
            </Label>
            <Input
              {...register("lastName", { required: true })}
              id="lastName"
              placeholder="Enter your last name"
              className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="preferredName" className="text-zinc-700 dark:text-zinc-300">
            Preferred Name
          </Label>
          <Input
            {...register("preferredName")}
            id="preferredName"
            placeholder="Enter your preferred name (optional)"
            className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="phone" className="text-zinc-700 dark:text-zinc-300">
              Phone Number
            </Label>
            <Input
              {...register("phone", { required: true })}
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300">
              Email
            </Label>
            <Input
              {...register("email", { required: true })}
              id="email"
              type="email"
              placeholder="Enter your email"
              className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80"
            />
          </div>
        </div>

        {/* <div className="grid gap-2">
          <Label htmlFor="linkedin" className="text-zinc-700 dark:text-zinc-300">
            LinkedIn Profile
          </Label>
          <Input
            {...register("linkedinProfile")}
            id="linkedin"
            placeholder="Enter your LinkedIn profile URL"
            className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80"
          />
        </div> */}

        <div className="grid gap-2">
          <Label htmlFor="resume" className="text-zinc-700 dark:text-zinc-300">
            Resume
          </Label>
          <Input
            {...register("resume", { required: false })}
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80"
          />
        </div>

        {/* <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="gender" className="text-zinc-700 dark:text-zinc-300">
              Gender
            </Label>
            <Select defaultValue={defaultValues?.gender}>
              <SelectTrigger className="bg-white dark:bg-zinc-900/50">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hispanicLatino" className="text-zinc-700 dark:text-zinc-300">
              Hispanic/Latino
            </Label>
            <Select defaultValue={defaultValues?.hispanicLatino}>
              <SelectTrigger className="bg-white dark:bg-zinc-900/50">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div> */}
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          className="border-zinc-200/80 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </div>
    </form>
  )
}

export async function POST(request: Request) {
  try {
    const applicationData = await request.json()
    console.log('Received application data:', applicationData) // Add this line for debugging
    // ... rest of the code
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

