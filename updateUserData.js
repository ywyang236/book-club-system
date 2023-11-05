const fs = require('fs');

// 讀取 output.json
const jsonData = fs.readFileSync('output.json', 'utf-8');
const usersData = JSON.parse(jsonData);

// 創建新的 userData.js 內容
const newContent = `
export const users = ${JSON.stringify(usersData, null, 2)};

export const fetchUsersData = async () => {
    return users;
};
`;

// 寫入到 userData.js
fs.writeFileSync('src/data/usersData.js', newContent);
console.log('Updated usersData.js successfully!');
