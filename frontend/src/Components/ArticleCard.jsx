import { useState } from 'react';
import useAuthStore from '../store/authStore';
import Button from './Button';

const ArticleCard = ({ item, onUpdate, onDelete, onAddStock, onRemoveStock, onViewHistory }) => {
  const { user } = useAuthStore();
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockAction, setStockAction] = useState('add');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    category: item.category,
  });

  const isLowStock = item.quantity <= 5;
  const isOutOfStock = item.quantity === 0;
  const isAdmin = user?.role === 'admin';

  const handleStockSubmit = async () => {
    if (stockAction === 'add') {
      await onAddStock(item._id, stockQuantity);
    } else {
      await onRemoveStock(item._id, stockQuantity);
    }
    setShowStockModal(false);
    setStockQuantity(1);
  };

  const handleUpdate = async () => {
    await onUpdate(item._id, editData);
    setIsEditing(false);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${
      isLowStock ? 'border-l-4 border-l-yellow-500' : ''
    } ${isOutOfStock ? 'border-l-4 border-l-red-500' : ''}`}>
      
      {/* En-tête avec catégorie */}
      <div className="px-4 py-2 bg-gray-50 border-b flex justify-between items-center">
        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
          {item.category}
        </span>
        {isLowStock && (
          <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
            ⚠️ Stock faible
          </span>
        )}
        {isOutOfStock && (
          <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
            ❌ Rupture
          </span>
        )}
      </div>

      {/* Corps */}
      <div className="p-4">
        {isEditing ? (
          // Mode édition
          <div>
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full px-2 py-1 border rounded mb-2"
              placeholder="Nom"
            />
            <input
              type="number"
              value={editData.price}
              onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
              className="w-full px-2 py-1 border rounded mb-2"
              placeholder="Prix"
            />
            <input
              type="text"
              value={editData.category}
              onChange={(e) => setEditData({ ...editData, category: e.target.value })}
              className="w-full px-2 py-1 border rounded mb-2"
              placeholder="Catégorie"
            />
            <div className="flex space-x-2 mt-2">
              <Button variant="success" onClick={handleUpdate} className="flex-1 text-sm">
                Sauvegarder
              </Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)} className="flex-1 text-sm">
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          // Mode affichage
          <>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2">
              {item.price.toLocaleString()} FCFA
            </p>
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Quantité:</span>
              <span className={`font-bold text-lg ${
                isLowStock ? 'text-yellow-600' : isOutOfStock ? 'text-red-600' : 'text-green-600'
              }`}>
                {item.quantity}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t">
        {!isEditing && (
          <div className="flex flex-wrap gap-2">
            {/* Admin: Modifier et Supprimer */}
            {isAdmin && (
              <>
                <Button variant="secondary" onClick={() => setIsEditing(true)} className="flex-1 text-sm">
                  ✏️ Modifier
                </Button>
                <Button variant="danger" onClick={() => onDelete(item._id)} className="flex-1 text-sm">
                  🗑️ Supprimer
                </Button>
                <Button 
                    variant="info" 
                    onClick={() => onViewHistory(item)}
                    className="flex-1 text-sm bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    📜 Historique
                </Button>
                
              </>
            )}
            
            {/* Gestion du stock (Admin + Employé) */}
            <Button 
              variant="success" 
              onClick={() => {
                setStockAction('add');
                setShowStockModal(true);
              }}
              className="flex-1 text-sm"
            >
              ➕ Ajouter
            </Button>
            <Button 
              variant="danger" 
              onClick={() => {
                setStockAction('remove');
                setShowStockModal(true);
              }}
              disabled={item.quantity === 0}
              className="flex-1 text-sm disabled:opacity-50"
            >
              ➖ Retirer
            </Button>
            
          </div>
        )}
      </div>

      {/* Modal de gestion de stock */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4">
              {stockAction === 'add' ? 'Ajouter du stock' : 'Retirer du stock'}
            </h3>
            <p className="text-gray-600 mb-4">
              Article: <span className="font-semibold">{item.name}</span>
            </p>
            <p className="text-gray-600 mb-4">
              Stock actuel: <span className="font-semibold">{item.quantity}</span>
            </p>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
              min="1"
              className="w-full px-3 py-2 border rounded-lg mb-4"
              placeholder="Quantité"
            />
            <div className="flex space-x-2">
              <Button variant="primary" onClick={handleStockSubmit} className="flex-1">
                Confirmer
              </Button>
              <Button variant="secondary" onClick={() => setShowStockModal(false)} className="flex-1">
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleCard;