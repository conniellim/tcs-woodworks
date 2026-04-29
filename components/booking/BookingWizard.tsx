'use client'

import { useState } from 'react'
import { StepIndicator } from './StepIndicator'
import { StepCategory } from './StepCategory'
import { StepProject, type ProjectFormData } from './StepProject'
import { StepCalendar } from './StepCalendar'
import type { ServiceCategory } from '@/types'

interface BookingWizardProps {
  categories: ServiceCategory[]
  initialCategoryId?: string
}

export function BookingWizard({ categories, initialCategoryId }: BookingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategoryId ?? null)
  const [projectData, setProjectData] = useState<ProjectFormData>({
    name: '', email: '', phone: '', description: '', photoFiles: [],
  })
  const [draftId, setDraftId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId)

  async function handleProjectSubmit(data: ProjectFormData) {
    setIsSubmitting(true)
    try {
      let photoUrls: string[] = []
      if (data.photoFiles.length > 0) {
        const formData = new FormData()
        data.photoFiles.forEach((f) => formData.append('files', f))
        const uploadRes = await fetch('/api/bookings/upload', { method: 'POST', body: formData })
        const uploadJson = await uploadRes.json()
        photoUrls = uploadJson.urls ?? []
      }

      const draftRes = await fetch('/api/bookings/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: data.name,
          customer_email: data.email,
          customer_phone: data.phone || null,
          service_category_id: selectedCategoryId,
          project_description: data.description,
          photo_urls: photoUrls,
        }),
      })
      const draftJson = await draftRes.json()
      if (!draftJson.draft_id) throw new Error('No draft_id returned')

      setProjectData(data)
      setDraftId(draftJson.draft_id)
      setStep(3)
    } catch (err) {
      console.error('Failed to save project details:', err)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <StepIndicator
        current={step}
        labels={['Select Service', 'Your Project', 'Pick a Time']}
      />
      {step === 1 && (
        <StepCategory
          categories={categories}
          selected={selectedCategoryId}
          onSelect={setSelectedCategoryId}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <StepProject
          category={selectedCategory}
          initialData={projectData}
          onSubmit={handleProjectSubmit}
          onBack={() => setStep(1)}
          isSubmitting={isSubmitting}
        />
      )}
      {step === 3 && draftId && (
        <StepCalendar
          draftId={draftId}
          customerEmail={projectData.email}
          customerName={projectData.name}
        />
      )}
    </div>
  )
}
