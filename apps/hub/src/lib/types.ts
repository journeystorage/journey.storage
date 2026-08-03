import type { DepartmentSlug } from '@/lib/departments'

export interface HubTask {
  id: string
  title: string
  notes: string | null
  status: 'open' | 'doing' | 'done'
  priority: 'low' | 'normal' | 'high' | null
  due_date: string | null
  department: DepartmentSlug | null
  created_at: string
  updated_at: string
}

export interface HubNote {
  id: string
  title: string
  content: string
  tags: string[]
  department: DepartmentSlug | null
  created_at: string
  updated_at: string
}

export interface HubAiEmployee {
  id: string
  department: DepartmentSlug
  name: string
  role: string
  system_prompt: string
  created_at: string
}

export interface HubChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  employee_id: string | null
  created_at: string
}

export interface HubApiUsage {
  id: string
  employee_id: string | null
  model: string
  input_tokens: number
  output_tokens: number
  cache_creation_input_tokens: number
  cache_read_input_tokens: number
  cost_usd: number
  created_at: string
}

export interface HubInsight {
  id: string
  content: string
  category: 'risk' | 'opportunity' | 'note' | null
  created_at: string
}
