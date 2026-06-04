import { useEffect, useState } from 'react';
import useItemStore from '../store/itemStore';
import useAuthStore from '../store/authStore';
import ArticleCard from '../components/ArticleCard';
import HistoryModal from '../components/HistoryModal';
import Button from '../components/Button';
import Alert from '../components/Alert';

const Dashboard = () => {
  const { 
    items, 
    loading, 
    error, 
    fetchItems, 
    createItem, 
    updateItem, 
    deleteItem, 
    addStock, 
    removeStock,
    getItemHistory,
    clearError 
  } = useItemStore();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    price: 0,
    category: '',
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createItem(formData);
    if (result.success) {
      setShowForm(false);
      setFormData({ name: '', quantity: 0, price: 0, category: '' });
    }
  };

  const handleViewHistory = (item) => {
    setSelectedItem(item);
    setShowHistoryModal(true);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase()) ||
    item.category.toLowerCase().includes(filter.toLowerCase())
  );

  const lowStockItems = items.filter(item => item.quantity <= 5 && item.quantity > 0);
  const outOfStockItems = items.filter(item => item.quantity === 0);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📊 Tableau de bord</h1>
          <p className="text-gray-600 mt-1">
            Bienvenue, {user?.name} ! ({user?.role === 'admin' ? 'Administrateur' : 'Employé'})
          </p>
        </div>
        {isAdmin && (
          <Button variant="primary" onClick={() => setShowForm(true)}>
            + Nouvel article
          </Button>
        )}
      </div>

      {/* Alertes */}
      {error && (
        <Alert type="error" message={error} onClose={clearError} />
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-gray-500 text-sm">Total articles</div>
          <div className="text-2xl font-bold text-gray-800">{items.length}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="text-yellow-600 text-sm">⚠️ Stock faible (&lt; 5)</div>
          <div className="text-2xl font-bold text-yellow-700">{lowStockItems.length}</div>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="text-red-600 text-sm">❌ Rupture de stock</div>
          <div className="text-2xl font-bold text-red-700">{outOfStockItems.length}</div>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="🔍 Rechercher par nom ou catégorie..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Liste des articles */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">Aucun article trouvé</p>
          {isAdmin && (
            <Button variant="primary" onClick={() => setShowForm(true)} className="mt-4">
              Créer votre premier article
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ArticleCard
              key={item._id}
              item={item}
              onUpdate={updateItem}
              onDelete={deleteItem}
              onAddStock={addStock}
              onRemoveStock={removeStock}
              onViewHistory={handleViewHistory}
            />
          ))}
        </div>
      )}

      {/* Modal de création d'article */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Nouvel article</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nom *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Quantité</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Prix (FCFA) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Catégorie *</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" variant="primary" className="flex-1">
                  Créer
                </Button>
                <Button type="button" variant="secondary" onClick={() => setShowForm(false)} className="flex-1">
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'historique */}
      {showHistoryModal && (
        <HistoryModal
          isOpen={showHistoryModal}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          fetchHistory={getItemHistory}
        />
      )}
    </div>
  );
};

export default Dashboard;