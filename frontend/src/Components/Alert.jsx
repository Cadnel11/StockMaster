const Alert = ({ type = 'success', message, onClose }) => {
  const types = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
  };

  return (
    <div className={`border rounded-lg p-4 mb-4 ${types[type]}`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        {onClose && (
          <button onClick={onClose} className="text-xl font-bold hover:opacity-70">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;