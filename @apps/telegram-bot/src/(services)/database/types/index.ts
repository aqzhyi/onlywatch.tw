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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      account: {
        Row: {
          accessToken: string | null
          accessTokenExpiresAt: string | null
          accountId: string
          createdAt: string
          id: string
          idToken: string | null
          password: string | null
          providerId: string
          refreshToken: string | null
          refreshTokenExpiresAt: string | null
          scope: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          accessToken?: string | null
          accessTokenExpiresAt?: string | null
          accountId: string
          createdAt?: string
          id: string
          idToken?: string | null
          password?: string | null
          providerId: string
          refreshToken?: string | null
          refreshTokenExpiresAt?: string | null
          scope?: string | null
          updatedAt: string
          userId: string
        }
        Update: {
          accessToken?: string | null
          accessTokenExpiresAt?: string | null
          accountId?: string
          createdAt?: string
          id?: string
          idToken?: string | null
          password?: string | null
          providerId?: string
          refreshToken?: string | null
          refreshTokenExpiresAt?: string | null
          scope?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_userId_fkey1"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      jin10_events: {
        Row: {
          actual_number: string | null
          consensus_number: string | null
          country: string | null
          display_title: string | null
          id: string
          latest_updated_at: string | null
          previous_number: string | null
          publish_at: string | null
          revised_number: string | null
          unit: string | null
        }
        Insert: {
          actual_number?: string | null
          consensus_number?: string | null
          country?: string | null
          display_title?: string | null
          id: string
          latest_updated_at?: string | null
          previous_number?: string | null
          publish_at?: string | null
          revised_number?: string | null
          unit?: string | null
        }
        Update: {
          actual_number?: string | null
          consensus_number?: string | null
          country?: string | null
          display_title?: string | null
          id?: string
          latest_updated_at?: string | null
          previous_number?: string | null
          publish_at?: string | null
          revised_number?: string | null
          unit?: string | null
        }
        Relationships: []
      }
      session: {
        Row: {
          createdAt: string
          expiresAt: string
          id: string
          impersonatedBy: string | null
          ipAddress: string | null
          token: string
          updatedAt: string
          userAgent: string | null
          userId: string
        }
        Insert: {
          createdAt?: string
          expiresAt: string
          id: string
          impersonatedBy?: string | null
          ipAddress?: string | null
          token: string
          updatedAt: string
          userAgent?: string | null
          userId: string
        }
        Update: {
          createdAt?: string
          expiresAt?: string
          id?: string
          impersonatedBy?: string | null
          ipAddress?: string | null
          token?: string
          updatedAt?: string
          userAgent?: string | null
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_userId_fkey1"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      tg_feeds_observers: {
        Row: {
          created_at: string
          feed_id: number
          id: number
          tg_id: number
        }
        Insert: {
          created_at?: string
          feed_id: number
          id?: number
          tg_id: number
        }
        Update: {
          created_at?: string
          feed_id?: number
          id?: number
          tg_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tg_feeds_subs_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "tg_rss_feeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tg_feeds_subs_tg_id_fkey"
            columns: ["tg_id"]
            isOneToOne: false
            referencedRelation: "tg_observers"
            referencedColumns: ["tg_id"]
          },
        ]
      }
      tg_observers: {
        Row: {
          created_at: string
          id: number
          memo: string | null
          tg_id: number
          tg_username: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          memo?: string | null
          tg_id: number
          tg_username?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          memo?: string | null
          tg_id?: number
          tg_username?: string | null
        }
        Relationships: []
      }
      tg_push_history: {
        Row: {
          error_message: string | null
          id: number
          item_id: number
          pushed_at: string | null
          retry_count: number
          status: string
          tg_id: number
        }
        Insert: {
          error_message?: string | null
          id?: number
          item_id: number
          pushed_at?: string | null
          retry_count?: number
          status?: string
          tg_id: number
        }
        Update: {
          error_message?: string | null
          id?: number
          item_id?: number
          pushed_at?: string | null
          retry_count?: number
          status?: string
          tg_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tg_push_history_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "tg_rss_items"
            referencedColumns: ["id"]
          },
        ]
      }
      tg_rss_feeds: {
        Row: {
          created_at: string
          enabled: boolean
          feed_url: string
          id: number
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          feed_url: string
          id?: number
          title?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          enabled?: boolean
          feed_url?: string
          id?: number
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tg_rssfeeds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      tg_rss_items: {
        Row: {
          created_at: string
          description: string
          feed_id: number
          id: number
          link: string
          pub_date: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          feed_id: number
          id?: number
          link: string
          pub_date: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          feed_id?: number
          id?: number
          link?: string
          pub_date?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tg_rss_news_feed_id_fkey"
            columns: ["feed_id"]
            isOneToOne: false
            referencedRelation: "tg_rss_feeds"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          banExpires: string | null
          banned: boolean | null
          banReason: string | null
          createdAt: string
          email: string
          emailVerified: boolean
          id: string
          image: string | null
          isAnonymous: boolean | null
          name: string
          role: string | null
          updatedAt: string
        }
        Insert: {
          banExpires?: string | null
          banned?: boolean | null
          banReason?: string | null
          createdAt?: string
          email: string
          emailVerified: boolean
          id: string
          image?: string | null
          isAnonymous?: boolean | null
          name: string
          role?: string | null
          updatedAt?: string
        }
        Update: {
          banExpires?: string | null
          banned?: boolean | null
          banReason?: string | null
          createdAt?: string
          email?: string
          emailVerified?: boolean
          id?: string
          image?: string | null
          isAnonymous?: boolean | null
          name?: string
          role?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      verification: {
        Row: {
          createdAt: string
          expiresAt: string
          id: string
          identifier: string
          updatedAt: string
          value: string
        }
        Insert: {
          createdAt?: string
          expiresAt: string
          id: string
          identifier: string
          updatedAt?: string
          value: string
        }
        Update: {
          createdAt?: string
          expiresAt?: string
          id?: string
          identifier?: string
          updatedAt?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_distinct_display_titles: {
        Args: { p_exclude_patterns?: string[]; p_limit?: number }
        Returns: {
          display_title: string
        }[]
      }
    }
    Enums: {
      currency:
        | "USD"
        | "JPY"
        | "AUD"
        | "HKD"
        | "NZD"
        | "CHF"
        | "GBP"
        | "EUR"
        | "TWD"
        | "CNH"
        | "KRW"
        | "CAD"
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
    Enums: {
      currency: [
        "USD",
        "JPY",
        "AUD",
        "HKD",
        "NZD",
        "CHF",
        "GBP",
        "EUR",
        "TWD",
        "CNH",
        "KRW",
        "CAD",
      ],
    },
  },
} as const
