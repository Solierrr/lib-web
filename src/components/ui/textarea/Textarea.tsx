export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  placeholder?: string;

  className?: string;
}


export default function Textarea({ name, placeholder, className, ...props }: TextareaProps) {
  return (
    <div className={`flex w-fit bg-input-bg rounded-medium items-center-safe ${className ?? ""}`}>
      <textarea
        className="w-full min-w-0 bg-transparent px-4 py-2 text-black placeholder:text-input-text placeholder:select-none focus:outline-0 font-medium resize-none input-scrollbar"
        {...props}
        placeholder={placeholder}
        aria-label={props["aria-label"] ?? name}
        name={name}
      />
    </div>
  );
}
