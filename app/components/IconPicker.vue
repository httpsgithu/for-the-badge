<template>
    <div class="icon-picker">
        <div class="picker-header">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search over 3,000 icons (e.g., react, github, python)..."
                class="search-input"
                @input="debouncedSearch"
            />
            <button v-if="selectedIcon" class="clear-btn" @click="clearSelection">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                </svg>
                Clear
            </button>
        </div>

        <div v-if="isLoading" class="loading">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="spin">
                <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
            </svg>
            Searching...
        </div>

        <div v-else-if="error" class="error">
            {{ error }}
        </div>

        <div v-else class="icons-grid">
            <button
                v-for="icon in icons"
                :key="icon.slug"
                class="icon-item"
                :class="{ selected: selectedIcon === icon.slug }"
                :title="icon.title"
                @click="selectIcon(icon)"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" role="img">
                    <path :d="icon.path" :fill="`#${icon.hex}`" />
                </svg>
                <span class="icon-name">{{ icon.title }}</span>
            </button>
        </div>

        <div v-if="!isLoading && icons.length === 0 && searchQuery" class="no-results">
            No icons found for "{{ searchQuery }}"
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { IconData } from '~/shared/types/icon';

interface Props {
    modelValue?: string;
}

interface Emits {
    (e: 'update:modelValue', value: string | undefined): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const searchQuery = ref('');
const icons = ref<IconData[]>([]);
const selectedIcon = ref<string | undefined>(props.modelValue);
const isLoading = ref(false);
const error = ref('');
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

async function searchIcons() {
    isLoading.value = true;
    error.value = '';
    
    try {
        const response = await $fetch<{ success: boolean; icons: IconData[]; count: number }>('/api/icons/search', {
            params: { q: searchQuery.value, limit: 50 },
        });
        
        if (response.success) {
            icons.value = response.icons;
        }
    } catch (err) {
        console.error('Error searching icons:', err);
        error.value = 'Failed to load icons. Please try again.';
    } finally {
        isLoading.value = false;
    }
}

function debouncedSearch() {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
    
    debounceTimer = setTimeout(() => {
        searchIcons();
    }, 300);
}

function selectIcon(icon: IconData) {
    selectedIcon.value = icon.slug;
    emit('update:modelValue', icon.slug);
}

function clearSelection() {
    selectedIcon.value = undefined;
    emit('update:modelValue', undefined);
}

onMounted(() => {
    // Load popular icons initially
    searchIcons();
});
</script>

<style scoped>
.icon-picker {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
}

.picker-header {
    display: flex;
    gap: 8px;
}

.search-input {
    flex: 1;
    padding: 10px 14px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    outline: none;
    transition: border-color 0.2s;
}

.search-input:focus {
    border-color: #31C4F3;
}

.clear-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 600;
    color: #666;
    background: white;
    border: 1px solid #ccc;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.clear-btn:hover {
    background: #f0f0f0;
    border-color: #999;
}

.loading,
.error,
.no-results {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 24px;
    text-align: center;
    color: #666;
}

.error {
    color: #d32f2f;
}

.spin {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.icons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
    max-height: 400px;
    overflow-y: auto;
    padding: 8px;
    background: white;
    border-radius: 6px;
}

.icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 8px;
    background: #f8f9fa;
    border: 2px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
}

.icon-item:hover {
    background: #e9ecef;
    transform: translateY(-2px);
}

.icon-item.selected {
    background: #e3f2fd;
    border-color: #31C4F3;
}

.icon-name {
    font-size: 8px;
    color: #666;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
}
</style>
