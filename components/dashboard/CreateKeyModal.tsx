'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface CreateKeyModalProps {
  onClose: () => void
  onSubmit: (name: string, limit: string, limitEnabled: boolean) => Promise<void>
}

export default function CreateKeyModal({ onClose, onSubmit }: CreateKeyModalProps) {
  const [name, setName] = useState('')
  const [monthlyLimit, setMonthlyLimit] = useState('1000')
  const [limitEnabled, setLimitEnabled] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return
    
    try {
      setIsSubmitting(true)
      await onSubmit(name, monthlyLimit, limitEnabled)
      onClose()
    } catch (error) {
      console.error('Error creating key:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New API Key</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
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
              <Label htmlFor="limit-enabled">Enable Monthly Limit</Label>
              <Switch
                id="limit-enabled"
                checked={limitEnabled}
                onCheckedChange={setLimitEnabled}
              />
            </div>
            {limitEnabled && (
              <div>
                <Label htmlFor="monthly-limit">Monthly Request Limit</Label>
                <Input
                  id="monthly-limit"
                  type="number"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(e.target.value)}
                  min="1"
                  required={limitEnabled}
                />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Key'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 