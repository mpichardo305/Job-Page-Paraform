import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ThankYou() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <img 
        src="https://logo.clearbit.com/paraform.com" 
        alt="Company Logo" 
        className="h-24 object-contain mb-8"
      />
      <h1 className="text-2xl font-semibold mb-4">Thank You for Submitting!</h1>
      <p className="text-center text-zinc-600 dark:text-zinc-400 mb-8">
        We have received your application and will review it shortly.
      </p>
      <Link href="/">
        <Button 
          className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
        >
          Return to Homepage
        </Button>
      </Link>
    </div>
  )
}