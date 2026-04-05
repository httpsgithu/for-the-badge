<template>
    <div class="text-styler">
        <div class="panel-selector">
            <label>Edit Panel</label>
            <div class="panel-buttons">
                <button
                    :class="{ active: selectedPanel === 'primary' }"
                    class="panel-btn primary-btn"
                    @click="selectedPanel = 'primary'"
                >
                    Primary
                </button>
                <button
                    :class="{ active: selectedPanel === 'secondary' }"
                    class="panel-btn secondary-btn"
                    @click="selectedPanel = 'secondary'"
                >
                    Secondary
                </button>
                <button
                    :class="{ active: selectedPanel === 'tertiary' }"
                    class="panel-btn tertiary-btn"
                    @click="selectedPanel = 'tertiary'"
                >
                    Tertiary
                </button>
            </div>
        </div>

        <div class="style-group">
            <label>Font Family</label>
            <select v-model="fontFamily" class="font-select">
                <option value="Roboto">Roboto</option>
                <option value="Montserrat">Montserrat</option>
                <option value="'Courier New'">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="'Times New Roman'">Times New Roman</option>
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
            </select>
        </div>
        
        <div class="style-group">
            <label>Size</label>
            <input
                v-model.number="fontSize"
                type="range"
                min="8"
                max="18"
                step="1"
                class="slider"
            >
            <span class="value">{{ fontSize }}px</span>
        </div>
        
        <div class="style-group">
            <label>Weight</label>
            <select v-model.number="fontWeight" class="font-select">
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semibold (600)</option>
                <option value="700">Bold (700)</option>
                <option value="900">Extra Bold (900)</option>
            </select>
        </div>
        
        <div class="style-group">
            <label>Letter Spacing</label>
            <input
                v-model.number="letterSpacing"
                type="range"
                min="0"
                max="8"
                step="0.5"
                class="slider"
            >
            <span class="value">{{ letterSpacing }}px</span>
        </div>
        
        <div class="style-group">
            <label>Text Styling</label>
            <div class="toolbar">
                <button
                    type="button"
                    :class="['toolbar-btn', { active: textTransform === 'uppercase' }]"
                    title="Uppercase"
                    @click="textTransform = textTransform === 'uppercase' ? 'none' : 'uppercase'"
                >
                    <span class="toolbar-icon">AA</span>
                </button>
                <button
                    type="button"
                    :class="['toolbar-btn', { active: textTransform === 'lowercase' }]"
                    title="Lowercase"
                    @click="textTransform = textTransform === 'lowercase' ? 'none' : 'lowercase'"
                >
                    <span class="toolbar-icon">aa</span>
                </button>
                <button
                    type="button"
                    :class="['toolbar-btn', { active: textTransform === 'capitalize' }]"
                    title="Capitalize"
                    @click="textTransform = textTransform === 'capitalize' ? 'none' : 'capitalize'"
                >
                    <span class="toolbar-icon">Aa</span>
                </button>
                <div class="toolbar-divider" />
                <button
                    type="button"
                    :class="['toolbar-btn', { active: fontStyleValue === 'italic' }]"
                    title="Italic"
                    @click="fontStyleValue = fontStyleValue === 'italic' ? 'normal' : 'italic'"
                >
                    <span class="toolbar-icon italic">I</span>
                </button>
                <button
                    type="button"
                    :class="['toolbar-btn', { active: textDecoration === 'underline' }]"
                    title="Underline"
                    @click="textDecoration = textDecoration === 'underline' ? 'none' : 'underline'"
                >
                    <span class="toolbar-icon underline">U</span>
                </button>
                <button
                    type="button"
                    :class="['toolbar-btn', { active: textDecoration === 'line-through' }]"
                    title="Strikethrough"
                    @click="textDecoration = textDecoration === 'line-through' ? 'none' : 'line-through'"
                >
                    <span class="toolbar-icon strikethrough">S</span>
                </button>
                <div class="toolbar-divider" />
                <button
                    type="button"
                    :class="['toolbar-btn', { active: fontVariantValue === 'small-caps' }]"
                    title="Small Caps"
                    @click="fontVariantValue = fontVariantValue === 'small-caps' ? 'normal' : 'small-caps'"
                >
                    <span class="toolbar-icon small-caps">Sc</span>
                </button>
            </div>
        </div>
        
        <div class="style-group">
            <label>Text Shadow</label>
            <div class="shadow-controls">
                <div class="shadow-row">
                    <label class="small-label">Color</label>
                    <input
                        v-model="textShadowColor"
                        type="color"
                        class="color-input"
                    >
                </div>
                <div class="shadow-row">
                    <label class="small-label">Offset X: <span class="value">{{ textShadowOffsetX }}px</span></label>
                    <input
                        v-model.number="textShadowOffsetX"
                        type="range"
                        min="-5"
                        max="5"
                        step="0.5"
                        class="slider"
                    >
                </div>
                <div class="shadow-row">
                    <label class="small-label">Offset Y: <span class="value">{{ textShadowOffsetY }}px</span></label>
                    <input
                        v-model.number="textShadowOffsetY"
                        type="range"
                        min="-5"
                        max="5"
                        step="0.5"
                        class="slider"
                    >
                </div>
                <div class="shadow-row">
                    <label class="small-label">Blur: <span class="value">{{ textShadowBlur }}px</span></label>
                    <input
                        v-model.number="textShadowBlur"
                        type="range"
                        min="0"
                        max="10"
                        step="0.5"
                        class="slider"
                    >
                </div>
            </div>
        </div>
        
        <div class="style-group">
            <label>Rotation</label>
            <input
                v-model.number="textRotation"
                type="range"
                min="-15"
                max="15"
                step="1"
                class="slider"
            >
            <span class="value">{{ textRotation }}°</span>
        </div>
        
        <div class="style-group">
            <label>Opacity</label>
            <input
                v-model.number="textOpacity"
                type="range"
                min="0"
                max="1"
                step="0.05"
                class="slider"
            >
            <span class="value">{{ Math.round(textOpacity * 100) }}%</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = defineProps({
    panel: String,
    family: { type: String, default: 'Roboto' },
    size: { type: Number, default: 12 },
    weight: { type: Number, default: 600 },
    spacing: { type: Number, default: 2 },
    transform: { type: String, default: 'uppercase' },
    decoration: { type: String, default: 'none' },
    fontStyle: { type: String, default: 'normal' },
    // Advanced styling
    shadowColor: { type: String, default: 'transparent' },
    shadowOffsetX: { type: Number, default: 0 },
    shadowOffsetY: { type: Number, default: 0 },
    shadowBlur: { type: Number, default: 0 },
    rotation: { type: Number, default: 0 },
    opacity: { type: Number, default: 1 },
    fontVariant: { type: String, default: 'normal' },
});

const selectedPanel = computed({
    get: () => props.panel,
    set: (val) => emit('update:panel', val),
});

const emit = defineEmits(['update:family', 'update:size', 'update:weight', 'update:spacing', 'update:transform', 'update:decoration', 'update:fontStyle', 'update:panel', 'update:shadowColor', 'update:shadowOffsetX', 'update:shadowOffsetY', 'update:shadowBlur', 'update:rotation', 'update:opacity', 'update:fontVariant']);

const fontFamily = ref(props.family);
const fontSize = ref(props.size);
const fontWeight = ref(props.weight);
const letterSpacing = ref(props.spacing);
const textTransform = ref(props.transform);
const textDecoration = ref(props.decoration);
const fontStyleValue = ref(props.fontStyle);
const textShadowColor = ref(props.shadowColor);
const textShadowOffsetX = ref(props.shadowOffsetX);
const textShadowOffsetY = ref(props.shadowOffsetY);
const textShadowBlur = ref(props.shadowBlur);
const textRotation = ref(props.rotation);
const textOpacity = ref(props.opacity);
const fontVariantValue = ref(props.fontVariant);

// Watch props to update local refs when panel changes
watch(() => props.family, (val) => fontFamily.value = val);
watch(() => props.size, (val) => fontSize.value = val);
watch(() => props.weight, (val) => fontWeight.value = val);
watch(() => props.spacing, (val) => letterSpacing.value = val);
watch(() => props.transform, (val) => textTransform.value = val);
watch(() => props.decoration, (val) => textDecoration.value = val);
watch(() => props.fontStyle, (val) => fontStyleValue.value = val);
watch(() => props.shadowColor, (val) => textShadowColor.value = val);
watch(() => props.shadowOffsetX, (val) => textShadowOffsetX.value = val);
watch(() => props.shadowOffsetY, (val) => textShadowOffsetY.value = val);
watch(() => props.shadowBlur, (val) => textShadowBlur.value = val);
watch(() => props.rotation, (val) => textRotation.value = val);
watch(() => props.opacity, (val) => textOpacity.value = val);
watch(() => props.fontVariant, (val) => fontVariantValue.value = val);

watch(fontFamily, (val) => emit('update:family', val));
watch(fontSize, (val) => emit('update:size', val));
watch(fontWeight, (val) => emit('update:weight', val));
watch(letterSpacing, (val) => emit('update:spacing', val));
watch(textTransform, (val) => emit('update:transform', val));
watch(textDecoration, (val) => emit('update:decoration', val));
watch(fontStyleValue, (val) => emit('update:fontStyle', val));
watch(textShadowColor, (val) => emit('update:shadowColor', val));
watch(textShadowOffsetX, (val) => emit('update:shadowOffsetX', val));
watch(textShadowOffsetY, (val) => emit('update:shadowOffsetY', val));
watch(textShadowBlur, (val) => emit('update:shadowBlur', val));
watch(textRotation, (val) => emit('update:rotation', val));
watch(textOpacity, (val) => emit('update:opacity', val));
watch(fontVariantValue, (val) => emit('update:fontVariant', val));
</script>

<style scoped>
.text-styler {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.panel-selector {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e5e5;
}

.panel-selector label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #666;
}

.panel-buttons {
    display: flex;
    gap: 0.5rem;
}

.panel-btn {
    flex: 1;
    padding: 0.5rem;
    border: 2px solid #e5e5e5;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.8rem;
    transition: all 0.2s;
    color: #666;
}

.panel-btn:hover {
    border-color: #ccc;
}

.panel-btn.active {
    border-color: #000;
    background: #f0f0f0;
    color: #000;
}

.primary-btn.active {
    border-color: #31C4F3;
}

.secondary-btn.active {
    border-color: #389AD5;
}

.tertiary-btn.active {
    border-color: #2674A4;
}

.style-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.style-group label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #666;
}

.font-select {
    padding: 0.5rem;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    font-size: 0.85rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
}

.font-select:focus {
    outline: none;
    border-color: #000;
}

.slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #e5e5e5;
    outline: none;
    -webkit-appearance: none;
    appearance: none;
}

.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #000;
    cursor: pointer;
}

.slider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #000;
    cursor: pointer;
    border: none;
}

.value {
    font-size: 0.75rem;
    color: #666;
    font-weight: 500;
}

.toolbar {
    display: flex;
    gap: 0.25rem;
    align-items: center;
    padding: 0.5rem;
    background: #fff;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
}

.toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid #e5e5e5;
    background: #fff;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0;
}

.toolbar-btn:hover {
    background: #f5f5f5;
    border-color: #ccc;
}

.toolbar-btn.active {
    background: #31C4F3;
    border-color: #31C4F3;
    color: #fff;
}

.toolbar-icon {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1;
}

.toolbar-icon.italic {
    font-style: italic;
    font-family: Georgia, serif;
}

.toolbar-icon.underline {
    text-decoration: underline;
}

.toolbar-icon.strikethrough {
    text-decoration: line-through;
}

.toolbar-divider {
    width: 1px;
    height: 24px;
    background: #e5e5e5;
    margin: 0 0.25rem;
}

.toolbar-icon.small-caps {
    font-variant: small-caps;
    font-size: 0.8rem;
}

.shadow-controls {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f9f9f9;
    border-radius: 4px;
}

.shadow-row {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.small-label {
    font-size: 0.7rem;
    font-weight: 500;
    color: #888;
    text-transform: none;
}

.color-input {
    height: 40px;
    border: 1px solid #e5e5e5;
    border-radius: 6px;
    cursor: pointer;
    padding: 4px;
    background: white;
}
</style>
