export default function DeleteConfirmModal({ open, onCancel, onConfirm, message }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={onCancel}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-4">{message}</h3>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
