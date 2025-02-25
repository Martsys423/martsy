'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface CreateKeyModalProps {
  onClose: () => void
  onSubmit: (name: string, limit: string, limitEnabled: boolean) => Promise<boolean>
}

export default function CreateKeyModal({ onClose, onSubmit }: CreateKeyModalProps) {
  const [name, setName] = useState('')
  const [limit, setLimit] = useState('1000')
  const [limitEnabled, setLimitEnabled] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSubmit(name, limit, limitEnabled)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Create New API Key</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Key Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for your API key"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Request Limit</Label>
                <div className="text-sm text-gray-500">
                  Enable request limit for this key
                </div>
              </div>
              <Switch
                checked={limitEnabled}
                onCheckedChange={setLimitEnabled}
              />
            </div>

            {limitEnabled && (
              <div>
                <Label htmlFor="limit">Monthly Request Limit</Label>
                <Input
                  id="limit"
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  min="1"
                  required={limitEnabled}
                />
              </div>
            )}

            <div className="flex justify-end gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Key'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 