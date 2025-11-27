
export interface PromptItem {
  title: string;
  preview: string;
  prompt: string;
  author: string;
  link?: string;
  mode: string; // 'edit' | 'generate'
  category: string;
  sub_category?: string;
  source?: {
    name: string;
    url: string;
  };
}

export type Category = string;
