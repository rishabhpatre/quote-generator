'use client';

import { useState } from 'react';
import { Package, Building2, Target, MapPin, TrendingUp, Scale, Check, Plus, ChevronDown, ChevronUp, FileText, Send, X, Trash2, PlusCircle, Edit } from 'lucide-react';

const INTENT_ICONS = {
    'SINGLE_PRODUCT': Package,
    'BUSINESS_IDEA': Building2,
    'PROBLEM_GOAL': Target
};

const INTENT_COLORS = {
    'SINGLE_PRODUCT': 'var(--intent-product)',
    'BUSINESS_IDEA': 'var(--intent-business)',
    'PROBLEM_GOAL': 'var(--intent-problem)'
};

function formatPrice(priceRange) {
    if (!priceRange) return 'Price on request';
    const { min, max, currency } = priceRange;

    const formatINR = (num) => {
        if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
        if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
        if (num >= 1000) return `₹${(num / 1000).toFixed(1)}K`;
        return `₹${num}`;
    };

    if (currency === 'INR') {
        return `${formatINR(min)} - ${formatINR(max)}`;
    }

    const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency });
    return `${formatter.format(min)} - ${formatter.format(max)}`;
}

function formatPriceExact(priceRange) {
    if (!priceRange) return 'Price on request';
    const { min, max } = priceRange;
    return `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')}`;
}

function RFQItemCard({ item, index, onUpdate, onDiscard, isDiscarded, onRestore }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showPreview, setShowPreview] = useState(false);

    // Editable state for the modal - initialized from item
    const [editedName, setEditedName] = useState(item.name);
    const [editedQuantity, setEditedQuantity] = useState(item.quantity);
    const [editedSpecs, setEditedSpecs] = useState([...item.specifications]);
    const [editedMinPrice, setEditedMinPrice] = useState(item.priceRange?.min || 0);
    const [editedMaxPrice, setEditedMaxPrice] = useState(item.priceRange?.max || 0);
    const [editedNote, setEditedNote] = useState(item.customNote || '');
    const [newSpec, setNewSpec] = useState('');

    const handlePreviewQuote = () => {
        setShowPreview(true);
    };

    const handleAddSpec = () => {
        if (newSpec.trim()) {
            setEditedSpecs([...editedSpecs, newSpec.trim()]);
            setNewSpec('');
        }
    };

    const handleRemoveSpec = (indexToRemove) => {
        setEditedSpecs(editedSpecs.filter((_, i) => i !== indexToRemove));
    };

    const handleSaveAndClose = () => {
        onUpdate(index, {
            ...item,
            name: editedName,
            quantity: editedQuantity,
            specifications: editedSpecs,
            priceRange: {
                ...item.priceRange,
                min: editedMinPrice,
                max: editedMaxPrice
            },
            customNote: editedNote
        });
        setShowPreview(false);
    };

    const handleDiscard = () => {
        onDiscard(index);
        setShowPreview(false);
    };

    if (isDiscarded) {
        return (
            <div className="rfq-item-card discarded">
                <div className="rfq-item-header">
                    <div className="rfq-item-number discarded">{index + 1}</div>
                    <div className="rfq-item-title">
                        <h4 className="discarded-text">{item.name}</h4>
                        <span className="discarded-badge">Discarded</span>
                    </div>
                    <button className="btn-undo" onClick={() => onRestore(index)}>
                        Undo
                    </button>
                </div>
            </div>
        );
    }

    // Use edited values for display
    const displayName = editedName;
    const displayQuantity = editedQuantity;
    const displaySpecs = editedSpecs;
    const displayPriceRange = {
        ...item.priceRange,
        min: editedMinPrice,
        max: editedMaxPrice
    };
    const displayNote = editedNote;

    return (
        <>
            <div className="rfq-item-card">
                <div className="rfq-item-header" onClick={() => setIsExpanded(!isExpanded)}>
                    {/* Product Image */}
                    {item.image && (
                        <div className="rfq-item-image">
                            <img src={item.image} alt={displayName} />
                        </div>
                    )}
                    <div className="rfq-item-number">{index + 1}</div>
                    <div className="rfq-item-title">
                        <h4>{displayName}</h4>
                        <span className="rfq-item-price">{formatPrice(displayPriceRange)}</span>
                    </div>
                    <button className="expand-btn">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>

                {isExpanded && (
                    <div className="rfq-item-body">
                        <div className="rfq-field">
                            <label>Purpose</label>
                            <p>{item.purpose}</p>
                        </div>

                        <div className="rfq-field">
                            <label>Specifications</label>
                            <ul className="specs-list">
                                {displaySpecs.map((spec, i) => (
                                    <li key={i}>{spec}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="rfq-field-row">
                            <div className="rfq-field">
                                <label>Quantity</label>
                                <p><strong>{displayQuantity} units</strong></p>
                            </div>
                            <div className="rfq-field">
                                <label>Est. Price Range</label>
                                <p className="price-highlight">{formatPriceExact(displayPriceRange)}</p>
                            </div>
                        </div>

                        {/* Custom Note Display */}
                        {displayNote && (
                            <div className="rfq-field custom-note-display">
                                <label>📝 Buyer's Note</label>
                                <p>{displayNote}</p>
                            </div>
                        )}

                        {item.sourcingNotes && (
                            <div className="rfq-field sourcing-note">
                                <label>💡 India Sourcing Insight</label>
                                <p>{item.sourcingNotes}</p>
                            </div>
                        )}

                        {/* Action Buttons - JustDial Style */}
                        <div className="item-actions">
                            <button className="jd-btn jd-btn-orange" onClick={handlePreviewQuote}>
                                <FileText size={16} />
                                Preview & Edit
                            </button>
                            <button className="jd-btn jd-btn-outline-red" onClick={handleDiscard}>
                                <Trash2 size={16} />
                                Discard
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Editable Quote Preview Modal */}
            {showPreview && (
                <div className="modal-overlay" onClick={() => setShowPreview(false)}>
                    <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>✏️ Edit Quote Request</h3>
                            <button className="modal-close" onClick={() => setShowPreview(false)}>×</button>
                        </div>
                        <div className="quote-preview">
                            {/* Editable Product Details */}
                            <div className="quote-section">
                                <h4>Product Details</h4>
                                <div className="edit-field">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        className="edit-input"
                                    />
                                </div>
                                <div className="edit-field-row">
                                    <div className="edit-field">
                                        <label>Quantity Required</label>
                                        <input
                                            type="number"
                                            value={editedQuantity}
                                            onChange={(e) => setEditedQuantity(parseInt(e.target.value) || 0)}
                                            className="edit-input"
                                        />
                                    </div>
                                    <div className="edit-field">
                                        <label>Unit</label>
                                        <select className="edit-input">
                                            <option>units</option>
                                            <option>kg</option>
                                            <option>pieces</option>
                                            <option>sets</option>
                                            <option>meters</option>
                                            <option>liters</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="edit-field-row">
                                    <div className="edit-field">
                                        <label>Min Budget (₹)</label>
                                        <input
                                            type="number"
                                            value={editedMinPrice}
                                            onChange={(e) => setEditedMinPrice(parseInt(e.target.value) || 0)}
                                            className="edit-input"
                                        />
                                    </div>
                                    <div className="edit-field">
                                        <label>Max Budget (₹)</label>
                                        <input
                                            type="number"
                                            value={editedMaxPrice}
                                            onChange={(e) => setEditedMaxPrice(parseInt(e.target.value) || 0)}
                                            className="edit-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Editable Specifications */}
                            <div className="quote-section">
                                <h4>Required Specifications</h4>
                                <div className="editable-specs">
                                    {editedSpecs.map((spec, i) => (
                                        <div key={i} className="editable-spec-item">
                                            <span>✓ {spec}</span>
                                            <button
                                                className="remove-spec-btn"
                                                onClick={() => handleRemoveSpec(i)}
                                                title="Remove specification"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="add-spec-row">
                                    <input
                                        type="text"
                                        placeholder="Add new specification..."
                                        value={newSpec}
                                        onChange={(e) => setNewSpec(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddSpec()}
                                        className="edit-input"
                                    />
                                    <button className="jd-btn jd-btn-green" onClick={handleAddSpec}>
                                        <Plus size={16} /> Add
                                    </button>
                                </div>
                            </div>

                            {/* Custom Note Section */}
                            <div className="quote-section">
                                <h4>📝 Custom Note for Suppliers</h4>
                                <textarea
                                    placeholder="Add any special requirements, delivery instructions, or notes for suppliers..."
                                    value={editedNote}
                                    onChange={(e) => setEditedNote(e.target.value)}
                                    className="edit-textarea"
                                    rows={3}
                                />
                            </div>

                            {/* Supplier Requirements (static) */}
                            <div className="quote-section">
                                <h4>Supplier Requirements</h4>
                                <ul className="quote-specs">
                                    <li>✓ GST registered supplier preferred</li>
                                    <li>✓ Provide test reports / certifications</li>
                                    <li>✓ Quote valid for minimum 30 days</li>
                                    <li>✓ Include delivery charges to buyer location</li>
                                    <li>✓ Payment terms: 50% advance, 50% on delivery</li>
                                </ul>
                            </div>

                            <div className="quote-section quote-note">
                                <strong>📍 Delivery Location:</strong> To be specified by buyer
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="jd-btn jd-btn-outline-red" onClick={handleDiscard}>
                                <Trash2 size={16} />
                                Discard Quote
                            </button>
                            <button className="jd-btn jd-btn-green" onClick={handleSaveAndClose}>
                                <Check size={16} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function RFQLayout({ data }) {
    const [items, setItems] = useState(data?.items || []);
    const [context, setContext] = useState(data?.context || {});

    // Context Edit State
    const [showContextEdit, setShowContextEdit] = useState(false);
    const [editContextIndustry, setEditContextIndustry] = useState('');
    const [editContextLocation, setEditContextLocation] = useState('');
    const [editContextBudget, setEditContextBudget] = useState('');
    const [editContextScale, setEditContextScale] = useState('');
    const [discardedIndices, setDiscardedIndices] = useState([]);
    const [suggestions, setSuggestions] = useState(data?.relatedSuggestions || []);
    const [showAddCustom, setShowAddCustom] = useState(false);
    const [customItemName, setCustomItemName] = useState('');
    const [customItemQty, setCustomItemQty] = useState(1);

    if (!data) return null;

    const IntentIcon = INTENT_ICONS[data.intentType] || Package;
    const intentColor = INTENT_COLORS[data.intentType] || 'var(--primary)';

    const handleUpdateItem = (index, updatedItem) => {
        const newItems = [...items];
        newItems[index] = updatedItem;
        setItems(newItems);
    };

    const handleEditContext = () => {
        setEditContextIndustry(context.industry || '');
        setEditContextLocation(context.location || '');
        setEditContextBudget(context.budgetSignal || '');
        setEditContextScale(context.scale || '');
        setShowContextEdit(true);
    };

    const handleSaveContext = () => {
        setContext({
            ...context,
            industry: editContextIndustry,
            location: editContextLocation,
            budgetSignal: editContextBudget,
            scale: editContextScale
        });
        setShowContextEdit(false);
    };

    const handleDiscardItem = (index) => {
        setDiscardedIndices([...discardedIndices, index]);
    };

    const handleRestoreItem = (index) => {
        setDiscardedIndices(discardedIndices.filter(i => i !== index));
    };

    const handleAddSuggestion = (suggestion) => {
        // Add suggestion as a new item
        const newItem = {
            name: suggestion,
            purpose: 'Added from suggestions',
            specifications: ['To be specified'],
            quantity: 1,
            priceRange: { min: 0, max: 0, currency: 'INR' },
            sourcingNotes: 'Specify your requirements to get accurate quotes from suppliers.',
            customNote: ''
        };
        setItems([...items, newItem]);
        // Remove from suggestions
        setSuggestions(suggestions.filter(s => s !== suggestion));
    };

    const handleAddCustomItem = () => {
        if (!customItemName.trim()) return;

        const newItem = {
            name: customItemName.trim(),
            purpose: 'Custom item added by buyer',
            specifications: ['To be specified'],
            quantity: customItemQty,
            priceRange: { min: 0, max: 0, currency: 'INR' },
            sourcingNotes: 'Specify your requirements to get accurate quotes from suppliers.',
            customNote: ''
        };
        setItems([...items, newItem]);
        setCustomItemName('');
        setCustomItemQty(1);
        setShowAddCustom(false);
    };

    const activeItemsCount = items.length - discardedIndices.length;

    return (
        <div className="rfq-layout">
            {/* Intent Badge */}
            <div className="intent-badge" style={{ '--intent-color': intentColor }}>
                <IntentIcon size={18} />
                <span>{data.intentLabel}</span>
            </div>

            {/* Title */}
            {data.title && <h2 className="rfq-title">{data.title}</h2>}

            {/* Context Summary */}
            {/* Context Summary */}
            <div className="context-card" style={{ position: 'relative' }}>
                <div style={{ paddingRight: '30px', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    <div className="context-item">
                        <Building2 size={16} />
                        <span><strong>Industry:</strong> {context.industry || 'General'}</span>
                    </div>
                    <div className="context-item">
                        <MapPin size={16} />
                        <span><strong>Sourcing Location:</strong> {context.location || 'Pan India'}</span>
                    </div>
                    <div className="context-item">
                        <TrendingUp size={16} />
                        <span><strong>Budget:</strong> {context.budgetSignal?.charAt(0).toUpperCase() + context.budgetSignal?.slice(1) || 'Medium'}</span>
                    </div>
                    <div className="context-item">
                        <Scale size={16} />
                        <span><strong>Scale:</strong> {context.scale?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Small Business'}</span>
                    </div>
                </div>
                <button
                    className="action-btn-icon"
                    onClick={handleEditContext}
                    style={{ position: 'absolute', top: '10px', right: '10px' }}
                    title="Edit Requirements"
                >
                    <Edit size={16} />
                </button>
            </div>

            {/* Items List */}
            <div className="rfq-items-section">
                <h3>📋 Quote Preview ({activeItemsCount} active items)</h3>
                <div className="rfq-items-list">
                    {items.map((item, index) => (
                        <RFQItemCard
                            key={index}
                            item={item}
                            index={index}
                            onUpdate={handleUpdateItem}
                            onDiscard={handleDiscardItem}
                            onRestore={handleRestoreItem}
                            isDiscarded={discardedIndices.includes(index)}
                        />
                    ))}
                </div>
            </div>

            {/* Related Suggestions - Clickable to add */}
            {suggestions.length > 0 && (
                <div className="suggestions-section">
                    <h3>💡 You might also need <span className="hint-text">(click to add)</span></h3>
                    <div className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                className="suggestion-chip"
                                onClick={() => handleAddSuggestion(suggestion)}
                            >
                                <Plus size={14} />
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Custom Item Section */}
            <div className="add-custom-section">
                {!showAddCustom ? (
                    <button
                        className="add-custom-btn"
                        onClick={() => setShowAddCustom(true)}
                    >
                        <PlusCircle size={18} />
                        Add Custom Item
                    </button>
                ) : (
                    <div className="add-custom-form">
                        <h4>Add Custom Item</h4>
                        <div className="add-custom-fields">
                            <input
                                type="text"
                                placeholder="Item name (e.g., Air Conditioner, Storage Rack)"
                                value={customItemName}
                                onChange={(e) => setCustomItemName(e.target.value)}
                                className="edit-input"
                                autoFocus
                            />
                            <div className="add-custom-qty">
                                <label>Qty:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={customItemQty}
                                    onChange={(e) => setCustomItemQty(parseInt(e.target.value) || 1)}
                                    className="edit-input qty-input"
                                />
                            </div>
                        </div>
                        <div className="add-custom-actions">
                            <button
                                className="jd-btn jd-btn-outline"
                                onClick={() => {
                                    setShowAddCustom(false);
                                    setCustomItemName('');
                                    setCustomItemQty(1);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="jd-btn jd-btn-blue"
                                onClick={handleAddCustomItem}
                                disabled={!customItemName.trim()}
                            >
                                <Plus size={16} />
                                Add Item
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Context Edit Modal */}
            {showContextEdit && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Edit Business Requirements</h3>
                            <button className="modal-close" onClick={() => setShowContextEdit(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Industry / Business Type</label>
                                <input
                                    type="text"
                                    className="edit-input"
                                    value={editContextIndustry}
                                    onChange={(e) => setEditContextIndustry(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Sourcing Location</label>
                                <input
                                    type="text"
                                    className="edit-input"
                                    value={editContextLocation}
                                    onChange={(e) => setEditContextLocation(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Budget Signal</label>
                                <select
                                    className="edit-input"
                                    value={editContextBudget}
                                    onChange={(e) => setEditContextBudget(e.target.value)}
                                >
                                    <option value="low">Low (Cost Conscious)</option>
                                    <option value="medium">Medium (Balanced)</option>
                                    <option value="high">High (Premium)</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Scale</label>
                                <select
                                    className="edit-input"
                                    value={editContextScale}
                                    onChange={(e) => setEditContextScale(e.target.value)}
                                >
                                    <option value="small_business">Small Business</option>
                                    <option value="medium_enterprise">Medium Enterprise</option>
                                    <option value="large_corporation">Large Corporation</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="jd-btn jd-btn-outline" onClick={() => setShowContextEdit(false)}>Cancel</button>
                            <button className="jd-btn jd-btn-blue" onClick={handleSaveContext}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Bar - Single Float All Button */}
            <div className="rfq-actions">
                <button className="jd-btn jd-btn-blue jd-btn-large" style={{ width: '100%' }} disabled={activeItemsCount === 0}>
                    <Send size={18} />
                    Float All RFQs to Suppliers ({activeItemsCount})
                </button>
            </div>

            {/* Footer */}
            <p className="rfq-footer">
                Click "Preview & Edit" on any item to customize specs, quantity, budget, and add custom notes.
            </p>
        </div>
    );
}
