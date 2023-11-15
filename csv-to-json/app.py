import pandas as pd
from flask import Flask, jsonify
from datetime import datetime, timedelta
import os
import json


app = Flask(__name__)


@app.route("/")
def home():
    # 讀取 CSV 檔案
    csv_file = "csv-to-json/chat.csv"
    data = pd.read_csv(
        csv_file,
        header=None,
        names=["datetime", "username", "unknown", "type", "column5", "column6"],
    )

    # 拆分日期和時間列
    data[["date", "time"]] = data["datetime"].str.split(",", expand=True)
    data = data[data["date"].str.match(r"\d{4}-\d{2}-\d{2}")]
    data["date"] = pd.to_datetime(data["date"])

    # 定義開始日期
    start_date = datetime.strptime("2023-10-23", "%Y-%m-%d")

    # 根據日期計算週次
    data["week"] = (((data["date"] - start_date).dt.days) // 7) + 1

    # 使用者暱稱對應字典
    user_nickname = {
        # "neal_180": "Neal",
        "ohtani_showyu": "大谷秀瑜",
        "yiyixiaoqisi": "Allen",
        "lark1987": "LTR",
        "lulu_cheng": "Lulu",
        # "yating.chang": "張 雅婷",
        "yuu0210_": "fish",
        ".wenying": "Wenying",
        # "ilbas": "Ezra",
        "rouyu.": "肉魚",
        # "angeltsui": "AngelTsui",
        "star533422": "JT Ho",
        "rororo": "rororo",
    }

    user_photos = {
        # "Neal" : "gs://book-club-system.appspot.com/user_image/9_neal_180.jpeg",
        "大谷秀瑜": "gs://book-club-system.appspot.com/user_image/8_ohtani_showyu.jpeg",
        "Allen": "gs://book-club-system.appspot.com/user_image/4_yiyixiaoqisi.jpeg",
        "LTR": "gs://book-club-system.appspot.com/user_image/7_lark1987.jpeg",
        "Lulu": "gs://book-club-system.appspot.com/user_image/1_lulu_cheng.jpeg",
        # "張 雅婷": "gs://book-club-system.appspot.com/user_image/11_yating.chang.jpeg",
        # "AngelTsui": "gs://book-club-system.appspot.com/user_image/13_angeltsui.jpeg",
        "rororo": "gs://book-club-system.appspot.com/user_image/2_rororo.jpeg",
        "肉魚": "gs://book-club-system.appspot.com/user_image/3_rouyu.jpeg",
        "Wenying": "gs://book-club-system.appspot.com/user_image/5_wenying.jpeg",
        # "Ezra": "gs://book-club-system.appspot.com/user_image/6_ilbas.jpeg",
        "JT Ho": "gs://book-club-system.appspot.com/user_image/12_star533422.jpeg",
        "fish": "gs://book-club-system.appspot.com/user_image/10_yuu0210_.jpeg",
    }

    result = []

    # 對每個使用者處理數據
    for username, nickname in user_nickname.items():
        # 過濾該使用者的數據
        user_data = data[data["username"] == username]

        # 初始化該使用者的記錄
        record = {
            "name": nickname,
            "photoPath": user_photos.get(
                nickname, ""
            ),  # 使用 nickname 從 user_photos 中查找URL
            "data": {},
        }

        # 假設您的CSV中有一個名為"week"的欄位表示週次
        for week in range(1, 7):
            week_data = user_data[user_data["week"] == week]
            record["data"][week] = {
                "notes": len(week_data[week_data["type"] == "筆記"]),
                "comments": len(week_data[week_data["type"] == "留言"]),
                "exercises": len(week_data[week_data["type"] == "運動"]),
                "activities": len(week_data[week_data["type"] == "活動"]),
            }

        result.append(record)

    # 將結果輸出成另一個 json 檔案
    with open("output.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=4)

    return jsonify(result)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5600, debug=True)
