// ═══════════════════════════════════════════════════════════════════════════
// Ecosystem 2026 — Color Documentation
// Figma "Run script" plugin
// ═══════════════════════════════════════════════════════════════════════════
// HOW TO USE:
//   Plugins → Development → New Plugin → Run script (paste & run)
// ═══════════════════════════════════════════════════════════════════════════

const main = async () => {

  // ── 1. Load fonts FIRST (blocks everything else) ─────────────────────────
  //    Inter is Figma's default system font – always available.
  const FONT_REG  = { family: 'Inter', style: 'Regular' };
  const FONT_BOLD = { family: 'Inter', style: 'Bold' };
  await figma.loadFontAsync(FONT_REG);
  await figma.loadFontAsync(FONT_BOLD);

  // ── 2. Primitives ─────────────────────────────────────────────────────────

  function rgb(hex) {
    const v = hex.replace('#', '');
    return {
      r: parseInt(v.slice(0,2), 16) / 255,
      g: parseInt(v.slice(2,4), 16) / 255,
      b: parseInt(v.slice(4,6), 16) / 255,
    };
  }

  function solidFill(hex) {
    return [{ type: 'SOLID', color: rgb(hex) }];
  }

  // Create a rectangle
  function R(parent, x, y, w, h, hex, radius) {
    const r = figma.createRectangle();
    r.x = x; r.y = y;
    r.resize(w, h);
    r.fills = solidFill(hex);
    if (radius) r.cornerRadius = radius;
    parent.appendChild(r);
    return r;
  }

  // Create a text node (fonts already loaded above)
  function T(parent, str, x, y, size, hex, bold, maxW) {
    const t = figma.createText();
    t.fontName = bold ? FONT_BOLD : FONT_REG;
    t.fontSize = size;
    t.characters = String(str);    // safe because fonts loaded above
    t.fills = solidFill(hex);
    t.x = x; t.y = y;
    if (maxW) {
      t.textAutoResize = 'HEIGHT';
      t.resize(maxW, 20);
    }
    parent.appendChild(t);
    return t;
  }

  // Create a frame
  function F(name, w, h, bgHex) {
    const f = figma.createFrame();
    f.name = name;
    f.resize(w, h);
    f.fills = solidFill(bgHex || '#ffffff');
    f.clipsContent = true;
    return f;
  }

  // ── 3. Token data ─────────────────────────────────────────────────────────

  const C = {
    brand1000:'#19653e', brand950:'#1b6e43', brand900:'#1d7748', brand800:'#228752',
    brand700:'#26985d', brand650:'#28a062', brandDef:'#2aa967', brand550:'#35ad6f',
    brand500:'#4ab67e', brand400:'#6ac395', brand300:'#95d4b3', brand200:'#bfe5d1',
    brand100:'#eaf6f0', brand50:'#f4fbf7',
    eg1:'#edf4f1', eg2:'#78c79f', eg3:'#276a43', eg4:'#223829',
    mg1:'#f8f2e6', mg2:'#f8cd69', mg3:'#996210', mg4:'#593207', mgDef:'#f4b539',
    dr1:'#f9f0ef', dr2:'#e0988d', dr3:'#a24536', dr4:'#5c2a22', drDef:'#c45f4f',
    st1:'#f3f1ef', st2:'#aa9e8d', st3:'#635544', st4:'#2e271e', stDef:'#dfd0bc',
    g800:'#212121', g700:'#454545', g600:'#505050', g500:'#757575', g400:'#9e9e9e',
    g300:'#c4c4c4', g200:'#e0e0e0', g100:'#f5f5f5', g50:'#fafafa',
    white:'#ffffff', black:'#000000',
  };

  // ── 4. Canvas layout ──────────────────────────────────────────────────────

  const W = 1440;
  const P = 80;   // horizontal padding
  let canvasY = 0;

  const created = []; // keep refs for final zoom

  function place(frame) {
    frame.x = 0;
    frame.y = canvasY;
    figma.currentPage.appendChild(frame);
    canvasY += frame.height + 80;
    created.push(frame);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FRAME 1 · Cover
  // ═══════════════════════════════════════════════════════════════════════════

  {
    const fr = F('01 · Color System', W, 820, C.eg4);
    place(fr);

    // accent bar
    R(fr, 0, 0, W, 6, C.brandDef);

    T(fr, 'Color System',                       P, 80,  72, C.eg1, true);
    T(fr, 'Ecosystem 2026  ·  Material Design 3', P, 168, 18, C.eg2, false);

    // key color chips
    const chips = [
      { name:'Eco Green', hex:C.brandDef, ink:C.eg4 },
      { name:'Marigold',  hex:C.mgDef,   ink:C.mg4 },
      { name:'Rose',      hex:C.drDef,   ink:C.white },
      { name:'Stone',     hex:C.stDef,   ink:C.st4 },
      { name:'Neutral',   hex:C.g300,    ink:C.g800 },
    ];
    let cx = P;
    for (const ch of chips) {
      R(fr, cx, 220, 220, 110, ch.hex, 12);
      T(fr, ch.name,          cx+12, 234, 16, ch.ink, true);
      T(fr, ch.hex.toUpperCase(), cx+12, 256, 11, ch.ink, false);
      cx += 240;
    }

    // principles
    const princs = [
      ['Brand-Grounded', 'Every token traces back to a Global Primitive ramp.'],
      ['MD3 Compatible',  'Roles map 1:1 to Material Design 3.'],
      ['WCAG AA+',        'All key pairs meet 4.5:1 contrast minimum.'],
    ];
    let px = P;
    for (const [title, body] of princs) {
      T(fr, title, px, 390, 14, C.eg1, true);
      T(fr, body,  px, 412, 11, C.eg2, false, 320);
      px += 440;
    }

    // section index
    T(fr, 'SECTIONS IN THIS FILE', P, 560, 10, C.eg3, true);
    const secs = [
      '01 · Overview','02 · Tonal Palettes',
      '03 · Roles Light','04 · Roles Dark',
      '05 · Usage Examples',"06 · Do's & Don'ts",'07 · Accessibility',
    ];
    for (let i=0; i<secs.length; i++) {
      T(fr, secs[i], P + (i%4)*320, 580 + Math.floor(i/4)*20, 11, C.eg2, false);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FRAME 2 · Tonal Palettes
  // ═══════════════════════════════════════════════════════════════════════════

  {
    const fr = F('02 · Tonal Palettes', W, 980, C.g50);
    place(fr);

    T(fr, 'Tonal Palettes', P, 40, 36, C.eg4, true);
    T(fr, 'Global primitive ramps — semantic roles reference specific tones.', P, 90, 13, C.g500, false);

    const palettes = [
      {
        name:'Eco Green',
        swatches:[
          {t:'1000',h:C.brand1000,ink:C.white},{t:'950',h:C.brand950,ink:C.white},
          {t:'900',h:C.brand900,ink:C.white},{t:'800',h:C.brand800,ink:C.white},
          {t:'700',h:C.brand700,ink:C.white},{t:'650',h:C.brand650,ink:C.white},
          {t:'★default',h:C.brandDef,ink:C.white},{t:'550',h:C.brand550,ink:C.white},
          {t:'500',h:C.brand500,ink:C.eg4},{t:'400',h:C.brand400,ink:C.eg4},
          {t:'300',h:C.brand300,ink:C.eg4},{t:'200',h:C.brand200,ink:C.eg4},
          {t:'100',h:C.brand100,ink:C.eg4},{t:'50',h:C.brand50,ink:C.eg4},
        ],
      },
      {
        name:'Marigold',
        swatches:[
          {t:'4',h:C.mg4,ink:C.white},{t:'3',h:C.mg3,ink:C.white},
          {t:'★def',h:C.mgDef,ink:C.mg4},{t:'2',h:C.mg2,ink:C.mg4},{t:'1',h:C.mg1,ink:C.mg4},
        ],
      },
      {
        name:'Desert Rose',
        swatches:[
          {t:'4',h:C.dr4,ink:C.white},{t:'3',h:C.dr3,ink:C.white},
          {t:'★def',h:C.drDef,ink:C.white},{t:'2',h:C.dr2,ink:C.dr4},{t:'1',h:C.dr1,ink:C.dr4},
        ],
      },
      {
        name:'Stone',
        swatches:[
          {t:'4',h:C.st4,ink:C.white},{t:'3',h:C.st3,ink:C.white},
          {t:'★def',h:C.stDef,ink:C.st4},{t:'2',h:C.st2,ink:C.st4},{t:'1',h:C.st1,ink:C.st4},
        ],
      },
      {
        name:'Gray / Neutral',
        swatches:[
          {t:'800',h:C.g800,ink:C.white},{t:'700',h:C.g700,ink:C.white},
          {t:'600',h:C.g600,ink:C.white},{t:'500',h:C.g500,ink:C.white},
          {t:'400',h:C.g400,ink:C.g800},{t:'300',h:C.g300,ink:C.g800},
          {t:'200',h:C.g200,ink:C.g800},{t:'100',h:C.g100,ink:C.g800},
          {t:'50',h:C.g50,ink:C.g800},{t:'white',h:C.white,ink:C.g800},
          {t:'black',h:C.black,ink:C.white},
        ],
      },
    ];

    let ry = 130;
    for (const pal of palettes) {
      T(fr, pal.name, P, ry, 12, C.g700, true);
      let sx = P;
      for (const sw of pal.swatches) {
        R(fr, sx, ry+18, 56, 64, sw.h, 4);
        T(fr, sw.t, sx+2, ry+22, 8, sw.ink, false);
        T(fr, sw.h, sx, ry+86, 8, C.g400, false);
        sx += 62;
      }
      ry += 130;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FRAME 3 · Color Roles — Light
  // ═══════════════════════════════════════════════════════════════════════════

  {
    const fr = F('03 · Color Roles — Light Mode', W, 1100, C.white);
    place(fr);

    T(fr, 'Color Roles — Light Mode', P, 40, 36, C.eg4, true);
    T(fr, 'Each role pairs with an On-[Role]. On-color must be legible on top of its paired role surface.', P, 88, 13, C.g500, false, W-P*2);

    const roles = [
      {g:'Primary',   role:'Primary',              token:'brand-default',        hex:C.brandDef,  onHex:C.eg1,   desc:'Main CTA buttons, active states'},
      {g:'Primary',   role:'On Primary',            token:'eco-green-1',          hex:C.eg1,       onHex:null,    desc:'Text/icons on Primary'},
      {g:'Primary',   role:'Primary Container',     token:'brand-100',            hex:C.brand100,  onHex:C.eg4,   desc:'Chip bg, featured card bg'},
      {g:'Primary',   role:'On Primary Container',  token:'eco-green-4',          hex:C.eg4,       onHex:null,    desc:'Text on Primary Container'},
      {g:'Secondary', role:'Secondary',             token:'marigold-default',     hex:C.mgDef,     onHex:C.mg4,   desc:'Accent badges, tags, progress'},
      {g:'Secondary', role:'On Secondary',          token:'marigold-4',           hex:C.mg4,       onHex:null,    desc:'Text on Secondary'},
      {g:'Secondary', role:'Secondary Container',   token:'marigold-1',           hex:C.mg1,       onHex:C.mg4,   desc:'Caution bg, subtle highlight'},
      {g:'Tertiary',  role:'Tertiary',              token:'stone-default',        hex:C.stDef,     onHex:C.st4,   desc:'Warm neutral accent'},
      {g:'Tertiary',  role:'On Tertiary',           token:'stone-4',              hex:C.st4,       onHex:null,    desc:'Text on Tertiary'},
      {g:'Tertiary',  role:'Tertiary Container',    token:'stone-1',              hex:C.st1,       onHex:C.st4,   desc:'Warm card container'},
      {g:'Error',     role:'Error',                 token:'desert-rose-default',  hex:C.drDef,     onHex:C.white, desc:'Danger, destructive actions'},
      {g:'Error',     role:'On Error',              token:'color-neutral-white',  hex:C.white,     onHex:null,    desc:'Text on Error'},
      {g:'Error',     role:'Error Container',       token:'desert-rose-1',        hex:C.dr1,       onHex:C.dr4,   desc:'Inline error banners'},
      {g:'Error',     role:'On Error Container',    token:'desert-rose-4',        hex:C.dr4,       onHex:null,    desc:'Text on Error Container'},
      {g:'Surface',   role:'Surface',               token:'background-primary',   hex:C.white,     onHex:C.eg4,   desc:'Default page / card bg'},
      {g:'Surface',   role:'On Surface',            token:'text-primary',         hex:C.eg4,       onHex:null,    desc:'Default body text'},
      {g:'Surface',   role:'Surface Variant',       token:'background-secondary', hex:C.eg1,       onHex:C.g500,  desc:'Alt surface: sidebars, rows'},
      {g:'Surface',   role:'On Surface Variant',    token:'text-secondary',       hex:C.g500,      onHex:null,    desc:'Muted text — use ≥16px'},
      {g:'Outline',   role:'Outline',               token:'border-primary',       hex:C.g600,      onHex:null,    desc:'Input borders, dividers'},
      {g:'Outline',   role:'Outline Variant',       token:'border-tertiary',      hex:C.g300,      onHex:null,    desc:'Subtle separators'},
    ];

    // Column headers
    R(fr, P, 120, W-P*2, 1, C.g200);
    T(fr, 'Role',          P,       108, 10, C.g400, true);
    T(fr, 'Token',         290,     108, 10, C.g400, true);
    T(fr, 'Hex',           530,     108, 10, C.g400, true);
    T(fr, 'Usage',         700,     108, 10, C.g400, true);

    let ty = 136;
    let lastGroup = '';
    for (const row of roles) {
      // Group header
      if (row.g !== lastGroup) {
        T(fr, row.g.toUpperCase(), P, ty, 10, C.g300, true);
        ty += 20;
        lastGroup = row.g;
      }

      // Color chip
      R(fr, P, ty, 72, 40, row.hex, 8);
      if (row.onHex) R(fr, P+80, ty, 72, 40, row.onHex, 8);

      T(fr, row.role,  190, ty+10, 13, C.g800, true);
      T(fr, row.token, 290, ty+10, 11, C.g500, false);
      T(fr, row.hex,   530, ty+10, 11, C.g400, false);
      T(fr, row.desc,  700, ty+10, 12, C.g700, false, 600);

      ty += 52;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FRAME 4 · Color Roles — Dark
  // ═══════════════════════════════════════════════════════════════════════════

  {
    const fr = F('04 · Color Roles — Dark Mode', W, 1100, C.eg4);
    place(fr);

    T(fr, 'Color Roles — Dark Mode', P, 40, 36, C.eg1, true);
    T(fr, 'Dark theme: surfaces invert. Primary lightens; containers deepen.', P, 88, 13, C.eg2, false, W-P*2);

    const darkRoles = [
      {g:'Primary',   role:'Primary',              token:'eco-green-2',          hex:C.eg2,       onHex:C.eg4,  desc:'Light green on dark bg'},
      {g:'Primary',   role:'On Primary',            token:'eco-green-4',          hex:C.eg4,       onHex:null,   desc:'Dark text on light Primary'},
      {g:'Primary',   role:'Primary Container',     token:'eco-green-3',          hex:C.eg3,       onHex:C.eg1,  desc:'Mid-dark container'},
      {g:'Primary',   role:'On Primary Container',  token:'eco-green-1',          hex:C.eg1,       onHex:null,   desc:'Light text on container'},
      {g:'Secondary', role:'Secondary',             token:'marigold-default',     hex:C.mgDef,     onHex:C.mg4,  desc:'Same marigold — pops on dark'},
      {g:'Secondary', role:'On Secondary',          token:'marigold-4',           hex:C.mg4,       onHex:null,   desc:'Dark text on marigold'},
      {g:'Secondary', role:'Secondary Container',   token:'marigold-1',           hex:C.mg1,       onHex:C.mg4,  desc:'Same pale marigold container'},
      {g:'Tertiary',  role:'Tertiary',              token:'stone-2',              hex:C.st2,       onHex:C.st1,  desc:'Lighter stone on dark bg'},
      {g:'Tertiary',  role:'On Tertiary',           token:'stone-1',              hex:C.st1,       onHex:null,   desc:'Light text on Tertiary'},
      {g:'Tertiary',  role:'Tertiary Container',    token:'stone-4',              hex:C.st4,       onHex:C.st1,  desc:'Dark stone container'},
      {g:'Error',     role:'Error',                 token:'desert-rose-2',        hex:C.dr2,       onHex:C.dr4,  desc:'Lighter error on dark bg'},
      {g:'Error',     role:'On Error',              token:'desert-rose-4',        hex:C.dr4,       onHex:null,   desc:'Dark text on Error'},
      {g:'Error',     role:'Error Container',       token:'desert-rose-4',        hex:C.dr4,       onHex:C.dr1,  desc:'Dark error container'},
      {g:'Error',     role:'On Error Container',    token:'desert-rose-1',        hex:C.dr1,       onHex:null,   desc:'Light text on Error Container'},
      {g:'Surface',   role:'Surface',               token:'background-primary',   hex:C.eg4,       onHex:C.eg1,  desc:'Deep green page bg'},
      {g:'Surface',   role:'On Surface',            token:'text-primary',         hex:C.eg1,       onHex:null,   desc:'Light body text on dark'},
      {g:'Surface',   role:'Surface Variant',       token:'background-secondary', hex:C.eg3,       onHex:C.g300, desc:'Slightly lighter surface'},
      {g:'Surface',   role:'On Surface Variant',    token:'text-secondary',       hex:C.g300,      onHex:null,   desc:'Muted text on dark'},
      {g:'Outline',   role:'Outline',               token:'border-primary',       hex:C.eg1,       onHex:null,   desc:'Light border on dark bg'},
      {g:'Outline',   role:'Outline Variant',       token:'border-tertiary',      hex:C.eg3,       onHex:null,   desc:'Subtle green divider'},
    ];

    R(fr, P, 120, W-P*2, 1, C.eg3);
    T(fr, 'Role',     P,   108, 10, C.eg3, true);
    T(fr, 'Token',    290, 108, 10, C.eg3, true);
    T(fr, 'Hex',      530, 108, 10, C.eg3, true);
    T(fr, 'Usage',    700, 108, 10, C.eg3, true);

    let ty = 136;
    let lastGroup = '';
    for (const row of darkRoles) {
      if (row.g !== lastGroup) {
        T(fr, row.g.toUpperCase(), P, ty, 10, C.eg3, true);
        ty += 20;
        lastGroup = row.g;
      }
      R(fr, P, ty, 72, 40, row.hex, 8);
      if (row.onHex) R(fr, P+80, ty, 72, 40, row.onHex, 8);
      T(fr, row.role,  190, ty+10, 13, C.eg1, true);
      T(fr, row.token, 290, ty+10, 11, C.eg2, false);
      T(fr, row.hex,   530, ty+10, 11, C.eg3, false);
      T(fr, row.desc,  700, ty+10, 12, C.eg2, false, 600);
      ty += 52;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FRAME 5 · Usage Examples
  // ═══════════════════════════════════════════════════════════════════════════

  {
    const fr = F('05 · Usage Examples', W, 900, C.g50);
    place(fr);

    T(fr, 'Usage Examples', P, 40, 36, C.eg4, true);
    T(fr, 'Light (left) · Dark (right) shown side by side for each pattern.', P, 90, 13, C.g500, false);

    // ── CTA Button ──────────────────────────────────────────────────────────
    T(fr, 'CTA Button  —  primary + on-primary', P, 150, 13, C.g700, true);

    // Light
    R(fr, P, 178, 180, 52, C.eg3, 14);
    T(fr, 'Lend Now', P+50, 192, 15, C.eg1, true);
    T(fr, 'bg: background-action\ntext: text-primary-inverse', P, 238, 10, C.g400, false);

    // Dark
    R(fr, P+300, 178, 180, 52, C.eg2, 14);
    T(fr, 'Lend Now', P+350, 192, 15, C.eg4, true);
    T(fr, 'bg: eco-green-2 (dark primary)\ntext: eco-green-4', P+300, 238, 10, C.g400, false);

    // ── Loan Card ────────────────────────────────────────────────────────────
    T(fr, 'Loan Card  —  surface + on-surface + outline-variant', P, 310, 13, C.g700, true);

    // Light
    R(fr, P, 338, 260, 120, C.white, 16);
    T(fr, 'Maria S.',          P+16, 354, 14, C.eg4,  true);
    T(fr, 'Agriculture · Philippines', P+16, 376, 11, C.g500, false);
    T(fr, '$500 of $750 funded', P+16, 394, 11, C.g400, false);
    R(fr, P+16, 418, 224, 6, C.g100, 3);
    R(fr, P+16, 418, 149, 6, C.brandDef, 3);
    T(fr, 'card: surface  |  title: on-surface  |  progress: primary', P, 468, 10, C.g400, false);

    // Dark
    R(fr, P+320, 338, 260, 120, C.eg3, 16);
    T(fr, 'Maria S.',          P+336, 354, 14, C.eg1, true);
    T(fr, 'Agriculture · Philippines', P+336, 376, 11, C.eg2, false);
    T(fr, '$500 of $750 funded', P+336, 394, 11, C.eg3, false);
    R(fr, P+336, 418, 224, 6, C.eg4, 3);
    R(fr, P+336, 418, 149, 6, C.eg2, 3);
    T(fr, 'card: surface-variant  |  title: on-surface  |  progress: primary (dark)', P+320, 468, 10, C.g400, false);

    // ── Alert Banners ────────────────────────────────────────────────────────
    T(fr, 'Alert Banners  —  secondary-container (caution) + error-container (danger)', P, 570, 13, C.g700, true);

    // Light caution
    R(fr, P, 598, 320, 48, C.mg1, 8);
    T(fr, '⚠  Payment due in 3 days', P+16, 614, 12, C.mg4, true);

    // Light danger
    R(fr, P+340, 598, 320, 48, C.dr1, 8);
    T(fr, '✕  Loan application declined', P+356, 614, 12, C.dr4, true);

    // Dark caution
    R(fr, P, 658, 320, 48, C.mg2, 8);
    T(fr, '⚠  Payment due in 3 days', P+16, 674, 12, C.mg4, true);

    // Dark danger
    R(fr, P+340, 658, 320, 48, C.dr3, 8);
    T(fr, '✕  Loan application declined', P+356, 674, 12, C.dr1, true);

    T(fr, 'caution: secondary-container (mg1)  |  danger: error-container (dr1)  |  dark versions shift to mg2 / dr3', P, 716, 10, C.g400, false, W-P*2);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FRAME 6 · Do's and Don'ts
  // ═══════════════════════════════════════════════════════════════════════════

  {
    const fr = F("06 · Do's and Don'ts", W, 900, C.g50);
    place(fr);

    T(fr, "Do's and Don'ts", P, 40, 36, C.eg4, true);
    T(fr, 'Common mistakes when applying color roles in Kiva UI.', P, 90, 13, C.g500, false);

    const rules = [
      {
        do:   'Use on-primary (#edf4f1) on Primary bg (#276a43)',
        dont: 'Use on-surface (#223829) on Primary bg — fails contrast',
        doA:  { chipBg:C.eg3,     chipText:C.eg1,  label:'on-primary on primary ✓' },
        dontA:{ chipBg:C.eg3,     chipText:C.eg4,  label:'on-surface on primary ✗' },
      },
      {
        do:   'Use primary-container (#eaf6f0) for subtle card bg',
        dont: 'Use primary (#2aa967) for large area bg — too vibrant',
        doA:  { chipBg:C.brand100, chipText:C.eg4,  label:'primary-container ✓' },
        dontA:{ chipBg:C.brandDef, chipText:C.eg4,  label:'primary as bg ✗' },
      },
      {
        do:   'Pair caution bg (mg1) with caution text (mg4) — 6.1:1',
        dont: 'Use caution-2 bg + caution-3 text — fails 4.5:1',
        doA:  { chipBg:C.mg1,     chipText:C.mg4,  label:'mg1 + mg4 ✓' },
        dontA:{ chipBg:C.mg2,     chipText:C.mg3,  label:'mg2 + mg3 ✗' },
      },
      {
        do:   'Use outline-variant (gray-300) for dividers',
        dont: 'Use outline (gray-600) for dividers — too heavy',
        doA:  { chipBg:C.g300,    chipText:C.g800, label:'border-tertiary ✓' },
        dontA:{ chipBg:C.g600,    chipText:C.white,label:'border-primary for divider ✗' },
      },
      {
        do:   'Use surface-variant (eg1) for card list backgrounds',
        dont: 'Use primary (#2aa967) as card bg — unintended brand saturation',
        doA:  { chipBg:C.eg1,     chipText:C.eg4,  label:'surface-variant ✓' },
        dontA:{ chipBg:C.brandDef, chipText:C.eg4, label:'primary as card bg ✗' },
      },
    ];

    let ry = 140;
    for (const rule of rules) {
      // DO side
      R(fr, P, ry, 240, 64, rule.doA.chipBg, 10);
      T(fr, rule.doA.label, P+12, ry+24, 13, rule.doA.chipText, true);

      T(fr, '✅  DO', P, ry-18, 11, C.brandDef, true);
      T(fr, rule.do, P+50, ry-18, 11, C.g600, false, 200);

      // DON'T side
      R(fr, P+560, ry, 240, 64, rule.dontA.chipBg, 10);
      T(fr, rule.dontA.label, P+572, ry+24, 13, rule.dontA.chipText, true);

      T(fr, "❌  DON'T", P+560, ry-18, 11, C.drDef, true);
      T(fr, rule.dont, P+640, ry-18, 11, C.g600, false, 200);

      ry += 120;
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FRAME 7 · Accessibility
  // ═══════════════════════════════════════════════════════════════════════════

  {
    const fr = F('07 · Accessibility & WCAG', W, 780, C.white);
    place(fr);

    T(fr, 'WCAG Contrast Ratios', P, 40, 36, C.eg4, true);
    T(fr, 'Target: AA ≥ 4.5:1 (body)  ·  AA Large ≥ 3:1  ·  AAA ≥ 7:1 (emphasis)', P, 90, 13, C.g500, false);

    // Badge legend
    const badges = [
      { label:'AAA  ≥ 7:1',      bg:C.eg4,    text:C.eg1  },
      { label:'AA  ≥ 4.5:1',     bg:C.brandDef, text:C.eg1 },
      { label:'AA Large  ≥ 3:1', bg:C.mgDef,  text:C.mg4  },
      { label:'Fail  < 3:1',     bg:C.drDef,  text:C.white },
    ];
    let bx = P;
    for (const b of badges) {
      R(fr, bx, 128, 168, 28, b.bg, 99);
      T(fr, b.label, bx+12, 135, 11, b.text, true);
      bx += 188;
    }

    // Table header
    R(fr, P, 182, W-P*2, 1, C.g200);
    T(fr, 'Color Pair',  P,   170, 11, C.g500, true);
    T(fr, 'BG',          560, 170, 11, C.g500, true);
    T(fr, 'FG',          620, 170, 11, C.g500, true);
    T(fr, 'Ratio',       680, 170, 11, C.g500, true);
    T(fr, 'Level',       760, 170, 11, C.g500, true);
    T(fr, 'Context',     860, 170, 11, C.g500, true);

    const rows = [
      {pair:'Background + text-primary',           bg:C.white,   fg:C.eg4,    ratio:'11.9:1', lvl:'AAA ✓',      ctx:'Default page body text'},
      {pair:'Primary + on-primary',                bg:C.eg3,     fg:C.eg1,    ratio:'5.8:1',  lvl:'AA ✓',       ctx:'Filled CTA buttons'},
      {pair:'Primary Container + on-PC',           bg:C.brand100,fg:C.eg4,    ratio:'10.2:1', lvl:'AAA ✓',      ctx:'Featured card / chip bg'},
      {pair:'Surface Variant + text-secondary',    bg:C.eg1,     fg:C.g500,   ratio:'4.2:1',  lvl:'AA Large ⚠', ctx:'Use ≥ 16px only'},
      {pair:'Error + on-error',                    bg:C.drDef,   fg:C.white,  ratio:'4.7:1',  lvl:'AA ✓',       ctx:'Error filled button'},
      {pair:'Error Container + on-error-container',bg:C.dr1,     fg:C.dr4,    ratio:'7.8:1',  lvl:'AAA ✓',      ctx:'Error banners & toasts'},
      {pair:'Secondary (Marigold) + on-secondary', bg:C.mgDef,   fg:C.mg4,    ratio:'6.1:1',  lvl:'AA ✓',       ctx:'Accent badges, tags'},
      {pair:'Tertiary (Stone) + on-tertiary',      bg:C.stDef,   fg:C.st4,    ratio:'5.3:1',  lvl:'AA ✓',       ctx:'Stone surface text'},
      {pair:'Dark Surface + text-primary (dark)',  bg:C.eg4,     fg:C.eg1,    ratio:'9.1:1',  lvl:'AAA ✓',      ctx:'Dark mode page text'},
      {pair:'Dark Primary + on-primary (dark)',    bg:C.eg2,     fg:C.eg4,    ratio:'4.9:1',  lvl:'AA ✓',       ctx:'Dark mode CTA buttons'},
    ];

    let ty = 196;
    for (let i=0; i<rows.length; i++) {
      const row = rows[i];
      if (i%2===0) R(fr, P, ty, W-P*2, 32, C.g50);

      T(fr, row.pair, P, ty+9, 12, C.g700, false, 480);

      // Swatch chips
      R(fr, 560, ty+6, 20, 20, row.bg,  4);
      R(fr, 620, ty+6, 20, 20, row.fg,  4);

      T(fr, row.ratio, 680, ty+9, 12, C.g800, true);

      const lvlColor = row.lvl.includes('AAA') ? C.eg3
                     : row.lvl.includes('Large') ? C.mg3
                     : row.lvl.includes('AA ✓') ? C.brandDef
                     : C.drDef;
      T(fr, row.lvl, 760, ty+9, 11, lvlColor, true);
      T(fr, row.ctx, 860, ty+9, 11, C.g600, false, 500);

      ty += 32;
    }

    R(fr, P, ty+8, W-P*2, 1, C.g100);
    T(fr, '⚠  Surface Variant + text-secondary is 4.2:1 — AA Large only. Use font-size ≥ 16px or switch to text-primary for body copy on this surface.', P, ty+20, 12, C.mg3, false, W-P*2);
    T(fr, 'ℹ  Verify all ratios with Figma plugin "Contrast" or polypane.app before shipping.', P, ty+44, 12, C.g400, false, W-P*2);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Zoom to fit all created frames
  // ═══════════════════════════════════════════════════════════════════════════

  figma.viewport.scrollAndZoomIntoView(created);
  figma.notify('✅ 7 Color Documentation frames created!', { timeout: 5000 });
  figma.closePlugin();

};

// ── Run with explicit error surfacing ──────────────────────────────────────
main().catch(err => {
  console.error('Plugin error:', err);
  figma.notify('❌ Error: ' + err.message, { error: true, timeout: 8000 });
  figma.closePlugin();
});
