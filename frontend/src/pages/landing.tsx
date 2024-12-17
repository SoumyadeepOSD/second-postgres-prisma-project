import { Button } from "@/components/ui/button"
import { useRouter } from "@/hooks/useRouter"

const Landing = () => {
    const router = useRouter();
    const handleStarted = () => router.replace("/login");
    return (
        <div className="flex flex-col h-screen py-20 px-20">
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                    <div className="bg-gradient-to-br from-blue-500 to-pink-500 text-[50px] bg-clip-text text-transparent font-bold flex flex-col items-start">
                        <p className="text-black">Unlease the power of</p>
                        <p><span className="bg-gradient-to-br from-orange-500 to-yellow-300 bg-clip-text text-transparent">Decipline & Consistency</span> <span className="text-black">using</span></p>
                        <p className="bg-gradient-to-br from-blue-700 to-purple-700 text-[50px] bg-clip-text text-transparent">
                            Todo <span className="text-black">application</span>
                        </p>
                    </div>
                    <div className="flex flex-row items-start my-3">
                        <Button variant="default" onClick={handleStarted}>
                            Get started
                        </Button>
                    </div>
                </div>
                <img
                    src="./women-todo.svg"
                    alt="women🍵"
                    height={500}
                    width={500}
                />
            </div>
            <div className="flex flex-col items-center justify-center">
                <a className="text-blue-950 font-semibold text-sm border-2 border-slate-300 rounded-lg p-3 w-fit" href="www.github.com/SoumyadeepOSD">Built by SoumyadeepOSD</a>
            </div>
        </div>
    )
}

export default Landing