import { GRADIENTS } from "@/lib/constants"
import { Button } from "@/components/ui/Button"

export function PlanCard() {
  return (
    <div className={`rounded-3xl p-8 ${GRADIENTS.primary} text-white`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-medium mb-2">CURRENT PLAN</h3>
          <h2 className="text-3xl font-bold mb-4">Researcher</h2>
          <div>
            <h4 className="text-sm font-medium mb-2">API Limit</h4>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white rounded-full h-2 w-[35%]" />
            </div>
            <p className="text-sm mt-2">35/1,000 Requests</p>
          </div>
        </div>
        <Button 
          className="bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2"
        >
          Manage Plan
        </Button>
      </div>
    </div>
  )
} 