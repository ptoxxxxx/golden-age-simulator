export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      games: {
        Row: {
          created_at: string | null
          finished_at: string | null
          id: string
          mode: string | null
          status: string | null
          tempo_custom_config: Json | null
          tempo_profile: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          finished_at?: string | null
          id?: string
          mode?: string | null
          status?: string | null
          tempo_custom_config?: Json | null
          tempo_profile?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          finished_at?: string | null
          id?: string
          mode?: string | null
          status?: string | null
          tempo_custom_config?: Json | null
          tempo_profile?: string | null
          user_id?: string
        }
        Relationships: []
      }
      player_choices: {
        Row: {
          created_at: string | null
          effects: Json | null
          game_id: string
          id: number
          option_id: number | null
          scenario_id: number | null
          turn_number: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          effects?: Json | null
          game_id: string
          id?: number
          option_id?: number | null
          scenario_id?: number | null
          turn_number: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          effects?: Json | null
          game_id?: string
          id?: number
          option_id?: number | null
          scenario_id?: number | null
          turn_number?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_choices_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_choices_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "scenario_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_choices_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      player_states: {
        Row: {
          age: number
          created_at: string | null
          education: string | null
          estimated_pension: number | null
          game_id: string
          happiness: number | null
          health: number | null
          id: number
          insurance_status: string | null
          planned_retirement_age: number | null
          private_investments: number | null
          relationships: number | null
          risk_level: number | null
          salary: number | null
          saldo: number | null
          savings: number | null
          turn_number: number
          zus_account: number | null
          zus_contributions: number | null
          zus_type: string | null
        }
        Insert: {
          age: number
          created_at?: string | null
          education?: string | null
          estimated_pension?: number | null
          game_id: string
          happiness?: number | null
          health?: number | null
          id?: number
          insurance_status?: string | null
          planned_retirement_age?: number | null
          private_investments?: number | null
          relationships?: number | null
          risk_level?: number | null
          salary?: number | null
          saldo?: number | null
          savings?: number | null
          turn_number: number
          zus_account?: number | null
          zus_contributions?: number | null
          zus_type?: string | null
        }
        Update: {
          age?: number
          created_at?: string | null
          education?: string | null
          estimated_pension?: number | null
          game_id?: string
          happiness?: number | null
          health?: number | null
          id?: number
          insurance_status?: string | null
          planned_retirement_age?: number | null
          private_investments?: number | null
          relationships?: number | null
          risk_level?: number | null
          salary?: number | null
          saldo?: number | null
          savings?: number | null
          turn_number?: number
          zus_account?: number | null
          zus_contributions?: number | null
          zus_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "player_states_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      scenario_options: {
        Row: {
          ai_coach_comment: string | null
          ai_coach_comment_pl: string | null
          effects: Json | null
          id: number
          next_scenario_id: number | null
          option_text: string
          option_text_pl: string | null
          scenario_id: number
        }
        Insert: {
          ai_coach_comment?: string | null
          ai_coach_comment_pl?: string | null
          effects?: Json | null
          id?: number
          next_scenario_id?: number | null
          option_text: string
          option_text_pl?: string | null
          scenario_id: number
        }
        Update: {
          ai_coach_comment?: string | null
          ai_coach_comment_pl?: string | null
          effects?: Json | null
          id?: number
          next_scenario_id?: number | null
          option_text?: string
          option_text_pl?: string | null
          scenario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "scenario_options_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "scenarios"
            referencedColumns: ["id"]
          },
        ]
      }
      scenarios: {
        Row: {
          area: string | null
          area_pl: string | null
          created_at: string | null
          id: number
          max_age: number | null
          min_age: number | null
          min_education: string | null
          min_health: number | null
          mode: string | null
          other_conditions: Json | null
          story_prompt: string
          story_prompt_pl: string | null
          tags: string[] | null
        }
        Insert: {
          area?: string | null
          area_pl?: string | null
          created_at?: string | null
          id?: number
          max_age?: number | null
          min_age?: number | null
          min_education?: string | null
          min_health?: number | null
          mode?: string | null
          other_conditions?: Json | null
          story_prompt: string
          story_prompt_pl?: string | null
          tags?: string[] | null
        }
        Update: {
          area?: string | null
          area_pl?: string | null
          created_at?: string | null
          id?: number
          max_age?: number | null
          min_age?: number | null
          min_education?: string | null
          min_health?: number | null
          mode?: string | null
          other_conditions?: Json | null
          story_prompt?: string
          story_prompt_pl?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      user_avatars: {
        Row: {
          age_group: number | null
          avatar_url: string | null
          background: string | null
          created_at: string | null
          extra_params: Json | null
          id: number
          mood: string | null
          user_id: string
        }
        Insert: {
          age_group?: number | null
          avatar_url?: string | null
          background?: string | null
          created_at?: string | null
          extra_params?: Json | null
          id?: number
          mood?: string | null
          user_id: string
        }
        Update: {
          age_group?: number | null
          avatar_url?: string | null
          background?: string | null
          created_at?: string | null
          extra_params?: Json | null
          id?: number
          mood?: string | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          nickname: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          nickname?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          nickname?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
