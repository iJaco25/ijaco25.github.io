const { useState, useCallback, useMemo, useEffect } = React;

// Simple icon components
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Plus = ({ size }) => <Icon size={size} d="M12 5v14M5 12h14" />;
const Trash2 = ({ size }) => <Icon size={size} d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />;
const Copy = ({ size }) => <Icon size={size} d="M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />;
const Download = ({ size }) => <Icon size={size} d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />;
const ChevronRight = ({ size }) => <Icon size={size} d="M9 18l6-6-6-6" />;
const ChevronDown = ({ size }) => <Icon size={size} d="M6 9l6 6 6-6" />;
const Layers = ({ size }) => <Icon size={size} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />;
const Code = ({ size }) => <Icon size={size} d="M16 18l6-6-6-6M8 6l-6 6 6 6" />;
const Eye = ({ size }) => <Icon size={size} d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z" />;
const Grid3X3 = ({ size }) => <Icon size={size} d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />;
const Box = ({ size }) => <Icon size={size} d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />;
const Type = ({ size }) => <Icon size={size} d="M4 7V4h16v3M9 20h6M12 4v16" />;
const Image = ({ size }) => <Icon size={size} d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM21 15l-5-5L5 21" />;
const Square = ({ size }) => <Icon size={size} d="M3 3h18v18H3z" />;
const PanelTop = ({ size }) => <Icon size={size} d="M3 3h18v18H3zM3 9h18" />;
const ListFilter = ({ size }) => <Icon size={size} d="M3 6h18M7 12h10M10 18h4" />;
const TextCursor = ({ size }) => <Icon size={size} d="M17 22h-1a4 4 0 01-4-4V6a4 4 0 014-4h1M7 22h1a4 4 0 004-4V6a4 4 0 00-4-4H7M12 2v20" />;
const CheckSquare = ({ size }) => <Icon size={size} d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />;
const SlidersHorizontal = ({ size }) => <Icon size={size} d="M21 4H14M10 4H3M21 12H12M8 12H3M21 20H16M12 20H3M14 1v6M8 9v6M16 17v6" />;
const X = ({ size }) => <Icon size={size} d="M18 6L6 18M6 6l12 12" />;
const Search = ({ size }) => <Icon size={size} d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" />;
const Loader = ({ size }) => <Icon size={size} d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />;
const Minus = ({ size }) => <Icon size={size} d="M5 12h14" />;
const LayoutGrid = ({ size }) => <Icon size={size} d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />;
const GripVertical = ({ size }) => <Icon size={size} d="M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01" />;
const Menu = ({ size }) => <Icon size={size} d="M3 12h18M3 6h18M3 18h18" />;
const PanelLeftClose = ({ size }) => <Icon size={size} d="M3 3h18v18H3zM9 3v18M15 9l-3 3 3 3" />;
const PanelRightClose = ({ size }) => <Icon size={size} d="M3 3h18v18H3zM15 3v18M9 9l3 3-3 3" />;

// Theme colors
const theme = {
  bg: {
    primary: '#0d1117',
    secondary: '#161b22',
    tertiary: '#1c2128',
    canvas: '#0a0d12',
  },
  border: {
    subtle: 'rgba(255,255,255,0.06)',
    default: 'rgba(255,255,255,0.1)',
    emphasis: 'rgba(255,255,255,0.15)',
  },
  text: {
    primary: 'rgba(255,255,255,0.92)',
    secondary: 'rgba(255,255,255,0.65)',
    muted: 'rgba(255,255,255,0.4)',
    placeholder: 'rgba(255,255,255,0.25)',
  },
  accent: {
    primary: '#58a6ff',
    success: '#3fb950',
    warning: '#d29922',
    danger: '#f85149',
  }
};

const LayoutMode = {
  NONE: 'None',
  TOP: 'Top',
  LEFT: 'Left',
  RIGHT: 'Right',
  BOTTOM: 'Bottom',
};

const COMPONENT_CATEGORIES = {
  containers: {
    label: 'Containers',
    icon: Layers,
    items: {
      'Group': { 
        icon: Layers, 
        color: '#58a6ff', 
        description: 'Basic container',
        isRaw: true,
        defaults: { layoutMode: LayoutMode.NONE, anchor: { width: 200, height: 150 }, padding: {} }
      },
      '@Container': { 
        icon: PanelTop, 
        color: '#79c0ff', 
        description: 'Container with title bar',
        props: ['@ContentPadding', '@CloseButton'],
        defaults: { anchor: { width: 300, height: 250 } }
      },
      '@DecoratedContainer': { 
        icon: PanelTop, 
        color: '#a5d6ff', 
        description: 'Fancy decorated container',
        props: ['@ContentPadding', '@CloseButton'],
        defaults: { anchor: { width: 350, height: 280 } }
      },
      '@Panel': { 
        icon: Square, 
        color: '#8b949e', 
        description: 'Simple panel',
        defaults: { anchor: { width: 200, height: 150 } }
      },
      '@PageOverlay': { 
        icon: Square, 
        color: '#484f58', 
        description: 'Dark overlay',
        defaults: { anchor: {} }
      },
      'ScrollPanel': {
        icon: Layers,
        color: '#39d353',
        description: 'Scrollable area',
        isRaw: true,
        defaults: { layoutMode: LayoutMode.TOP, anchor: { width: 200, height: 200 }, scrollbarStyle: '$C.@DefaultScrollbarStyle' }
      },
    }
  },
  buttons: {
    label: 'Buttons',
    icon: Square,
    items: {
      '@TextButton': { 
        icon: Square, color: '#f78166', description: 'Primary button',
        props: ['@Text', '@Anchor', '@Sounds'],
        defaults: { templateProps: { '@Text': 'Button' }, anchor: { height: 44 } }
      },
      '@SecondaryTextButton': { 
        icon: Square, color: '#ffa657', description: 'Secondary button',
        props: ['@Text', '@Anchor', '@Sounds'],
        defaults: { templateProps: { '@Text': 'Secondary' }, anchor: { height: 44 } }
      },
      '@TertiaryTextButton': { 
        icon: Square, color: '#d2a8ff', description: 'Tertiary button',
        props: ['@Text', '@Anchor', '@Sounds'],
        defaults: { templateProps: { '@Text': 'Tertiary' }, anchor: { height: 44 } }
      },
      '@CancelTextButton': { 
        icon: X, color: '#f85149', description: 'Cancel button',
        props: ['@Text', '@Anchor', '@Sounds'],
        defaults: { templateProps: { '@Text': 'Cancel' }, anchor: { height: 44 } }
      },
      '@SmallSecondaryTextButton': { 
        icon: Square, color: '#ffc680', description: 'Small button',
        props: ['@Text', '@Anchor', '@Sounds'],
        defaults: { templateProps: { '@Text': 'Small' }, anchor: { height: 32 } }
      },
      '@CloseButton': { 
        icon: X, color: '#ff7b72', description: 'Close button',
        defaults: { anchor: { width: 32, height: 32, top: -8, right: -8 } }
      },
    }
  },
  inputs: {
    label: 'Inputs',
    icon: TextCursor,
    items: {
      '@TextField': { 
        icon: TextCursor, color: '#3fb950', description: 'Text input',
        props: ['@Anchor'],
        defaults: { anchor: { height: 38 } }
      },
      '@NumberField': { 
        icon: TextCursor, color: '#56d364', description: 'Number input',
        props: ['@Anchor'],
        defaults: { anchor: { height: 38 } }
      },
      '@CheckBox': { 
        icon: CheckSquare, color: '#7ee787', description: 'Checkbox',
        defaults: { anchor: { width: 22, height: 22 } }
      },
      '@CheckBoxWithLabel': { 
        icon: CheckSquare, color: '#a5d6a7', description: 'Checkbox + label',
        props: ['@Text', '@Checked'],
        defaults: { templateProps: { '@Text': 'Option', '@Checked': false }, anchor: { height: 22 } }
      },
      '@DropdownBox': { 
        icon: ListFilter, color: '#79c0ff', description: 'Dropdown',
        props: ['@Anchor'],
        defaults: { anchor: { width: 200, height: 32 } }
      },
      'Slider': {
        icon: SlidersHorizontal, color: '#bc8cff', description: 'Slider',
        isRaw: true,
        defaults: { anchor: { height: 16 }, style: '$C.@DefaultSliderStyle' }
      },
    }
  },
  text: {
    label: 'Text',
    icon: Type,
    items: {
      'Label': {
        icon: Type, color: '#e3b341', description: 'Text label',
        isRaw: true,
        defaults: { anchor: { width: 150, height: 24 }, text: 'Label Text', style: '$C.@DefaultLabelStyle' }
      },
      '@Title': { 
        icon: Type, color: '#f9e2af', description: 'Title',
        props: ['@Text', '@Alignment'],
        defaults: { templateProps: { '@Text': 'Title', '@Alignment': 'Center' }, anchor: { height: 38 } }
      },
      '@Subtitle': { 
        icon: Type, color: '#d29922', description: 'Subtitle',
        props: ['@Text'],
        defaults: { templateProps: { '@Text': 'Subtitle' }, anchor: { height: 24 } }
      },
      '@PanelTitle': { 
        icon: Type, color: '#e3b341', description: 'Section title',
        props: ['@Text', '@Alignment'],
        defaults: { templateProps: { '@Text': 'Section', '@Alignment': 'Start' }, anchor: { height: 36 } }
      },
      'Image': {
        icon: Image, color: '#8b949e', description: 'Image',
        isRaw: true,
        defaults: { anchor: { width: 64, height: 64 }, texturePath: 'textures/ui/icon.png' }
      },
    }
  },
  utility: {
    label: 'Utility',
    icon: LayoutGrid,
    items: {
      '@ContentSeparator': { 
        icon: Minus, color: '#6e7681', description: 'H-line',
        props: ['@Anchor'],
        defaults: { anchor: { height: 1 } }
      },
      '@VerticalSeparator': { 
        icon: GripVertical, color: '#6e7681', description: 'V-line',
        defaults: { anchor: { width: 6 } }
      },
      '@DefaultSpinner': { 
        icon: Loader, color: '#8b949e', description: 'Spinner',
        props: ['@Anchor'],
        defaults: { anchor: { width: 32, height: 32 } }
      },
      '@HeaderSearch': { 
        icon: Search, color: '#58a6ff', description: 'Search',
        props: ['@MarginRight'],
        defaults: { anchor: { width: 200 } }
      },
    }
  },
};

const ALL_COMPONENTS = {};
Object.values(COMPONENT_CATEGORIES).forEach(cat => {
  Object.entries(cat.items).forEach(([key, val]) => {
    ALL_COMPONENTS[key] = val;
  });
});

let idCounter = 0;
const genId = () => `el_${++idCounter}`;

// Layout Engine
function computeLayout(elements, rootWidth, rootHeight) {
  const computed = new Map();
  const getChildren = (parentId) => elements.filter(el => el.parentId === parentId);
  
  const resolveAnchor = (anchor, pw, ph) => {
    const a = anchor || {};
    let w = a.width ?? 100;
    let h = a.height ?? 50;
    
    if (a.width != null) w = a.width;
    else if (a.left != null && a.right != null) w = Math.max(10, pw - a.left - a.right);
    else if (a.horizontal != null) w = Math.max(10, pw - a.horizontal * 2);
    else w = pw;
    
    if (a.height != null) h = a.height;
    else if (a.top != null && a.bottom != null) h = Math.max(10, ph - a.top - a.bottom);
    else if (a.vertical != null) h = Math.max(10, ph - a.vertical * 2);
    else h = ph;
    
    let x = 0;
    if (a.left != null) x = a.left;
    else if (a.right != null) x = pw - w - a.right;
    else if (a.horizontal != null) x = a.horizontal;
    
    let y = 0;
    if (a.top != null) y = a.top;
    else if (a.bottom != null) y = ph - h - a.bottom;
    else if (a.vertical != null) y = a.vertical;
    
    return { x, y, width: Math.max(10, w), height: Math.max(10, h) };
  };

  const computeElement = (el, px, py, pw, ph, offset = 0, layoutMode = LayoutMode.NONE, flexSpace = null) => {
    const props = el.props || {};
    const anchor = props.anchor || {};
    const padding = props.padding || {};
    
    let result;
    
    if (layoutMode === LayoutMode.NONE) {
      const r = resolveAnchor(anchor, pw, ph);
      result = { id: el.id, x: px + r.x, y: py + r.y, width: r.width, height: r.height };
    } else {
      const isVert = layoutMode === LayoutMode.TOP || layoutMode === LayoutMode.BOTTOM;
      const isRev = layoutMode === LayoutMode.BOTTOM || layoutMode === LayoutMode.RIGHT;
      
      let w = anchor.width ?? (isVert ? pw : 100);
      let h = anchor.height ?? (isVert ? 50 : ph);
      
      if (props.flexWeight && flexSpace != null) {
        if (isVert) h = flexSpace;
        else w = flexSpace;
      }
      
      if (isVert) {
        if (anchor.horizontal != null) w = pw - anchor.horizontal * 2;
        else if (anchor.left != null && anchor.right != null) w = pw - anchor.left - anchor.right;
      }
      
      if (!isVert) {
        if (anchor.vertical != null) h = ph - anchor.vertical * 2;
        else if (anchor.top != null && anchor.bottom != null) h = ph - anchor.top - anchor.bottom;
      }
      
      let x, y;
      if (isVert) {
        x = px + (anchor.left ?? anchor.horizontal ?? 0);
        y = isRev ? py + ph - offset - h : py + offset;
      } else {
        x = isRev ? px + pw - offset - w : px + offset;
        y = py + (anchor.top ?? anchor.vertical ?? 0);
      }
      
      result = { id: el.id, x, y, width: Math.max(10, w), height: Math.max(10, h) };
    }
    
    computed.set(el.id, result);
    
    const children = getChildren(el.id);
    if (children.length === 0) return result;
    
    const childLayout = props.layoutMode || LayoutMode.NONE;
    const pf = padding.full || 0;
    const pt = padding.top ?? padding.vertical ?? pf;
    const pl = padding.left ?? padding.horizontal ?? pf;
    const pr = padding.right ?? padding.horizontal ?? pf;
    const pb = padding.bottom ?? padding.vertical ?? pf;
    
    const ix = result.x + pl;
    const iy = result.y + pt;
    const iw = Math.max(10, result.width - pl - pr);
    const ih = Math.max(10, result.height - pt - pb);
    
    if (childLayout === LayoutMode.NONE) {
      children.forEach(c => computeElement(c, ix, iy, iw, ih));
    } else {
      const isVert = childLayout === LayoutMode.TOP || childLayout === LayoutMode.BOTTOM;
      
      let totalFixed = 0, totalWeight = 0;
      children.forEach(c => {
        const cp = c.props || {};
        if (cp.flexWeight) totalWeight += cp.flexWeight;
        else totalFixed += isVert ? (cp.anchor?.height ?? 50) : (cp.anchor?.width ?? 100);
      });
      
      const available = Math.max(0, (isVert ? ih : iw) - totalFixed);
      
      let off = 0;
      children.forEach(c => {
        const cp = c.props || {};
        const fs = cp.flexWeight ? (cp.flexWeight / totalWeight) * available : null;
        computeElement(c, ix, iy, iw, ih, off, childLayout, fs);
        const cc = computed.get(c.id);
        off += isVert ? cc.height : cc.width;
      });
    }
    
    return result;
  };
  
  elements.filter(el => !el.parentId).forEach(root => {
    computeElement(root, 0, 0, rootWidth, rootHeight);
  });
  
  return computed;
}

// Code Generator
function generateHytaleCode(elements, canvasSize) {
  const ind = (n) => '  '.repeat(n);
  
  const fmtVal = (v) => {
    if (v == null) return null;
    if (typeof v === 'string') {
      if (v.startsWith('$') || v.startsWith('@') || v.startsWith('#') || v.startsWith('%')) return v;
      return `"${v}"`;
    }
    if (typeof v === 'boolean') return v.toString();
    return v.toString();
  };
  
  const fmtAnchor = (a) => {
    if (!a) return null;
    const p = [];
    if (a.top != null) p.push(`Top: ${a.top}`);
    if (a.left != null) p.push(`Left: ${a.left}`);
    if (a.right != null) p.push(`Right: ${a.right}`);
    if (a.bottom != null) p.push(`Bottom: ${a.bottom}`);
    if (a.width != null) p.push(`Width: ${a.width}`);
    if (a.height != null) p.push(`Height: ${a.height}`);
    if (a.horizontal != null) p.push(`Horizontal: ${a.horizontal}`);
    if (a.vertical != null) p.push(`Vertical: ${a.vertical}`);
    return p.length ? `(${p.join(', ')})` : null;
  };
  
  const fmtPad = (p) => {
    if (!p) return null;
    const a = [];
    if (p.full != null) a.push(`Full: ${p.full}`);
    if (p.top != null) a.push(`Top: ${p.top}`);
    if (p.left != null) a.push(`Left: ${p.left}`);
    if (p.right != null) a.push(`Right: ${p.right}`);
    if (p.bottom != null) a.push(`Bottom: ${p.bottom}`);
    if (p.horizontal != null) a.push(`Horizontal: ${p.horizontal}`);
    if (p.vertical != null) a.push(`Vertical: ${p.vertical}`);
    return a.length ? `(${a.join(', ')})` : null;
  };

  const render = (el, lv = 1) => {
    const p = el.props || {};
    const ch = elements.filter(e => e.parentId === el.id);
    const def = ALL_COMPONENTS[el.componentType];
    const isRaw = def?.isRaw;
    
    let c = ind(lv);
    c += (!isRaw && el.componentType.startsWith('@')) ? `$C.${el.componentType}` : el.componentType;
    if (el.name) c += ` #${el.name}`;
    c += ' {\n';
    
    if (el.templateProps) {
      Object.entries(el.templateProps).forEach(([k, v]) => {
        if (v != null && v !== '') c += `${ind(lv + 1)}${k}: ${fmtVal(v)};\n`;
      });
    }
    
    if (p.layoutMode && p.layoutMode !== LayoutMode.NONE) c += `${ind(lv + 1)}LayoutMode: ${p.layoutMode};\n`;
    if (p.flexWeight) c += `${ind(lv + 1)}FlexWeight: ${p.flexWeight};\n`;
    
    const anc = fmtAnchor(p.anchor);
    if (anc) c += `${ind(lv + 1)}Anchor: ${anc};\n`;
    
    const pad = fmtPad(p.padding);
    if (pad) c += `${ind(lv + 1)}Padding: ${pad};\n`;
    
    if (isRaw) {
      if (p.background) c += `${ind(lv + 1)}Background: ${fmtVal(p.background)};\n`;
      if (p.style) c += `${ind(lv + 1)}Style: ${p.style};\n`;
    }
    if (p.text != null) c += `${ind(lv + 1)}Text: ${fmtVal(p.text)};\n`;
    if (p.texturePath) c += `${ind(lv + 1)}TexturePath: ${fmtVal(p.texturePath)};\n`;
    if (p.scrollbarStyle) c += `${ind(lv + 1)}ScrollbarStyle: ${p.scrollbarStyle};\n`;
    
    ch.forEach(child => { c += render(child, lv + 1); });
    c += `${ind(lv)}}\n`;
    return c;
  };
  
  let out = `$C = "../Common.ui";\n\nGroup {\n  LayoutMode: Top;\n  Style: (TextColor: #ffffff);\n  Anchor: (Width: ${canvasSize.width}, Height: ${canvasSize.height});\n  Background: #1a1f2e;\n`;
  elements.filter(el => !el.parentId).forEach(r => { out += render(r, 1); });
  out += `}\n`;
  return out;
}

// Breakpoints
const useResponsive = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return {
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
  };
};

// Main App
function HytaleUIBuilder() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [viewMode, setViewMode] = useState('design');
  const [expanded, setExpanded] = useState(new Set());
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 400 });
  const [dragState, setDragState] = useState(null);
  const [activeCategory, setActiveCategory] = useState('containers');
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  
  const { isMobile, isTablet } = useResponsive();
  
  // Auto-collapse panels on mobile
  useEffect(() => {
    if (isMobile) {
      setLeftPanelOpen(false);
      setRightPanelOpen(false);
    } else if (isTablet) {
      setRightPanelOpen(false);
    }
  }, [isMobile, isTablet]);
  
  const selectedElement = elements.find(el => el.id === selectedId);
  const computedLayout = useMemo(() => computeLayout(elements, canvasSize.width, canvasSize.height), [elements, canvasSize]);

  const addElement = useCallback((componentType, parentId = null) => {
    const def = ALL_COMPONENTS[componentType];
    if (!def) return;
    
    const newEl = {
      id: genId(),
      componentType,
      name: `${componentType.replace('@', '')}${idCounter}`,
      parentId,
      templateProps: def.defaults?.templateProps ? { ...def.defaults.templateProps } : null,
      props: {
        layoutMode: def.defaults?.layoutMode || LayoutMode.NONE,
        flexWeight: null,
        anchor: { ...(def.defaults?.anchor || {}) },
        padding: { ...(def.defaults?.padding || {}) },
        background: def.defaults?.background || null,
        style: def.defaults?.style || null,
        text: def.defaults?.text || null,
        texturePath: def.defaults?.texturePath || null,
        scrollbarStyle: def.defaults?.scrollbarStyle || null,
      },
    };
    
    setElements(prev => [...prev, newEl]);
    setSelectedId(newEl.id);
    if (parentId) setExpanded(prev => new Set([...prev, parentId]));
    if (isMobile) setLeftPanelOpen(false);
  }, [isMobile]);

  const deleteElement = useCallback((id) => {
    setElements(prev => {
      const del = new Set([id]);
      const findKids = (pid) => prev.filter(e => e.parentId === pid).forEach(c => { del.add(c.id); findKids(c.id); });
      findKids(id);
      return prev.filter(e => !del.has(e.id));
    });
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const updateProps = useCallback((id, path, val) => {
    setElements(prev => prev.map(el => {
      if (el.id !== id) return el;
      const n = { ...el, props: { ...el.props } };
      const p = path.split('.');
      if (p.length === 1) n.props[p[0]] = val;
      else if (p.length === 2) n.props[p[0]] = { ...n.props[p[0]], [p[1]]: val };
      return n;
    }));
  }, []);

  const updateTemplateProp = useCallback((id, k, v) => {
    setElements(prev => prev.map(el => el.id !== id ? el : { ...el, templateProps: { ...el.templateProps, [k]: v } }));
  }, []);

  const updateName = useCallback((id, name) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, name } : el));
  }, []);

  const duplicateElement = useCallback((id) => {
    const el = elements.find(e => e.id === id);
    if (!el) return;
    const n = { ...el, id: genId(), name: `${el.name}_copy`, props: JSON.parse(JSON.stringify(el.props)), templateProps: el.templateProps ? { ...el.templateProps } : null };
    setElements(prev => [...prev, n]);
    setSelectedId(n.id);
  }, [elements]);

  const handleMouseDown = (e, id) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const el = elements.find(x => x.id === id);
    if (!el) return;
    setSelectedId(id);
    setDragState({ id, sx: e.clientX, sy: e.clientY, anchor: { ...el.props.anchor } });
    if (isMobile && !rightPanelOpen) setRightPanelOpen(true);
  };

  const handleMouseMove = (e) => {
    if (!dragState) return;
    const dx = e.clientX - dragState.sx;
    const dy = e.clientY - dragState.sy;
    const a = dragState.anchor;
    const na = { ...a };
    
    if (a.left != null) na.left = Math.max(0, Math.round(a.left + dx));
    else if (a.right != null) na.right = Math.max(0, Math.round(a.right - dx));
    else na.left = Math.max(0, Math.round(dx));
    
    if (a.top != null) na.top = Math.max(0, Math.round(a.top + dy));
    else if (a.bottom != null) na.bottom = Math.max(0, Math.round(a.bottom - dy));
    else na.top = Math.max(0, Math.round(dy));
    
    setElements(prev => prev.map(el => el.id === dragState.id ? { ...el, props: { ...el.props, anchor: na } } : el));
  };

  const handleMouseUp = () => setDragState(null);

  const canHaveChildren = (t) => ['Group', 'ScrollPanel', '@Container', '@DecoratedContainer', '@Panel', '@PageOverlay'].includes(t);

  const sidebarWidth = isMobile ? '100%' : isTablet ? 220 : 240;
  const rightSidebarWidth = isMobile ? '100%' : isTablet ? 260 : 280;

  const renderTree = (el, lv = 0) => {
    const kids = elements.filter(c => c.parentId === el.id);
    const hasKids = kids.length > 0;
    const isExp = expanded.has(el.id);
    const isSel = selectedId === el.id;
    const def = ALL_COMPONENTS[el.componentType];
    const IconComp = def?.icon || Box;
    const col = def?.color || '#8b949e';

    return (
      <div key={el.id}>
        <div onClick={() => { setSelectedId(el.id); if (isMobile) setRightPanelOpen(true); }}
          style={{ 
            padding: '6px 8px 6px ' + (12 + lv * 14) + 'px',
            borderLeft: isSel ? `2px solid ${theme.accent.primary}` : '2px solid transparent',
            background: isSel ? 'rgba(88,166,255,0.08)' : 'transparent',
            display: 'flex', alignItems: 'center', gap: 6,
            cursor: 'pointer', transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { if (!isSel) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
          onMouseLeave={(e) => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}>
          {hasKids ? (
            <button onClick={(e) => { e.stopPropagation(); setExpanded(p => { const n = new Set(p); n.has(el.id) ? n.delete(el.id) : n.add(el.id); return n; }); }}
              style={{ padding: 2, background: 'transparent', border: 'none', cursor: 'pointer', color: theme.text.muted, display: 'flex' }}>
              {isExp ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </button>
          ) : <span style={{ width: 16 }} />}
          <IconComp size={14} style={{ color: col, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontFamily: 'monospace', color: isSel ? theme.text.primary : theme.text.secondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{el.name}</span>
        </div>
        {isExp && kids.map(c => renderTree(c, lv + 1))}
      </div>
    );
  };

  const renderCanvas = (el) => {
    const c = computedLayout.get(el.id);
    if (!c) return null;
    const isSel = selectedId === el.id;
    const def = ALL_COMPONENTS[el.componentType];
    const col = def?.color || '#8b949e';
    const kids = elements.filter(x => x.parentId === el.id);
    
    let txt = el.componentType.replace('@', '');
    if (el.templateProps?.['@Text']) txt = el.templateProps['@Text'];
    else if (el.props?.text) txt = el.props.text;

    return (
      <div key={el.id} onMouseDown={(e) => handleMouseDown(e, el.id)} onClick={(e) => { e.stopPropagation(); setSelectedId(el.id); }}
        style={{
          position: 'absolute', left: c.x, top: c.y, width: c.width, height: c.height,
          border: `1.5px ${isSel ? 'solid' : 'dashed'} ${isSel ? col : col + '40'}`,
          background: `${col}08`, 
          boxShadow: isSel ? `0 0 0 2px ${col}25, inset 0 0 20px ${col}05` : 'none',
          borderRadius: 3, cursor: dragState?.id === el.id ? 'grabbing' : 'grab', overflow: 'hidden',
          transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
        }}>
        <div style={{ 
          position: 'absolute', top: -16, left: 0, fontSize: 10, fontFamily: 'monospace', fontWeight: 500,
          padding: '2px 6px', borderRadius: 3, 
          background: isSel ? col : theme.bg.tertiary, 
          color: isSel ? '#000' : theme.text.secondary, 
          whiteSpace: 'nowrap', letterSpacing: '-0.02em',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}>
          {el.name}
        </div>
        {el.props.layoutMode && el.props.layoutMode !== LayoutMode.NONE && (
          <div style={{ position: 'absolute', top: 4, right: 4, fontSize: 9, fontFamily: 'monospace', background: 'rgba(0,0,0,0.5)', padding: '2px 5px', borderRadius: 3, color: theme.text.muted }}>
            {el.props.layoutMode}
          </div>
        )}
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: theme.text.placeholder, fontFamily: 'monospace', textAlign: 'center', padding: 6, overflow: 'hidden' }}>
          {txt}
        </div>
        {kids.map(renderCanvas)}
      </div>
    );
  };

  const NumInput = ({ label, value, onChange, placeholder }) => (
    <div style={{ flex: 1, minWidth: 0 }}>
      <label style={{ display: 'block', fontSize: 10, color: theme.text.muted, marginBottom: 4, fontWeight: 500 }}>{label}</label>
      <input type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : parseInt(e.target.value))} placeholder={placeholder}
        style={{ 
          width: '100%', background: theme.bg.canvas, border: `1px solid ${theme.border.default}`, borderRadius: 4, 
          padding: '6px 8px', fontSize: 12, fontFamily: 'monospace', color: theme.text.primary, outline: 'none',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
        }}
        onFocus={(e) => { e.target.style.borderColor = theme.accent.primary; e.target.style.boxShadow = `0 0 0 2px ${theme.accent.primary}20`; }}
        onBlur={(e) => { e.target.style.borderColor = theme.border.default; e.target.style.boxShadow = 'none'; }} />
    </div>
  );

  const inputStyle = {
    width: '100%', background: theme.bg.canvas, border: `1px solid ${theme.border.default}`, borderRadius: 4,
    padding: '8px 10px', fontSize: 12, fontFamily: 'monospace', color: theme.text.primary, outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  };

  const btnStyle = (active) => ({
    padding: '6px 12px', borderRadius: 4, fontSize: 11, fontWeight: 500,
    background: active ? 'rgba(88,166,255,0.15)' : 'transparent',
    color: active ? theme.accent.primary : theme.text.secondary,
    border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
    display: 'flex', alignItems: 'center', gap: 6,
  });

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', background: theme.bg.primary, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', color: theme.text.secondary, overflow: 'hidden' }}
      onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      
      {/* Header */}
      <div style={{ height: 48, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8, borderBottom: `1px solid ${theme.border.subtle}`, background: theme.bg.secondary, flexShrink: 0 }}>
        {/* Mobile menu toggle */}
        <button onClick={() => setLeftPanelOpen(!leftPanelOpen)}
          style={{ padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: theme.text.secondary, display: 'flex', borderRadius: 4 }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          {leftPanelOpen ? <PanelLeftClose size={18} /> : <Menu size={18} />}
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(135deg, ${theme.accent.primary}, #a855f7)` }}>
            <Grid3X3 size={16} color="#fff" />
          </div>
          {!isMobile && <span style={{ fontWeight: 600, color: theme.text.primary, fontSize: 15, letterSpacing: '-0.02em' }}>Hytale UI Builder</span>}
        </div>
        
        <div style={{ flex: 1 }} />
        
        <div style={{ display: 'flex', gap: 2, background: theme.bg.canvas, borderRadius: 6, padding: 3 }}>
          {[{ id: 'design', icon: Eye, label: 'Design' }, { id: 'code', icon: Code, label: 'Code' }].map(m => (
            <button key={m.id} onClick={() => setViewMode(m.id)} style={btnStyle(viewMode === m.id)}>
              <m.icon size={14} />{!isMobile && m.label}
            </button>
          ))}
        </div>
        
        <button onClick={() => {
          const code = generateHytaleCode(elements, canvasSize);
          const blob = new Blob([code], { type: 'text/plain' });
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'custom_ui.ui'; a.click();
        }} style={{ padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, background: theme.accent.success, color: '#fff', border: 'none', cursor: 'pointer', transition: 'opacity 0.15s ease' }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
          <Download size={14} />{!isMobile && 'Export'}
        </button>
        
        {!isMobile && (
          <button onClick={() => setRightPanelOpen(!rightPanelOpen)}
            style={{ padding: 8, background: 'transparent', border: 'none', cursor: 'pointer', color: theme.text.secondary, display: 'flex', borderRadius: 4 }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            {rightPanelOpen ? <PanelRightClose size={18} /> : <PanelRightClose size={18} style={{ transform: 'scaleX(-1)' }} />}
          </button>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0, position: 'relative' }}>
        
        {/* Left Sidebar */}
        <div style={{ 
          width: leftPanelOpen ? sidebarWidth : 0,
          minWidth: leftPanelOpen ? sidebarWidth : 0,
          display: 'flex', flexDirection: 'column', borderRight: leftPanelOpen ? `1px solid ${theme.border.subtle}` : 'none',
          background: theme.bg.primary, overflow: 'hidden', transition: 'width 0.2s ease, min-width 0.2s ease',
          position: isMobile ? 'absolute' : 'relative', left: 0, top: 0, bottom: 0, zIndex: 20,
          boxShadow: isMobile && leftPanelOpen ? '4px 0 20px rgba(0,0,0,0.3)' : 'none',
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${theme.border.subtle}`, flexShrink: 0, overflowX: 'auto' }}>
            {Object.entries(COMPONENT_CATEGORIES).map(([k, cat]) => {
              const IconComp = cat.icon;
              const isActive = activeCategory === k;
              return (
                <button key={k} onClick={() => setActiveCategory(k)}
                  style={{ 
                    flex: 1, minWidth: 44, padding: '10px 4px', fontSize: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    background: 'transparent', border: 'none', borderBottom: `2px solid ${isActive ? theme.accent.primary : 'transparent'}`,
                    color: isActive ? theme.text.primary : theme.text.muted, cursor: 'pointer', transition: 'all 0.15s ease',
                  }}>
                  <IconComp size={14} />
                  <span style={{ fontWeight: isActive ? 600 : 400 }}>{cat.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Components Grid */}
          <div style={{ padding: 10, borderBottom: `1px solid ${theme.border.subtle}`, overflowY: 'auto', maxHeight: 200, flexShrink: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
              {Object.entries(COMPONENT_CATEGORIES[activeCategory]?.items || {}).map(([k, comp]) => {
                const IconComp = comp.icon;
                return (
                  <button key={k} onClick={() => { const pid = selectedElement && canHaveChildren(selectedElement.componentType) ? selectedId : null; addElement(k, pid); }}
                    style={{ 
                      padding: 10, borderRadius: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      background: `${comp.color}08`, border: `1px solid ${comp.color}20`, cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = `${comp.color}15`; e.currentTarget.style.borderColor = `${comp.color}40`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = `${comp.color}08`; e.currentTarget.style.borderColor = `${comp.color}20`; }}
                    title={comp.description}>
                    <IconComp size={16} style={{ color: comp.color }} />
                    <span style={{ fontSize: 10, color: theme.text.secondary, textAlign: 'center', lineHeight: 1.3, fontWeight: 500 }}>{k.replace('@', '')}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hierarchy Tree */}
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            <div style={{ padding: '14px 12px 8px', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.text.muted, fontWeight: 600 }}>Hierarchy</div>
            {elements.filter(el => !el.parentId).map(el => renderTree(el))}
            {elements.length === 0 && <div style={{ fontSize: 12, color: theme.text.placeholder, textAlign: 'center', padding: 32 }}>Add components from above</div>}
          </div>
        </div>

        {/* Canvas Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          {viewMode === 'design' && (
            <>
              <div style={{ height: 40, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, borderBottom: `1px solid ${theme.border.subtle}`, flexShrink: 0, background: theme.bg.secondary }}>
                <span style={{ fontSize: 11, color: theme.text.muted, fontWeight: 500 }}>Canvas</span>
                <input type="number" value={canvasSize.width} onChange={(e) => setCanvasSize(s => ({ ...s, width: parseInt(e.target.value) || 400 }))}
                  style={{ width: 60, background: theme.bg.canvas, border: `1px solid ${theme.border.default}`, borderRadius: 4, padding: '4px 8px', fontSize: 12, fontFamily: 'monospace', color: theme.text.primary }} />
                <span style={{ color: theme.text.muted }}>×</span>
                <input type="number" value={canvasSize.height} onChange={(e) => setCanvasSize(s => ({ ...s, height: parseInt(e.target.value) || 300 }))}
                  style={{ width: 60, background: theme.bg.canvas, border: `1px solid ${theme.border.default}`, borderRadius: 4, padding: '4px 8px', fontSize: 12, fontFamily: 'monospace', color: theme.text.primary }} />
              </div>
              <div onClick={() => setSelectedId(null)}
                style={{ 
                  flex: 1, overflow: 'auto', padding: isMobile ? 12 : 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                  background: theme.bg.canvas,
                  backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.border.subtle} 1px, transparent 0)`,
                  backgroundSize: '24px 24px',
                }}>
                <div style={{ 
                  position: 'relative', width: canvasSize.width, height: canvasSize.height, 
                  background: `linear-gradient(145deg, ${theme.bg.tertiary} 0%, ${theme.bg.primary} 100%)`,
                  border: `1px solid ${theme.border.emphasis}`, borderRadius: 6, 
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02) inset',
                  flexShrink: 0,
                }}>
                  {elements.filter(el => !el.parentId).map(renderCanvas)}
                  {elements.length === 0 && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.text.placeholder, fontSize: 13 }}>Click a component to add it</div>}
                </div>
              </div>
            </>
          )}
          {viewMode === 'code' && (
            <div style={{ flex: 1, overflow: 'auto', padding: 16, background: theme.bg.canvas }}>
              <pre style={{ 
                fontSize: 12, lineHeight: 1.7, padding: 20, borderRadius: 8, fontFamily: '"Fira Code", "SF Mono", monospace',
                whiteSpace: 'pre', background: '#010409', border: `1px solid ${theme.border.default}`, color: '#7ee787', margin: 0, overflow: 'auto',
              }}>
                {generateHytaleCode(elements, canvasSize)}
              </pre>
            </div>
          )}
        </div>

        {/* Right Sidebar - Properties */}
        <div style={{ 
          width: rightPanelOpen ? rightSidebarWidth : 0,
          minWidth: rightPanelOpen ? rightSidebarWidth : 0,
          display: 'flex', flexDirection: 'column', borderLeft: rightPanelOpen ? `1px solid ${theme.border.subtle}` : 'none',
          background: theme.bg.primary, overflow: 'hidden', transition: 'width 0.2s ease, min-width 0.2s ease',
          position: isMobile ? 'absolute' : 'relative', right: 0, top: 0, bottom: 0, zIndex: 20,
          boxShadow: isMobile && rightPanelOpen ? '-4px 0 20px rgba(0,0,0,0.3)' : 'none',
        }}>
          <div style={{ padding: '14px 16px', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.text.muted, fontWeight: 600, borderBottom: `1px solid ${theme.border.subtle}`, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Properties</span>
            {isMobile && (
              <button onClick={() => setRightPanelOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: theme.text.muted, padding: 4 }}>
                <X size={14} />
              </button>
            )}
          </div>
          
          {selectedElement ? (
            <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Type Badge */}
              <div style={{ padding: '6px 10px', borderRadius: 4, background: `${ALL_COMPONENTS[selectedElement.componentType]?.color}15`, color: ALL_COMPONENTS[selectedElement.componentType]?.color, fontSize: 11, alignSelf: 'flex-start', fontWeight: 600, letterSpacing: '-0.01em' }}>
                {selectedElement.componentType}
              </div>

              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: 11, color: theme.text.muted, marginBottom: 6, fontWeight: 500 }}>Name</label>
                <input type="text" value={selectedElement.name || ''} onChange={(e) => updateName(selectedId, e.target.value)} style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = theme.accent.primary; e.target.style.boxShadow = `0 0 0 2px ${theme.accent.primary}20`; }}
                  onBlur={(e) => { e.target.style.borderColor = theme.border.default; e.target.style.boxShadow = 'none'; }} />
              </div>

              {/* Template Props */}
              {selectedElement.templateProps && Object.keys(selectedElement.templateProps).length > 0 && (
                <div style={{ padding: 12, borderRadius: 6, background: 'rgba(227,179,65,0.05)', border: '1px solid rgba(227,179,65,0.15)' }}>
                  <div style={{ fontSize: 10, color: '#e3b341', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Template Props</div>
                  {Object.entries(selectedElement.templateProps).map(([k, v]) => (
                    <div key={k} style={{ marginBottom: 10 }}>
                      <label style={{ display: 'block', fontSize: 11, color: theme.text.muted, marginBottom: 6, fontWeight: 500 }}>{k}</label>
                      {k === '@Checked' ? (
                        <button onClick={() => updateTemplateProp(selectedId, k, !v)}
                          style={{ padding: '6px 14px', borderRadius: 4, fontSize: 11, fontWeight: 500, background: v ? 'rgba(63,185,80,0.15)' : 'rgba(255,255,255,0.05)', color: v ? theme.accent.success : theme.text.muted, border: 'none', cursor: 'pointer', transition: 'all 0.15s ease' }}>
                          {v ? 'true' : 'false'}
                        </button>
                      ) : k === '@Alignment' ? (
                        <div style={{ display: 'flex', gap: 4 }}>
                          {['Start', 'Center', 'End'].map(a => (
                            <button key={a} onClick={() => updateTemplateProp(selectedId, k, a)}
                              style={{ flex: 1, padding: '6px 0', borderRadius: 4, fontSize: 10, fontWeight: 500, background: v === a ? `${theme.accent.primary}20` : theme.bg.canvas, color: v === a ? theme.accent.primary : theme.text.muted, border: `1px solid ${v === a ? theme.accent.primary + '40' : theme.border.default}`, cursor: 'pointer', transition: 'all 0.15s ease' }}>
                              {a}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input type="text" value={v || ''} onChange={(e) => updateTemplateProp(selectedId, k, e.target.value)} style={inputStyle}
                          onFocus={(e) => { e.target.style.borderColor = theme.accent.primary; e.target.style.boxShadow = `0 0 0 2px ${theme.accent.primary}20`; }}
                          onBlur={(e) => { e.target.style.borderColor = theme.border.default; e.target.style.boxShadow = 'none'; }} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* LayoutMode */}
              {canHaveChildren(selectedElement.componentType) && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: theme.text.muted, marginBottom: 6, fontWeight: 500 }}>Layout Mode</label>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {Object.values(LayoutMode).map(m => (
                      <button key={m} onClick={() => updateProps(selectedId, 'layoutMode', m)}
                        style={{ padding: '6px 10px', borderRadius: 4, fontSize: 10, fontWeight: 500, background: selectedElement.props.layoutMode === m ? `${theme.accent.primary}20` : theme.bg.canvas, color: selectedElement.props.layoutMode === m ? theme.accent.primary : theme.text.muted, border: `1px solid ${selectedElement.props.layoutMode === m ? theme.accent.primary + '40' : theme.border.default}`, cursor: 'pointer', transition: 'all 0.15s ease' }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* FlexWeight */}
              <div>
                <label style={{ display: 'block', fontSize: 11, color: theme.text.muted, marginBottom: 6, fontWeight: 500 }}>Flex Weight</label>
                <input type="number" value={selectedElement.props.flexWeight ?? ''} placeholder="null"
                  onChange={(e) => updateProps(selectedId, 'flexWeight', e.target.value === '' ? null : parseFloat(e.target.value))}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = theme.accent.primary; e.target.style.boxShadow = `0 0 0 2px ${theme.accent.primary}20`; }}
                  onBlur={(e) => { e.target.style.borderColor = theme.border.default; e.target.style.boxShadow = 'none'; }} />
              </div>

              {/* Anchor */}
              <div style={{ padding: 12, borderRadius: 6, background: theme.bg.secondary, border: `1px solid ${theme.border.subtle}` }}>
                <div style={{ fontSize: 10, color: theme.text.muted, marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Anchor</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <NumInput label="Top" value={selectedElement.props.anchor?.top} onChange={(v) => updateProps(selectedId, 'anchor.top', v)} />
                  <NumInput label="Bottom" value={selectedElement.props.anchor?.bottom} onChange={(v) => updateProps(selectedId, 'anchor.bottom', v)} />
                  <NumInput label="Left" value={selectedElement.props.anchor?.left} onChange={(v) => updateProps(selectedId, 'anchor.left', v)} />
                  <NumInput label="Right" value={selectedElement.props.anchor?.right} onChange={(v) => updateProps(selectedId, 'anchor.right', v)} />
                  <NumInput label="Width" value={selectedElement.props.anchor?.width} onChange={(v) => updateProps(selectedId, 'anchor.width', v)} />
                  <NumInput label="Height" value={selectedElement.props.anchor?.height} onChange={(v) => updateProps(selectedId, 'anchor.height', v)} />
                  <NumInput label="Horiz" value={selectedElement.props.anchor?.horizontal} onChange={(v) => updateProps(selectedId, 'anchor.horizontal', v)} placeholder="L+R" />
                  <NumInput label="Vert" value={selectedElement.props.anchor?.vertical} onChange={(v) => updateProps(selectedId, 'anchor.vertical', v)} placeholder="T+B" />
                </div>
              </div>

              {/* Padding */}
              {canHaveChildren(selectedElement.componentType) && (
                <div style={{ padding: 12, borderRadius: 6, background: theme.bg.secondary, border: `1px solid ${theme.border.subtle}` }}>
                  <div style={{ fontSize: 10, color: theme.text.muted, marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Padding</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <NumInput label="Full" value={selectedElement.props.padding?.full} onChange={(v) => updateProps(selectedId, 'padding.full', v)} />
                    <NumInput label="Horiz" value={selectedElement.props.padding?.horizontal} onChange={(v) => updateProps(selectedId, 'padding.horizontal', v)} />
                    <NumInput label="Top" value={selectedElement.props.padding?.top} onChange={(v) => updateProps(selectedId, 'padding.top', v)} />
                    <NumInput label="Bottom" value={selectedElement.props.padding?.bottom} onChange={(v) => updateProps(selectedId, 'padding.bottom', v)} />
                    <NumInput label="Left" value={selectedElement.props.padding?.left} onChange={(v) => updateProps(selectedId, 'padding.left', v)} />
                    <NumInput label="Right" value={selectedElement.props.padding?.right} onChange={(v) => updateProps(selectedId, 'padding.right', v)} />
                  </div>
                </div>
              )}

              {/* Raw Props */}
              {ALL_COMPONENTS[selectedElement.componentType]?.isRaw && (
                <>
                  {selectedElement.props.text !== undefined && (
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: theme.text.muted, marginBottom: 6, fontWeight: 500 }}>Text</label>
                      <input type="text" value={selectedElement.props.text || ''} onChange={(e) => updateProps(selectedId, 'text', e.target.value)} style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = theme.accent.primary; e.target.style.boxShadow = `0 0 0 2px ${theme.accent.primary}20`; }}
                        onBlur={(e) => { e.target.style.borderColor = theme.border.default; e.target.style.boxShadow = 'none'; }} />
                    </div>
                  )}
                  {selectedElement.props.texturePath !== undefined && (
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: theme.text.muted, marginBottom: 6, fontWeight: 500 }}>Texture Path</label>
                      <input type="text" value={selectedElement.props.texturePath || ''} onChange={(e) => updateProps(selectedId, 'texturePath', e.target.value)} style={inputStyle}
                        onFocus={(e) => { e.target.style.borderColor = theme.accent.primary; e.target.style.boxShadow = `0 0 0 2px ${theme.accent.primary}20`; }}
                        onBlur={(e) => { e.target.style.borderColor = theme.border.default; e.target.style.boxShadow = 'none'; }} />
                    </div>
                  )}
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: theme.text.muted, marginBottom: 6, fontWeight: 500 }}>Background</label>
                    <input type="text" value={selectedElement.props.background || ''} onChange={(e) => updateProps(selectedId, 'background', e.target.value || null)} placeholder="#hex or $C.@Style" style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = theme.accent.primary; e.target.style.boxShadow = `0 0 0 2px ${theme.accent.primary}20`; }}
                      onBlur={(e) => { e.target.style.borderColor = theme.border.default; e.target.style.boxShadow = 'none'; }} />
                  </div>
                </>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, paddingTop: 14, borderTop: `1px solid ${theme.border.subtle}`, marginTop: 'auto' }}>
                <button onClick={() => duplicateElement(selectedId)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 6, fontSize: 11, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: theme.bg.secondary, border: `1px solid ${theme.border.default}`, color: theme.text.secondary, cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = theme.bg.tertiary; e.currentTarget.style.borderColor = theme.border.emphasis; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = theme.bg.secondary; e.currentTarget.style.borderColor = theme.border.default; }}>
                  <Copy size={13} /> Clone
                </button>
                <button onClick={() => deleteElement(selectedId)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 6, fontSize: 11, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(248,81,73,0.1)', border: '1px solid rgba(248,81,73,0.2)', color: theme.accent.danger, cursor: 'pointer', transition: 'all 0.15s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(248,81,73,0.15)'; e.currentTarget.style.borderColor = 'rgba(248,81,73,0.3)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(248,81,73,0.1)'; e.currentTarget.style.borderColor = 'rgba(248,81,73,0.2)'; }}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.text.placeholder, fontSize: 12, padding: 20, textAlign: 'center' }}>
              Select a component to edit its properties
            </div>
          )}
        </div>
        
        {/* Mobile overlay */}
        {isMobile && (leftPanelOpen || rightPanelOpen) && (
          <div onClick={() => { setLeftPanelOpen(false); setRightPanelOpen(false); }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10 }} />
        )}
      </div>

      {/* Footer */}
      <div style={{ height: 28, display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 11, color: theme.text.muted, borderTop: `1px solid ${theme.border.subtle}`, background: theme.bg.secondary, gap: 16, flexShrink: 0 }}>
        <span style={{ fontWeight: 500 }}>{elements.length} component{elements.length !== 1 ? 's' : ''}</span>
        <span style={{ color: theme.border.default }}>|</span>
        <span style={{ fontFamily: 'monospace', fontSize: 10 }}>$C = "../Common.ui"</span>
      </div>
    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('gui-plugin-root'));
root.render(<HytaleUIBuilder />);
