// import React from "react";

// const PostFilters = ({
//   search,
//   setSearch,
//   sortBy,
//   setSortBy,
//   category,
//   setCategory,
//   categories,
// }) => {
//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search posts..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />
//       <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
//         <option value="latest">Latest</option>
//         <option value="likes">Most Liked</option>
//         <option value="author">Author (A-Z)</option>
//       </select>
//       <select value={category} onChange={(e) => setCategory(e.target.value)}>
//         <option value="All">All</option>
//         {categories.map((cat) => (
//           <option key={cat} value={cat}>
//             {cat}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };
