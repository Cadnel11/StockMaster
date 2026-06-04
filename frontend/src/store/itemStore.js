import { create } from 'zustand';
import api from '../services/api';

const itemStore = (set) => ({
  items: [],
  loading: false,
  error: null,

  // Récupérer tous les articles
  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/items');
      set({ items: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Erreur lors du chargement', 
        loading: false 
      });
      return [];
    }
  },

  // Créer un article
  createItem: async (itemData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/items', itemData);
      const newItem = response.data.data;
      set((state) => ({ 
        items: [newItem, ...state.items], 
        loading: false 
      }));
      return { success: true, data: newItem };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Erreur lors de la création', 
        loading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Mettre à jour un article
  updateItem: async (id, itemData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/items/${id}`, itemData);
      const updatedItem = response.data.data;
      set((state) => ({
        items: state.items.map((item) => 
          item._id === id ? updatedItem : item
        ),
        loading: false
      }));
      return { success: true, data: updatedItem };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Erreur lors de la modification', 
        loading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Supprimer un article
  deleteItem: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/items/${id}`);
      set((state) => ({
        items: state.items.filter((item) => item._id !== id),
        loading: false
      }));
      return { success: true };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Erreur lors de la suppression', 
        loading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Ajouter du stock
  addStock: async (id, quantity) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/items/${id}/add`, { quantity });
      const updatedItem = response.data.data;
      set((state) => ({
        items: state.items.map((item) => 
          item._id === id ? updatedItem : item
        ),
        loading: false
      }));
      return { success: true, data: updatedItem, message: response.data.message };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Erreur lors de l\'ajout de stock', 
        loading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Retirer du stock
  removeStock: async (id, quantity) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/items/${id}/remove`, { quantity });
      const updatedItem = response.data.data;
      set((state) => ({
        items: state.items.map((item) => 
          item._id === id ? updatedItem : item
        ),
        loading: false
      }));
      return { success: true, data: updatedItem, message: response.data.message };
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Erreur lors du retrait de stock', 
        loading: false 
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  // Ajoutez cette fonction dans itemStore (src/store/itemStore.js)

// Récupérer l'historique d'un article
getItemHistory: async (id) => {
  set({ loading: true, error: null });
  try {
    const response = await api.get(`/items/${id}/history`);
    set({ loading: false });
    return { success: true, data: response.data.data };
  } catch (error) {
    set({ 
      error: error.response?.data?.message || 'Erreur lors du chargement de l\'historique', 
      loading: false 
    });
    return { success: false, error: error.response?.data?.message };
  }
},

  clearError: () => set({ error: null }),
});

const useItemStore = create(itemStore);
export default useItemStore;