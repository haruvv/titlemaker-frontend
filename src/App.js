import React, { useState } from "react";
import axios from "axios";

function App() {
  const [title, setTitle] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEvaluate = async () => {
    setLoading(true);
    setError(null);
    setEvaluation(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/evaluate`,
        { title }
      );
      if (response.data.success) {
        setEvaluation(response.data.data.evaluation);
      } else {
        setError("評価に失敗しました。");
      }
    } catch (err) {
      setError("エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">AVタイトルメーカー</h1>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトルを入力してください"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={handleEvaluate}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "評価中..." : "評価する"}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {evaluation && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">評価結果</h2>
            <pre className="bg-gray-100 p-2 rounded mt-2">
              {JSON.stringify(evaluation, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
