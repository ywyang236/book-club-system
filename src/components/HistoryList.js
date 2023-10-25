// src/components/HistoryList.js

import React from 'react';

function HistoryList() {
    // 模擬的活動歷史資料
    const historyItems = ["活動1", "活動2", "活動3"];

    return (
        <div className="history-list">
            {historyItems.map(item => (
                <div key={item}>{item}</div>
            ))}
        </div>
    );
}

export default HistoryList;
