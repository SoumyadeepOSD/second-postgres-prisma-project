import { CheckCircle2Icon } from "lucide-react"

const NotifyEmail = () => {
  return (
    <div>
        <h1>NotifyEmail</h1>
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-xs font-semibold text-blue-500">Verification email has been sent to your registered email</h1>
            <CheckCircle2Icon color="green" height={100} width={100}/>
        </div>
    </div>
  )
}

export default NotifyEmail