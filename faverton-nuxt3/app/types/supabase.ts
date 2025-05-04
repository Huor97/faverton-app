export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      alocate: {
        Row: {
          alocate_id: string
          panel_id: string
          profile_id: string | null
        }
        Insert: {
          alocate_id?: string
          panel_id: string
          profile_id?: string | null
        }
        Update: {
          alocate_id?: string
          panel_id?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: `alocate_panel_id_fkey`
            columns: [`panel_id`]
            isOneToOne: false
            referencedRelation: `panel`
            referencedColumns: [`panel_id`]
          },
          {
            foreignKeyName: `alocate_profile_id_fkey`
            columns: [`profile_id`]
            isOneToOne: false
            referencedRelation: `profiles`
            referencedColumns: [`id`]
          },
        ]
      }
      panel: {
        Row: {
          company: string | null
          country: string | null
          detail: string | null
          efficiency: number | null
          model: string
          panel_id: string
          panel_type_id: string | null
        }
        Insert: {
          company?: string | null
          country?: string | null
          detail?: string | null
          efficiency?: number | null
          model: string
          panel_id?: string
          panel_type_id?: string | null
        }
        Update: {
          company?: string | null
          country?: string | null
          detail?: string | null
          efficiency?: number | null
          model?: string
          panel_id?: string
          panel_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: `panel_panel_type_id_fkey`
            columns: [`panel_type_id`]
            isOneToOne: false
            referencedRelation: `panel_type`
            referencedColumns: [`panel_type_id`]
          },
        ]
      }
      panel_type: {
        Row: {
          label: string
          panel_type_id: string
        }
        Insert: {
          label: string
          panel_type_id?: string
        }
        Update: {
          label?: string
          panel_type_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      simulation: {
        Row: {
          history: boolean | null
          panel_id: string | null
          simulation_date: string
          simulation_id: string
          solar_energy_id: string | null
          surface: number | null
          user_id: string | null
        }
        Insert: {
          history?: boolean | null
          panel_id?: string | null
          simulation_date: string
          simulation_id?: string
          solar_energy_id?: string | null
          surface?: number | null
          user_id?: string | null
        }
        Update: {
          history?: boolean | null
          panel_id?: string | null
          simulation_date?: string
          simulation_id?: string
          solar_energy_id?: string | null
          surface?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: `simulation_panel_id_fkey`
            columns: [`panel_id`]
            isOneToOne: false
            referencedRelation: `panel`
            referencedColumns: [`panel_id`]
          },
          {
            foreignKeyName: `simulation_solar_energy_id_fkey`
            columns: [`solar_energy_id`]
            isOneToOne: false
            referencedRelation: `solar_energy`
            referencedColumns: [`solar_energy_id`]
          },
        ]
      }
      solar_energy: {
        Row: {
          city: string | null
          month_1_energy: number | null
          month_10_energy: number | null
          month_11_energy: number | null
          month_12_energy: number | null
          month_2_energy: number | null
          month_3_energy: number | null
          month_4_energy: number | null
          month_5_energy: number | null
          month_6_energy: number | null
          month_7_energy: number | null
          month_8_energy: number | null
          month_9_energy: number | null
          postal_code: string
          solar_energy_id: string
          updated_at: string | null
          yearly_energy: number | null
        }
        Insert: {
          city?: string | null
          month_1_energy?: number | null
          month_10_energy?: number | null
          month_11_energy?: number | null
          month_12_energy?: number | null
          month_2_energy?: number | null
          month_3_energy?: number | null
          month_4_energy?: number | null
          month_5_energy?: number | null
          month_6_energy?: number | null
          month_7_energy?: number | null
          month_8_energy?: number | null
          month_9_energy?: number | null
          postal_code: string
          solar_energy_id?: string
          updated_at?: string | null
          yearly_energy?: number | null
        }
        Update: {
          city?: string | null
          month_1_energy?: number | null
          month_10_energy?: number | null
          month_11_energy?: number | null
          month_12_energy?: number | null
          month_2_energy?: number | null
          month_3_energy?: number | null
          month_4_energy?: number | null
          month_5_energy?: number | null
          month_6_energy?: number | null
          month_7_energy?: number | null
          month_8_energy?: number | null
          month_9_energy?: number | null
          postal_code?: string
          solar_energy_id?: string
          updated_at?: string | null
          yearly_energy?: number | null
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
};

type DefaultSchema = Database[Extract<keyof Database, `public`>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema[`Tables`] & DefaultSchema[`Views`])
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions[`schema`]][`Tables`] &
      Database[DefaultSchemaTableNameOrOptions[`schema`]][`Views`])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions[`schema`]][`Tables`] &
    Database[DefaultSchemaTableNameOrOptions[`schema`]][`Views`])[TableName] extends {
      Row: infer R
    }
      ? R
      : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema[`Tables`] &
    DefaultSchema[`Views`])
    ? (DefaultSchema[`Tables`] &
      DefaultSchema[`Views`])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
        ? R
        : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema[`Tables`]
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions[`schema`]][`Tables`]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions[`schema`]][`Tables`][TableName] extends {
    Insert: infer I
  }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema[`Tables`]
    ? DefaultSchema[`Tables`][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema[`Tables`]
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions[`schema`]][`Tables`]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions[`schema`]][`Tables`][TableName] extends {
    Update: infer U
  }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema[`Tables`]
    ? DefaultSchema[`Tables`][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema[`Enums`]
  | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions[`schema`]][`Enums`]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions[`schema`]][`Enums`][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema[`Enums`]
    ? DefaultSchema[`Enums`][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema[`CompositeTypes`]
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions[`schema`]][`CompositeTypes`]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions[`schema`]][`CompositeTypes`][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema[`CompositeTypes`]
    ? DefaultSchema[`CompositeTypes`][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
