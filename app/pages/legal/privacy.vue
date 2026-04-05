<template>
    <div class="legal-background">
        <!-- Animated Dot Matrix Background -->
        <div class="dot-matrix" ref="dotMatrix">
            <div v-for="(dot, index) in dots" :key="index" 
                 :class="['dot', dot.type]" 
                 :style="{ left: dot.x + '%', top: dot.y + '%', animationDelay: dot.delay + 'ms' }">
            </div>
        </div>
        
        <!-- Desktop Navigation -->
        <NavBar v-if="!isMobile" />
        
        <!-- Mobile Navigation -->
        <MobileNavBar v-if="isMobile" />
        
        <div class="legal-page" :class="{ 'mobile-view': isMobile }">
            <!-- Hero Section -->
            <section class="hero-section">
                <div class="hero-container">
                    <div class="scanning-indicator" v-if="mounted">
                        <div class="scan-dot"></div>
                        <span class="scan-text">Analyzing privacy practices</span>
                        <span class="scan-status" :key="scanStatus">{{ scanStatus }}</span>
                    </div>
                    
                    <h1 class="hero-title">
                        <span class="highlight">Privacy Policy</span>
                    </h1>
                    <p class="hero-subtitle">
                        TL;DR: We don't spy on you. That's literally the whole point.
                    </p>
                    <p class="last-updated">
                        Last updated: October 13, 2025
                    </p>
                </div>
            </section>

            <!-- Main Content Sections -->
            <div class="content-container">
                <!-- Quick Summary -->
                <section class="legal-section" 
                         :class="{ 'animated': visibleSections.summary }"
                         ref="summarySection">
                    <div class="section-icon">
                        <div class="icon-wrapper summary">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <h2 class="section-title">The Short Version</h2>
                    <div class="section-content">
                        <p class="lead-text">We built For The Badge because we hate how companies collect your data and sell it to the highest bidder. So we don't do that. At all.</p>
                        
                        <div class="promise-grid">
                            <div class="promise-item good">
                                <div class="promise-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <p>Let you create beautiful badges</p>
                            </div>
                            <div class="promise-item good">
                                <div class="promise-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <p>Store only saved badges (encrypted)</p>
                            </div>
                            <div class="promise-item good">
                                <div class="promise-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <p>Use minimal session cookies for basic functionality</p>
                            </div>
                            <div class="promise-item bad">
                                <div class="promise-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <p>Track what badges you create</p>
                            </div>
                            <div class="promise-item bad">
                                <div class="promise-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <p>Track your browsing habits</p>
                            </div>
                            <div class="promise-item bad">
                                <div class="promise-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <p>Sell your data to anyone, ever</p>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Data Collection -->
                <section class="legal-section" 
                         :class="{ 'animated': visibleSections.collection }"
                         ref="collectionSection">
                    <div class="section-icon">
                        <div class="icon-wrapper collection">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <h2 class="section-title">Information We Actually Collect</h2>
                    <div class="section-content">
                        <div class="data-category">
                            <h3>Account Information</h3>
                            <p class="lead-text">When you create an account, we generate a random 16-digit account number. That's it.</p>
                            
                            <div class="data-list">
                                <div class="data-item minimal">
                                    <div class="data-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <div class="data-details">
                                        <h4>16-digit Account Number</h4>
                                        <p>Random number that lets you access your credits. No personal info attached.</p>
                                    </div>
                                </div>
                                <div class="data-item minimal">
                                    <div class="data-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2v20m-8.5-2h17a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0020.5 4h-17A1.5 1.5 0 002 5.5v13A1.5 1.5 0 003.5 20z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <div class="data-details">
                                        <h4>Saved Badges (Optional)</h4>
                                        <p>If you choose to save badges, they're encrypted and tied to your account.</p>
                                    </div>
                                </div>
                                <div class="data-item minimal">
                                    <div class="data-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <div class="data-details">
                                        <h4>Referral Links (Optional)</h4>
                                        <p>If someone referred you, we track that for credit bonuses.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="data-category">
                            <h3>Badges (Your Choice)</h3>
                            <p class="lead-text">When you create a badge, here's exactly what happens:</p>
                            
                            <div class="process-flow">
                                <div class="process-step">
                                    <div class="step-number">1</div>
                                    <h4>Create</h4>
                                    <p>You design your badge</p>
                                </div>
                                <div class="process-arrow">→</div>
                                <div class="process-step">
                                    <div class="step-number">2</div>
                                    <h4>Export</h4>
                                    <p>Download SVG or PNG instantly</p>
                                </div>
                                <div class="process-arrow">→</div>
                                <div class="process-step">
                                    <div class="step-number">3</div>
                                    <h4>Save (Optional)</h4>
                                    <p>Choose to save (encrypted) or leave</p>
                                </div>
                                <div class="process-arrow">→</div>
                                <div class="process-step delete">
                                    <div class="step-number">4</div>
                                    <h4>Done</h4>
                                    <p>Use your badge anywhere</p>
                                </div>
                            </div>
                            
                            <div class="highlight-callout security">
                                <strong>No tracking, no analytics on your designs.</strong> We don't monitor what badges you create or where you use them.
                            </div>
                        </div>

                        <div class="data-category">
                            <h3>Technical Data (Minimal)</h3>
                            <p>We collect the bare minimum to keep the service running:</p>
                            
                            <div class="tech-data-grid">
                                <div class="tech-item">
                                    <div class="tech-icon">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 3v18h18M8 17V9m4 8V5m4 12v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <h4>Usage Metrics</h4>
                                    <p>Basic counts: badges created, pages visited</p>
                                </div>
                                <div class="tech-item">
                                    <div class="tech-icon">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <h4>Error Logs</h4>
                                    <p>Technical errors to fix bugs (no personal content)</p>
                                </div>
                                <div class="tech-item">
                                    <div class="tech-icon">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                            <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <h4>Performance Data</h4>
                                    <p>Response times to improve the service</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Data Usage -->
                <section class="legal-section" 
                         :class="{ 'animated': visibleSections.usage }"
                         ref="usageSection">
                    <div class="section-icon">
                        <div class="icon-wrapper usage">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l3.5-1.75a.75.75 0 000-1.342L4.25 8.887a.75.75 0 00-1.06 1.06L8.05 14.81a.75.75 0 00.852-1.063l2.836-.708a.75.75 0 00.853 1.063l.708-2.836z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <h2 class="section-title">How We Use Your Information</h2>
                    <div class="section-content">
                        <p class="lead-text">We use your information for exactly three things. Nothing more.</p>
                        
                        <div class="usage-items">
                            <div class="usage-item">
                                <div class="usage-number">01</div>
                                <h3>Providing the Service</h3>
                                <p>Helping you create beautiful, customizable badges for your projects. This is literally why we exist.</p>
                            </div>
                            <div class="usage-item">
                                <div class="usage-number">02</div>
                                <h3>Account Management</h3>
                                <p>Tracking your credits, handling payments, and managing your account access.</p>
                            </div>
                            <div class="usage-item">
                                <div class="usage-number">03</div>
                                <h3>Service Improvement</h3>
                                <p>Fixing bugs and improving the badge creation experience.</p>
                            </div>
                        </div>
                        
                        <div class="highlight-callout">
                            <strong>That's it.</strong> We don't use your data for advertising, marketing, profiling, or selling to third parties. We're not Facebook.
                        </div>
                    </div>
                </section>

                <!-- Data Security -->
                <section class="legal-section security-section" 
                         :class="{ 'animated': visibleSections.security }"
                         ref="securitySection">
                    <div class="section-icon">
                        <div class="icon-wrapper security">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <h2 class="section-title">Data Security</h2>
                    <div class="section-content">
                        <p class="lead-text">We take security seriously because your data deserves respect.</p>
                        
                        <div class="security-measures">
                            <div class="measure-item">
                                <div class="measure-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <h4>Encryption Everywhere</h4>
                                <p>All data encrypted in transit (HTTPS) and at rest (AES-256)</p>
                            </div>
                            <div class="measure-item">
                                <div class="measure-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <h4>Trusted Hosting</h4>
                                <p>Servers hosted with reputable, enterprise-grade cloud providers</p>
                            </div>
                            <div class="measure-item">
                                <div class="measure-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <h4>Minimal Storage</h4>
                                <p>Only saved badges are stored (encrypted), nothing else</p>
                            </div>
                        </div>
                        
                        <div class="highlight-callout security">
                            <strong>No system is 100% secure,</strong> but we do everything humanly possible to protect your information.
                        </div>
                    </div>
                </section>

                <!-- Your Rights -->
                <section class="legal-section rights-section" 
                         :class="{ 'animated': visibleSections.rights }"
                         ref="rightsSection">
                    <div class="section-icon">
                        <div class="icon-wrapper rights">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <h2 class="section-title">Your Rights</h2>
                    <div class="section-content">
                        <p class="lead-text">You have complete control over your data. Here's what you can do:</p>
                        
                        <div class="rights-grid">
                            <div class="right-item">
                                <div class="right-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                        <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <h4>Access</h4>
                                <p>See exactly what data we have about you (spoiler: it's not much)</p>
                            </div>
                            <div class="right-item">
                                <div class="right-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                        <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <h4>Deletion</h4>
                                <p>Delete your account and all associated data permanently</p>
                            </div>
                            <div class="right-item">
                                <div class="right-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                        <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <h4>Correction</h4>
                                <p>Fix any incorrect information in your account</p>
                            </div>
                            <div class="right-item">
                                <div class="right-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                        <path d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <h4>Portability</h4>
                                <p>Get a copy of your data in a readable format</p>
                            </div>
                            <div class="right-item">
                                <div class="right-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                        <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18 21l-1.5-1.5m0 0L3 6l1.5 1.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <h4>Objection</h4>
                                <p>Object to how we process your data</p>
                            </div>
                            <div class="right-item">
                                <div class="right-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <h4>Complaint</h4>
                                <p>File complaints with data protection authorities</p>
                            </div>
                        </div>
                        
                        <div class="contact-box">
                            <h4>Exercise Your Rights</h4>
                            <p>Email us at <a href="mailto:hello@forthebadge.com">hello@forthebadge.com</a> and we'll respond within 30 days. We're real humans who actually read emails.</p>
                        </div>
                    </div>
                </section>

                <!-- Contact Section -->
                <section class="legal-section contact-section" 
                         :class="{ 'animated': visibleSections.contact }"
                         ref="contactSection">
                    <div class="section-icon">
                        <div class="icon-wrapper contact">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                    </div>
                    <h2 class="section-title">Questions About Privacy?</h2>
                    <div class="section-content">
                        <p class="lead-text">We're here to answer any questions about how we handle your data.</p>
                        
                        <div class="contact-methods">
                            <div class="contact-method">
                                <div class="contact-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <div>
                                    <h4>Email Us</h4>
                                    <p><a href="mailto:hello@forthebadge.com">hello@forthebadge.com</a></p>
                                    <small>Response time: Within 24-48 hours</small>
                                </div>
                            </div>
                            <div class="contact-method">
                                <div class="contact-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <div>
                                    <h4>Contact Form</h4>
                                    <p><NuxtLink to="/company/contact">Use our contact page</NuxtLink></p>
                                    <small>For detailed privacy inquiries</small>
                                </div>
                            </div>
                        </div>
                        
                        <div class="final-statement">
                            <h3>Privacy is a fundamental right</h3>
                            <p>Not a luxury. Not a feature. Not something you should have to pay extra for. It's the foundation of everything we build at For The Badge.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <Footer v-if="!isMobile" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import Footer from "~/components/Footer.vue";
import NavBar from "~/components/NavBar.vue";
import MobileNavBar from "~/components/MobileNavBar.vue";
import { isMobileDevice } from '~/utils/deviceDetection';

// Mobile detection based on user agent
const isMobile = computed(() => {
    if (import.meta.client) {
        return isMobileDevice();
    }
    return false;
});

// Animation state
const mounted = ref(false);
const dotMatrix = ref(null);
const dots = ref([]);
const scanStatus = ref('Scanning data practices...');

// Section refs for scroll animations
const summarySection = ref(null);
const collectionSection = ref(null);
const usageSection = ref(null);
const securitySection = ref(null);
const rightsSection = ref(null);
const contactSection = ref(null);

// Visibility state for sections
const visibleSections = ref({
    summary: false,
    collection: false,
    usage: false,
    security: false,
    rights: false,
    contact: false
});

// Generate random dots for the matrix background
const generateDots = () => {
    const dotCount = 150;
    const newDots = [];
    
    for (let i = 0; i < dotCount; i++) {
        const types = ['small', 'medium', 'large'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        newDots.push({
            x: Math.random() * 100,
            y: Math.random() * 100,
            type,
            delay: Math.random() * 3000
        });
    }
    
    dots.value = newDots;
};

// Scanning status messages
const statusMessages = [
    'Scanning data practices...',
    'Verifying privacy claims...',
    'Analyzing data flows...',
    'Privacy verified!'
];

let statusIndex = 0;
let statusInterval = null;
let observer = null;

// Scroll animation observer
const setupScrollAnimations = () => {
    if (!import.meta.client) return;
    
    const options = {
        root: null,
        rootMargin: '-100px',
        threshold: 0.1
    };
    
    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                if (entry.target === summarySection.value) {
                    visibleSections.value.summary = true;
                } else if (entry.target === collectionSection.value) {
                    visibleSections.value.collection = true;
                } else if (entry.target === usageSection.value) {
                    visibleSections.value.usage = true;
                } else if (entry.target === securitySection.value) {
                    visibleSections.value.security = true;
                } else if (entry.target === rightsSection.value) {
                    visibleSections.value.rights = true;
                } else if (entry.target === contactSection.value) {
                    visibleSections.value.contact = true;
                }
            }
        });
    }, options);
    
    // Observe all sections
    nextTick(() => {
        if (summarySection.value) observer.observe(summarySection.value);
        if (collectionSection.value) observer.observe(collectionSection.value);
        if (usageSection.value) observer.observe(usageSection.value);
        if (securitySection.value) observer.observe(securitySection.value);
        if (rightsSection.value) observer.observe(rightsSection.value);
        if (contactSection.value) observer.observe(contactSection.value);
    });
};

onMounted(() => {
    mounted.value = true;
    generateDots();
    
    // Status animation
    statusInterval = setInterval(() => {
        statusIndex = (statusIndex + 1) % statusMessages.length;
        scanStatus.value = statusMessages[statusIndex];
    }, 2500);
    
    // Setup scroll animations
    setupScrollAnimations();
});

onUnmounted(() => {
    if (statusInterval) {
        clearInterval(statusInterval);
    }
    if (observer) {
        observer.disconnect();
    }
});

useHead({
    title: "Privacy Policy - For The Badge",
    meta: [{ name: "description", content: "For The Badge's privacy policy: We don't spy on you, track your designs, or sell your data. Privacy-first badge creation." }],
});
</script>

<style scoped>
/* Base Layout */
.legal-background {
  min-height: 100vh;
  background: #f8fafb;
  position: relative;
  overflow-x: hidden;
}

/* Animated dot matrix background */
.dot-matrix {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.dot {
  position: absolute;
  border-radius: 50%;
  background: #667eea;
  opacity: 0;
  animation: dotFade 6s infinite;
}

.dot.small {
  width: 3px;
  height: 3px;
}

.dot.medium {
  width: 5px;
  height: 5px;
}

.dot.large {
  width: 7px;
  height: 7px;
}

@keyframes dotFade {
  0%, 90%, 100% { opacity: 0; }
  45% { opacity: 0.6; }
}

/* Main Layout */
.legal-page {
  min-height: 100vh;
  padding-top: 6rem;
  position: relative;
  z-index: 2;
}

.legal-page.mobile-view {
  padding-top: 4rem;
}

/* Hero Section */
.hero-section {
  min-height: 60vh;
  background: #f8fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
  position: relative;
  overflow: hidden;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
  z-index: 1;
  position: relative;
}

.scanning-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  margin-bottom: 2rem;
  animation: slideInDown 0.8s ease-out;
}

.scan-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #10b981;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.scan-text {
  font-weight: 600;
  color: #1f2937;
}

.scan-status {
  color: #6b7280;
  font-size: 0.9rem;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: #1f2937;
  animation: slideInUp 0.8s ease-out 0.2s both;
}

.hero-title .highlight {
  color: #10b981;
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2vw, 1.3rem);
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.6;
  font-weight: 400;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  animation: slideInUp 0.8s ease-out 0.4s both;
}

.last-updated {
  font-size: 1rem;
  opacity: 0.8;
  color: #6b7280;
  animation: slideInUp 0.8s ease-out 0.6s both;
}

/* Content Container */
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  position: relative;
  z-index: 3;
}

/* Legal Sections */
.legal-section {
  background: white;
  border-radius: 24px;
  padding: 3rem;
  margin-bottom: 4rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.8s ease-out;
  position: relative;
}

.legal-section.animated {
  opacity: 1;
  transform: translateY(0);
}

.legal-section:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Section Icons */
.section-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: iconBounce 2s ease-out infinite;
}

.icon-wrapper.summary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.icon-wrapper.collection {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.icon-wrapper.usage {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.icon-wrapper.security {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.icon-wrapper.rights {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.icon-wrapper.contact {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

@keyframes iconBounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4px);
  }
  60% {
    transform: translateY(-2px);
  }
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
}

.section-content {
  position: relative;
}

.lead-text {
  font-size: 1.25rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Promise Grid */
.promise-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.promise-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid;
  transition: all 0.3s ease;
}

.promise-item.good {
  border-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%);
}

.promise-item.bad {
  border-color: #ef4444;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%);
}

.promise-item:hover {
  transform: translateY(-2px);
}

.promise-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.promise-icon svg {
  color: currentColor;
}

.promise-item p {
  margin: 0;
  font-weight: 500;
  color: #374151;
}

/* Data Categories */
.data-category {
  margin-bottom: 3rem;
}

.data-category h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

/* Data List */
.data-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
}

.data-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.data-item:hover {
  transform: translateY(-2px);
  border-color: #3b82f6;
}

.data-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  color: #3b82f6;
}

.data-details h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.data-details p {
  color: #6b7280;
  margin: 0;
  font-size: 0.9rem;
}

/* Process Flow */
.process-flow {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 16px;
  overflow-x: auto;
}

.process-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 120px;
  flex-shrink: 0;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.process-step.delete .step-number {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.process-step h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.process-step p {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0;
}

.process-arrow {
  font-size: 1.5rem;
  color: #6b7280;
  flex-shrink: 0;
}

/* Tech Data Grid */
.tech-data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: transform 0.3s ease;
}

.tech-item:hover {
  transform: translateY(-2px);
}

.tech-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  color: #667eea;
}

.tech-item h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.tech-item p {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

/* Usage Items */
.usage-items {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 2rem 0;
}

.usage-item {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.usage-number {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  line-height: 1;
  flex-shrink: 0;
}

.usage-item h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.usage-item p {
  color: #6b7280;
  margin: 0;
}

/* Security Measures */
.security-measures {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.measure-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%);
  border-radius: 12px;
  border: 1px solid rgba(239, 68, 68, 0.2);
  transition: transform 0.3s ease;
}

.measure-item:hover {
  transform: translateY(-2px);
}

.measure-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  color: #ef4444;
}

.measure-item h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.measure-item p {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

/* Rights Grid */
.rights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.right-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%);
  border-radius: 12px;
  border: 1px solid rgba(245, 158, 11, 0.2);
  transition: all 0.3s ease;
}

.right-item:hover {
  transform: translateY(-2px);
  border-color: #f59e0b;
}

.right-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  color: #f59e0b;
}

.right-item h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.right-item p {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
}

/* Contact Methods */
.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 2rem 0;
}

.contact-method {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.contact-method:hover {
  transform: translateY(-2px);
  border-color: #667eea;
}

.contact-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  color: #667eea;
}

.contact-method h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.contact-method p {
  margin: 0;
  margin-bottom: 0.25rem;
}

.contact-method small {
  color: #6b7280;
  font-size: 0.8rem;
}

.contact-method a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.contact-method a:hover {
  text-decoration: underline;
}

/* Highlight Callouts */
.highlight-callout {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-left: 4px solid #667eea;
  padding: 1.5rem;
  border-radius: 0 12px 12px 0;
  margin: 2rem 0;
  font-size: 1.1rem;
  animation: slideInRight 0.6s ease-out;
}

.highlight-callout.security {
  border-left-color: #ef4444;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%);
}

/* Contact Box */
.contact-box {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  margin: 2rem 0;
}

.contact-box h4 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.contact-box a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.contact-box a:hover {
  text-decoration: underline;
}

/* Final Statement */
.final-statement {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(102, 126, 234, 0.2);
}

.final-statement h3 {
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

/* Animations */
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .legal-page {
    padding-top: 4rem;
  }
  
  .hero-section {
    min-height: auto;
    padding: 3rem 0;
  }
  
  .hero-container {
    padding: 0 1rem;
  }
  
  .scanning-indicator {
    padding: 0.75rem 1.5rem;
    gap: 0.75rem;
    font-size: 0.9rem;
  }
  
  .content-container {
    padding: 3rem 1rem;
  }
  
  .legal-section {
    padding: 2rem;
    margin-bottom: 3rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .lead-text {
    font-size: 1.1rem;
  }
  
  .promise-grid {
    grid-template-columns: 1fr;
  }
  
  .process-flow {
    flex-direction: column;
    align-items: stretch;
  }
  
  .process-arrow {
    transform: rotate(90deg);
  }
  
  .tech-data-grid,
  .security-measures,
  .rights-grid {
    grid-template-columns: 1fr;
  }
  
  .usage-item {
    flex-direction: column;
    text-align: center;
  }
  
  .usage-number {
    margin-bottom: 1rem;
  }
}
</style>
