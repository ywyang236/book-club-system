// function UserCard({ user, week }) {
//     const totalPoints = calculateTotalPoints(user, week);
//     const difference = calculateDifferenceFromLastWeek(user, week);

//     // 使用 firebase 取得照片的 URL
//     const [photoUrl, setPhotoUrl] = useState(null);

//     useEffect(() => {
//         if (user.photoPath) {
//             getDownloadURL(ref(storage, user.photoPath)).then((url) => {
//                 setPhotoUrl(url);
//             });
//         }
//     }, [user.photoPath]);

//     return (
//         <div className="user-card">
//             {photoUrl && <img src={photoUrl} alt={user.name} className="user-photo" />}
//             <div className="user-info">
//                 <div className="user-name">{user.name}</div>
//                 <div className="user-points">Points: {totalPoints}</div>
//                 {difference && <div className="user-difference">Difference from last week: {difference}</div>}
//             </div>
//         </div>
//     );
// }
