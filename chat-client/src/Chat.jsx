import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { IoMdSend } from "react-icons/io";

const socket = io("https://react-socket-chats.vercel.app", {
    path: "/api/socket.io",
});

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [userColors, setUserColors] = useState({});

    useEffect(() => {
        socket.on("chat message", (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
            setUserColors((prevColors) => {
                if (!prevColors[msg.user]) {
                    prevColors[msg.user] = getRandomColor();
                }
                return { ...prevColors };
            });
        });

        return () => {
            socket.off("chat message");
        };
    }, []);

    const getRandomColor = () => {
        const colors = [
            "bg-red-50 text-red-600",
            "bg-green-50 text-green-600",
            "bg-blue-50 text-blue-600",
            "bg-yellow-50 text-yellow-600",
            "bg-purple-50 text-purple-600",
            "bg-pink-50 text-pink-600",
            "bg-indigo-50 text-indigo-600",
            "bg-violet-50 text-violet-600",
            "bg-rose-50 text-rose-600",
            "bg-teal-50 text-teal-600",
            "bg-sky-50 text-sky-600",
            "bg-fuchsia-50 text-fuchsia-600",
            "bg-cyan-50 text-cyan-600",
            "bg-emerald-50 text-emerald-600",
            "bg-lime-50 text-lime-600",
            "bg-amber-50 text-amber-600",
            "bg-orange-50 text-orange-600",
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const sendMessage = () => {
        if (message.trim() && username.trim()) {
            const msgObject = {
                user: username,
                text: message,
                date: new Date().toLocaleString(),
            };
            socket.emit("chat message", msgObject);
            setMessage("");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Chat</h1>
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        placeholder="🙎🏻‍♂️ Kullanıcı Adınız"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="h-80 overflow-y-auto mb-4">
                    {messages.map((msg, index) => (
                        <div key={index} className="mb-2">
                            <div className={`p-4 rounded-xl ${userColors[msg.user] || "bg-gray-100 text-black"}`}>
                                <div className="flex items-center justify-between">
                                    <strong>{msg.user}</strong>
                                    <span className="text-xs">{msg.date}</span>
                                </div>
                                <p className="mt-2">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {!messages.length && (
                        <div className="w-full h-full p-4 flex flex-col items-center justify-center">
                            <p className="text-slate-400 text-center text-md">Lütfen kullanıcı adınızı daha sonra</p>
                            <p className="text-slate-400 text-center text-md"> mesajınızı yazınız 😊 💬</p>
                        </div>
                    )}
                </div>
                <div className="flex">
                    <input
                        type="text"
                        placeholder="Mesajınız"
                        className={message ? "flex-grow p-3 border border-gray-300 rounded-l-xl focus:outline-none" : "flex-grow p-3 border border-gray-300 rounded-xl focus:outline-none"}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button className={message && username ? "p-3 bg-green-500 text-white rounded-r-xl" : "hidden"} onClick={sendMessage}>
                        <IoMdSend size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
