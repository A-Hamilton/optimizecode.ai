import React from "react";

const SupportPage: React.FC = () => {
  return (
    <div className="page">
      <div className="container">
        <h1>Support & Contact</h1>
        <p>Get help when you need it</p>

        <div className="support-options">
          <div className="support-card">
            <h3>📚 Knowledge Base</h3>
            <p>Search our comprehensive documentation</p>
            <button className="btn-primary">Browse Articles</button>
          </div>
          <div className="support-card">
            <h3>💬 Live Chat</h3>
            <p>Chat with our support team</p>
            <button className="btn-primary">Start Chat</button>
          </div>
          <div className="support-card">
            <h3>📧 Email Support</h3>
            <p>Send us a detailed message</p>
            <button className="btn-primary">Send Email</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
