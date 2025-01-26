import React from "react";

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 max-w-lg w-full border border-pink-100">
        <div className="text-center space-y-6">
          {/* アイコンとタイトル */}
          <div className="space-y-4">
            <div className="text-6xl animate-bounce">🛠️</div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500">
              メンテナンス中
            </h1>
          </div>

          {/* メッセージ */}
          <div className="space-y-4 text-gray-600">
            <p>
              より良いサービスを提供するため、現在システムのメンテナンスを行っています。
            </p>
            <p className="text-sm">
              ご不便をおかけして申し訳ございません。
              <br />
              しばらくお待ちください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
