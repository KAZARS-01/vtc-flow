import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import { MapPin, Navigation } from 'lucide-react';

interface AddressAutocompleteProps {
    label: string;
    placeholder: string;
    icon: 'navigation' | 'mappin';
    onAddressSelect: (address: string, lat: number, lng: number) => void;
}

export default function AddressAutocomplete({ label, placeholder, icon, onAddressSelect }: AddressAutocompleteProps) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            /* Define search scope here */
        },
        debounce: 300,
    });

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleSelect = ({ description }: { description: string }) => () => {
        setValue(description, false);
        clearSuggestions();

        getGeocode({ address: description }).then((results) => {
            const { lat, lng } = getLatLng(results[0]);
            onAddressSelect(description, lat, lng);
        }).catch((error) => {
            console.log("Error: ", error);
        });
    };

    return (
        <div className="input-group" style={{ marginBottom: 0, position: 'relative' }}>
            <label>{label}</label>
            <div style={{ position: 'relative' }}>
                {icon === 'navigation' ? (
                    <Navigation size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--accent-blue)' }} />
                ) : (
                    <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
                )}
                <input
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    type="text"
                    className="input-field"
                    style={{ width: '100%', paddingLeft: '48px' }}
                    placeholder={placeholder}
                />

                {status === "OK" && (
                    <ul style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        background: 'rgba(9, 10, 15, 0.95)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '8px',
                        listStyle: 'none',
                        margin: '4px 0 0 0',
                        padding: 0,
                        zIndex: 50,
                        overflow: 'hidden'
                    }}>
                        {data.map((suggestion) => {
                            const {
                                place_id,
                                structured_formatting: { main_text, secondary_text },
                            } = suggestion;

                            return (
                                <li key={place_id} onClick={handleSelect(suggestion)} style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column' }}>
                                    <strong style={{ fontSize: '14px', color: '#fff' }}>{main_text}</strong>
                                    <small style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{secondary_text}</small>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </div>
    );
}
