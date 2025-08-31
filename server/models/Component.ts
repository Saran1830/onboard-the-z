
import { supabaseServerClient } from "../utils/supabase/serverClient";
import {
  CustomComponent,
  PageConfig,
  ComponentType,
  COMPONENT_TYPES,
} from "../../src/types/components";

// Shape coming from Supabase (type is string in the DB)
type DbCustomComponent = Omit<CustomComponent, "type"> & { type: string };

function toCustomComponent(row: DbCustomComponent): CustomComponent {
  // Validate & coerce DB string -> union
  if (!COMPONENT_TYPES.includes(row.type as ComponentType)) {
    throw new Error(`Invalid component type from DB: ${row.type}`);
  }
  return { ...row, type: row.type as ComponentType };
}

export class ComponentModel {
  private supabase = supabaseServerClient();
    async getAllCustomComponents(): Promise<CustomComponent[] > {
        try {
            const { data, error } = await this.supabase
                .from("custom_components")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error in fetching all custom components:", error);
                return [];
            }

            const rows = (data ?? []) as DbCustomComponent[];
            return rows.map(toCustomComponent);
        } catch (error) {
        console.error("Error fetching all custom components:", error);
        return [];
        }
    }

    async createCustomComponent(component: {
        name: string
        label: string
        type: ComponentType
        required: boolean
        placeholder: string
        options: string[] | null
    }): Promise<{ success: boolean; error?: string; data?: CustomComponent }> {
        try {
            // Validate component name
            if (!component.name || !/^[a-z_]+$/.test(component.name)) {
                return {
                    success: false,
                    error: 'Component name must contain only lowercase letters and underscores'
                }
            }

            // Check if component name already exists
            const { data: existing } = await this.supabase
                .from('custom_components')
                .select('name')
                .eq('name', component.name)
                .single()

            if (existing) {
                return {
                    success: false,
                    error: 'Component name already exists'
                }
            }

            const { data, error } = await this.supabase
                .from('custom_components')
                .insert([component])
                .select()
                .single()

            if (error || !data) {
                return {
                    success: false,
                    error: error?.message || 'Failed to create component'
                }
            }

        return {
        success: true,
        data
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create component";
      console.error("Error creating custom component:", err);
      return { success: false, error: errorMessage };
    }
}

    async getAllPageConfigs(): Promise<PageConfig[]> {
        try {
            const { data, error } = await this.supabase
                .from("page_components")
                .select("*")
                .order("page");

            if (error) {
                console.error("Error in fetching all page configs:", error);
                return [];
            }

            return data || [];
        } catch (error) {
            console.error("Error fetching all page configs:", error);
            return [];
        }
    }

    async updatePageConfig(page:number , components:string[]): Promise<{ success: boolean; error?: string }> {
        try {
            // Business rule: Pages 2 and 3 must have at least one component
            if ((page === 2 || page === 3) && components.length === 0) {
                return { success: false, error: "Pages 2 and 3 must have at least one component" };
            }
            // Validate that all components exist
      if (components.length > 0) {
        const { data: existingComponents } = await this.supabase
          .from("custom_components")
          .select("name");

        const existingNames = existingComponents?.map((c) => c.name) || [];
        const invalidComponents = components.filter(
          (name) => !existingNames.includes(name),
        );

        if (invalidComponents.length > 0) {
          return {
            success: false,
            error: `Invalid components: ${invalidComponents.join(", ")}`,
          };
        }
      }

      const { error } = await this.supabase
        .from("page_components")
        .upsert([{ page, components, updated_at: new Date().toISOString() }], {
          onConflict: "page",
        });

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Error updating page config:", error);
      return {
        success: false,
        error: "Failed to update page config",
      }
    }
}
    async initializeDefaults(): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if defaults already exist
      const { data: existingConfigs } = await this.supabase
        .from("page_components")
        .select("*")
        .in("page", [2, 3]);

      if (existingConfigs && existingConfigs.length >= 2) {
        return { success: true };
      }

      // Get available components
      const components = await this.getAllCustomComponents();

      if (components.length === 0) {
        return {
          success: false,
          error: "No components available for default setup",
        };
      }

      // Set up defaults
      const componentNames = components.map((c) => c.name);
      const defaultConfigs = [];

      // Page 2: Prefer aboutMe, then birthdate, then first available
      const page2Components: string[] = [];
      if (componentNames.includes("aboutMe")) {
        page2Components.push("aboutMe");
      } else if (componentNames.includes("birthdate")) {
        page2Components.push("birthdate");
      } else if (componentNames.length > 0) {
        page2Components.push(componentNames[0]);
      }

      // Page 3: Prefer address, then remaining components
      const page3Components: string[] = [];
      if (componentNames.includes("address")) {
        page3Components.push("address");
      } else {
        const remaining = componentNames.filter(
          (name) => !page2Components.includes(name),
        );
        if (remaining.length > 0) {
          page3Components.push(remaining[0]);
        } else if (componentNames.length > 1) {
          page3Components.push(componentNames[1]);
        } else {
          page3Components.push(componentNames[0]);
        }
      }

      if (page2Components.length > 0) {
        defaultConfigs.push({ page: 2, components: page2Components });
      }
      if (page3Components.length > 0) {
        defaultConfigs.push({ page: 3, components: page3Components });
      }

      if (defaultConfigs.length > 0) {
        const { error } = await this.supabase
          .from("page_components")
          .upsert(defaultConfigs, { onConflict: "page" });

        if (error) {
          return {
            success: false,
            error: error.message,
          };
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error initializing defaults:", error);
      return {
        success: false,
        error: "Failed to initialize defaults",
      };
    }
  }
}