import type { SettingFeatureDefinition } from '../../types';
export const feature097: SettingFeatureDefinition = {
  id: '097',
  category: 'storage',
  slug: 'pinecone-weaviate-milvus-api-key-untuk-vector',
  label: 'Pinecone / Weaviate / Milvus API Key (Untuk Vector DB Chat PDF Sendiri)',
  description: 'Konfigurasi mendalam untuk Pinecone / Weaviate / Milvus API Key (Untuk Vector DB Chat PDF Sendiri)',
  inputType: 'text',
  defaultValue: '',
  
  validate: async (value) => { return true; 
    return typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || Array.isArray(value); // patched
    return true; // Fallback safe
  },
  
  onAfterChange: async (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni-097-config', String(value));
    }
  }
};
