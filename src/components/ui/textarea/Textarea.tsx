import type { TextareaHTMLAttributes } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string
}

export function Textarea({ name, placeholder, className, ...props }: TextareaProps) {
  return (
    <div className={`flex w-fit items-center rounded-medium bg-input-bg ${className ?? ''}`}>
      <textarea
        className="resize-none px-4 py-2 font-medium text-black placeholder:text-input-text placeholder:select-none focus:outline-0"
        {...props}
        placeholder={placeholder}
        aria-label={name}
        name={name}
      />
    </div>
  )
}

export default Textarea
