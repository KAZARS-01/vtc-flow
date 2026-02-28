import { useState } from 'react'
import './App.css'
import {
  Car,
  FileText,
  Users,
  Settings,
  Bell,
  Plus,
  QrCode
} from 'lucide-react'
import QuickQuote from './components/QuickQuote'
import Dashboard from './components/Dashboard'
import VirtualCard from './components/VirtualCard'
import PublicCardView from './components/PublicCardView'

function App() {
  const [activeTab, setActiveTab] = useState('quote');

  // Simple "Router" for the public business card
  const urlParams = new URLSearchParams(window.location.search);
  const isPublicCard = urlParams.get('card') === '1';

  if (isPublicCard) {
    return <PublicCardView />;
  }

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">VF</div>
          <h1>VTC-Flow</h1>
        </div>

        <nav className="nav-links">
          <div
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Car size={20} />
            <span>Tableau de Bord</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'quote' ? 'active' : ''}`}
            onClick={() => setActiveTab('quote')}
          >
            <FileText size={20} />
            <span>Nouveau Devis</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            <Users size={20} />
            <span>Clients</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'card' ? 'active' : ''}`}
            onClick={() => setActiveTab('card')}
          >
            <QrCode size={20} />
            <span>Ma Carte Visite</span>
          </div>
          <div
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            <span>Paramètres</span>
          </div>
        </nav>

        <div className="driver-profile">
          <div className="avatar">
            <img src="https://ui-avatars.com/api/?name=Walid&background=0D0A0B&color=fff" alt="Driver" />
          </div>
          <div className="profile-info">
            <h4>Walid (Admin)</h4>
            <p><div className="status-dot"></div> En ligne</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-bar animate-fade-in">
          <h2>
            {activeTab === 'quote' && 'Créer un Bon de Commande'}
            {activeTab === 'dashboard' && 'Vue d\'Ensemble'}
            {activeTab === 'clients' && 'Base Clients'}
            {activeTab === 'card' && 'Outil de Parrainage & Revente'}
            {activeTab === 'settings' && 'Configuration'}
          </h2>
          <div className="action-bar">
            <button className="btn btn-secondary">
              <Bell size={18} />
            </button>
            <button className="btn btn-primary">
              <Plus size={18} />
              Nouveau Client
            </button>
          </div>
        </header>

        <div className="content-area animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Main Views will go here */}
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'quote' && <QuickQuote />}
          {activeTab === 'card' && <VirtualCard />}
        </div>
      </main>
    </div>
  )
}

export default App
