import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Copy, CheckCircle2, QrCode } from 'lucide-react';
import './VirtualCard.css';

export default function VirtualCard() {
    const [copied, setCopied] = useState(false);

    const driverInfo = {
        name: "Walid",
        role: "Chauffeur VTC Premium",
        phone: "+33 6 12 34 56 78",
        email: "contact@vtc-flow.fr",
        vehicle: "Mercedes-Benz Classe E",
        // Fake public booking URL
        bookingUrl: "https://vtc-flow.vercel.app/book/walid-premium"
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(driverInfo.bookingUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Réserver un VTC avec ${driverInfo.name}`,
                    text: `Réservez votre prochain trajet en VTC Premium avec ${driverInfo.name}.`,
                    url: driverInfo.bookingUrl,
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            handleCopy();
        }
    };

    return (
        <div className="virtual-card-container animate-fade-in">
            <div className="card-header">
                <h3>VOTRE CARTE VIRTUELLE</h3>
                <p>Partagez ce QR Code avec vos clients pour une réservation instantanée.</p>
            </div>

            <div className="card-wrapper">
                {/* The Physical-looking Card */}
                <div className="business-card glass-panel">
                    <div className="card-top-accent"></div>

                    <div className="card-content">
                        <div className="card-left">
                            <div className="driver-avatar-large">
                                <img src="https://ui-avatars.com/api/?name=Walid&background=0D0A0B&color=00E676&size=128" alt="Driver" />
                            </div>
                            <div className="driver-details">
                                <h2>{driverInfo.name}</h2>
                                <h4 className="role-badge">{driverInfo.role}</h4>
                                <div className="vehicle-info">🚘 {driverInfo.vehicle}</div>
                                <div className="contact-info">
                                    <span>📞 {driverInfo.phone}</span>
                                    <span>✉️ {driverInfo.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="card-right">
                            <div className="qr-container">
                                <QRCodeSVG
                                    value={driverInfo.bookingUrl}
                                    size={140}
                                    fgColor="#FFFFFF"
                                    bgColor="transparent"
                                    level="H"
                                    includeMargin={false}
                                />
                                <div className="scan-me">SCANNER POUR RÉSERVER</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="card-actions">
                    <button className="btn btn-primary action-btn" onClick={handleShare}>
                        <Share2 size={18} /> Partager le lien
                    </button>
                    <button className="btn btn-secondary action-btn" onClick={handleCopy}>
                        {copied ? <CheckCircle2 size={18} color="var(--accent-neon)" /> : <Copy size={18} />}
                        {copied ? 'Lien copié !' : 'Copier le lien'}
                    </button>
                </div>

                <div className="public-url-display glass-panel">
                    <QrCode size={16} className="url-icon" />
                    <span className="url-text">{driverInfo.bookingUrl}</span>
                </div>
            </div>
        </div>
    );
}
