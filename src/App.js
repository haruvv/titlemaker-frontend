import React, { useState } from "react";
import axios from "axios";
import { PROMPT_MODES, PROMPT_MODE_LABELS } from "./constants/promptModes";

function App() {
  const [title, setTitle] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [promptMode, setPromptMode] = useState(PROMPT_MODES.CASUAL); // "casual"をデフォルトに設定

  // 評価結果を整形する関数
  const formatEvaluation = (evaluation) => {
    if (!evaluation || typeof evaluation !== "object") return null;

    return {
      インパクト: {
        スコア: `${evaluation.ratings.impact.score}/10`,
        コメント: evaluation.ratings.impact.comment,
      },
      妄想力: {
        スコア: `${evaluation.ratings.imagination.score}/10`,
        コメント: evaluation.ratings.imagination.comment,
      },
      エロ度: {
        スコア: `${evaluation.ratings.eroticism.score}/10`,
        コメント: evaluation.ratings.eroticism.comment,
      },
      独創性: {
        スコア: `${evaluation.ratings.originality.score}/10`,
        コメント: evaluation.ratings.originality.comment,
      },
      総合コメント: evaluation.overall_comment,
    };
  };

  // 評価結果を表示する関数
  const renderEvaluation = (evaluation) => {
    const formatted = formatEvaluation(evaluation);
    if (!formatted) return null;

    return (
      <div className="space-y-6">
        {Object.entries(formatted).map(([key, value]) => (
          <div
            key={key}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              {getCategoryEmoji(key)} <span className="ml-2">{key}</span>
            </h3>
            {typeof value === "object" ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${(parseInt(value.スコア) / 10) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className="ml-4 font-bold text-lg text-gray-700">
                    {value.スコア}
                  </span>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  『{value.コメント}』
                </p>
              </div>
            ) : (
              <p className="text-gray-600 text-lg leading-relaxed">
                『{value}』
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  // カテゴリーに対応する絵文字を返す関数
  const getCategoryEmoji = (category) => {
    const emojis = {
      インパクト: "💥",
      妄想力: "💭",
      エロ度: "🔥",
      独創性: "✨",
      総合コメント: "📝",
    };
    return emojis[category] || "📊";
  };

  // キャラクター選択部分を改善
  const renderCharacterSelect = () => (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-pink-600 mb-3 flex items-center justify-center sm:justify-start">
        <span className="mr-2">❤</span>
        評価キャラクター
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {Object.keys(PROMPT_MODES).map((mode) => (
          <button
            key={mode}
            onClick={() => setPromptMode(PROMPT_MODES[mode])}
            className={`
              relative overflow-hidden group p-3 sm:p-4 rounded-xl transition-all duration-300
              ${
                promptMode === PROMPT_MODES[mode]
                  ? "bg-gradient-to-br from-pink-400 to-purple-500 text-white shadow-lg"
                  : "bg-white/60 text-gray-700 hover:bg-pink-50 hover:shadow border border-pink-200"
              }
            `}
          >
            <div className="relative z-10 flex flex-col items-center space-y-2">
              <span className="text-2xl sm:text-3xl">
                {getCharacterEmoji(mode)}
              </span>
              <span className="text-xs sm:text-sm font-medium text-center leading-tight">
                {PROMPT_MODE_LABELS[PROMPT_MODES[mode]]}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // APIを呼び出して評価を取得する関数
  const handleEvaluate = async () => {
    setLoading(true);
    setError(null);
    setEvaluation(null);

    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/evaluate`;
      console.log("Requesting:", apiUrl);

      const response = await axios.post(
        apiUrl,
        {
          title,
          promptMode, // プロンプトモードを追加
        },
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
      console.error("API Error:", {
        url: err.config?.url,
        method: err.config?.method,
        status: err.response?.status,
        data: err.response?.data,
      });
      setError(err.response?.data?.message || "エラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  const getCharacterEmoji = (mode) => {
    const emojis = {
      CASUAL: "👩",
      COOL: "🧐",
      IMOUTO: "👧",
      POET: "🥸",
      // DIRECTOR: "🎬",
      // COMEDIAN: "🎭",
      // ROMANTIC: "🌹",
      // REALIST: "📊",
    };
    return emojis[mode] || "👤";
  };

  // 右側のコンテンツ部分を修正
  const renderRightContent = () => {
    if (evaluation) {
      return (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-pink-100">
          {renderEvaluation(evaluation)}
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-2xl mb-6">
          <div className="flex items-center space-x-3">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-8 border border-pink-100">
        <div className="text-center space-y-6">
          <div className="p-8">
            <span className="text-6xl mb-4 block animate-bounce">🎬</span>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              AIによる詳細な評価が表示されます
            </h3>
            <p className="text-gray-500 leading-relaxed">
              左側でキャラクターを選択し、タイトルを入力してください。
              <br />
              各項目ごとの詳細な評価とアドバイスを表示します。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4">
            {["インパクト", "妄想力", "エロ度", "独創性"].map((category) => (
              <div
                key={category}
                className="bg-gray-50 rounded-xl p-4 text-center"
              >
                <span className="text-2xl mb-2 block">
                  {getCategoryEmoji(category)}
                </span>
                <span className="text-gray-600 font-medium">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* ヘッダー */}
        <div className="text-center mb-6 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500">
              AVタイトルメーカー
            </span>
          </h1>
          <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-gray-600">
            <span className="text-pink-500">❤</span>{" "}
            AIがあなたのタイトルを多角的に分析します
          </p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-8">
          {/* 左側：入力部分 */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-8 border border-pink-100">
              {renderCharacterSelect()}

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-base sm:text-lg font-medium text-pink-600 mb-2"
                  >
                    タイトルを入力してください{" "}
                    <span className="text-pink-400">♡</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例：清楚な人妻が..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-pink-200 
                      focus:border-pink-500 focus:ring-4 focus:ring-pink-200 
                      transition-all duration-200 text-sm sm:text-base"
                  />
                </div>

                <button
                  onClick={handleEvaluate}
                  disabled={loading || !title.trim()}
                  className="w-full bg-gradient-to-r from-pink-400 to-purple-500 
                    text-white py-3 sm:py-4 rounded-xl font-medium text-base sm:text-lg
                    shadow-lg hover:shadow-xl transition-all duration-300 
                    disabled:opacity-50 disabled:cursor-not-allowed
                    hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? "評価中..." : "AIに評価してもらう ❤"}
                </button>
              </div>
            </div>
          </div>

          {/* 右側：評価結果 */}
          <div className="lg:col-span-7">{renderRightContent()}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
