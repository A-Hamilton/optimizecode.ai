import React, { useState } from "react";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured?: boolean;
}

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const blogPosts: BlogPost[] = [
    {
      id: "ai-code-optimization",
      title: "How AI is Revolutionizing Code Optimization",
      excerpt:
        "Explore the latest advances in AI-powered code analysis and how machine learning models are making developers more productive than ever before.",
      content: "Full article content would go here...",
      author: "Jane Doe",
      date: "Dec 15, 2024",
      readTime: "8 min read",
      category: "AI & Technology",
      tags: ["AI", "Machine Learning", "Code Optimization"],
      featured: true,
    },
    {
      id: "cloud-cost-reduction",
      title: "Reducing Cloud Costs: A Developer's Guide",
      excerpt:
        "Learn practical strategies to optimize your cloud spending through better code efficiency, resource management, and smart architectural decisions.",
      content: "Full article content would go here...",
      author: "John Smith",
      date: "Dec 10, 2024",
      readTime: "12 min read",
      category: "Performance",
      tags: ["Cloud", "Cost Optimization", "AWS", "Performance"],
    },
    {
      id: "legacy-code-modernization",
      title: "Modernizing Legacy Code with AI: Best Practices",
      excerpt:
        "Discover how to safely transform legacy codebases using AI-assisted refactoring, maintaining functionality while improving maintainability.",
      content: "Full article content would go here...",
      author: "Sarah Chen",
      date: "Dec 8, 2024",
      readTime: "10 min read",
      category: "Best Practices",
      tags: ["Legacy Code", "Refactoring", "Best Practices"],
    },
    {
      id: "javascript-performance",
      title: "JavaScript Performance Optimization in 2024",
      excerpt:
        "Modern techniques for optimizing JavaScript applications, from bundle splitting to runtime optimizations and memory management.",
      content: "Full article content would go here...",
      author: "Mike Rodriguez",
      date: "Dec 5, 2024",
      readTime: "15 min read",
      category: "Performance",
      tags: ["JavaScript", "Performance", "Web Development"],
    },
    {
      id: "security-code-review",
      title: "Automated Security Code Review: The Future is Here",
      excerpt:
        "How AI-powered security analysis is changing the way we identify and fix vulnerabilities in codebases before they reach production.",
      content: "Full article content would go here...",
      author: "Alex Kim",
      date: "Dec 2, 2024",
      readTime: "7 min read",
      category: "Security",
      tags: ["Security", "Code Review", "DevSecOps"],
    },
    {
      id: "typescript-optimization",
      title: "TypeScript Code Optimization: Types That Perform",
      excerpt:
        "Leverage TypeScript's type system not just for safety, but for performance. Learn optimization patterns specific to TypeScript development.",
      content: "Full article content would go here...",
      author: "Emma Wilson",
      date: "Nov 28, 2024",
      readTime: "9 min read",
      category: "Best Practices",
      tags: ["TypeScript", "Performance", "Types"],
    },
  ];

  const categories = [
    { id: "all", name: "All Posts", count: blogPosts.length },
    {
      id: "AI & Technology",
      name: "AI & Technology",
      count: blogPosts.filter((p) => p.category === "AI & Technology").length,
    },
    {
      id: "Performance",
      name: "Performance",
      count: blogPosts.filter((p) => p.category === "Performance").length,
    },
    {
      id: "Best Practices",
      name: "Best Practices",
      count: blogPosts.filter((p) => p.category === "Best Practices").length,
    },
    {
      id: "Security",
      name: "Security",
      count: blogPosts.filter((p) => p.category === "Security").length,
    },
  ];

  const filteredPosts =
    selectedCategory === "all"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  const BlogPostCard: React.FC<{ post: BlogPost; featured?: boolean }> = ({
    post,
    featured = false,
  }) => (
    <article
      className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/8 transition-all duration-300 group ${featured ? "lg:col-span-2" : ""}`}
    >
      <div className="p-6">
        {/* Category & Date */}
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-medium rounded-full">
            {post.category}
          </span>
          <div className="flex items-center gap-4 text-xs text-white/60">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`font-bold text-white mb-3 group-hover:text-primary transition-colors ${featured ? "text-2xl" : "text-xl"}`}
        >
          <Link to={`/blog/${post.id}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p
          className={`text-white/70 leading-relaxed mb-4 ${featured ? "text-base" : "text-sm"}`}
        >
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white/10 text-white/60 text-xs rounded hover:bg-white/20 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author & Read More */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-primary text-xs font-bold">
                {post.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <span className="text-white/70 text-sm">{post.author}</span>
          </div>
          <Link
            to={`/blog/${post.id}`}
            className="text-primary hover:text-primary-light text-sm font-medium group-hover:translate-x-1 transition-all duration-300 flex items-center gap-1"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );

  return (
    <div className="page min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-6">
            Blog & Resources
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Latest insights on AI, code optimization, and developer
            productivity. Learn from our team and the community about building
            better software.
          </p>
        </header>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-4 mb-12 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-primary text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === "all" && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Featured Article
            </h2>
            <BlogPostCard post={featuredPost} featured />
          </section>
        )}

        {/* Regular Posts Grid */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">
            {selectedCategory === "all"
              ? "Latest Articles"
              : `${selectedCategory} Articles`}
          </h2>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(selectedCategory === "all" ? regularPosts : filteredPosts).map(
                (post) => (
                  <BlogPostCard key={post.id} post={post} />
                ),
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-white/80 mb-2">
                No posts found
              </h3>
              <p className="text-white/60">
                Try selecting a different category or check back later for new
                content.
              </p>
            </div>
          )}
        </section>

        {/* Newsletter Signup */}
        <section className="mt-16 bg-white/5 border border-white/10 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Get the latest articles, tutorials, and insights delivered to your
            inbox. No spam, just valuable content for developers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-primary transition-colors"
            />
            <button className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-white/50 mt-3">
            Join 5,000+ developers already subscribed
          </p>
        </section>

        {/* Related Resources */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Related Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/docs"
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-all duration-300 group"
            >
              <div className="text-3xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                Documentation
              </h3>
              <p className="text-white/70 text-sm">
                Complete API reference and integration guides
              </p>
            </Link>

            <Link
              to="/optimize"
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-all duration-300 group"
            >
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                Try the Tool
              </h3>
              <p className="text-white/70 text-sm">
                Experience AI-powered code optimization firsthand
              </p>
            </Link>

            <a
              href="https://github.com/optimizecode-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-all duration-300 group"
            >
              <div className="text-3xl mb-4">🐙</div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                Open Source
              </h3>
              <p className="text-white/70 text-sm">
                Contribute to our open source tools and examples
              </p>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;
