// src/components/UserList.js

import React, { useState, useEffect } from 'react';
import 'firebase/storage'; // 引入storage功能
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';  // 使用相對路徑導入 storage
import Navbar from './Navbar';
import '../styles/UserList.css';

// 計算總積分的函數
function calculateTotalPoints(user, week) {
    const notePoints = user.data[week]?.notes * 12 || 0;
    const commentPoints = user.data[week]?.comments * 6 || 0;
    const exercisePoints = user.data[week]?.exercises * 3 || 0;
    const activityPoints = user.data[week]?.activities * 10 || 0;

    return notePoints + commentPoints + exercisePoints + activityPoints;
}

// 計算與上週差異的函數
function calculateDifferenceFromLastWeek(user, week) {
    if (week === 1) {
        return null;
    }
    const currentWeekPoints = calculateTotalPoints(user, week);
    const lastWeekPoints = week > 1 ? calculateTotalPoints(user, week - 1) : 0;
    const difference = currentWeekPoints - lastWeekPoints;
    return difference !== 0 ? difference : null;
}


function UserList() {
    const [users, setUsers] = useState([]);
    const [week, setWeek] = useState(1);

    const setWeekDirectly = (selectedWeek) => {
        if (selectedWeek >= 1 && selectedWeek <= 7) {
            setWeek(selectedWeek);
        }
    }

    useEffect(() => {
        // 使用者資料包含每週的數據
        const sampleUsers = [
            {
                name: "楊于葳 Vivian",
                photoPath: "gs://book-club-system.appspot.com/user_image/0_ywyang236.jpeg",
                data: {
                    1: { notes: 8, comments: 1, activities: 2, exercises: 2 },
                    2: { notes: 5, comments: 2, activities: 0, exercises: 0 },
                    3: { notes: 20, comments: 0, activities: 0, exercises: 0 },
                    4: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    5: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    6: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                }
            },
            {
                name: "Neal",
                photoPath: "gs://book-club-system.appspot.com/user_image/9_neal_180.jpeg",
                data: {
                    1: { notes: 4, comments: 1, activities: 2, exercises: 2 },
                    2: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    3: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    4: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    5: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    6: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                }
            },
            {
                name: "大谷秀瑜",
                photoPath: "gs://book-club-system.appspot.com/user_image/8_ohtani_showyu.jpeg",
                data: {
                    1: { notes: 2, comments: 1, activities: 2, exercises: 2 },
                    2: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    3: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    4: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    5: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    6: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                }
            },
            {
                name: "Allen",
                photoPath: "gs://book-club-system.appspot.com/user_image/4_yiyixiaoqisi.jpeg",
                data: {
                    1: { notes: 0, comments: 1, activities: 0, exercises: 2 },
                    2: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    3: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    4: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    5: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    6: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                }
            },
            {
                name: "LTR",
                photoPath: "gs://book-club-system.appspot.com/user_image/7_lark1987.jpeg",
                data: {
                    1: { notes: 2, comments: 1, activities: 2, exercises: 2 },
                    2: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    3: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    4: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    5: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    6: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                }
            },
            {
                name: "Lulu",
                photoPath: "gs://book-club-system.appspot.com/user_image/1_lulu_cheng.jpeg",
                data: {
                    1: { notes: 2, comments: 1, activities: 2, exercises: 2 },
                    2: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    3: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    4: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    5: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    6: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                }
            },
            {
                name: "張 雅婷",
                photoPath: "gs://book-club-system.appspot.com/user_image/11_yating.chang.jpeg",
                data: {
                    1: { notes: 2, comments: 1, activities: 2, exercises: 2 },
                    2: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    3: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    4: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    5: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    6: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                }
            },
            {
                name: "AngelTsui",
                photoPath: "gs://book-club-system.appspot.com/user_image/13_angeltsui.jpeg",
                data: {
                    1: { notes: 2, comments: 1, activities: 2, exercises: 2 },
                    2: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    3: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    4: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    5: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    6: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                }
            },
            {
                name: "rororo",
                photoPath: "gs://book-club-system.appspot.com/user_image/2_rororo.jpeg",
                data: {
                    1: { notes: 2, comments: 1, activities: 2, exercises: 2 },
                    2: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    3: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    4: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    5: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    6: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                }
            },
            {
                name: "肉魚",
                photoPath: "gs://book-club-system.appspot.com/user_image/3_rouyu.jpeg",
                data: {
                    1: { notes: 2, comments: 1, activities: 2, exercises: 2 },
                    2: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    3: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    4: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    5: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    6: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                }
            },
            {
                name: "Wenying",
                photoPath: "gs://book-club-system.appspot.com/user_image/5_wenying.jpeg",
                data: {
                    1: { notes: 2, comments: 1, activities: 2, exercises: 2 },
                    2: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    3: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    4: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    5: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    6: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                }
            },
            {
                name: "Ezra",
                photoPath: "gs://book-club-system.appspot.com/user_image/6_ilbas.jpeg",
                data: {
                    1: { notes: 2, comments: 1, activities: 2, exercises: 2 },
                    2: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    3: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    4: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    5: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    6: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                }
            },
            {
                name: "JT Ho",
                photoPath: "gs://book-club-system.appspot.com/user_image/12_star533422.jpeg",
                data: {
                    1: { notes: 2, comments: 1, activities: 2, exercises: 2 },
                    2: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    3: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    4: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    5: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    6: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                }
            },
            {
                name: "fish",
                photoPath: "gs://book-club-system.appspot.com/user_image/10_yuu0210_.jpeg",
                data: {
                    1: { notes: 2, comments: 1, activities: 2, exercises: 2 },
                    2: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    3: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    4: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    5: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                    6: { notes: 0, comments: 0, activities: 0, exercises: 0 },
                }
            },
        ];

        const promises = sampleUsers.map(async user => {
            const url = await getDownloadURL(ref(storage, user.photoPath));
            return { ...user, photoUrl: url };
        });

        Promise.all(promises).then(updatedUsers => {
            updatedUsers.sort((a, b) => calculateTotalPoints(b, week) - calculateTotalPoints(a, week)); // 這裡進行排序
            setUsers(updatedUsers);
        });
    }, [week]);

    return (
        <div className="user-card">
            <Navbar onWeekSelect={setWeekDirectly} />
            <div className="table-container">
                <table>
                    <tbody>
                        <tr>
                            <th></th>
                            <th>暱稱</th>
                            <th>筆記</th>
                            <th>留言</th>
                            <th>運動</th>
                            <th>活動</th>
                            <th>積分</th>
                            <th>與上週差異</th>
                        </tr>
                        {users.map(user => (
                            <tr key={user.name}>
                                <td><img src={user.photoUrl} alt={user.name} style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "10px" }} /></td>
                                <td>{user.name}</td>
                                <td>{user.data[week]?.notes || 0}</td>
                                <td>{user.data[week]?.comments || 0}</td>
                                <td>{user.data[week]?.exercises || 0}</td>
                                <td>{user.data[week]?.activities || 0}</td>
                                <td>{calculateTotalPoints(user, week)}</td>
                                <td>{
                                    (() => {
                                        const difference = calculateDifferenceFromLastWeek(user, week);
                                        if (difference === null) {
                                            return null; // 不顯示差異值
                                        }
                                        return (
                                            <span style={{ color: difference > 0 ? "green" : "red" }}>
                                                {difference > 0 ? `+${difference}` : difference}
                                            </span>
                                        );
                                    })()
                                }</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserList;