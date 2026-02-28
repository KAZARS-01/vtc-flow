import { Calendar, Euro, TrendingUp, Clock, MapPin } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
    const upcomingRides = [
        { id: '1', time: '14:30', client: 'Karim Bennani', route: 'Paris Centre → Orly T3', price: '65€', status: 'CONFIRMED' },
        { id: '2', time: '16:00', client: 'M. Dupont', route: 'Gare de Lyon → La Défense', price: '45€', status: 'PENDING' },
        { id: '3', time: '19:15', client: 'Sarah M.', route: 'CDG T2E → Paris 8ème', price: '75€', status: 'CONFIRMED' },
    ];

    return (
        <div className="dashboard-container">
            {/* Stats Row */}
            <div className="stats-grid">
                <div className="stat-card glass-panel">
                    <div className="stat-icon" style={{ background: 'rgba(0, 230, 118, 0.1)', color: 'var(--accent-neon)' }}>
                        <Euro size={24} />
                    </div>
                    <div className="stat-info">
                        <p>Revenus du jour</p>
                        <h3>345.00 €</h3>
                        <span className="trend positive"><TrendingUp size={14} /> +12% vs Hier</span>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon" style={{ background: 'rgba(0, 176, 255, 0.1)', color: 'var(--accent-blue)' }}>
                        <Calendar size={24} />
                    </div>
                    <div className="stat-info">
                        <p>Courses Actives</p>
                        <h3>5</h3>
                        <span className="trend neutral">Aujourd'hui</span>
                    </div>
                </div>

                <div className="stat-card glass-panel">
                    <div className="stat-icon" style={{ background: 'rgba(255, 152, 0, 0.1)', color: '#FF9800' }}>
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <p>Temps de Conduite</p>
                        <h3>4h 30m</h3>
                        <span className="trend neutral">Limite légale: 10h</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                {/* Upcoming Rides */}
                <div className="rides-section glass-panel">
                    <div className="section-header">
                        <h3>Courses à venir</h3>
                        <button className="btn-link">Voir tout</button>
                    </div>

                    <div className="rides-list">
                        {upcomingRides.map((ride) => (
                            <div key={ride.id} className="ride-card">
                                <div className="ride-time">
                                    <h4>{ride.time}</h4>
                                    <span className={`status-badge ${ride.status.toLowerCase()}`}>{ride.status}</span>
                                </div>
                                <div className="ride-details">
                                    <p className="client-name">{ride.client}</p>
                                    <p className="route-info"><MapPin size={14} /> {ride.route}</p>
                                </div>
                                <div className="ride-action">
                                    <div className="price">{ride.price}</div>
                                    <button className="btn btn-secondary small">Naviguer</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Map Preview or Activity Chart */}
                <div className="activity-section glass-panel">
                    <div className="section-header">
                        <h3>Activité (Semaine)</h3>
                    </div>
                    <div className="chart-placeholder">
                        <div className="bar" style={{ height: '60%' }}></div>
                        <div className="bar" style={{ height: '80%' }}></div>
                        <div className="bar" style={{ height: '40%' }}></div>
                        <div className="bar" style={{ height: '100%', background: 'var(--accent-neon)', boxShadow: 'var(--shadow-neon)' }}></div>
                        <div className="bar" style={{ height: '50%' }}></div>
                        <div className="bar" style={{ height: '30%' }}></div>
                        <div className="bar" style={{ height: '70%' }}></div>
                    </div>
                    <div className="chart-labels">
                        <span>Lun</span><span>Mar</span><span>Mer</span><span style={{ color: 'var(--accent-neon)', fontWeight: 'bold' }}>Jeu</span><span>Ven</span><span>Sam</span><span>Dim</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
