import { useState } from "react";

// ─── Kiva Design Tokens ──────────────────────────────────────────────────────
// All values are sourced directly from Design-Tokens/tokens.json
// Token path → value mapping is annotated per property.

const tokens = {
  color: {
    // color.brand.default
    brandDefault:       "#2aa967",
    // color.brand.700  (hover surface)
    brandHover:         "#26985d",
    // color.brand.800  (active/pressed surface)
    brandActive:        "#228752",
    // color.brand.200  (focus ring — high visibility against brand bg)
    brandFocusRing:     "#bfe5d1",
    // Alias: default theme → text.primary-inverse
    textInverse:        "#edf4f1",
    // Alias: default theme → text.tertiary  (disabled text)
    textDisabled:       "#9e9e9e",
    // color.gray.200  (disabled surface)
    surfaceDisabled:    "#e0e0e0",
  },
  radius: {
    // radius.default
    default: 16,
  },
  spacing: {
    // spacing.spacing.2  = 16px  (vertical padding)
    2: 16,
    // spacing.spacing.4  = 32px  (horizontal padding)
    4: 32,
  },
  type: {
    // type.font-family.sans
    fontSans:     "'Kiva Post Grot', sans-serif",
    // type.font-size.button.button
    fontSize:     17,
    // type.line-height.button.button
    lineHeight:   21,
    // type.font-weight.medium
    fontWeight:   500,
    // type.letter-spacing.-100
    letterSpacing: -0.2,
  },
  elevation: {
    // elevation.y.sm=1, elevation.blur.sm=2, elevation.spread.clean=-1, elevation.opacity.sm=10%
    shadowResting: "0 1px 2px -1px rgba(0,0,0,0.10)",
    // elevation.y.md=4, elevation.blur.md=6, elevation.spread.clean=-1, elevation.opacity.md=15%
    shadowHover:   "0 4px 6px -1px rgba(0,0,0,0.15)",
  },
};

// ─── Style Builders ──────────────────────────────────────────────────────────

function buildStyles(state, disabled) {
  const base = {
    display:         "inline-flex",
    alignItems:      "center",
    justifyContent:  "center",
    gap:             8, /* spacing.spacing.1 */
    paddingTop:      tokens.spacing[2],
    paddingBottom:   tokens.spacing[2],
    paddingLeft:     tokens.spacing[4],
    paddingRight:    tokens.spacing[4],
    borderRadius:    tokens.radius.default,
    border:          "none",
    cursor:          disabled ? "not-allowed" : "pointer",
    fontFamily:      tokens.type.fontSans,
    fontSize:        tokens.type.fontSize,
    lineHeight:      `${tokens.type.lineHeight}px`,
    fontWeight:      tokens.type.fontWeight,
    letterSpacing:   tokens.type.letterSpacing,
    textDecoration:  "none",
    whiteSpace:      "nowrap",
    transition:      "background-color 150ms ease, box-shadow 150ms ease, transform 100ms ease",
    outline:         "none",
    userSelect:      "none",
    WebkitFontSmoothing: "antialiased",
  };

  if (disabled) {
    return {
      ...base,
      backgroundColor: tokens.color.surfaceDisabled,
      color:           tokens.color.textDisabled,
      boxShadow:       "none",
      transform:       "none",
    };
  }

  const stateStyles = {
    resting: {
      backgroundColor: tokens.color.brandDefault,
      color:           tokens.color.textInverse,
      boxShadow:       tokens.elevation.shadowResting,
      transform:       "scale(1)",
    },
    hover: {
      backgroundColor: tokens.color.brandHover,
      color:           tokens.color.textInverse,
      boxShadow:       tokens.elevation.shadowHover,
      transform:       "scale(1)",
    },
    active: {
      backgroundColor: tokens.color.brandActive,
      color:           tokens.color.textInverse,
      boxShadow:       tokens.elevation.shadowResting,
      transform:       "scale(0.97)", /* active:scale-95 micro-interaction */
    },
    focus: {
      backgroundColor: tokens.color.brandDefault,
      color:           tokens.color.textInverse,
      boxShadow:       `0 0 0 3px ${tokens.color.brandFocusRing}`, /* focus-visible ring */
      transform:       "scale(1)",
    },
  };

  return { ...base, ...stateStyles[state] };
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * StrategicCTAButton
 *
 * A primary call-to-action button built entirely on Kiva design tokens.
 * Supports resting, hover, active, focus, and disabled states.
 *
 * @param {string}    label       - Visible button text (required for a11y)
 * @param {function}  onClick     - Click handler
 * @param {boolean}   disabled    - Disables interaction and applies muted styling
 * @param {string}    ariaLabel   - Overrides visible label for screen readers
 * @param {ReactNode} icon        - Optional leading icon element
 * @param {string}    type        - HTML button type ("button" | "submit" | "reset")
 */
export function StrategicCTAButton({
  label,
  onClick,
  disabled = false,
  ariaLabel,
  icon = null,
  type = "button",
}) {
  const [interactionState, setInteractionState] = useState("resting");

  function handleMouseEnter() { if (!disabled) setInteractionState("hover"); }
  function handleMouseLeave() { if (!disabled) setInteractionState("resting"); }
  function handleMouseDown()  { if (!disabled) setInteractionState("active"); }
  function handleMouseUp()    { if (!disabled) setInteractionState("hover"); }
  function handleFocus()      { if (!disabled) setInteractionState("focus"); }
  function handleBlur()       { if (!disabled) setInteractionState("resting"); }

  const style = buildStyles(interactionState, disabled);

  return (
    <button
      type={type}
      style={style}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel || label}
      aria-disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {icon && (
        <span aria-hidden="true" style={{ display: "flex", alignItems: "center" }}>
          {icon}
        </span>
      )}
      {label}
    </button>
  );
}

export default StrategicCTAButton;
