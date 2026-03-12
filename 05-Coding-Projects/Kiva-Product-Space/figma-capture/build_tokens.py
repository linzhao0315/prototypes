import json, re, os, sys

base = os.path.dirname(os.path.abspath(__file__)) + '/'
out_dir = os.path.abspath(os.path.join(base, '..', 'Design-Tokens')) + '/'
os.makedirs(out_dir, exist_ok=True)

files = ['Global.json', 'Alias - Color.json', 'Alias - Text_Spacing_Layout.json',
         'Alias - Elevation.json', 'Alias - Radius.json', 'Alias - Border.json', 'Mapped.json']

all_data = {}
id_to_var = {}
for fname in files:
    with open(base + fname) as f:
        data = json.load(f)
    all_data[fname] = data
    for v in data.get('variables', []):
        id_to_var[v['id']] = v

def to_rgba(c):
    if isinstance(c, dict) and 'r' in c:
        r,g,b,a = int(c['r']*255), int(c['g']*255), int(c['b']*255), c.get('a',1)
        if abs(a-1) < 0.001:
            return f"#{r:02x}{g:02x}{b:02x}"
        return f"rgba({r},{g},{b},{round(a,2)})"
    return str(c)

def resolve(v, mode_id):
    resolved = v.get('resolvedValuesByMode', {}).get(mode_id)
    if resolved is None:
        raw = v.get('valuesByMode', {}).get(mode_id)
        if isinstance(raw, dict) and raw.get('type') == 'VARIABLE_ALIAS':
            ref = id_to_var.get(raw['id'])
            if ref:
                ref_mode = list(ref.get('valuesByMode', {}).keys())[0]
                return resolve(ref, ref_mode)
        return raw
    rv = resolved.get('resolvedValue')
    if isinstance(rv, dict) and 'r' in rv:
        return to_rgba(rv)
    return rv

def to_css(name):
    # Preserve negative sign: replace leading '-' in each segment with 'neg-'
    parts = name.lower().split('/')
    safe_parts = []
    for p in parts:
        p = re.sub(r'^-(\d)', r'neg\1', p)   # -500 → neg500
        p = re.sub(r'[^a-z0-9]+', '-', p).strip('-')
        safe_parts.append(p)
    return '--' + '-'.join(safe_parts)

def add_unit(val, name):
    if not isinstance(val, (int, float)):
        return str(val)
    rounded = round(val, 2)
    px_props = ('spacing','layout','radius','elevation','border',
                'type/font-size','type/line-height','type/letter-spacing',
                'text/')
    if any(name.startswith(g) for g in px_props):
        return f"{rounded}px"
    return str(rounded)

lines = []
header = [
    "Kiva Design System - CSS Custom Properties",
    "Source: Figma Ecosystem 2026 (WIP)",
    "Auto-generated from figma-capture - DO NOT EDIT MANUALLY",
    "Regenerate: cd figma-capture && python3 build_tokens.py",
]
for h in header:
    lines.append(f"/* {h} */")
lines.append("")

# ── 1. GLOBAL PRIMITIVES + ALIAS COLORS + TEXT/SPACING (desktop lg) + RADIUS/BORDER + MAPPED
lines.append(":root {")

# Global
gdata = all_data['Global.json']
mode_id = list(gdata['modes'].keys())[0]
lines.append("  /* Global Primitives */")
cur_group = None
for v in gdata['variables']:
    name = v['name']
    val = resolve(v, mode_id)
    if val is None: continue
    group = name.split('/')[0]
    if group != cur_group:
        lines.append(f"")
        lines.append(f"  /* {group} */")
        cur_group = group
    lines.append(f"  {to_css(name)}: {add_unit(val, name)};")

# Semantic colors
lines.append("")
lines.append("  /* Semantic Colors */")
cdata = all_data['Alias - Color.json']
cmode = list(cdata['modes'].keys())[0]
cur_group = None
for v in cdata['variables']:
    name = v['name']
    val = resolve(v, cmode)
    if val is None: continue
    group = name.split('/')[0]
    if group != cur_group:
        lines.append(f"")
        lines.append(f"  /* {group} */")
        cur_group = group
    lines.append(f"  {to_css(name)}: {val};")

# Text/Spacing/Layout - desktop (lg) as default
lines.append("")
lines.append("  /* Semantic Text / Spacing / Layout - desktop lg default */")
tdata = all_data['Alias - Text_Spacing_Layout.json']
tmodes_by_name = {v: k for k, v in tdata['modes'].items()}
dlg = tmodes_by_name.get('desktop (lg)')
if dlg:
    cur_group = None
    for v in tdata['variables']:
        name = v['name']
        val = resolve(v, dlg)
        if val is None: continue
        group = name.split('/')[0]
        if group != cur_group:
            lines.append(f"")
            lines.append(f"  /* {group} */")
            cur_group = group
        lines.append(f"  {to_css(name)}: {add_unit(val, name)};")

# Radius
lines.append("")
lines.append("  /* Radius */")
rdata = all_data['Alias - Radius.json']
rmode = list(rdata['modes'].keys())[0]
for v in rdata['variables']:
    val = resolve(v, rmode)
    if val is None: continue
    lines.append(f"  {to_css(v['name'])}: {add_unit(val, 'radius')};")

# Border
lines.append("")
lines.append("  /* Border */")
bdata = all_data['Alias - Border.json']
bmode = list(bdata['modes'].keys())[0]
for v in bdata['variables']:
    val = resolve(v, bmode)
    if val is None: continue
    lines.append(f"  {to_css(v['name'])}: {add_unit(val, 'border')};")

# Mapped (primary)
lines.append("")
lines.append("  /* Mapped Tokens - primary */")
mdata = all_data['Mapped.json']
primary_mid = next((k for k,v in mdata['modes'].items() if v=='primary'), None)
if primary_mid:
    cur_group = None
    for v in mdata['variables']:
        name = v['name']
        val = resolve(v, primary_mid)
        if val is None: continue
        group = name.split('/')[0]
        if group != cur_group:
            lines.append(f"")
            lines.append(f"  /* {group} */")
            cur_group = group
        lines.append(f"  {to_css(name)}: {val};")

# Elevation raw values
lines.append("")
lines.append("  /* Elevation Raw Values */")
edata = all_data['Alias - Elevation.json']
for v in edata['variables']:
    name = v['name']
    for mid, mname in edata['modes'].items():
        val = resolve(v, mid)
        if val is None: continue
        lines.append(f"  {to_css(name + '-' + mname)}: {add_unit(val, 'elevation')};")

lines.append("}")
lines.append("")

# ── 2. RESPONSIVE OVERRIDES
bp_breakpoints = [
    ('desktop (xl)', None),
    ('tablet (md)',  '@media (max-width: 734px)'),
    ('mobile (sm)',  '@media (max-width: 390px)'),
    ('mobile (xs)',  '@media (max-width: 320px)'),
]
for bp_name, mq in bp_breakpoints:
    mid = tmodes_by_name.get(bp_name)
    if not mid or not mq: continue
    lines.append(f"{mq} {{")
    lines.append(f"  :root {{")
    for v in tdata['variables']:
        name = v['name']
        val = resolve(v, mid)
        if val is None: continue
        lines.append(f"    {to_css(name)}: {add_unit(val, name)};")
    lines.append("  }")
    lines.append("}")
    lines.append("")

# ── 3. ELEVATION BOX-SHADOW HELPERS
lines.append("/* Elevation box-shadow helpers */")
lines.append(":root {")
shadow_color = "rgba(0,0,0,0.08)"
e_vars = {v['name']: v for v in edata['variables']}
for level in ['rest', 'hover', 'active']:
    if level not in e_vars: continue
    v = e_vars[level]
    y_val   = resolve(v, next(k for k,n in edata['modes'].items() if n=='y'))
    bl_val  = resolve(v, next(k for k,n in edata['modes'].items() if n=='Blur'))
    sp_val  = resolve(v, next(k for k,n in edata['modes'].items() if n=='Spread'))
    op_val  = resolve(v, next(k for k,n in edata['modes'].items() if n=='Opacity'))
    if all(x is not None for x in [y_val, bl_val, sp_val, op_val]):
        shadow = f"0 {y_val}px {bl_val}px {sp_val}px rgba(0,0,0,{round(op_val,2)})"
        lines.append(f"  --shadow-{level}: {shadow};")
lines.append("}")
lines.append("")

# ── 4. ALSO WRITE tokens.json (W3C-ish flat format)
tokens_json = {}

def set_nested(d, keys, value):
    for k in keys[:-1]:
        d = d.setdefault(k, {})
    d[keys[-1]] = value

# Global
for v in gdata['variables']:
    name = v['name']
    val = resolve(v, mode_id)
    if val is None: continue
    set_nested(tokens_json, ['global'] + name.split('/'), {"value": val})

# Semantic color
for v in cdata['variables']:
    name = v['name']
    val = resolve(v, cmode)
    if val is None: continue
    set_nested(tokens_json, ['color'] + name.split('/'), {"value": val})

# Text/Spacing/Layout per breakpoint
for bp_name, bp_mid in tmodes_by_name.items():
    safe_bp = re.sub(r'[^a-z0-9]+', '_', bp_name.lower())
    for v in tdata['variables']:
        name = v['name']
        val = resolve(v, bp_mid)
        if val is None: continue
        set_nested(tokens_json, [safe_bp] + name.split('/'), {"value": val})

# Mapped
if primary_mid:
    for v in mdata['variables']:
        name = v['name']
        val = resolve(v, primary_mid)
        if val is None: continue
        set_nested(tokens_json, ['mapped', 'primary'] + name.split('/'), {"value": val})

with open(out_dir + 'tokens.json', 'w') as f:
    json.dump(tokens_json, f, indent=2)

with open(out_dir + 'tokens.css', 'w') as f:
    f.write('\n'.join(lines))

print(f"tokens.css  -> {out_dir}tokens.css")
print(f"tokens.json -> {out_dir}tokens.json")
print(f"CSS lines: {len(lines)}")
