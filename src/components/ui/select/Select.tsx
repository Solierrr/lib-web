import { useEffect, useRef, useState } from 'react'
import Colors from '../../../shared/styles/colors'
import Icon from '../icon/Icon'
import { MenuItem, MenuList } from '../../overlay/Menu'

export type SelectOption<T = string> = string | readonly [label: string, value: T]

function optionLabel<T>(option: SelectOption<T>) {
  return typeof option === 'string' ? option : option[0]
}

function optionValue<T>(option: SelectOption<T>): T {
  return typeof option === 'string' ? option as unknown as T : option[1]
}

export interface SelectProps<T = string> {
  name: string
  options: SelectOption<T>[]
  value?: T
  defaultValue?: T
  onChange?: (value: T | undefined) => void
  placeholder?: string
  rounded?: boolean
  disabled?: boolean
  className?: string
}

export function Select<T = string>({ name, options, value, defaultValue, onChange, placeholder = 'Selecione uma opção', rounded = false, disabled = false, className }: SelectProps<T>) {
  const [open, setOpen] = useState(false)
  const [internalValue, setInternalValue] = useState<T | undefined>(defaultValue)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedValue = value !== undefined ? value : internalValue
  const selectedOption = options.find((option) => optionValue(option) === selectedValue)

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false)
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  function selectOption(option: SelectOption<T>) {
    const next = optionValue(option)
    setInternalValue(next)
    onChange?.(next)
    setOpen(false)
  }

  function clearSelection(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation()
    setInternalValue(undefined)
    onChange?.(undefined)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative w-fit ${className ?? ''}`}>
      <div
        className={`flex w-full cursor-pointer items-center justify-between gap-8 bg-input-bg py-2 font-medium text-black ${selectedOption ? 'pl-3 pr-4' : 'px-4'} ${disabled ? 'pointer-events-none opacity-50' : ''} ${rounded ? 'rounded-full' : 'rounded-medium'}`}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={name}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-disabled={disabled}
        onClick={() => !disabled && setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setOpen((current) => !current)
          }
        }}>
        <span className="flex items-center gap-2">
          {selectedOption && <button type="button" aria-label="Limpar seleção" onClick={clearSelection} className="flex animate-fade-in"><Icon name="x" color={Colors.INPUTICON} className="cursor-pointer" /></button>}
          <span className={`select-none font-medium ${selectedOption ? '' : 'text-input-text'}`}>{selectedOption ? optionLabel(selectedOption) : placeholder}</span>
        </span>
        <Icon className={`transition-transform ${open ? 'rotate-180' : ''}`} name="chevronDown" color={Colors.INPUTICON} />
      </div>
      {open && (
        <MenuList className="absolute z-10 mt-1 w-full" role="listbox" aria-label={name}>
          {options.map((option, index) => (
            <MenuItem key={index} role="option" selected={optionValue(option) === selectedValue} onSelect={() => selectOption(option)}>
              {optionLabel(option)}
            </MenuItem>
          ))}
        </MenuList>
      )}
    </div>
  )
}

export default Select
