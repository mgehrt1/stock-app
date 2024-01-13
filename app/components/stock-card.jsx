export const StockCard = ({ stock, onClick }) => {
  return (
    <div
      className="border p-4 m-2 cursor-pointer transition transform hover:scale-105"
      onClick={() => onClick(stock)}
    >
      <h3 className="text-xl font-semibold mb-2">{stock}</h3>
      {/* Additional details or styling */}
      <div className="flex items-center justify-between">
        <span className="text-gray-500">Add more details here...</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-6 h-6 text-blue-500"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};
