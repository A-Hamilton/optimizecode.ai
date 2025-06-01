import React from "react";

const BlogPage: React.FC = () => {
  return (
    <div className="page">
      <div className="container">
        <h1>Blog & Resources</h1>
        <p>
          Latest insights on AI, code optimization, and developer productivity
        </p>

        <div className="blog-posts">
          <article className="blog-post">
            <h3>How AI is Revolutionizing Code Optimization</h3>
            <p>Explore the latest advances in AI-powered code analysis...</p>
            <span className="post-date">Dec 15, 2024</span>
          </article>
          <article className="blog-post">
            <h3>Reducing Cloud Costs: A Developer's Guide</h3>
            <p>Learn practical strategies to optimize your cloud spending...</p>
            <span className="post-date">Dec 10, 2024</span>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
