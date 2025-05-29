export const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg flex items-center gap-3">
        <svg className="animate-spin h-6 w-6 text-blue-500" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
        <span className="text-gray-700 font-medium">Procesando...</span>
      </div>
    </div>
  );
  