'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Plus } from 'lucide-react'

interface ColorPickerProps {
  selectedColors: string[]
  onColorsChange: (colors: string[]) => void
  maxColors?: number
}

const presetColors = [
  '#3B82F6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
  '#F97316',
  '#6366F1',
  '#14B8A6',
  '#F43F5E',
  '#000000',
  '#FFFFFF',
  '#6B7280',
  '#374151',
  '#1F2937',
  '#111827',
]

export function ColorPicker({
  selectedColors,
  onColorsChange,
  maxColors = 4,
}: ColorPickerProps) {
  const t = useTranslations('colorPicker')
  const [customColor, setCustomColor] = useState('#3B82F6')

  const addColor = (color: string) => {
    if (selectedColors.length < maxColors && !selectedColors.includes(color)) {
      onColorsChange([...selectedColors, color])
    }
  }

  const removeColor = (colorToRemove: string) => {
    onColorsChange(selectedColors.filter((color) => color !== colorToRemove))
  }

  const addCustomColor = () => {
    addColor(customColor)
  }

  return (
    <div className="space-y-4">
      <Label className="text-slate-700">
        {t('customColors')} ({selectedColors.length}/{maxColors})
      </Label>

      {/* Couleurs sélectionnées */}
      <div className="flex flex-wrap gap-2">
        {selectedColors.map((color, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => removeColor(color)}
          >
            <div
              className="w-10 h-10 rounded-lg border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-200"
              style={{ backgroundColor: color }}
            />
            <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <span className="text-white text-xs">×</span>
            </div>
          </div>
        ))}

        {/* Bouton d'ajout */}
        {selectedColors.length < maxColors && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0 border-2 border-dashed border-slate-300 hover:border-blue-400 bg-transparent"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">
                    {t('presetColors')}
                  </Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => addColor(color)}
                        className="w-8 h-8 rounded border-2 border-white shadow-sm hover:scale-110 transition-transform duration-200"
                        style={{ backgroundColor: color }}
                        disabled={selectedColors.includes(color)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    {t('customColor')}
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-12 h-8 p-0 border-0"
                    />
                    <Input
                      type="text"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      placeholder="#3B82F6"
                      className="flex-1 text-sm"
                    />
                    <Button size="sm" onClick={addCustomColor}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )
}
