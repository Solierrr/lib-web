import type { MessageAttachment } from './message.js'

export interface User { id: string; name: string }
export interface Message { user: User; message: string; time: Date; attachments?: MessageAttachment[] }
