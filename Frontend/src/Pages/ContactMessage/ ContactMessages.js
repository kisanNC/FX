import React, { useState } from "react";
import { Trash2, MessageSquareReply, Send } from "lucide-react";
import DeleteConfirmModal from "../../utils/DeleteConfirmModal";

const Initialmessages = [
  { id: 1, user: "JohnDoe", rating: 4, comment: "Excellent image and works" },
  { id: 2, user: "JaneSmith", rating: 5, comment: "Excellent image and works" },
  { id: 3, user: "Alice", rating: 4, comment: "Excellent image and works" },
  { id: 4, user: "Bob", rating: 3, comment: "Nice photo collection" },
  { id: 5, user: "Charlie", rating: 5, comment: "Amazing experience!" },
  { id: 6, user: "Diana", rating: 4, comment: "Very professional." },
  { id: 7, user: "Eve", rating: 5, comment: "Loved the edits!" },
  { id: 8, user: "Frank", rating: 3, comment: "Good, but can improve." },
  { id: 9, user: "Grace", rating: 4, comment: "Great service." },
  { id: 10, user: "Hank", rating: 5, comment: "Highly recommended!" },
];

const RatingStars = ({ rating }) => (
  <div className="text-orange-400 text-lg">
    {"★".repeat(rating)}
    {"☆".repeat(5 - rating)}
  </div>
);

const ContactMessages = () => {
  const [replyVisible, setReplyVisible] = useState({});
  const [messages, setMessages] = useState(Initialmessages);
  const [deleteId, setDeleteId] = useState(null);
  const [replies, setReplies] = useState({});
  const [inputValues, setInputValues] = useState({});

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = () => {
    setMessages((prev) => prev.filter((msg) => msg.id !== deleteId));
    setReplies((prev) => {
      const updated = { ...prev };
      delete updated[deleteId];
      return updated;
    });
    setInputValues((prev) => {
      const updated = { ...prev };
      delete updated[deleteId];
      return updated;
    });
    setDeleteId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteId(null);
  };

  const toggleReply = (id) => {
    setReplyVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInputChange = (id, value) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

const handleSendReply = (id) => {
  const newReply = inputValues[id]?.trim();
  if (!newReply) return;

  console.log(`Reply to ${messages.find((m) => m.id === id)?.user}:`, newReply); // <-- log to console

  setReplies((prev) => ({
    ...prev,
    [id]: [...(prev[id] || []), newReply],
  }));

  setInputValues((prev) => ({ ...prev, [id]: "" }));
  setReplyVisible((prev) => ({ ...prev, [id]: false }));
};


  return (
    <div className="max-h-[90vh] mt-[4rem] md:mt-[1.5rem] overflow-auto px-6 py-6">
      <h1 className="text-3xl font-semibold mb-8 text-black text-center">
        Client Reviews
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white p-5 rounded-2xl shadow border border-orange-100 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-sm text-black font-semibold mb-1">
                {msg.user}
              </h3>
              <RatingStars rating={msg.rating} />
              <p className="text-gray-700 mt-2 text-base">{msg.comment}</p>

              {replies[msg.id]?.length > 0 && (
                <div className="mt-4 bg-orange-50 rounded-lg p-3 text-sm text-gray-800">
                  <strong className="block text-black mb-1">Your Replies:</strong>
                  <ul className="list-disc ml-4">
                    {replies[msg.id].map((reply, i) => (
                      <li key={i}>{reply}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-4 flex gap-4 text-sm text-black">
              <button
                onClick={() => toggleReply(msg.id)}
                className="flex items-center gap-1 hover:text-orange-600 transition"
              >
                <MessageSquareReply size={18} />
                Reply
              </button>
              <button
                onClick={() => handleDelete(msg.id)}
                className="flex items-center gap-1 hover:text-orange-600 transition"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>

            {replyVisible[msg.id] && (
              <div className="mt-3 flex items-center border border-orange-300 rounded-lg px-2 py-2 bg-white">
                <input
                  type="text"
                  value={inputValues[msg.id] || " "}
                  onChange={(e) => handleInputChange(msg.id, e.target.value)}
                  placeholder="Write your reply..."
                  className="flex-1 outline-none bg-transparent"
                />
                <button
                  type="button"
                  className="ml-2 text-orange-500 hover:text-orange-700"
                  title="Send Reply"
                  onClick={() => handleSendReply(msg.id)}
                >
                  <Send size={20} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <DeleteConfirmModal
        open={deleteId !== null}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this message?"
      />
    </div>
  );
};

export default ContactMessages;
