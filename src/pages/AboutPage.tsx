import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="page">
      <div className="container">
        <h1>About OptimizeCode.ai</h1>
        <p>
          Our mission is to make code optimization accessible to every developer
        </p>

        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Founded in 2024, OptimizeCode.ai was born from the frustration of
            manual code optimization...
          </p>
        </section>

        <section className="team-section">
          <h2>Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <h3>Jane Doe</h3>
              <p>CEO & Co-founder</p>
            </div>
            <div className="team-member">
              <h3>John Smith</h3>
              <p>CTO & Co-founder</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
