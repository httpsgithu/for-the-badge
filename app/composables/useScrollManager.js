import { ref, nextTick } from "vue";

// Global state for scroll management
const scrollPositions = ref(new Map());
const focusStack = ref([]);
const smoothScrollBehavior = ref(true);

export const useScrollManager = () =>
{
    // Save current scroll position with a key
    const saveScrollPosition = (key = "default") =>
    {
        if (import.meta.client)
        {
            const position = {
                x: window.scrollX || window.pageXOffset,
                y: window.scrollY || window.pageYOffset,
                timestamp: Date.now(),
            };
            scrollPositions.value.set(key, position);
            console.log(`📍 Saved scroll position for "${key}":`, position);
        }
    };

    // Restore scroll position by key
    const restoreScrollPosition = async (key = "default", smooth = true) =>
    {
        if (import.meta.client)
        {
            const position = scrollPositions.value.get(key);
            if (position)
            {
                await nextTick();

                const scrollOptions = {
                    left: position.x,
                    top: position.y,
                    behavior: smooth && smoothScrollBehavior.value ? "smooth" : "instant",
                };

                // Try modern scrollTo first
                if (window.scrollTo)
                {
                    window.scrollTo(scrollOptions);
                }
                else
                {
                    // Fallback for older browsers
                    window.scroll(position.x, position.y);
                }

                console.log(`↩️ Restored scroll position for "${key}":`, position);
            }
        }
    };

    // Preserve scroll position during an action
    const preserveScrollDuring = async (actionFn, key = "action") =>
    {
        saveScrollPosition(key);
        try
        {
            const result = await actionFn();
            await nextTick();
            setTimeout(() => restoreScrollPosition(key, true), 50);

            return result;
        }
        catch (error)
        {
            await nextTick();
            setTimeout(() => restoreScrollPosition(key, true), 50);
            throw error;
        }
    };

    // Smooth scroll to element
    const scrollToElement = async (elementOrSelector, offset = 0, smooth = true) =>
    {
        if (import.meta.client)
        {
            await nextTick();

            let element;
            if (typeof elementOrSelector === "string")
            {
                element = document.querySelector(elementOrSelector);
            }
            else
            {
                element = elementOrSelector;
            }

            if (element)
            {
                const rect = element.getBoundingClientRect();
                const targetY = window.scrollY + rect.top - offset;

                const scrollOptions = {
                    left: 0,
                    top: Math.max(0, targetY),
                    behavior: smooth && smoothScrollBehavior.value ? "smooth" : "instant",
                };

                window.scrollTo(scrollOptions);
                console.log(`🎯 Scrolled to element:`, element, "at position:", targetY);
            }
        }
    };

    // Smart scroll to keep element in view
    const ensureElementVisible = async (elementOrSelector, margin = 100, smooth = true) =>
    {
        if (import.meta.client)
        {
            await nextTick();

            let element;
            if (typeof elementOrSelector === "string")
            {
                element = document.querySelector(elementOrSelector);
            }
            else
            {
                element = elementOrSelector;
            }

            if (element)
            {
                const rect = element.getBoundingClientRect();
                const viewportHeight = window.innerHeight;

                // Check if element is already visible with margin
                const isVisible = rect.top >= margin && rect.bottom <= viewportHeight - margin;

                if (!isVisible)
                {
                    let targetY;
                    if (rect.top < margin)
                    {
                        // Element is above viewport, scroll up
                        targetY = window.scrollY + rect.top - margin;
                    }
                    else
                    {
                        // Element is below viewport, scroll down
                        targetY = window.scrollY + rect.bottom - viewportHeight + margin;
                    }

                    const scrollOptions = {
                        left: 0,
                        top: Math.max(0, targetY),
                        behavior: smooth && smoothScrollBehavior.value ? "smooth" : "instant",
                    };

                    window.scrollTo(scrollOptions);
                    console.log(`👀 Made element visible:`, element, "scrolled to:", targetY);
                }
            }
        }
    };

    // Focus management
    const saveFocus = () =>
    {
        if (import.meta.client && document.activeElement && document.activeElement !== document.body)
        {
            focusStack.value.push(document.activeElement);
            console.log(`🎯 Saved focus on:`, document.activeElement);
        }
    };

    const restoreFocus = async () =>
    {
        if (import.meta.client && focusStack.value.length > 0)
        {
            await nextTick();
            const element = focusStack.value.pop();
            if (element && element.focus && element.isConnected)
            {
                try
                {
                    element.focus();
                    // Also ensure the focused element is visible
                    setTimeout(() => ensureElementVisible(element, 100, true), 100);
                    console.log(`🎯 Restored focus to:`, element);
                }
                catch (error)
                {
                    console.warn("Could not restore focus:", error);
                }
            }
        }
    };

    // Preserve focus during an action
    const preserveFocusDuring = async (actionFn) =>
    {
        saveFocus();
        try
        {
            const result = await actionFn();
            await nextTick();
            setTimeout(() => restoreFocus(), 50);

            return result;
        }
        catch (error)
        {
            await nextTick();
            setTimeout(() => restoreFocus(), 50);
            throw error;
        }
    };

    // Combined preservation of both scroll and focus
    const preserveStatesDuring = async (actionFn, scrollKey = "action") =>
    {
        saveScrollPosition(scrollKey);
        saveFocus();

        try
        {
            const result = await actionFn();
            await nextTick();
            setTimeout(() =>
            {
                restoreScrollPosition(scrollKey, true);
                restoreFocus();
            }, 50);

            return result;
        }
        catch (error)
        {
            await nextTick();
            setTimeout(() =>
            {
                restoreScrollPosition(scrollKey, true);
                restoreFocus();
            }, 50);
            throw error;
        }
    };

    // Scroll to top of page
    const scrollToTop = (smooth = true) =>
    {
        if (import.meta.client)
        {
            const scrollOptions = {
                left: 0,
                top: 0,
                behavior: smooth && smoothScrollBehavior.value ? "smooth" : "instant",
            };
            window.scrollTo(scrollOptions);
        }
    };

    // Clear all saved positions (useful for cleanup)
    const clearSavedPositions = () =>
    {
        scrollPositions.value.clear();
        focusStack.value = [];
        console.log("🧹 Cleared all saved scroll positions and focus stack");
    };

    // Toggle smooth scrolling behavior
    const setSmoothScrolling = (enabled) =>
    {
        smoothScrollBehavior.value = enabled;
    };

    return {
    // Scroll position management
        saveScrollPosition,
        restoreScrollPosition,
        preserveScrollDuring,

        // Element scrolling
        scrollToElement,
        ensureElementVisible,
        scrollToTop,

        // Focus management
        saveFocus,
        restoreFocus,
        preserveFocusDuring,

        // Combined state preservation
        preserveStatesDuring,

        // Utilities
        clearSavedPositions,
        setSmoothScrolling,

        // Reactive state (read-only)
        scrollPositions: readonly(scrollPositions),
        smoothScrollBehavior: readonly(smoothScrollBehavior),
    };
};