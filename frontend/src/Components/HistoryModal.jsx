import { useState, useEffect } from 'react';
import Button from './Button';

const HistoryModal = ({ isOpen, onClose, item, fetchHistory }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && item) {
      loadHistory();
    }
  }, [isOpen, item]);

  const loadHistory = async () => {
    setLoading(true);
    const result = await fetchHistory(item._id);
    if (result.success) {
      setHistory(result.data);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  const getTypeBadge = (type) => {
    if (type === 'add') {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">➕ Ajout</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">➖ Retrait</span>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden">
        {/* En-tête */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">📜 Historique des mouvements</h2>
              <p className="text-gray-600 mt-1">{item?.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Corps */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucun mouvement de stock pour cet article</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* En-têtes du tableau */}
              <div className="grid grid-cols-5 gap-3 px-3 py-2 bg-gray-100 rounded-lg text-xs font-semibold text-gray-600">
                <div>Date</div>
                <div>Type</div>
                <div>Quantité</div>
                <div>Avant</div>
                <div>Après</div>
              </div>
              
              {/* Lignes du tableau */}
              {history.map((movement) => (
                <div
                  key={movement._id}
                  className="grid grid-cols-5 gap-3 px-3 py-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <div className="text-sm text-gray-600">
                    {formatDate(movement.createdAt)}
                  </div>
                  <div>
                    {getTypeBadge(movement.type)}
                  </div>
                  <div className="font-semibold">
                    {movement.quantity}
                  </div>
                  <div className="text-gray-500">
                    {movement.previousQuantity}
                  </div>
                  <div className="font-semibold text-blue-600">
                    {movement.newQuantity}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pied de page */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;