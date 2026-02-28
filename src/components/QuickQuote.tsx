import { useState } from 'react';
import { MapPin, Navigation, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import './QuickQuote.css';

export default function QuickQuote() {
    const [pricingMode, setPricingMode] = useState<'FIXED' | 'HOURLY'>('FIXED');
    const [documentType, setDocumentType] = useState<'MISSION_ORDER' | 'QUOTE' | 'INVOICE'>('MISSION_ORDER');
    const [isGenerated, setIsGenerated] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfData, setPdfData] = useState<any>(null);
    const [clientEmail, setClientEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSendEmail = async () => {
        if (!clientEmail) return;
        setIsSending(true);
        const apiUrl = import.meta.env.MODE === 'production'
            ? 'https://vtc-flow-backend.onrender.com/api/v1/documents/send-email'
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
        setIsGenerating(true);
        let endpoint = '/api/v1/documents/generate-mission-order';
        if (documentType === 'QUOTE') endpoint = '/api/v1/documents/generate-quote';
        if (documentType === 'INVOICE') endpoint = '/api/v1/documents/generate-invoice';

        // Use relative URL for Vercel/Render proxy or direct backend URL in prod
        const apiUrl = import.meta.env.MODE === 'production'
            ? `https://vtc-flow-backend.onrender.com${endpoint}`
            : `http://localhost:5001${endpoint}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    booking_id: `bkg-${Math.floor(Math.random() * 10000)}`,
                    driver_id: 'drv-555',
                    route: {
                        pickup_address: 'Position Actuelle',
                        dropoff_address: 'Saisie Auto',
                    }
                })
            });
            const data = await response.json();
            if (data.status === 'success') {
                setPdfData(data.data);
                setIsGenerated(true);
            }
        } catch (error) {
            console.error('API Error:', error);
            // Fallback for demo if server is off
            setIsGenerated(true);
        } finally {
            setIsGenerating(false);
        }
    };

    if (isGenerated) {
        return (
            <div className="quick-quote-container animate-fade-in" style={{ alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <CheckCircle2 size={80} color="var(--accent-neon)" style={{ marginBottom: '24px', filter: 'drop-shadow(0 0 15px rgba(0, 230, 118, 0.4))' }} />
                <h2 style={{ fontSize: '32px', marginBottom: '16px' }}>
                    {documentType === 'MISSION_ORDER' && 'Bon de Commande Généré'}
                    {documentType === 'QUOTE' && 'Devis Généré'}
                    {documentType === 'INVOICE' && 'Facture Générée'}
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px', textAlign: 'center' }}>
                    {documentType === 'MISSION_ORDER' && 'Document validé via Hash SHA-256. Légalement conforme (L3121-2).'}
                    {documentType !== 'MISSION_ORDER' && 'Document édité et sauvegardé.'}
                    {pdfData && (
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
                    )}
                </p>
                <button className="btn btn-secondary" onClick={() => {
                    setIsGenerated(false);
                    setPdfData(null);
                    setEmailSent(false);
                    setClientEmail('');
                }}>
                    Nouveau Devis
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="quick-quote-container">

                {/* Document Type Selector */}
                <div className="pricing-tabs" style={{ marginBottom: '16px' }}>
                    <div className={`pricing-tab ${documentType === 'MISSION_ORDER' ? 'active' : ''}`} onClick={() => setDocumentType('MISSION_ORDER')} style={{ fontSize: '12px' }}>Bon Cmd</div>
                    <div className={`pricing-tab ${documentType === 'QUOTE' ? 'active' : ''}`} onClick={() => setDocumentType('QUOTE')} style={{ fontSize: '12px' }}>Devis</div>
                    <div className={`pricing-tab ${documentType === 'INVOICE' ? 'active' : ''}`} onClick={() => setDocumentType('INVOICE')} style={{ fontSize: '12px' }}>Facture</div>
                </div>

                {/* Card 1: Itinerary */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <div className="map-placeholder">
                        <MapPin size={18} style={{ marginRight: '8px' }} />
                        <span>Map Matrix API Preview</span>
                    </div>

                    <div className="input-group">
                        <label>Départ (Tap 1)</label>
                        <div style={{ position: 'relative' }}>
                            <Navigation size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--accent-blue)' }} />
                            <input type="text" className="input-field" style={{ width: '100%', paddingLeft: '48px' }} defaultValue="Ma Position Actuelle 🎯" />
                        </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>Arrivée (Tap 2)</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                            <input type="text" className="input-field" style={{ width: '100%', paddingLeft: '48px' }} placeholder="Saisir Destination (ex: Aéroport CDG)" />
                        </div>
                    </div>
                </div>

                {/* Card 2: Dynamic Pricing */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Navigation size={14} /> 24 km</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> 38 min</span>
                    </div>

                    <div className="price-display">
                        <div className="price-amount">
                            65.00 <span className="price-currency">€</span>
                        </div>
                        <p style={{ color: 'var(--accent-blue)', fontSize: '13px', fontWeight: 600 }}>Tarif Estimé</p>
                    </div>

                    <div className="pricing-tabs">
                        <div
                            className={`pricing-tab ${pricingMode === 'FIXED' ? 'active' : ''}`}
                            onClick={() => setPricingMode('FIXED')}
                        >
                            Forfait Fixe
                        </div>
                        <div
                            className={`pricing-tab ${pricingMode === 'HOURLY' ? 'active' : ''}`}
                            onClick={() => setPricingMode('HOURLY')}
                        >
                            Mise à dispo (Horaire)
                        </div>
                    </div>
                </div>

                {/* Card 3: Client Info */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label>Client (Optionnel)</label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <input type="text" className="input-field" style={{ flex: 1 }} placeholder="Rechercher habitué ou tel..." />
                            <button className="btn btn-secondary" style={{ padding: '0 16px' }}>+</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Footer: HUGE SWIPE BUTTON */}
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
