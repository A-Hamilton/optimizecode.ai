import React from "react";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}

const AboutPage: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Jane Doe",
      role: "CEO & Co-founder",
      bio: "Former Google engineer with 10+ years optimizing large-scale systems. Passionate about making developer tools accessible.",
      avatar:
        "data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23646cff'/%3E%3Ctext x='40' y='48' text-anchor='middle' fill='white' font-size='24' font-weight='bold'%3EJD%3C/text%3E%3C/svg%3E",
      linkedin: "https://linkedin.com/in/jane-doe",
      twitter: "https://twitter.com/jane_doe",
    },
    {
      name: "John Smith",
      role: "CTO & Co-founder",
      bio: "AI/ML expert with PhD in Computer Science. Previously led engineering teams at Microsoft and AWS.",
      avatar:
        "data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='40' fill='%2322c55e'/%3E%3Ctext x='40' y='48' text-anchor='middle' fill='white' font-size='24' font-weight='bold'%3EJS%3C/text%3E%3C/svg%3E",
      linkedin: "https://linkedin.com/in/john-smith",
      github: "https://github.com/john-smith",
    },
    {
      name: "Sarah Chen",
      role: "VP of Engineering",
      bio: "Full-stack architect with expertise in scalable systems. Former tech lead at Stripe, building developer-first products.",
      avatar:
        "data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23f59e0b'/%3E%3Ctext x='40' y='48' text-anchor='middle' fill='white' font-size='24' font-weight='bold'%3ESC%3C/text%3E%3C/svg%3E",
      linkedin: "https://linkedin.com/in/sarah-chen",
      github: "https://github.com/sarah-chen",
    },
    {
      name: "Mike Rodriguez",
      role: "Head of AI Research",
      bio: "Machine learning researcher focused on code analysis and optimization. Published 15+ papers on automated programming.",
      avatar:
        "data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='40' fill='%23e11d48'/%3E%3Ctext x='40' y='48' text-anchor='middle' fill='white' font-size='24' font-weight='bold'%3EMR%3C/text%3E%3C/svg%3E",
      linkedin: "https://linkedin.com/in/mike-rodriguez",
      twitter: "https://twitter.com/mike_research",
    },
  ];

  const values = [
    {
      icon: "🚀",
      title: "Innovation First",
      description:
        "We push the boundaries of what's possible with AI and code optimization.",
    },
    {
      icon: "👥",
      title: "Developer-Centric",
      description:
        "Every decision we make is focused on improving the developer experience.",
    },
    {
      icon: "🔒",
      title: "Security & Privacy",
      description:
        "Your code is never stored permanently and is processed with enterprise-grade security.",
    },
    {
      icon: "🌍",
      title: "Global Impact",
      description:
        "Making better software development accessible to developers worldwide.",
    },
  ];

  const milestones = [
    {
      year: "2023",
      title: "The Problem",
      description:
        "After spending countless hours manually optimizing code at our previous companies, we realized there had to be a better way.",
    },
    {
      year: "Early 2024",
      title: "The Solution",
      description:
        "We started building the first AI models specifically trained on code optimization patterns and performance improvements.",
    },
    {
      year: "Mid 2024",
      title: "First Release",
      description:
        "Launched our beta with support for JavaScript and Python, helping 1,000+ developers optimize their code.",
    },
    {
      year: "Late 2024",
      title: "Scaling Up",
      description:
        "Added 15+ programming languages and enterprise features. Now processing millions of lines of code monthly.",
    },
  ];

  const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-all duration-300 group">
      <div className="flex flex-col items-center text-center">
        <img
          src={member.avatar}
          alt={member.name}
          className="w-20 h-20 rounded-full mb-4 group-hover:scale-105 transition-transform duration-300"
        />
        <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
        <p className="text-primary font-medium mb-3">{member.role}</p>
        <p className="text-white/70 text-sm leading-relaxed mb-4">
          {member.bio}
        </p>

        {/* Social Links */}
        <div className="flex gap-3">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-primary transition-colors p-2 hover:bg-white/10 rounded-lg"
              title="LinkedIn"
            >
              💼
            </a>
          )}
          {member.twitter && (
            <a
              href={member.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-primary transition-colors p-2 hover:bg-white/10 rounded-lg"
              title="Twitter"
            >
              🐦
            </a>
          )}
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-primary transition-colors p-2 hover:bg-white/10 rounded-lg"
              title="GitHub"
            >
              🐙
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-6">
            About OptimizeCode.ai
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to make code optimization accessible to every
            developer, eliminating the tedious manual work and empowering teams
            to build faster, more efficient software.
          </p>
        </header>

        {/* Our Story Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Our Story
          </h2>
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 mb-8">
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              Founded in 2024, OptimizeCode.ai was born from the frustration of
              manual code optimization. Our founders, Jane and John, spent years
              at major tech companies watching talented developers waste
              countless hours on repetitive optimization tasks that could be
              automated.
            </p>
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              The breaking point came during a critical product launch where the
              team spent three weeks optimizing a codebase for performance, only
              to introduce new bugs and complexity. We knew there had to be a
              better way – one that leveraged AI to understand code patterns and
              optimization techniques better than any human could manually
              apply.
            </p>
            <p className="text-white/80 text-lg leading-relaxed">
              Today, we're proud to help thousands of developers worldwide
              optimize millions of lines of code, reducing deployment times,
              cutting cloud costs, and improving software quality across the
              industry.
            </p>
          </div>

          {/* Timeline */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              Our Journey
            </h3>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">
                      {milestone.year}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-white mb-2">
                      {milestone.title}
                    </h4>
                    <p className="text-white/70 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:bg-white/8 transition-all duration-300"
              >
                <div className="text-3xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Meet Our Team
          </h2>
          <p className="text-white/70 text-center mb-12 max-w-2xl mx-auto">
            We're a diverse group of engineers, researchers, and product
            builders passionate about making software development more efficient
            and enjoyable.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={index} member={member} />
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            By The Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">2M+</div>
              <div className="text-white/70">Lines of Code Optimized</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <div className="text-white/70">Developers Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">40%</div>
              <div className="text-white/70">
                Average Performance Improvement
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-white/70">Programming Languages</div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center bg-white/5 border border-white/10 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Want to Join Our Mission?
          </h2>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals who share our passion
            for improving software development through AI innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:careers@optimizecode.ai"
              className="bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Open Positions
            </a>
            <a
              href="mailto:hello@optimizecode.ai"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium border border-white/20 transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
