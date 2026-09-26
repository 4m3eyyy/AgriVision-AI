import {
  BarChart3,
  Bell,
  Bot,
  Camera,
  ChevronRight,
  CloudSun,
  Droplets,
  FlaskConical,
  Home,
  Leaf,
  Menu,
  Settings,
  Sprout,
  TrendingUp,
  User,
  Wheat,
  X,
} from "lucide-react";

import { useState } from "react";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const features = [
    {
      title: "Crop Recommendation",
      description: "Find the most suitable crop for your soil and climate.",
      icon: Sprout,
      className: "green",
    },
    {
      title: "Disease Detection",
      description: "Scan a plant leaf and detect possible diseases using AI.",
      icon: Camera,
      className: "orange",
    },
    {
      title: "Fertilizer Recommendation",
      description: "Get fertilizer suggestions based on crop and soil data.",
      icon: FlaskConical,
      className: "blue",
    },
    {
      title: "Weather Intelligence",
      description: "Check current weather conditions for your location.",
      icon: CloudSun,
      className: "sky",
    },
    {
      title: "Market Intelligence",
      description: "Explore agricultural market prices and predictions.",
      icon: TrendingUp,
      className: "purple",
    },
    {
      title: "AgriVision AI",
      description: "Ask our AI assistant your agriculture-related questions.",
      icon: Bot,
      className: "dark",
    },
  ];

  return (
    <div className="app">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>

        <div className="brand">
          <div className="brand-icon">
            <Leaf size={22} />
          </div>

          <div>
            <h2>AgriVision</h2>
            <span>AI Agriculture</span>
          </div>

          <button
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="navigation">

          <p className="nav-label">MAIN</p>

          <button className="nav-item active">
            <Home size={19} />
            <span>Dashboard</span>
          </button>

          <button className="nav-item">
            <Sprout size={19} />
            <span>Crop Recommendation</span>
          </button>

          <button className="nav-item">
            <Camera size={19} />
            <span>Disease Detection</span>
          </button>

          <button className="nav-item">
            <FlaskConical size={19} />
            <span>Fertilizer</span>
          </button>

          <button className="nav-item">
            <CloudSun size={19} />
            <span>Weather</span>
          </button>

          <button className="nav-item">
            <BarChart3 size={19} />
            <span>Market Intelligence</span>
          </button>

          <p className="nav-label second">AI TOOLS</p>

          <button className="nav-item">
            <Bot size={19} />
            <span>AI Assistant</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button className="nav-item">
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="sidebar-profile">
            <div className="profile-avatar">
              <User size={18} />
            </div>

            <div>
              <strong>Farmer</strong>
              <span>AgriVision User</span>
            </div>
          </div>

        </div>

      </aside>

      {/* Main Content */}
      <main className="main">

        {/* Topbar */}
        <header className="topbar">

          <button
            className="menu-button"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>

          <div className="topbar-left">
            <span className="breadcrumb">Dashboard</span>
          </div>

          <div className="topbar-right">

            <button className="icon-button">
              <Bell size={19} />
              <span className="notification-dot"></span>
            </button>

            <div className="user-avatar">
              <User size={18} />
            </div>

          </div>

        </header>

        {/* Dashboard Content */}
        <section className="dashboard">

          {/* Welcome */}
          <div className="welcome-section">

            <div>
              <p className="eyebrow">SMART AGRICULTURE</p>

              <h1>
                Welcome to <span>AgriVision AI</span>
              </h1>

              <p className="welcome-text">
                Intelligent tools to help you make better farming decisions.
              </p>
            </div>

            <div className="date-card">
              <CloudSun size={20} />
              <div>
                <strong>Today's Intelligence</strong>
                <span>Weather & market insights</span>
              </div>
            </div>

          </div>

          {/* Quick Stats */}
          <div className="stats-grid">

            <div className="stat-card">
              <div className="stat-icon green-bg">
                <Wheat size={21} />
              </div>

              <div>
                <span>Crop Recommendations</span>
                <strong>AI Powered</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange-bg">
                <Camera size={21} />
              </div>

              <div>
                <span>Disease Detection</span>
                <strong>Image Analysis</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue-bg">
                <Droplets size={21} />
              </div>

              <div>
                <span>Weather Data</span>
                <strong>Live Conditions</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon purple-bg">
                <TrendingUp size={21} />
              </div>

              <div>
                <span>Market Intelligence</span>
                <strong>Price Prediction</strong>
              </div>
            </div>

          </div>

          {/* Features */}
          <div className="section-heading">
            <div>
              <h2>Explore AgriVision</h2>
              <p>Everything you need for smarter agricultural decisions.</p>
            </div>
          </div>

          <div className="feature-grid">

            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <button
                  className={`feature-card ${feature.className}`}
                  key={feature.title}
                >

                  <div className="feature-top">
                    <div className="feature-icon">
                      <Icon size={22} />
                    </div>

                    <ChevronRight
                      size={19}
                      className="feature-arrow"
                    />
                  </div>

                  <div className="feature-content">
                    <h3>{feature.title}</h3>

                    <p>{feature.description}</p>
                  </div>

                </button>
              );
            })}

          </div>

          {/* Bottom Information */}
          <div className="bottom-grid">

            <div className="info-card weather-card">

              <div className="info-header">
                <div>
                  <p className="card-label">WEATHER</p>
                  <h3>Farm Weather</h3>
                </div>

                <CloudSun size={27} />
              </div>

              <div className="weather-content">
                <strong>28°C</strong>

                <div>
                  <span>Partly Cloudy</span>
                  <small>Mumbai, Maharashtra</small>
                </div>
              </div>

              <div className="weather-details">
                <span>Humidity <strong>72%</strong></span>
                <span>Wind <strong>12 km/h</strong></span>
              </div>

            </div>

            <div className="info-card market-card">

              <div className="info-header">
                <div>
                  <p className="card-label">MARKET</p>
                  <h3>Market Intelligence</h3>
                </div>

                <TrendingUp size={27} />
              </div>

              <div className="market-price">
                <div>
                  <span>Onion</span>
                  <strong>₹2,025</strong>
                </div>

                <div className="price-badge">
                  Predicted
                </div>
              </div>

              <p className="market-note">
                View agricultural market prices and AI predictions.
              </p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;