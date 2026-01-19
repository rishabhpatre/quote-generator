import { NextResponse } from 'next/server';

// ============================================================================
// INTENT CLASSIFICATION
// ============================================================================

const SINGLE_PRODUCT_KEYWORDS = [
    'buy', 'purchase', 'need', 'looking for', 'want to get', 'order', 'require',
    'pcs', 'pieces', 'units', 'kg', 'tons', 'meters', 'liters', 'dozen'
];

const BUSINESS_IDEA_KEYWORDS = [
    'open', 'start', 'launch', 'set up', 'setup', 'establish', 'begin',
    'business', 'shop', 'store', 'restaurant', 'cafe', 'kitchen', 'factory',
    'manufacturing', 'unit', 'facility', 'outlet', 'franchise'
];

const PROBLEM_GOAL_KEYWORDS = [
    'improve', 'reduce', 'solve', 'fix', 'optimize', 'enhance', 'automate',
    'package', 'store', 'transport', 'protect', 'efficiency', 'solution'
];

function classifyIntent(query) {
    const lowerQuery = query.toLowerCase();

    const quantityPattern = /\d+\s*(pcs|pieces|units|kg|tons|meters|liters|dozen|hp|kw|mm|cm)/i;
    if (quantityPattern.test(query)) {
        return 'SINGLE_PRODUCT';
    }

    let singleProductScore = 0;
    let businessIdeaScore = 0;
    let problemGoalScore = 0;

    SINGLE_PRODUCT_KEYWORDS.forEach(kw => {
        if (lowerQuery.includes(kw)) singleProductScore++;
    });

    BUSINESS_IDEA_KEYWORDS.forEach(kw => {
        if (lowerQuery.includes(kw)) businessIdeaScore++;
    });

    PROBLEM_GOAL_KEYWORDS.forEach(kw => {
        if (lowerQuery.includes(kw)) problemGoalScore++;
    });

    if (businessIdeaScore >= problemGoalScore && businessIdeaScore > 0) {
        return 'BUSINESS_IDEA';
    }
    if (problemGoalScore > 0) {
        return 'PROBLEM_GOAL';
    }
    if (singleProductScore > 0) {
        return 'SINGLE_PRODUCT';
    }

    return 'BUSINESS_IDEA';
}

// ============================================================================
// CONTEXT EXTRACTION
// ============================================================================

const INDUSTRIES = {
    'coffee': 'Food & Beverage',
    'cafe': 'Food & Beverage',
    'restaurant': 'Food & Beverage',
    'kitchen': 'Food & Beverage',
    'bakery': 'Food & Beverage',
    'clothing': 'Retail / Fashion',
    'fashion': 'Retail / Fashion',
    'apparel': 'Retail / Fashion',
    'garment': 'Retail / Fashion',
    'manufacturing': 'Industrial',
    'factory': 'Industrial',
    'warehouse': 'Logistics',
    'cold storage': 'Cold Chain / Logistics',
    'packaging': 'Packaging & Logistics',
    'gym': 'Fitness & Wellness',
    'salon': 'Beauty & Personal Care',
    'spa': 'Beauty & Personal Care',
    'pharmacy': 'Healthcare / Pharma',
    'clinic': 'Healthcare',
    'grocery': 'Retail / FMCG',
    'supermarket': 'Retail / FMCG',
    'kirana': 'Retail / FMCG',
};

const INDIAN_CITIES = [
    'mumbai', 'delhi', 'bangalore', 'bengaluru', 'chennai', 'kolkata', 'hyderabad',
    'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane',
    'bhopal', 'visakhapatnam', 'pimpri', 'patna', 'vadodara', 'ghaziabad', 'ludhiana',
    'agra', 'nashik', 'faridabad', 'meerut', 'rajkot', 'varanasi', 'srinagar', 'aurangabad',
    'dhanbad', 'amritsar', 'navi mumbai', 'allahabad', 'ranchi', 'howrah', 'coimbatore',
    'jabalpur', 'gwalior', 'vijayawada', 'jodhpur', 'madurai', 'raipur', 'kota', 'gurgaon',
    'chandigarh', 'thiruvananthapuram', 'solapur', 'hubballi', 'tiruchirappalli', 'bareilly',
    'mysuru', 'tiruppur', 'guwahati', 'noida', 'surat', 'kochi', 'bhubaneswar'
];

function extractContext(query) {
    const lowerQuery = query.toLowerCase();

    let industry = null;
    for (const [keyword, ind] of Object.entries(INDUSTRIES)) {
        if (lowerQuery.includes(keyword)) {
            industry = ind;
            break;
        }
    }

    let location = null;
    for (const city of INDIAN_CITIES) {
        if (lowerQuery.includes(city)) {
            location = city.charAt(0).toUpperCase() + city.slice(1);
            break;
        }
    }

    let budgetSignal = 'medium';
    if (lowerQuery.includes('budget') || lowerQuery.includes('cheap') || lowerQuery.includes('affordable') || lowerQuery.includes('low cost') || lowerQuery.includes('sasta')) {
        budgetSignal = 'low';
    } else if (lowerQuery.includes('premium') || lowerQuery.includes('high quality') || lowerQuery.includes('luxury') || lowerQuery.includes('best')) {
        budgetSignal = 'high';
    }

    let scale = 'small_business';
    if (lowerQuery.includes('enterprise') || lowerQuery.includes('large scale') || lowerQuery.includes('industrial')) {
        scale = 'enterprise';
    } else if (lowerQuery.includes('pilot') || lowerQuery.includes('test') || lowerQuery.includes('trial')) {
        scale = 'pilot';
    }

    return {
        industry: industry || 'General',
        location: location || 'Pan India',
        budgetSignal,
        scale,
        constraints: []
    };
}

// ============================================================================
// RFQ GENERATORS - INDIA FOCUSED MOCK DATA (All prices in INR)
// ============================================================================

const BUSINESS_BREAKDOWNS = {
    'coffee': {
        title: 'Coffee Shop Setup',
        items: [
            {
                name: 'Commercial Espresso Machine',
                purpose: 'Core equipment for preparing espresso-based drinks',
                specifications: ['Semi-automatic or automatic', '2-group head minimum', 'Built-in steam wand', '15-bar pressure'],
                quantity: 1,
                priceRange: { min: 150000, max: 600000, currency: 'INR' },
                sourcingNotes: 'La Marzocco & Nuova Simonelli available through authorized dealers in Mumbai/Delhi. Indian brands like Kaapi Machines offer budget options. Float RFQ to get competitive quotes from verified suppliers.',
                image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=200&h=200&fit=crop'
            },
            {
                name: 'Coffee Grinder',
                purpose: 'Freshly ground beans for optimal flavor',
                specifications: ['Burr grinder', 'Commercial grade', 'Stepless adjustment', '1.5kg hopper'],
                quantity: 2,
                priceRange: { min: 30000, max: 120000, currency: 'INR' },
                sourcingNotes: 'Mazzer and Mahlkönig available in India. Fiorenzato is a good mid-range option. Bangalore coffee equipment suppliers offer competitive prices.',
                image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=200&h=200&fit=crop'
            },
            {
                name: 'Refrigeration Unit',
                purpose: 'Store milk, pastries, and perishables',
                specifications: ['Under-counter', '200-400L capacity', 'Glass door display optional', 'Energy efficient (BEE 4-5 star)'],
                quantity: 2,
                priceRange: { min: 60000, max: 200000, currency: 'INR' },
                sourcingNotes: 'Blue Star, Voltas, and Western are reliable Indian brands. Check for GST input credit. AMC contracts available from most dealers.',
                image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=200&h=200&fit=crop'
            },
            {
                name: 'POS System',
                purpose: 'Order management, billing, and payment processing',
                specifications: ['Touchscreen terminal', 'GST-compliant billing', 'UPI/Card integration', 'Inventory tracking'],
                quantity: 1,
                priceRange: { min: 25000, max: 80000, currency: 'INR' },
                sourcingNotes: 'POSist, Petpooja, and Torqus are popular in India. Most offer monthly SaaS plans starting ₹1,500/month. Ensure GST compliance and e-invoice integration.',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop'
            },
            {
                name: 'Furniture - Tables & Chairs',
                purpose: 'Customer seating area',
                specifications: ['Cafe-style chairs', '2-4 seater tables', 'Durable materials', 'Easy to clean'],
                quantity: 10,
                priceRange: { min: 8000, max: 25000, currency: 'INR' },
                sourcingNotes: 'Price per set. Jodhpur and Saharanpur are major wooden furniture hubs. Local carpenters offer customization at lower costs. Get quotes from multiple suppliers.',
                image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop'
            },
            {
                name: 'Display Counter with Refrigeration',
                purpose: 'Showcase pastries, cakes, and merchandise',
                specifications: ['Refrigerated display', 'LED lighting', 'Glass front', '1.2-1.5m width'],
                quantity: 1,
                priceRange: { min: 80000, max: 250000, currency: 'INR' },
                sourcingNotes: 'Western, Celfrost, and Elanpro are reliable brands. Custom fabrication available in most metro cities. Consider SS304 grade for durability.',
                image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200&h=200&fit=crop'
            }
        ],
        relatedSuggestions: ['Coffee Bean Supplier (Coorg/Chikmagalur)', 'Dairy Partner (Amul/Local)', 'Paper Cups & Packaging', 'Signage & Branding', 'FSSAI License Consultant']
    },
    'clothing': {
        title: 'Clothing Store Setup',
        items: [
            {
                name: 'Garment Display Racks',
                purpose: 'Display clothing in an organized manner',
                specifications: ['Heavy-duty metal', 'Adjustable height', 'Rolling wheels', 'Chrome or powder-coated finish'],
                quantity: 10,
                priceRange: { min: 3000, max: 12000, currency: 'INR' },
                sourcingNotes: 'Bulk orders available from Delhi Karol Bagh or Mumbai Crawford Market. SS racks from Ahmedabad manufacturers are cost-effective. Request quotes from multiple vendors.',
                image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=200&h=200&fit=crop'
            },
            {
                name: 'Mannequins',
                purpose: 'Showcase outfits and styling',
                specifications: ['Full body', 'Fiberglass construction', 'Indian body proportions', 'White/black/skin tone'],
                quantity: 6,
                priceRange: { min: 4000, max: 15000, currency: 'INR' },
                sourcingNotes: 'Mumbai and Delhi have specialized mannequin markets. Fiberglass preferred over plastic. Half-body mannequins are cheaper for window displays.',
                image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200&h=200&fit=crop'
            },
            {
                name: 'Fitting Room Setup',
                purpose: 'Private space for customers to try clothes',
                specifications: ['Curtain or door', 'Full-length mirror', 'Hooks', 'Good lighting'],
                quantity: 3,
                priceRange: { min: 15000, max: 40000, currency: 'INR' },
                sourcingNotes: 'Local carpenters can build at competitive rates. Use LED panel lights. Prefab options available from interior suppliers.',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop'
            },
            {
                name: 'Cash Counter with Display',
                purpose: 'Checkout area and impulse buy display',
                specifications: ['Glass top display', 'Storage drawers', 'POS integration space', '4-6 ft length'],
                quantity: 1,
                priceRange: { min: 25000, max: 80000, currency: 'INR' },
                sourcingNotes: 'Custom-built recommended. Plywood with laminate is budget-friendly. SS counters from Gujarat suppliers are durable.',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop'
            },
            {
                name: 'Billing & POS System',
                purpose: 'Sales, inventory, GST billing, and payments',
                specifications: ['Barcode scanner', 'Thermal printer', 'GST-compliant software', 'UPI/Card acceptance'],
                quantity: 1,
                priceRange: { min: 20000, max: 60000, currency: 'INR' },
                sourcingNotes: 'Marg ERP, Busy, and Vyapar are popular for retail. Pine Labs and Razorpay for payment terminals. Ensure GST e-invoice ready.',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop'
            },
            {
                name: 'Security System',
                purpose: 'Loss prevention and store security',
                specifications: ['CCTV cameras (4-8)', 'DVR with 1TB storage', 'Night vision', 'Mobile app viewing'],
                quantity: 1,
                priceRange: { min: 25000, max: 80000, currency: 'INR' },
                sourcingNotes: 'CP Plus and Hikvision are market leaders in India. Available at Nehru Place (Delhi) and Lamington Road (Mumbai). Installation included by most vendors.',
                image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=200&h=200&fit=crop'
            }
        ],
        relatedSuggestions: ['GST Registration', 'Shop & Establishment License', 'Hangers (bulk from Delhi)', 'Carry Bags with Branding', 'Interior Designer']
    },
    'gym': {
        title: 'Gym / Fitness Center Setup',
        items: [
            {
                name: 'Commercial Treadmills',
                purpose: 'Cardio equipment for running/walking',
                specifications: ['Commercial grade', '3+ HP AC motor', 'Incline feature', 'Heart rate monitor'],
                quantity: 5,
                priceRange: { min: 150000, max: 400000, currency: 'INR' },
                sourcingNotes: 'Cosco, Viva Fitness, and Energie Fitness are popular Indian brands. Life Fitness and Precor for premium. Meerut is a major gym equipment manufacturing hub.',
                image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=200&h=200&fit=crop'
            },
            {
                name: 'Weight Training Equipment Set',
                purpose: 'Strength training zone',
                specifications: ['Dumbbells (2.5-25 kg)', 'Barbells', 'Weight plates', 'Squat rack', 'Bench press'],
                quantity: 1,
                priceRange: { min: 300000, max: 1000000, currency: 'INR' },
                sourcingNotes: 'Complete set pricing. Meerut and Jalandhar are manufacturing hubs. Syndicate Gym, Body Maxx, and KRX are trusted brands. Rubber-coated plates reduce noise.',
                image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop'
            },
            {
                name: 'Rubber Flooring',
                purpose: 'Floor protection and safety',
                specifications: ['15mm+ thickness', 'Interlocking tiles', 'Anti-slip surface', 'Easy to clean'],
                quantity: 100,
                priceRange: { min: 400, max: 1200, currency: 'INR' },
                sourcingNotes: 'Price per sq meter. Bahadurgarh and Delhi NCR have multiple manufacturers. 20mm recommended for free weight areas. GST rate is 18% on flooring.',
                image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=200&h=200&fit=crop'
            },
            {
                name: 'Lockers',
                purpose: 'Secure storage for member belongings',
                specifications: ['Metal construction', '12-18 inches width', 'Digital or key lock', 'Ventilated'],
                quantity: 30,
                priceRange: { min: 5000, max: 12000, currency: 'INR' },
                sourcingNotes: 'Godrej and local fabricators are options. SS lockers for wet areas. Digital locks add ₹1,500-3,000 per unit. Request bulk pricing from suppliers.',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop'
            },
            {
                name: 'Split AC Units',
                purpose: 'Climate control for workout comfort',
                specifications: ['1.5-2 Ton capacity', 'Inverter technology', 'BEE 5-star rating', 'Copper coil'],
                quantity: 4,
                priceRange: { min: 45000, max: 80000, currency: 'INR' },
                sourcingNotes: 'Daikin, Voltas, and Blue Star recommended for commercial use. Calculate 1 ton per 100 sq ft. AMC contracts are essential. Factor in installation costs.',
                image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=200&h=200&fit=crop'
            }
        ],
        relatedSuggestions: ['Gym Management Software', 'RO Water Purifier', 'Sound System', 'Trainer Hiring', 'FSSAI License (if selling supplements)']
    }
};

const PROBLEM_SOLUTIONS = {
    'packaging fragile': {
        title: 'Fragile Item Packaging Solutions',
        items: [
            {
                name: 'Bubble Wrap Rolls',
                purpose: 'Cushioning layer for fragile surfaces',
                specifications: ['10mm bubble size', '1m width rolls', 'Perforated', '50-100m length'],
                quantity: 10,
                priceRange: { min: 800, max: 2500, currency: 'INR' },
                sourcingNotes: 'Major packaging markets: Chawri Bazaar (Delhi), Kalbadevi (Mumbai). Vadodara and Ahmedabad have large manufacturers. Anti-static version available for electronics.',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop'
            },
            {
                name: 'Corrugated Boxes (5-ply)',
                purpose: 'Strong outer protection',
                specifications: ['5-ply construction', 'Various sizes', 'Burst strength 10+ kg/cm²', 'Printed or plain'],
                quantity: 100,
                priceRange: { min: 50, max: 300, currency: 'INR' },
                sourcingNotes: 'Per box pricing. 5-ply essential for fragile items. Manufacturing hubs: Vasai-Virar (Mumbai), Kundli (Delhi). MOQ usually 100-500 boxes.',
                image: 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=200&h=200&fit=crop'
            },
            {
                name: 'EPE Foam Inserts',
                purpose: 'Custom-fit cushioning for products',
                specifications: ['EPE foam', 'Die-cut to product shape', '25-50mm thickness', 'Reusable'],
                quantity: 100,
                priceRange: { min: 80, max: 500, currency: 'INR' },
                sourcingNotes: 'Requires product samples for die-cutting. Noida and Pune have EPE manufacturers. MOQ typically 500-1000 units. Lead time 7-10 days.',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop'
            },
            {
                name: 'Fragile & Handle with Care Stickers',
                purpose: 'Handling instructions for couriers',
                specifications: ['Bright red/orange', 'Waterproof', '"Fragile" in Hindi & English', 'Roll of 500'],
                quantity: 2,
                priceRange: { min: 400, max: 1000, currency: 'INR' },
                sourcingNotes: 'Available from label printing suppliers. Include "This Side Up" arrows. Custom printing available for bulk orders (1000+ rolls).',
                image: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=200&h=200&fit=crop'
            }
        ],
        relatedSuggestions: ['Packing Tape Dispenser', 'Thermocol Sheets', 'Logistics Partner', 'Packaging Design Consultant']
    },
    'cold storage': {
        title: 'Cold Storage Facility Setup',
        items: [
            {
                name: 'Walk-in Cold Room',
                purpose: 'Primary refrigerated storage space',
                specifications: ['PUF panel construction (80-120mm)', '0-5°C temperature range', 'Hinged/sliding door', 'Floor insulation'],
                quantity: 1,
                priceRange: { min: 600000, max: 2000000, currency: 'INR' },
                sourcingNotes: 'Size-dependent (price for ~1000 sq ft). Rinac, Kirloskar, and Carrier are premium options. Gujarat and Punjab have local fabricators. NABARD subsidies may apply.',
                image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=200&h=200&fit=crop'
            },
            {
                name: 'Refrigeration Unit',
                purpose: 'Cooling system for cold room',
                specifications: ['Matched to room size (5-20 TR)', 'Bitzer/Copeland compressor', 'Energy efficient', 'Digital controller'],
                quantity: 1,
                priceRange: { min: 250000, max: 800000, currency: 'INR' },
                sourcingNotes: 'Sizing critical - get refrigeration engineer consultation. Emerson, Danfoss controllers recommended. AMC essential (₹25,000-50,000/year). 440V power required.',
                image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=200&h=200&fit=crop'
            },
            {
                name: 'Industrial Racking System',
                purpose: 'Organize storage and maximize space',
                specifications: ['Galvanized steel', 'Adjustable shelves', 'FSSAI compliant (for food)', '500kg per level capacity'],
                quantity: 10,
                priceRange: { min: 12000, max: 35000, currency: 'INR' },
                sourcingNotes: 'Godrej and Nilkamal for branded options. Bhiwandi (Mumbai) and Ludhiana have local manufacturers. FIFO racking recommended for perishables.',
                image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=200&fit=crop'
            },
            {
                name: 'Temperature Monitoring System',
                purpose: 'Real-time temp tracking and alerts',
                specifications: ['IoT sensors', 'Cloud dashboard', 'SMS/WhatsApp alerts', 'Data logging for FSSAI audit'],
                quantity: 1,
                priceRange: { min: 40000, max: 150000, currency: 'INR' },
                sourcingNotes: 'Elitech, Monnit, and Inficold offer solutions. Essential for FSSAI compliance. Battery backup sensors recommended for power cuts.',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&h=200&fit=crop'
            }
        ],
        relatedSuggestions: ['DG Set Backup (essential)', 'Pallet Truck/Forklift', 'FSSAI License', 'Cold Chain Logistics Partner', 'Insurance (spoilage coverage)']
    }
};

const SINGLE_PRODUCT_DATA = {
    'ball bearing': {
        name: 'Ball Bearings',
        specifications: ['Deep groove type', 'Chrome steel (52100)', 'ABEC-3 precision', 'Standard clearance'],
        priceRange: { min: 40, max: 4000, currency: 'INR' },
        sourcingNotes: 'SKF, FAG, NTN for premium quality. Indian brands like NBC, NEI, and ZKL are reliable for general use. Jamnagar is a major bearing manufacturing hub in India.',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop'
    },
    'water pump': {
        name: 'Water Pump',
        specifications: ['Centrifugal type', 'Cast iron body', 'Brass impeller', 'Single phase motor'],
        priceRange: { min: 8000, max: 40000, currency: 'INR' },
        sourcingNotes: 'Kirloskar and Crompton are market leaders. CRI Pumps for agricultural use. Rajkot and Coimbatore are pump manufacturing hubs. Check BEE star rating for energy efficiency.',
        image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop'
    },
    'plastic chair': {
        name: 'Plastic Chairs',
        specifications: ['Virgin polypropylene', 'Stackable design', 'UV resistant', 'Weight capacity 120kg'],
        priceRange: { min: 400, max: 1500, currency: 'INR' },
        sourcingNotes: 'Nilkamal, Supreme, and Cello are trusted brands. Bulk discounts available (10%+ for 100+ units). Ahmedabad and Daman are manufacturing hubs for unbranded options.',
        image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=200&h=200&fit=crop'
    },
    'led light': {
        name: 'LED Panel Lights',
        specifications: ['18W/24W/36W options', '6500K daylight', 'Slim panel', 'Driver included'],
        priceRange: { min: 250, max: 1200, currency: 'INR' },
        sourcingNotes: 'Philips, Havells, and Syska for branded options. Bhagirath Palace (Delhi) and Lohar Chawl (Mumbai) for wholesale pricing. Check BIS certification and warranty terms.',
        image: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=200&h=200&fit=crop'
    }
};

// Default placeholder image
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=200&fit=crop';

function generateSingleProductRFQ(query, context) {
    const lowerQuery = query.toLowerCase();

    for (const [keyword, data] of Object.entries(SINGLE_PRODUCT_DATA)) {
        if (lowerQuery.includes(keyword)) {
            const qtyMatch = query.match(/(\d+)\s*(pcs|pieces|units|kg|tons|meters|liters|dozen)?/i);
            const quantity = qtyMatch ? parseInt(qtyMatch[1]) : 100;

            return {
                intentType: 'SINGLE_PRODUCT',
                intentLabel: 'Single Product Request',
                query,
                context,
                items: [{
                    ...data,
                    purpose: `Requested product from user query`,
                    quantity,
                }],
                relatedSuggestions: ['Request samples first', 'Compare 3+ suppliers', 'Check GST & certifications', 'Negotiate payment terms']
            };
        }
    }

    return {
        intentType: 'SINGLE_PRODUCT',
        intentLabel: 'Single Product Request',
        query,
        context,
        items: [{
            name: query.replace(/\d+\s*(pcs|pieces|units)?/gi, '').trim(),
            purpose: 'Product as specified in query',
            specifications: ['Specifications to be confirmed', 'Material grade TBD', 'Standard industry specs'],
            quantity: 100,
            priceRange: { min: 500, max: 50000, currency: 'INR' },
            sourcingNotes: 'Float this RFQ to get quotes from verified suppliers. Request detailed specs and samples before bulk order. Verify GST registration of supplier.',
            image: DEFAULT_IMAGE
        }],
        relatedSuggestions: ['Request product samples', 'Get GST invoice', 'Check seller ratings & reviews', 'Negotiate freight terms']
    };
}

function generateBusinessBreakdown(query, context) {
    const lowerQuery = query.toLowerCase();

    for (const [keyword, data] of Object.entries(BUSINESS_BREAKDOWNS)) {
        if (lowerQuery.includes(keyword)) {
            return {
                intentType: 'BUSINESS_IDEA',
                intentLabel: 'Business Setup',
                query,
                context: { ...context, industry: data.title },
                title: data.title,
                items: data.items,
                relatedSuggestions: data.relatedSuggestions
            };
        }
    }

    return {
        intentType: 'BUSINESS_IDEA',
        intentLabel: 'Business Setup',
        query,
        context,
        title: 'Business Setup Requirements',
        items: [
            {
                name: 'Primary Equipment',
                purpose: 'Core operational equipment for your business',
                specifications: ['To be specified based on business type', 'Commercial grade recommended'],
                quantity: 1,
                priceRange: { min: 100000, max: 1000000, currency: 'INR' },
                sourcingNotes: 'Float RFQ to get quotes from verified suppliers. Visit manufacturer showrooms in metro cities. Get multiple quotes for comparison.',
                image: DEFAULT_IMAGE
            },
            {
                name: 'Furniture & Fixtures',
                purpose: 'Basic setup for operations',
                specifications: ['Desks/counters', 'Storage units', 'Display areas'],
                quantity: 1,
                priceRange: { min: 50000, max: 500000, currency: 'INR' },
                sourcingNotes: 'Local carpenters offer customization at lower costs. Modular furniture from Godrej, Nilkamal, or Featherlite. Kirti Nagar (Delhi) is a major furniture wholesale hub.',
                image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=200&fit=crop'
            },
            {
                name: 'POS / Billing System',
                purpose: 'Track sales, inventory, and GST compliance',
                specifications: ['Touch terminal', 'GST e-invoice ready', 'UPI/Card integration'],
                quantity: 1,
                priceRange: { min: 15000, max: 80000, currency: 'INR' },
                sourcingNotes: 'Tally, Marg ERP, or Vyapar for billing. Pine Labs or Paytm for payment terminals. Ensure GST e-invoice compliance from Day 1.',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop'
            }
        ],
        relatedSuggestions: ['GST Registration', 'Shop & Establishment License', 'FSSAI (if food business)', 'Fire NOC', 'Business Insurance']
    };
}

function generateProblemSolution(query, context) {
    const lowerQuery = query.toLowerCase();

    for (const [keyword, data] of Object.entries(PROBLEM_SOLUTIONS)) {
        if (lowerQuery.includes(keyword.split(' ')[0]) || lowerQuery.includes(keyword.split(' ')[1])) {
            return {
                intentType: 'PROBLEM_GOAL',
                intentLabel: 'Problem / Goal',
                query,
                context,
                title: data.title,
                items: data.items,
                relatedSuggestions: data.relatedSuggestions
            };
        }
    }

    return {
        intentType: 'PROBLEM_GOAL',
        intentLabel: 'Problem / Goal',
        query,
        context,
        title: 'Solution Requirements',
        items: [
            {
                name: 'Primary Solution Equipment',
                purpose: 'Address the core problem',
                specifications: ['Based on problem analysis', 'Scalable solution'],
                quantity: 1,
                priceRange: { min: 50000, max: 500000, currency: 'INR' },
                sourcingNotes: 'Float RFQ to get quotes from verified suppliers. Consult industry experts for specific recommendations. Consider made-in-India options for better support.',
                image: DEFAULT_IMAGE
            }
        ],
        relatedSuggestions: ['Describe your problem in more detail', 'Share current challenges', 'Specify scale/volume', 'Mention your city for local suppliers']
    };
}

// ============================================================================
// MAIN API HANDLER
// ============================================================================

export async function POST(request) {
    try {
        const { query } = await request.json();

        if (!query || query.trim().length === 0) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const intentType = classifyIntent(query);
        const context = extractContext(query);

        let response;
        switch (intentType) {
            case 'SINGLE_PRODUCT':
                response = generateSingleProductRFQ(query, context);
                break;
            case 'BUSINESS_IDEA':
                response = generateBusinessBreakdown(query, context);
                break;
            case 'PROBLEM_GOAL':
                response = generateProblemSolution(query, context);
                break;
            default:
                response = generateBusinessBreakdown(query, context);
        }

        return NextResponse.json(response);

    } catch (error) {
        console.error('RFQ API Error:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
