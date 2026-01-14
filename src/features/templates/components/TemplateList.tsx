'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { Template } from '../types'
import { TEMPLATE_VARIABLES } from '../types'

interface TemplateListProps {
  templates: Template[]
}

export function TemplateList({ templates: initialTemplates }: TemplateListProps) {
  const router = useRouter()
  const [templates, setTemplates] = useState(initialTemplates)
  const [isCreating, setIsCreating] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formName, setFormName] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formIsDefault, setFormIsDefault] = useState(false)

  const resetForm = () => {
    setFormName('')
    setFormContent('')
    setFormIsDefault(false)
    setError(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsCreating(true)
  }

  const openEditDialog = (template: Template) => {
    setFormName(template.name)
    setFormContent(template.content)
    setFormIsDefault(template.isDefault)
    setEditingTemplate(template)
    setError(null)
  }

  const handleCreate = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          content: formContent,
          isDefault: formIsDefault,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create template')
      }

      setIsCreating(false)
      resetForm()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingTemplate) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/templates/${editingTemplate.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          content: formContent,
          isDefault: formIsDefault,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update template')
      }

      setEditingTemplate(null)
      resetForm()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const res = await fetch(`/api/templates/${templateId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to delete template')
      }

      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete template')
    }
  }

  const insertVariable = (variable: string) => {
    setFormContent((prev) => prev + variable)
  }

  const TemplateForm = () => (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Template Name</Label>
        <Input
          id="name"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          placeholder="e.g., 1 Day Reminder"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Message Content</Label>
        <Textarea
          id="content"
          value={formContent}
          onChange={(e) => setFormContent(e.target.value)}
          placeholder="Hi {{patientName}}, this is a reminder..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          {formContent.length}/500 characters
        </p>
      </div>

      <div className="space-y-2">
        <Label>Insert Variable</Label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(TEMPLATE_VARIABLES).map(([key, value]) => (
            <Button
              key={key}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertVariable(value)}
            >
              {value}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={formIsDefault}
          onChange={(e) => setFormIsDefault(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 cursor-pointer"
        />
        <Label htmlFor="isDefault" className="font-normal cursor-pointer">
          Set as default template
        </Label>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">SMS Templates</h2>
          <p className="text-muted-foreground">
            Create and manage your reminder message templates
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>Create Template</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Template</DialogTitle>
              <DialogDescription>
                Create a new SMS template for appointment reminders.
              </DialogDescription>
            </DialogHeader>
            <TemplateForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isLoading || !formName || !formContent}>
                {isLoading ? 'Creating...' : 'Create Template'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No templates yet</p>
            <Button onClick={openCreateDialog}>Create your first template</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  {template.isDefault && <Badge variant="secondary">Default</Badge>}
                </div>
                <CardDescription>
                  Available variables: {Object.values(TEMPLATE_VARIABLES).join(', ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm font-mono whitespace-pre-wrap">{template.content}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <Dialog
                    open={editingTemplate?.id === template.id}
                    onOpenChange={(open) => !open && setEditingTemplate(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(template)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Edit Template</DialogTitle>
                        <DialogDescription>
                          Update your SMS template.
                        </DialogDescription>
                      </DialogHeader>
                      <TemplateForm />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdate}
                          disabled={isLoading || !formName || !formContent}
                        >
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
