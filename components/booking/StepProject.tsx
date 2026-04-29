'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/Button'
import type { ServiceCategory } from '@/types'

export interface ProjectFormData {
  name: string
  email: string
  phone: string
  description: string
  photoFiles: File[]
}

interface StepProjectProps {
  category: ServiceCategory | undefined
  initialData: ProjectFormData
  onSubmit: (data: ProjectFormData) => Promise<void>
  onBack: () => void
  isSubmitting: boolean
}

export function StepProject({ category, initialData, onSubmit, onBack, isSubmitting }: StepProjectProps) {
  const [form, setForm] = useState<ProjectFormData>(initialData)
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({})

  const onDrop = useCallback((accepted: File[]) => {
    setForm((prev) => ({ ...prev, photoFiles: [...prev.photoFiles, ...accepted].slice(0, 5) }))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 5,
  })

  function validate(): boolean {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.description.trim()) e.description = 'Please describe your project'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit() {
    if (validate()) onSubmit(form)
  }

  return (
    <div>
      {category && (
        <p className="text-xs text-sage-dark tracking-widest uppercase mb-2">{category.name}</p>
      )}
      <h2 className="text-2xl font-black text-forest mb-8">Tell us about your project</h2>

      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-sm font-semibold text-forest mb-1.5">Your Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Full name"
            className="w-full border border-stone-border rounded px-4 py-3 text-sm focus:outline-none focus:border-forest"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-forest mb-1.5">Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="email@example.com"
            className="w-full border border-stone-border rounded px-4 py-3 text-sm focus:outline-none focus:border-forest"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-forest mb-1.5">
          Phone <span className="font-normal text-sage-dark">(optional)</span>
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          placeholder="(510) 555-0123"
          className="w-full border border-stone-border rounded px-4 py-3 text-sm focus:outline-none focus:border-forest"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-forest mb-1.5">Project Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="Describe what you're looking for — dimensions, materials, style, timeline, budget range..."
          rows={5}
          className="w-full border border-stone-border rounded px-4 py-3 text-sm focus:outline-none focus:border-forest resize-none"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <div className="mb-8">
        <label className="block text-sm font-semibold text-forest mb-1.5">
          Reference Photos <span className="font-normal text-sage-dark">(optional, up to 5)</span>
        </label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-forest bg-stone-mid' : 'border-stone-muted hover:border-sage'
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-sm text-sage-dark">
            {isDragActive ? 'Drop photos here...' : 'Drag & drop photos or '}
            {!isDragActive && <span className="text-forest underline">browse</span>}
          </p>
          <p className="text-xs text-sage-dark mt-1">JPG, PNG, WebP · Max 10MB each</p>
        </div>
        {form.photoFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {form.photoFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-1 bg-stone-mid rounded px-3 py-1">
                <span className="text-xs text-forest">{f.name}</span>
                <button
                  onClick={() => setForm((p) => ({ ...p, photoFiles: p.photoFiles.filter((_, j) => j !== i) }))}
                  className="text-sage-dark hover:text-red-500 text-xs ml-1"
                >✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-sm text-sage-dark hover:text-forest transition-colors">← Back</button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Next: Pick a Time →'}
        </Button>
      </div>
    </div>
  )
}
