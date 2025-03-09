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
          email: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      simulation: {
        Row: {
          annual_income: number | null
          history: boolean | null
          monthly_income: number | null
          panel_id: string | null
          simulation_date: string
          simulation_id: string
          solar_energy_id: string | null
          user_id: string | null
        }
        Insert: {
          annual_income?: number | null
          history?: boolean | null
          monthly_income?: number | null
          panel_id?: string | null
          simulation_date: string
          simulation_id?: string
          solar_energy_id?: string | null
          user_id?: string | null
        }
        Update: {
          annual_income?: number | null
          history?: boolean | null
          monthly_income?: number | null
          panel_id?: string | null
          simulation_date?: string
          simulation_id?: string
          solar_energy_id?: string | null
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
            referencedColumns: [`solar_energy _id`]
          },
        ]
      }
      solar_energy: {
        Row: {
          "city": string | null
          "month_1_energy": number | null
          "month_10_energy": number | null
          "month_11_energy": number | null
          "month_12_energy": number | null
          "month_2_energy": number | null
          "month_3_energy": number | null
          "month_4_energy": number | null
          "month_5_energy": number | null
          "month_6_energy": number | null
          "month_7_energy": number | null
          "month_8_energy": number | null
          "month_9_energy": number | null
          "postal_code": string
          "solar_energy _id": string
          "yearly_energy": number | null
        }
        Insert: {
          "city"?: string | null
          "month_1_energy"?: number | null
          "month_10_energy"?: number | null
          "month_11_energy"?: number | null
          "month_12_energy"?: number | null
          "month_2_energy"?: number | null
          "month_3_energy"?: number | null
          "month_4_energy"?: number | null
          "month_5_energy"?: number | null
          "month_6_energy"?: number | null
          "month_7_energy"?: number | null
          "month_8_energy"?: number | null
          "month_9_energy"?: number | null
          "postal_code": string
          "solar_energy _id"?: string
          "yearly_energy"?: number | null
        }
        Update: {
          "city"?: string | null
          "month_1_energy"?: number | null
          "month_10_energy"?: number | null
          "month_11_energy"?: number | null
          "month_12_energy"?: number | null
          "month_2_energy"?: number | null
          "month_3_energy"?: number | null
          "month_4_energy"?: number | null
          "month_5_energy"?: number | null
          "month_6_energy"?: number | null
          "month_7_energy"?: number | null
          "month_8_energy"?: number | null
          "month_9_energy"?: number | null
          "postal_code"?: string
          "solar_energy _id"?: string
          "yearly_energy"?: number | null
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

type PublicSchema = Database[Extract<keyof Database, `public`>];

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema[`Tables`] & PublicSchema[`Views`])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions[`schema`]][`Tables`] &
      Database[PublicTableNameOrOptions[`schema`]][`Views`])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions[`schema`]][`Tables`] &
    Database[PublicTableNameOrOptions[`schema`]][`Views`])[TableName] extends {
      Row: infer R
    }
      ? R
      : never
  : PublicTableNameOrOptions extends keyof (PublicSchema[`Tables`] &
    PublicSchema[`Views`])
    ? (PublicSchema[`Tables`] &
      PublicSchema[`Views`])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
        ? R
        : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema[`Tables`]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions[`schema`]][`Tables`]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions[`schema`]][`Tables`][TableName] extends {
    Insert: infer I
  }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema[`Tables`]
    ? PublicSchema[`Tables`][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema[`Tables`]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions[`schema`]][`Tables`]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions[`schema`]][`Tables`][TableName] extends {
    Update: infer U
  }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema[`Tables`]
    ? PublicSchema[`Tables`][PublicTableNameOrOptions] extends {
      Update: infer U
    }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema[`Enums`]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions[`schema`]][`Enums`]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions[`schema`]][`Enums`][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema[`Enums`]
    ? PublicSchema[`Enums`][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof PublicSchema[`CompositeTypes`]
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions[`schema`]][`CompositeTypes`]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions[`schema`]][`CompositeTypes`][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema[`CompositeTypes`]
    ? PublicSchema[`CompositeTypes`][PublicCompositeTypeNameOrOptions]
    : never;
