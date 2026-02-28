import { Phone, Mail, MessageCircle, Star, MapPin } from 'lucide-react';
import './PublicCardView.css';

export default function PublicCardView() {
    const driver = {
        name: "Walid",
        role: "Chauffeur VTC Premium",
        vehicle: "Mercedes-Benz Classe E",
        bio: "Transport de prestige à Paris & IDF. Ponctualité, discrétion et confort.",
        rating: 4.9,
        trips: 1250,
        phone: "+33612345678",
        email: "contact@vtc-flow.fr"
    };

    const handleWhatsApp = () => {
        window.open(`https://wa.me/${driver.phone}`, '_blank');
    };

    const handleCall = () => {
        window.open(`tel:${driver.phone}`, '_self');
    };

    return (
        <div className="public-mobile-container">
            <div className="gradient-background"></div>

            {/* Header / Profile Section */}
            <div className="profile-header">
                <div className="avatar-wrapper">
                    <img src="https://ui-avatars.com/api/?name=Walid&background=0D0A0B&color=00E676&size=200" alt="Walid" />
                    <div className="online-badge">EN LIGNE</div>
                </div>
                <h2>{driver.name}</h2>
                <span className="badge-premium">CHAUFFEUR GOLD</span>
            </div>

            {/* Stats Bar */}
            <div className="stats-bar glass-panel">
                <div className="stat-item">
                    <Star color="var(--accent-neon)" size={16} fill="var(--accent-neon)" />
                    <span>{driver.rating}</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <strong>{driver.trips}+</strong>
                    <span>Courses</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <MapPin size={16} />
                    <span>Paris</span>
                </div>
            </div>

            {/* Bio */}
            <div className="bio-section glass-panel">
                <p>{driver.bio}</p>
                <div className="vehicle-badge">🚘 {driver.vehicle}</div>
            </div>

            {/* Main Action Buttons */}
            <div className="actions-grid">
                <button className="main-btn booking-btn" onClick={() => window.location.href = '/'}>
                    DÉMARRER UNE RÉSERVATION
                </button>

                <div className="secondary-actions">
                    <button className="action-circle-btn whatsapp" onClick={handleWhatsApp}>
                        <MessageCircle size={24} />
                        <span>WhatsApp</span>
                    </button>
                    <button className="action-circle-btn call" onClick={handleCall}>
                        <Phone size={24} />
                        <span>Appeler</span>
                    </button>
                    <button className="action-circle-btn email" onClick={() => window.open(`mailto:${driver.email}`)}>
                        <Mail size={24} />
                        <span>Email</span>
                    </button>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
                <div className="trust-item">🛡️ Paiement Sécurisé</div>
                <div className="trust-item">🧾 Facturation Officielle</div>
            </div>

            {/* Footer */}
            <footer className="card-footer">
                <div className="brand-logo">VF</div>
                <span>Propulsé par VTC-Flow</span>
            </footer>
        </div>
    );
}
