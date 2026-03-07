import { useState, useEffect } from 'react';
import { Navigation, Clock, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import AddressAutocomplete from './AddressAutocomplete';
import './QuickQuote.css';

export default function QuickQuote() {
    const [documentType, setDocumentType] = useState<'MISSION_ORDER' | 'QUOTE' | 'INVOICE'>('MISSION_ORDER');
    const [isGenerated, setIsGenerated] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfData, setPdfData] = useState<any>(null);
    const [clientEmail, setClientEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    // Form Navigation & Maps State
    const [departure, setDeparture] = useState<{ address: string, lat: number, lng: number } | null>(null);
    const [arrival, setArrival] = useState<{ address: string, lat: number, lng: number } | null>(null);

    // User can manually exit these if needed
    const [distanceText, setDistanceText] = useState('0 km');
    const [durationText, setDurationText] = useState('0 min');
    const [estimatedPrice, setEstimatedPrice] = useState(0);

    // Calculate rough distance using Haversine formula (since Google is paid)
    useEffect(() => {
        if (departure && arrival) {
            const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
                const R = 6371; // Radius of the earth in km
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;
                const a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const d = R * c; // Distance in km
                return d;
            };

            const directDistance = calculateDistance(departure.lat, departure.lng, arrival.lat, arrival.lng);
            // Multiplier for road distance (typically 1.25 to 1.4 in cities)
            const roadDistance = Math.round(directDistance * 1.3);
            const approxDuration = Math.round(roadDistance * 2.5); // 2.5 min/km average in city

            setDistanceText(`${roadDistance} km`);
            setDurationText(`${approxDuration} min`);

            // Pricing: 5€ base + 2€/km + 0.5€/min (Walid's Premium Pricing)
            const price = 5 + (roadDistance * 2.0) + (approxDuration * 0.5);
            setEstimatedPrice(Math.max(35, Math.round(price))); // Minimum 35€
        }
    }, [departure, arrival]);

    const handleSendEmail = async () => {
        if (!clientEmail) return;
        setIsSending(true);
        const apiUrl = import.meta.env.VITE_API_URL
            ? `${import.meta.env.VITE_API_URL}/api/v1/documents/send-email`
            : import.meta.env.MODE === 'production'
                ? '/api/v1/documents/send-email'
                : 'http://localhost:5001/api/v1/documents/send-email';

        try {
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: clientEmail,
                    document_url: pdfData.pdf_url,
                    document_type: documentType === 'MISSION_ORDER' ? 'Bon de Commande' : documentType === 'QUOTE' ? 'Devis' : 'Facture'
                })
            });
            setEmailSent(true);
        } catch (error) {
            console.error('Email API Error:', error);
        } finally {
            setIsSending(false);
        }
    };

    const handleGenerate = async () => {
        if (!departure || !arrival) {
            alert("Veuillez saisir une adresse de départ et d'arrivée.");
            return;
        }

        setIsGenerating(true);
        let endpoint = '/api/v1/documents/generate-mission-order';
        if (documentType === 'QUOTE') endpoint = '/api/v1/documents/generate-quote';
        if (documentType === 'INVOICE') endpoint = '/api/v1/documents/generate-invoice';

        const apiUrl = import.meta.env.VITE_API_URL
            ? `${import.meta.env.VITE_API_URL}${endpoint}`
            : import.meta.env.MODE === 'production'
                ? endpoint
                : `http://localhost:5001${endpoint}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    booking_id: `bkg-${Math.floor(Math.random() * 10000)}`,
                    driver_id: 'drv-walid',
                    amount: estimatedPrice,
                    route: {
                        pickup_address: departure.address,
                        dropoff_address: arrival.address,
                        distance: distanceText,
                        duration: durationText
                    },
                    client_details: {
                        name: 'Client Standard'
                    }
                })
            });
            const data = await response.json();
            if (data.status === 'success') {
                setPdfData(data.data);
                setIsGenerated(true);
            } else {
                throw new Error(data.message || 'Erreur lors de la génération');
            }
        } catch (error: any) {
            console.error('API Error:', error);
            alert(`Erreur: ${error.message || 'Le serveur ne répond pas'}`);
        } finally {
            setIsGenerating(false);
        }
    };

    if (isGenerated) {
        return (
            <div className="quick-quote-container animate-fade-in" style={{ alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <CheckCircle2 size={80} color="var(--accent-neon)" style={{ marginBottom: '24px', filter: 'drop-shadow(0 0 15px rgba(0, 230, 118, 0.4))' }} />
                <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>
                    Document Prêt !
                </h2>
                <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '100%' }}>
                    <a href={pdfData.pdf_url} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                        📄 Ouvrir le PDF
                    </a>

                    {!emailSent ? (
                        <div style={{ width: '100%', display: 'flex', gap: '8px' }}>
                            <input
                                type="email"
                                className="input-field"
                                placeholder="Email client..."
                                style={{ flex: 1, padding: '12px', fontSize: '14px' }}
                                value={clientEmail}
                                onChange={(e) => setClientEmail(e.target.value)}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleSendEmail}
                                disabled={isSending || !clientEmail}
                                style={{ padding: '0 20px', minWidth: '100px', display: 'flex', justifyContent: 'center' }}
                            >
                                {isSending ? '...' : 'Email'}
                            </button>
                        </div>
                    ) : (
                        <div style={{ color: 'var(--accent-neon)', fontSize: '14px', fontWeight: 'bold', padding: '12px', background: 'rgba(0, 230, 118, 0.1)', borderRadius: '8px', width: '100%' }}>
                            ✅ Envoyé avec succès !
                        </div>
                    )}
                </div>
                <button className="btn btn-secondary" style={{ marginTop: '32px' }} onClick={() => {
                    setIsGenerated(false);
                    setPdfData(null);
                    setEmailSent(false);
                    setClientEmail('');
                }}>
                    Nouveau Document
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="quick-quote-container">
                <div className="pricing-tabs" style={{ marginBottom: '16px' }}>
                    <div className={`pricing-tab ${documentType === 'MISSION_ORDER' ? 'active' : ''}`} onClick={() => setDocumentType('MISSION_ORDER')} style={{ fontSize: '12px' }}>Bon Cmd</div>
                    <div className={`pricing-tab ${documentType === 'QUOTE' ? 'active' : ''}`} onClick={() => setDocumentType('QUOTE')} style={{ fontSize: '12px' }}>Devis</div>
                    <div className={`pricing-tab ${documentType === 'INVOICE' ? 'active' : ''}`} onClick={() => setDocumentType('INVOICE')} style={{ fontSize: '12px' }}>Facture</div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', position: 'relative', zIndex: 10 }}>
                    <div style={{ marginBottom: '16px' }}>
                        <AddressAutocomplete
                            label="Départ (Prise en charge)"
                            placeholder="Saisir adresse ou lieu..."
                            icon="navigation"
                            onAddressSelect={(addr, lat, lng) => setDeparture({ address: addr, lat, lng })}
                        />
                    </div>

                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <AddressAutocomplete
                            label="Arrivée (Destination)"
                            placeholder="Aéroport, Gare, Hôtel..."
                            icon="mappin"
                            onAddressSelect={(addr, lat, lng) => setArrival({ address: addr, lat, lng })}
                        />
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px', position: 'relative', zIndex: 5 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Navigation size={14} /> {distanceText}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {durationText}</span>
                    </div>

                    <div className="price-display">
                        <div className="price-amount">
                            {estimatedPrice.toFixed(2)} <span className="price-currency">€</span>
                        </div>
                        <p style={{ color: 'var(--accent-blue)', fontSize: '13px', fontWeight: 600 }}>Tarif Estimé (Base + Km + Min)</p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--accent-blue)', fontSize: '13px' }}>
                        <Info size={16} />
                        <span>Propulsé par l'API Adresse Nationale (GRATUIT)</span>
                    </div>
                </div>
            </div>

            <div className="sticky-footer">
                <div className="swipe-btn" onClick={handleGenerate} style={{ opacity: isGenerating ? 0.7 : 1 }}>
                    <div className="swipe-icon">
                        {isGenerating ? <Clock size={24} className="animate-spin" /> : <ChevronRight size={24} strokeWidth={3} />}
                    </div>
                    <span style={{ marginLeft: '40px', letterSpacing: '0.5px', fontSize: '14px' }}>
                        {isGenerating ? 'GÉNÉRATION EN COURS...' : `GÉNÉRER ${documentType === 'MISSION_ORDER' ? 'LE BON' : documentType === 'QUOTE' ? 'LE DEVIS' : 'LA FACTURE'}`}
                    </span>
                </div>
            </div>
        </>
    );
}
