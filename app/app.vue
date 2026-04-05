<script lang="ts" setup>
const desc = "For the Badge - Create custom badges for your projects. Badges for badges sake. Generate, customize, and download SVG badges.";
useSeoMeta({
    description: desc,
    ogTitle: "For the Badge - Badges for badges sake",
    ogDescription: desc,
    ogUrl: "https://forthebadge.com",
    twitterTitle: "For the Badge - Badges for badges sake",
    twitterDescription: desc,
    twitterCard: "summary_large_image",
});
useHead({
    htmlAttrs: { lang: "en" },
    link: [ { rel: "icon", type: "image/png", href: "/favicon.png" } ],
});

const show = ref(false);
</script>

<template>
    <div>
        <NuxtRouteAnnouncer />
        <NuxtPage />

        <FeedbackChatBubble />

        <CookieNotice />

        <Skew :show />
    </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
}
</style>

