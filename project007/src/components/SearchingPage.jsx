import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SearchingPage = () => {
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);  // ✅ Ensure default state is an array
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!query.trim()) {
            setUsers([]);  // ✅ Reset to empty array if query is empty
            return;
        }

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/user/search?query=${query}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                 console.log("Response object:", response); // Log the full response
        console.log("Response data:", response.data); // Log only the data

                setUsers(Array.isArray(response.data) ? response.data : []); // ✅ Ensure it's always an array
            } catch (error) {
                console.error("Error fetching users:", error);
                setUsers([]);  // ✅ Handle error gracefully
            }
            setLoading(false);
        };

        const delayDebounceFn = setTimeout(fetchUsers, 300); // Debounce API call

        return () => clearTimeout(delayDebounceFn);
    }, [query, token]);

    return (
        <div className="relative w-full max-w-md mx-auto">
            {/* Search Input */}
            <input
                type="text"
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring focus:ring-primary outline-none text-gray-800"
                placeholder="Search users..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />

            {/* Search Results */}
            {query && (
                <div className="absolute w-full bg-white shadow-lg rounded-lg mt-2">
                    {loading ? (
                        <p className="p-3 text-center text-gray-500">Searching...</p>
                    ) : users.length > 0 ? (
                        users.map((user) => (
                            <Link
                                key={user._id}
                                to={`/profile/${user.username}`}
                                className="flex items-center gap-3 p-3 hover:bg-gray-100 transition"
                            >
                                <img
                                    src={user.image || "/default-avatar.png"}
                                    alt={user.username}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <p className="font-semibold">{user.fullName}</p>
                                    <p className="text-gray-500">@{user.username}</p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="p-3 text-center text-gray-500">No users found</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchingPage;
