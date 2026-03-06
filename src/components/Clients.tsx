import { useState } from 'react';
import { Search, UserPlus, Phone, Mail, MoreVertical, ShieldCheck } from 'lucide-react';
import './Clients.css';

interface ClientsProps {
    initialShowModal?: boolean;
}

interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    trips: number;
    status: string;
}

export default function Clients({ initialShowModal = false }: ClientsProps) {
    const [clients] = useState<Client[]>([
        { id: 1, name: 'Jean Dupont', email: 'j.dupont@email.com', phone: '06 12 34 56 78', trips: 14, status: 'VIP' },
        { id: 2, name: 'Marie Leroy', email: 'm.leroy@outlook.fr', phone: '07 88 45 22 10', trips: 3, status: 'REGULAR' },
        { id: 3, name: 'Robert Martin', email: 'robert.m@company.com', phone: '06 55 44 33 22', trips: 28, status: 'BUSINESS' },
    ]);

    const [isAdding, setIsAdding] = useState(initialShowModal);

    return (
        <div className="clients-container animate-fade-in">
            <div className="clients-header">
                <div className="search-box glass-panel">
                    <Search size={18} />
                    <input type="text" placeholder="Rechercher par nom, email ou téléphone..." />
                </div>
                <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
                    <UserPlus size={18} /> Nouveau Client
                </button>
            </div>

            <div className="clients-list glass-panel">
                <table className="clients-table">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Contact</th>
                            <th>Courses</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client: Client) => (
                            <tr key={client.id}>
                                <td className="client-name-cell">
                                    <div className="avatar-sm">
                                        {client.name.split(' ').map((n: string) => n[0]).join('')}
                                    </div>
                                    <span>{client.name}</span>
                                </td>
                                <td>
                                    <div className="contact-info-sm">
                                        <span><Phone size={12} /> {client.phone}</span>
                                        <span><Mail size={12} /> {client.email}</span>
                                    </div>
                                </td>
                                <td><strong>{client.trips}</strong></td>
                                <td>
                                    <span className={`badge badge-${client.status.toLowerCase()}`}>
                                        {client.status === 'VIP' && <ShieldCheck size={12} />} {client.status}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-icon"><MoreVertical size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isAdding && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel animate-scale-in">
                        <h3>Ajouter un Nouveau Client</h3>
                        <div className="form-grid">
                            <div className="input-group">
                                <label>Nom Complet</label>
                                <input type="text" className="input-field" placeholder="Ex: Walid ..." />
                            </div>
                            <div className="input-group">
                                <label>Téléphone</label>
                                <input type="text" className="input-field" placeholder="06 ..." />
                            </div>
                            <div className="input-group" style={{ gridColumn: 'span 2' }}>
                                <label>Email</label>
                                <input type="email" className="input-field" placeholder="client@email.com" />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setIsAdding(false)}>Annuler</button>
                            <button className="btn btn-primary" onClick={() => setIsAdding(false)}>Enregistrer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
