export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      agent_configs: {
        Row: {
          id: string
          tenant_id: string
          name: string
          personality: string | null
          greeting_message: string | null
          services: Json
          negotiation_script: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          name: string
          personality?: string | null
          greeting_message?: string | null
          services?: Json
          negotiation_script?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      service_orders: {
        Row: {
          id: string
          tenant_id: string
          client_name: string | null
          client_phone: string
          service_type: string
          neighborhood: string | null
          status: string
          technician_id: string | null
          visit_date: string | null
          conversation_history: Json
          human_intervention_needed: boolean
          created_at: string
        }
      }
      technicians: {
        Row: {
          id: string
          tenant_id: string
          name: string
          phone: string
          specialty: string
          neighborhoods: string[] | null
          whatsapp_group_id: string | null
          schedule: Json
          active: boolean
        }
      }
    }
  }
}
