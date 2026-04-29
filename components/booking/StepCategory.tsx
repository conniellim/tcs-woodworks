'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import type { ServiceCategory } from '@/types'

interface StepCategoryProps {
  categories: ServiceCategory[]
  selected: string | null
  onSelect: (id: string) => void
  onNext: () => void
}

export function StepCategory({ categories, selected, onSelect, onNext }: StepCategoryProps) {
  return (
    <div>
      <h2 className="text-2xl font-black text-forest mb-2">What type of work do you need?</h2>
      <p className="text-sage-dark text-sm mb-8">Select a category to get started</p>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`text-left rounded overflow-hidden border-2 transition-all ${
              selected === cat.id
                ? 'border-forest shadow-md'
                : 'border-stone-border hover:border-sage'
            }`}
          >
            <div className="relative aspect-video bg-stone-muted">
              {cat.cover_image_url ? (
                <Image src={cat.cover_image_url} alt={cat.name} fill sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-stone-muted" />
              )}
              {selected === cat.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-forest rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>
            <div className="p-4 bg-stone-mid">
              <p className="font-bold text-forest text-sm">{cat.name}</p>
              <p className="text-xs text-sage-deeper mt-1 line-clamp-2">{cat.description}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selected} variant="primary">
          Next: Describe Your Project →
        </Button>
      </div>
    </div>
  )
}
