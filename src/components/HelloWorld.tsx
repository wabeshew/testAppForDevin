import { useState } from 'react';

const HelloWorld = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Hello Devin!</h1>
      <p className="text-lg text-gray-600 mb-6">環境構築が正常に完了しました</p>
      <div>
        <button
          type="button"
          onClick={() => setCount((count) => count + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          カウント: {count}
        </button>
      </div>
    </div>
  );
};

export default HelloWorld;
