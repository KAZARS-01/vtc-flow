import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';

interface AddressAutocompleteProps {
    label: string;
    placeholder: string;
    icon: 'navigation' | 'mappin';
    onAddressSelect: (address: string, lat: number, lng: number) => void;
}

export default function AddressAutocomplete({ label, placeholder, icon, onAddressSelect }: AddressAutocompleteProps) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // API Adresse (data.gouv.fr) - FREE & NO KEY REQUIRED
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 3) {
                setSuggestions([]);
                return;
            }

            try {
                const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
                const data = await response.json();
                setSuggestions(data.features || []);
            } catch (error) {
                console.error('BAN API Error:', error);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (feature: any) => {
        const address = feature.properties.label;
        const [lng, lat] = feature.geometry.coordinates;
        setQuery(address);
        setSuggestions([]);
        setShowSuggestions(false);
        onAddressSelect(address, lat, lng);
    };

    return (
        <div className="input-group" style={{ marginBottom: 0, position: 'relative' }} ref={dropdownRef}>
            <label>{label}</label>
            <div style={{ position: 'relative' }}>
                {icon === 'navigation' ? (
                    <Navigation size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--accent-blue)' }} />
                ) : (
                    <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                )}
                <input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => query.length >= 3 && setShowSuggestions(true)}
                    type="text"
                    className="input-field"
                    style={{ width: '100%', paddingLeft: '48px' }}
                    placeholder={placeholder}
                />

                {showSuggestions && suggestions.length > 0 && (
                    <ul style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'rgba(9, 10, 15, 0.98)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '8px',
                        listStyle: 'none',
                        margin: '4px 0 0 0',
                        padding: 0,
                        zIndex: 100,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                        maxHeight: '250px',
                        overflowY: 'auto'
                    }}>
                        {suggestions.map((feature, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelect(feature)}
                                style={{
                                    padding: '12px 16px',
                                    cursor: 'pointer',
                                    borderBottom: index !== suggestions.length - 1 ? '1px solid var(--border-glass)' : 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <strong style={{ fontSize: '14px', color: '#fff' }}>{feature.properties.name}</strong>
                                <small style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                    {feature.properties.postcode} {feature.properties.city}
                                </small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
