export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          address: Json | null;
          role: "customer" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          address?: Json | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          address?: Json | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          parent_id: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          parent_id?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          compare_at_price: number | null;
          category_id: string | null;
          images: string[];
          specifications: Json | null;
          stock_quantity: number;
          is_active: boolean;
          is_featured: boolean;
          stripe_price_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          compare_at_price?: number | null;
          category_id?: string | null;
          images?: string[];
          specifications?: Json | null;
          stock_quantity?: number;
          is_active?: boolean;
          is_featured?: boolean;
          stripe_price_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          price?: number;
          compare_at_price?: number | null;
          category_id?: string | null;
          images?: string[];
          specifications?: Json | null;
          stock_quantity?: number;
          is_active?: boolean;
          is_featured?: boolean;
          stripe_price_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
          items: Json;
          subtotal: number;
          shipping_cost: number;
          total: number;
          shipping_address: Json;
          stripe_payment_intent_id: string | null;
          tracking_number: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
          items: Json;
          subtotal: number;
          shipping_cost: number;
          total: number;
          shipping_address: Json;
          stripe_payment_intent_id?: string | null;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
          items?: Json;
          subtotal?: number;
          shipping_cost?: number;
          total?: number;
          shipping_address?: Json;
          stripe_payment_intent_id?: string | null;
          tracking_number?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      repairs: {
        Row: {
          id: string;
          user_id: string;
          status: "pending" | "diagnosed" | "in_progress" | "completed" | "cancelled";
          board_type: string;
          brand: string | null;
          description: string;
          images: string[];
          diagnosis: string | null;
          estimated_cost: number | null;
          final_cost: number | null;
          estimated_completion: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: "pending" | "diagnosed" | "in_progress" | "completed" | "cancelled";
          board_type: string;
          brand?: string | null;
          description: string;
          images?: string[];
          diagnosis?: string | null;
          estimated_cost?: number | null;
          final_cost?: number | null;
          estimated_completion?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: "pending" | "diagnosed" | "in_progress" | "completed" | "cancelled";
          board_type?: string;
          brand?: string | null;
          description?: string;
          images?: string[];
          diagnosis?: string | null;
          estimated_cost?: number | null;
          final_cost?: number | null;
          estimated_completion?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      quotes: {
        Row: {
          id: string;
          user_id: string;
          repair_id: string | null;
          status: "draft" | "sent" | "accepted" | "rejected" | "expired";
          items: Json;
          labor_cost: number;
          parts_cost: number;
          total: number;
          valid_until: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          repair_id?: string | null;
          status?: "draft" | "sent" | "accepted" | "rejected" | "expired";
          items: Json;
          labor_cost: number;
          parts_cost: number;
          total: number;
          valid_until: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          repair_id?: string | null;
          status?: "draft" | "sent" | "accepted" | "rejected" | "expired";
          items?: Json;
          labor_cost?: number;
          parts_cost?: number;
          total?: number;
          valid_until?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          admin_id: string | null;
          subject: string;
          status: "open" | "closed";
          related_order_id: string | null;
          related_repair_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          admin_id?: string | null;
          subject: string;
          status?: "open" | "closed";
          related_order_id?: string | null;
          related_repair_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          admin_id?: string | null;
          subject?: string;
          status?: "open" | "closed";
          related_order_id?: string | null;
          related_repair_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          attachments: string[];
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          attachments?: string[];
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender_id?: string;
          content?: string;
          attachments?: string[];
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string | null;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject?: string | null;
          message: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string | null;
          message?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      repair_requests: {
        Row: {
          id: string;
          brand: string;
          model: string | null;
          description: string;
          urgency: string;
          contact_preference: string;
          phone: string | null;
          email: string;
          location: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          brand: string;
          model?: string | null;
          description: string;
          urgency?: string;
          contact_preference?: string;
          phone?: string | null;
          email: string;
          location?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          brand?: string;
          model?: string | null;
          description?: string;
          urgency?: string;
          contact_preference?: string;
          phone?: string | null;
          email?: string;
          location?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "customer" | "admin";
      order_status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
      repair_status: "pending" | "diagnosed" | "in_progress" | "completed" | "cancelled";
      quote_status: "draft" | "sent" | "accepted" | "rejected" | "expired";
      conversation_status: "open" | "closed";
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Product = Tables<"products">;
export type Category = Tables<"categories">;
export type Order = Tables<"orders">;
export type Repair = Tables<"repairs">;
export type Quote = Tables<"quotes">;
export type Conversation = Tables<"conversations">;
export type Message = Tables<"messages">;
export type Profile = Tables<"profiles">;
