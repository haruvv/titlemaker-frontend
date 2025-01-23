import React, { useState } from "react";
import axios from "axios";

function App() {
  const [title, setTitle] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatEvaluation = (evaluation) => {
    if (!evaluation || typeof evaluation !== "object") return null;

    // 評価結果を整形
    const formattedEvaluation = {
      ジャンル: evaluation.genre || "不明",
      ターゲット層: evaluation.target_audience || "不明",
      アピールポイント: evaluation.appeal_points || [],
      評価スコア: evaluation.rating ? `${evaluation.rating}/10` : "未評価",
    };

    return formattedEvaluation;
  };

  const renderEvaluation = (evaluation) => {
    const formatted = formatEvaluation(evaluation);
    if (!formatted) return null;

    return (
      <div className="space-y-4">
        {Object.entries(formatted).map(([key, value]) => (
          <div key={key} className="border-b pb-2">
            <h3 className="font-semibold text-gray-700">{key}</h3>
            {Array.isArray(value) ? (
              <ul className="list-disc list-inside">
                {value.map((item, index) => (
                  <li key={index} className="text-gray-600">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">{value}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleEvaluate = async () => {
    setLoading(true);
    setError(null);
    setEvaluation(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/evaluate`,
        { title },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      if (response.data.success) {
        setEvaluation(response.data.data.evaluation);
      } else {
        setError(response.data.message || "評価に失敗しました。");
      }
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "エラーが発生しました。");
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
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading || !title.trim()}
        >
          {loading ? "評価中..." : "評価する"}
        </button>
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {evaluation && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">評価結果</h2>
            <div className="bg-gray-50 p-4 rounded">
              {renderEvaluation(evaluation)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
