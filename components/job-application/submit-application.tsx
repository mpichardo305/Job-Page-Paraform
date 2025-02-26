import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface FormData {
  firstName: string
  lastName: string
  preferredName?: string
  phone: string
  email: string
  linkedinProfile?: string
  resume?: FileList
}

interface JobApplicationFormProps {
  defaultValues?: {
    firstName: string
    lastName: string
    phone: string
    email: string
    linkedinProfile?: string
  }
}

export default function JobApplicationForm({ defaultValues }: JobApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues
  })

  const handleClear = () => {
    reset({
      firstName: '',
      lastName: '',
      preferredName: '',
      phone: '',
      email: '',
      linkedinProfile: '',
      resume: undefined
    })
    const fileInput = document.getElementById('resume') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
    router.push('/')
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      let resumeBase64 = null

      if (data.resume?.[0]) {
        const base64Resume = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(data.resume![0])
          reader.onload = () => resolve(reader.result)
          reader.onerror = error => reject(error)
        })
        
        resumeBase64 = {
          filename: data.resume[0].name,
          type: "resume",
          content: (base64Resume as string).split(',')[1],
          content_type: data.resume[0].type
        }
      }
      
      const applicationData = {
        job_id: 4285367007,           
        candidate_information: {      
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone_numbers: [data.phone],
          custom_fields: {
            linkedin_url: data.linkedinProfile,
          }
        },
        attachment: resumeBase64
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
      router.push('/thank-you')
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
        <div className="grid gap-4">
        <div className="grid text-center">
        <p className="text-zinc-700 dark:text-zinc-300 text-3xl font-semibold">Paraform</p>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <p className="text-zinc-700 dark:text-zinc-300 text-2xl font-semibold flex items-center justify-between w-full">
            Software Engineer <span className="text-zinc-600 dark:text-zinc-400 font-semibold text-base">San Francisco, CA</span>
          </p>
        </div>
        <p className="text-blue-400 dark:text-zinc-200 text-md font-medium">Full-time</p>
      </div>
          <Collapsible open={isAboutOpen} onOpenChange={setIsAboutOpen}>
            <CollapsibleTrigger className="flex items-center gap-1 w-full">
              <p className="text-zinc-700 dark:text-zinc-300 font-semibold">About</p>
              <ChevronDown className={`h-4 w-4 transition-transform ${isAboutOpen ? 'transform rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Recruiting is the highest-leverage action any company can take. Hundreds of billions are spent on staffing and recruiting per year because of how difficult yet critical it is. Hiring the best candidate for any role should take days, not months, and we believe we're best positioned to solve this at scale with our AI-enabled recruiting marketplace.
              </p>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
            <CollapsibleTrigger className="flex items-center gap-1 w-full">
              <p className="text-zinc-700 dark:text-zinc-300 font-semibold">Job Description</p>
              <ChevronDown className={`h-4 w-4 transition-transform ${isDescriptionOpen ? 'transform rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <p className="text-zinc-600 dark:text-zinc-400 text-xs whitespace-pre-line">
                You'll work on high-impact, data-driven projects that optimize recruiter efficiency, improve hiring outcomes, and scale our platform across industries. Key challenges you'll tackle include:

                Intelligent Matching → Build systems to precisely match recruiters to roles and candidates to jobs, optimizing placements with real-time data and AI.

                Growth Engineering → Solve how we acquire every vertical—expanding Paraform's reach and impact while maintaining efficiency at scale.

                Leveraging Unique Data → Harness our proprietary recruiting data to continuously improve matching algorithms, recruiter efficiency, and company hiring processes.

                Upleveling Recruiters → Reduce time-to-value, optimize incentives, and build tools that make recruiters more effective from day one.

                Optimizing the Company Experience → Design a seamless, data-driven hiring process that makes recruiting on Paraform effortless and effective for companies.
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
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

        <div className="grid gap-2">
          <Label htmlFor="linkedin" className="text-zinc-700 dark:text-zinc-300">
            LinkedIn Profile
          </Label>
          <Input
            {...register("linkedinProfile")}
            id="linkedin"
            placeholder="Enter your LinkedIn profile URL"
            className="bg-white dark:bg-zinc-900/50 border-zinc-200/80 dark:border-zinc-800/80"
          />
        </div>

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

      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            handleClear();
          }}
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
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}

