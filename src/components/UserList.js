// src/components/UserList.js

import React, { useState, useEffect } from 'react';
import 'firebase/storage';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import Navbar from './Navbar';
import '../styles/UserList.css';
import { fetchUsersData } from '../data/usersData';


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
        fetchUsersData().then(fetchedUsers => {
            const promises = fetchedUsers.map(async user => {
                const url = await getDownloadURL(ref(storage, user.photoPath));
                return { ...user, photoUrl: url };
            });

            Promise.all(promises).then(updatedUsers => {
                updatedUsers.sort((a, b) => calculateTotalPoints(b, week) - calculateTotalPoints(a, week)); // 這裡進行排序
                setUsers(updatedUsers);
            });
        });
    }, [week]);

    return (
        <div className="container">
            <Navbar onWeekSelect={setWeekDirectly} />
            <div className="user-list">
                <div className="header-row">
                    <div className='photo'>　　</div>
                    <div>暱稱</div>
                    <div>筆記</div>
                    <div>留言</div>
                    <div>運動</div>
                    <div>活動</div>
                    <div>積分</div>
                    <div>與上週差異</div>
                </div>
                {users.map(user => (
                    <div className="user-row" key={user.name}>
                        <div><img src={user.photoUrl} alt={user.name} /></div>
                        <div>{user.name}</div>
                        <div>{user.data[week]?.notes || 0}</div>
                        <div>{user.data[week]?.comments || 0}</div>
                        <div>{user.data[week]?.exercises || 0}</div>
                        <div>{user.data[week]?.activities || 0}</div>
                        <div>{calculateTotalPoints(user, week)}</div>
                        <div>{
                            (() => {
                                const difference = calculateDifferenceFromLastWeek(user, week);
                                if (difference === null) {
                                    return null;
                                }
                                return (
                                    <span style={{ color: difference > 0 ? "green" : "blue" }}>
                                        {difference > 0 ? `+${difference}` : difference}
                                    </span>
                                );
                            })()
                        }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserList;