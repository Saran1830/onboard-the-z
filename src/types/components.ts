export const COMPONENT_TYPES = [
  "text", "textarea", "date", "number", "email", "phone", "url",
] as const;
export type ComponentType = (typeof COMPONENT_TYPES)[number];


export interface CustomComponent {
  id: string;
  name: string;
  label: string;
  type: ComponentType;      // strict union, not plain string
  required: boolean;
  placeholder: string;
  created_at: string;
  options: string[] | null;
}

export interface PageConfig {
  id: string;
  page: number;
  title: string;
  components: string[];
  updated_at: string;
}