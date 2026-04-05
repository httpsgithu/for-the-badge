<template>
  <div class="api-page">
    <!-- Desktop Navigation -->
    <NavBar v-if="!isMobile" />
    
    <!-- Mobile Navigation -->
    <MobileNavBar v-if="isMobile" />

    <!-- Hero Section -->
    <SubPageHeader
      title="Public API"
      subtitle="Generate custom badges programmatically using our simple REST API"
    />

    <!-- Main Content -->
    <div class="api-wrapper">
      <div class="api-layout">
        <!-- Sidebar Navigation -->
        <aside class="sidebar">
          <nav class="sidebar-nav">
            <div class="nav-section">
              <h3>Getting Started</h3>
              <ul>
                <li><a href="#overview" @click.prevent="scrollTo('overview')" :class="{ active: activeSection === 'overview' }">Overview</a></li>
                <li><a href="#quickstart" @click.prevent="scrollTo('quickstart')" :class="{ active: activeSection === 'quickstart' }">Quick Start</a></li>
              </ul>
            </div>
            <div class="nav-section">
              <h3>Reference</h3>
              <ul>
                <li><a href="#endpoint" @click.prevent="scrollTo('endpoint')" :class="{ active: activeSection === 'endpoint' }">Endpoint</a></li>
                <li><a href="#parameters" @click.prevent="scrollTo('parameters')" :class="{ active: activeSection === 'parameters' }">Parameters</a></li>
                <li><a href="#response" @click.prevent="scrollTo('response')" :class="{ active: activeSection === 'response' }">Response</a></li>
                <li><a href="#examples" @click.prevent="scrollTo('examples')" :class="{ active: activeSection === 'examples' }">Examples</a></li>
              </ul>
            </div>
            <div class="nav-section">
              <h3>Advanced</h3>
              <ul>
                <li><a href="#styling" @click.prevent="scrollTo('styling')" :class="{ active: activeSection === 'styling' }">Styling Options</a></li>
                <li><a href="#errors" @click.prevent="scrollTo('errors')" :class="{ active: activeSection === 'errors' }">Error Handling</a></li>
              </ul>
            </div>
          </nav>
        </aside>

        <!-- Main Content -->
        <main class="content">
          <!-- Overview -->
          <section id="overview" class="doc-section">
            <h2>Overview</h2>
            <p>The For the Badge API allows you to generate custom SVG badges programmatically. Simply make a GET request to our endpoint with your desired configuration as query parameters, and we'll return a ready-to-use SVG badge.</p>
            <p>This is perfect for:</p>
            <ul>
              <li>Dynamically generating badges in your CI/CD pipelines</li>
              <li>Creating badges on-the-fly in your applications</li>
              <li>Building badge galleries with custom styling</li>
              <li>Integrating badges into static site generators</li>
            </ul>
          </section>

          <!-- Quick Start -->
          <section id="quickstart" class="doc-section">
            <h2>Quick Start</h2>
            <p>Here's a simple example to get started:</p>
            <div class="code-block">
              <pre><code>https://forthebadge.com/api/badges/generate?primaryLabel=BUILT&secondaryLabel=WITH&primaryBGColor=%2331C4F3&secondaryBGColor=%23389AD5</code></pre>
            </div>
            <p>Visit this URL in your browser to see a badge with "BUILT" and "WITH" labels.</p>
            <p>Use it in Markdown:</p>
            <div class="code-block">
              <pre><code>![Badge](https://forthebadge.com/api/badges/generate?primaryLabel=BUILT&secondaryLabel=WITH)</code></pre>
            </div>
          </section>

          <!-- Endpoint -->
          <section id="endpoint" class="doc-section">
            <h2>Endpoint</h2>
            <div class="endpoint-box">
              <div class="method get">GET</div>
              <div class="path">/api/badges/generate</div>
            </div>
            <p><strong>Base URL:</strong> <code>https://forthebadge.com</code></p>
            <p><strong>Response Type:</strong> <code>image/svg+xml</code></p>
            <p><strong>Cache:</strong> Responses are cached for 1 year with immutable flag for optimal performance.</p>
          </section>

          <!-- Parameters -->
          <section id="parameters" class="doc-section">
            <h2>Query Parameters</h2>
            
            <div class="params-section">
              <h3>Required Parameters</h3>
              <table class="params-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Type</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>primaryLabel</code></td>
                    <td>string</td>
                    <td>Text for the first (primary) panel. URL encode special characters.</td>
                  </tr>
                  <tr>
                    <td><code>secondaryLabel</code></td>
                    <td>string</td>
                    <td>Text for the second (secondary) panel. URL encode special characters.</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryLabel</code></td>
                    <td>string</td>
                    <td>Text for the third panel. <strong>Required only when</strong> <code>panels=3</code></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="params-section">
              <h3>Optional Parameters</h3>
              <table class="params-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>panels</code></td>
                    <td>number</td>
                    <td>2</td>
                    <td>Number of panels: 2 or 3</td>
                  </tr>
                  <tr>
                    <td><code>primaryBGColor</code></td>
                    <td>hex color</td>
                    <td>#31C4F3</td>
                    <td>Primary panel background color</td>
                  </tr>
                  <tr>
                    <td><code>primaryTextColor</code></td>
                    <td>hex color</td>
                    <td>#FFFFFF</td>
                    <td>Primary panel text color</td>
                  </tr>
                  <tr>
                    <td><code>secondaryBGColor</code></td>
                    <td>hex color</td>
                    <td>#389AD5</td>
                    <td>Secondary panel background color</td>
                  </tr>
                  <tr>
                    <td><code>secondaryTextColor</code></td>
                    <td>hex color</td>
                    <td>#FFFFFF</td>
                    <td>Secondary panel text color</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryBGColor</code></td>
                    <td>hex color</td>
                    <td>#2674A4</td>
                    <td>Tertiary panel background color (3-panel badges only)</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryTextColor</code></td>
                    <td>hex color</td>
                    <td>#FFFFFF</td>
                    <td>Tertiary panel text color (3-panel badges only)</td>
                  </tr>
                  <tr>
                    <td><code>primaryFontSize</code></td>
                    <td>number</td>
                    <td>12</td>
                    <td>Font size for primary text (pixels)</td>
                  </tr>
                  <tr>
                    <td><code>secondaryFontSize</code></td>
                    <td>number</td>
                    <td>12</td>
                    <td>Font size for secondary text (pixels)</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryFontSize</code></td>
                    <td>number</td>
                    <td>12</td>
                    <td>Font size for tertiary text (pixels)</td>
                  </tr>
                  <tr>
                    <td><code>primaryFontWeight</code></td>
                    <td>number</td>
                    <td>600</td>
                    <td>Font weight for primary text (100-900)</td>
                  </tr>
                  <tr>
                    <td><code>secondaryFontWeight</code></td>
                    <td>number</td>
                    <td>900</td>
                    <td>Font weight for secondary text (100-900)</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryFontWeight</code></td>
                    <td>number</td>
                    <td>500</td>
                    <td>Font weight for tertiary text (100-900)</td>
                  </tr>
                  <tr>
                    <td><code>primaryLetterSpacing</code></td>
                    <td>number</td>
                    <td>2</td>
                    <td>Letter spacing for primary text</td>
                  </tr>
                  <tr>
                    <td><code>secondaryLetterSpacing</code></td>
                    <td>number</td>
                    <td>2</td>
                    <td>Letter spacing for secondary text</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryLetterSpacing</code></td>
                    <td>number</td>
                    <td>2</td>
                    <td>Letter spacing for tertiary text</td>
                  </tr>
                  <tr>
                    <td><code>primaryFontFamily</code></td>
                    <td>string</td>
                    <td>Roboto</td>
                    <td>Font family for primary text</td>
                  </tr>
                  <tr>
                    <td><code>secondaryFontFamily</code></td>
                    <td>string</td>
                    <td>Montserrat</td>
                    <td>Font family for secondary text</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryFontFamily</code></td>
                    <td>string</td>
                    <td>Roboto</td>
                    <td>Font family for tertiary text</td>
                  </tr>
                  <tr>
                    <td><code>primaryTextTransform</code></td>
                    <td>string</td>
                    <td>uppercase</td>
                    <td>Text transform: uppercase, lowercase, capitalize, none</td>
                  </tr>
                  <tr>
                    <td><code>secondaryTextTransform</code></td>
                    <td>string</td>
                    <td>uppercase</td>
                    <td>Text transform: uppercase, lowercase, capitalize, none</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryTextTransform</code></td>
                    <td>string</td>
                    <td>uppercase</td>
                    <td>Text transform: uppercase, lowercase, capitalize, none</td>
                  </tr>
                  <tr>
                    <td><code>scale</code></td>
                    <td>number</td>
                    <td>1</td>
                    <td>Badge size multiplier (0.5-2.0)</td>
                  </tr>
                  <tr>
                    <td><code>borderRadius</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Corner radius in pixels (0-10)</td>
                  </tr>
                  <tr>
                    <td><code>primaryTextDecoration</code></td>
                    <td>string</td>
                    <td>none</td>
                    <td>Text decoration: none, underline, line-through</td>
                  </tr>
                  <tr>
                    <td><code>primaryFontStyle</code></td>
                    <td>string</td>
                    <td>normal</td>
                    <td>Font style: normal, italic</td>
                  </tr>
                  <tr>
                    <td><code>secondaryTextDecoration</code></td>
                    <td>string</td>
                    <td>none</td>
                    <td>Text decoration: none, underline, line-through</td>
                  </tr>
                  <tr>
                    <td><code>secondaryFontStyle</code></td>
                    <td>string</td>
                    <td>normal</td>
                    <td>Font style: normal, italic</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryTextDecoration</code></td>
                    <td>string</td>
                    <td>none</td>
                    <td>Text decoration (3-panel badges only): none, underline, line-through</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryFontStyle</code></td>
                    <td>string</td>
                    <td>normal</td>
                    <td>Font style (3-panel badges only): normal, italic</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="params-section">
              <h3>Advanced Text Styling</h3>
              <p>Apply advanced styling effects to text in each panel. These parameters allow you to add text shadows, rotation, opacity, and font variants.</p>
              <table class="params-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>primaryTextShadowColor</code></td>
                    <td>hex color</td>
                    <td>#000000</td>
                    <td>Shadow color for primary panel text</td>
                  </tr>
                  <tr>
                    <td><code>primaryTextShadowOffsetX</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Horizontal shadow offset in pixels (-10 to 10)</td>
                  </tr>
                  <tr>
                    <td><code>primaryTextShadowOffsetY</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Vertical shadow offset in pixels (-10 to 10)</td>
                  </tr>
                  <tr>
                    <td><code>primaryTextShadowBlur</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Shadow blur radius in pixels (0 to 10)</td>
                  </tr>
                  <tr>
                    <td><code>primaryTextRotation</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Text rotation angle in degrees (-15 to 15)</td>
                  </tr>
                  <tr>
                    <td><code>primaryTextOpacity</code></td>
                    <td>number</td>
                    <td>100</td>
                    <td>Text opacity percentage (0 to 100)</td>
                  </tr>
                  <tr>
                    <td><code>primaryFontVariant</code></td>
                    <td>string</td>
                    <td>normal</td>
                    <td>Font variant: normal, small-caps</td>
                  </tr>
                  <tr>
                    <td><code>secondaryTextShadowColor</code></td>
                    <td>hex color</td>
                    <td>#000000</td>
                    <td>Shadow color for secondary panel text</td>
                  </tr>
                  <tr>
                    <td><code>secondaryTextShadowOffsetX</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Horizontal shadow offset in pixels (-10 to 10)</td>
                  </tr>
                  <tr>
                    <td><code>secondaryTextShadowOffsetY</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Vertical shadow offset in pixels (-10 to 10)</td>
                  </tr>
                  <tr>
                    <td><code>secondaryTextShadowBlur</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Shadow blur radius in pixels (0 to 10)</td>
                  </tr>
                  <tr>
                    <td><code>secondaryTextRotation</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Text rotation angle in degrees (-15 to 15)</td>
                  </tr>
                  <tr>
                    <td><code>secondaryTextOpacity</code></td>
                    <td>number</td>
                    <td>100</td>
                    <td>Text opacity percentage (0 to 100)</td>
                  </tr>
                  <tr>
                    <td><code>secondaryFontVariant</code></td>
                    <td>string</td>
                    <td>normal</td>
                    <td>Font variant: normal, small-caps</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryTextShadowColor</code></td>
                    <td>hex color</td>
                    <td>#000000</td>
                    <td>Shadow color for tertiary panel text (3-panel badges only)</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryTextShadowOffsetX</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Horizontal shadow offset in pixels (-10 to 10)</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryTextShadowOffsetY</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Vertical shadow offset in pixels (-10 to 10)</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryTextShadowBlur</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Shadow blur radius in pixels (0 to 10)</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryTextRotation</code></td>
                    <td>number</td>
                    <td>0</td>
                    <td>Text rotation angle in degrees (-15 to 15)</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryTextOpacity</code></td>
                    <td>number</td>
                    <td>100</td>
                    <td>Text opacity percentage (0 to 100)</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryFontVariant</code></td>
                    <td>string</td>
                    <td>normal</td>
                    <td>Font variant: normal, small-caps</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="params-section">
              <h3>Icon Parameters</h3>
              <p>Add icons to any panel using Simple Icons. Icons are sourced from the <a href="https://simpleicons.org" target="_blank" rel="noopener">Simple Icons</a> library.</p>
              <table class="params-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>primaryIcon</code></td>
                    <td>string</td>
                    <td>-</td>
                    <td>Icon slug for primary panel (e.g., "react", "github", "typescript")</td>
                  </tr>
                  <tr>
                    <td><code>primaryIconColor</code></td>
                    <td>hex color</td>
                    <td>primaryTextColor</td>
                    <td>Color for primary icon</td>
                  </tr>
                  <tr>
                    <td><code>primaryIconSize</code></td>
                    <td>number</td>
                    <td>16</td>
                    <td>Size of primary icon in pixels (12-24 recommended)</td>
                  </tr>
                  <tr>
                    <td><code>primaryIconPosition</code></td>
                    <td>string</td>
                    <td>left</td>
                    <td>Icon position: "left" or "right" of text</td>
                  </tr>
                  <tr>
                    <td><code>secondaryIcon</code></td>
                    <td>string</td>
                    <td>-</td>
                    <td>Icon slug for secondary panel</td>
                  </tr>
                  <tr>
                    <td><code>secondaryIconColor</code></td>
                    <td>hex color</td>
                    <td>secondaryTextColor</td>
                    <td>Color for secondary icon</td>
                  </tr>
                  <tr>
                    <td><code>secondaryIconSize</code></td>
                    <td>number</td>
                    <td>16</td>
                    <td>Size of secondary icon in pixels</td>
                  </tr>
                  <tr>
                    <td><code>secondaryIconPosition</code></td>
                    <td>string</td>
                    <td>left</td>
                    <td>Icon position: "left" or "right" of text</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryIcon</code></td>
                    <td>string</td>
                    <td>-</td>
                    <td>Icon slug for tertiary panel (3-panel badges only)</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryIconColor</code></td>
                    <td>hex color</td>
                    <td>tertiaryTextColor</td>
                    <td>Color for tertiary icon</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryIconSize</code></td>
                    <td>number</td>
                    <td>16</td>
                    <td>Size of tertiary icon in pixels</td>
                  </tr>
                  <tr>
                    <td><code>tertiaryIconPosition</code></td>
                    <td>string</td>
                    <td>left</td>
                    <td>Icon position: "left" or "right" of text</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Response -->
          <section id="response" class="doc-section">
            <h2>Response</h2>
            <p>The API returns an SVG image with the following characteristics:</p>
            <ul>
              <li><strong>Content-Type:</strong> <code>image/svg+xml; charset=utf-8</code></li>
              <li><strong>Format:</strong> Scalable Vector Graphics (SVG)</li>
              <li><strong>Dimensions:</strong> Dynamic width based on text content, fixed 35px height</li>
              <li><strong>Caching:</strong> <code>Cache-Control: public, max-age=31536000, immutable</code></li>
            </ul>
            <p>The SVG is fully rendered and can be used directly in web pages, markdown, or any context that supports SVG images.</p>
          </section>

          <!-- Examples -->
          <section id="examples" class="doc-section">
            <h2>Examples</h2>

            <div class="example-block">
              <h3>Example 1: Simple 2-Panel Badge</h3>
              <p>Create a basic "BUILT WITH" badge:</p>
              <div class="code-block">
                <pre><code>https://forthebadge.com/api/badges/generate?primaryLabel=BUILT&secondaryLabel=WITH</code></pre>
              </div>
              <div class="badge-preview">
                <img :src="exampleBadges.simple" :alt="'Simple badge example'" />
              </div>
            </div>

            <div class="example-block">
              <h3>Example 2: Custom Colors</h3>
              <p>Generate with custom colors:</p>
              <div class="code-block">
                <pre><code>https://forthebadge.com/api/badges/generate?primaryLabel=MADE&secondaryLabel=WITH&primaryBGColor=%23FF6B6B&primaryTextColor=%23FFFFFF&secondaryBGColor=%234ECDC4&secondaryTextColor=%23FFFFFF</code></pre>
              </div>
              <div class="badge-preview">
                <img :src="exampleBadges.colors" :alt="'Custom colors badge example'" />
              </div>
            </div>

            <div class="example-block">
              <h3>Example 3: 3-Panel Badge</h3>
              <p>Create a 3-panel badge:</p>
              <div class="code-block">
                <pre><code>https://forthebadge.com/api/badges/generate?panels=3&primaryLabel=BUILT&secondaryLabel=WITH&tertiaryLabel=LOVE&primaryBGColor=%2331C4F3&secondaryBGColor=%23389AD5&tertiaryBGColor=%232674A4</code></pre>
              </div>
              <div class="badge-preview">
                <img :src="exampleBadges.threePanels" :alt="'3-panel badge example'" />
              </div>
            </div>

            <div class="example-block">
              <h3>Example 4: Badge with Icon</h3>
              <p>Add an icon from Simple Icons (browse at <a href="https://simpleicons.org" target="_blank" rel="noopener">simpleicons.org</a>):</p>
              <div class="code-block">
                <pre><code>https://forthebadge.com/api/badges/generate?panels=2&primaryLabel=Build&secondaryLabel=with+nuxt&primaryBGColor=%2331C4F3&primaryTextColor=%23FFFFFF&secondaryBGColor=%23389AD5&secondaryTextColor=%23FFFFFF&primaryFontSize=12&primaryFontWeight=600&primaryLetterSpacing=2&primaryFontFamily=Roboto&primaryTextTransform=uppercase&secondaryFontSize=12&secondaryFontWeight=900&secondaryLetterSpacing=2&secondaryFontFamily=Montserrat&secondaryTextTransform=uppercase&secondaryIcon=nuxt&secondaryIconColor=%23FFFFFF&secondaryIconSize=16&secondaryIconPosition=right</code></pre>
              </div>
              <div class="badge-preview">
                <img :src="exampleBadges.withIcon" :alt="'Badge with Nuxt icon example'" />
              </div>
            </div>

            <div class="example-block">
              <h3>Example 5: Text Shadow Effect</h3>
              <p>Add dramatic text shadows to make your badges stand out:</p>
              <div class="code-block">
                <pre><code>https://forthebadge.com/api/badges/generate?primaryLabel=POWERED&secondaryLabel=BY+SHADOWS&primaryBGColor=%23FF6B35&secondaryBGColor=%23004E89&primaryTextShadowColor=%23000000&primaryTextShadowOffsetX=2&primaryTextShadowOffsetY=2&primaryTextShadowBlur=4&secondaryTextShadowColor=%2300F5FF&secondaryTextShadowOffsetX=0&secondaryTextShadowOffsetY=0&secondaryTextShadowBlur=8</code></pre>
              </div>
              <div class="badge-preview">
                <img :src="exampleBadges.textShadow" :alt="'Badge with text shadow example'" />
              </div>
            </div>

            <div class="example-block">
              <h3>Example 6: Rotated Text</h3>
              <p>Apply subtle rotation for a dynamic look:</p>
              <div class="code-block">
                <pre><code>https://forthebadge.com/api/badges/generate?primaryLabel=SLIGHTLY&secondaryLabel=TILTED&primaryBGColor=%23FFD23F&primaryTextColor=%23000000&secondaryBGColor=%23EE4266&primaryTextRotation=-5&secondaryTextRotation=5</code></pre>
              </div>
              <div class="badge-preview">
                <img :src="exampleBadges.rotated" :alt="'Badge with rotated text example'" />
              </div>
            </div>

            <div class="example-block">
              <h3>Example 7: Opacity & Small Caps</h3>
              <p>Combine opacity and font variant for sophisticated styling:</p>
              <div class="code-block">
                <pre><code>https://forthebadge.com/api/badges/generate?primaryLabel=Elegant&secondaryLabel=Design&primaryBGColor=%232B2D42&secondaryBGColor=%238D99AE&primaryFontVariant=small-caps&secondaryFontVariant=small-caps&primaryTextOpacity=85&secondaryTextOpacity=90&primaryTextTransform=none&secondaryTextTransform=none</code></pre>
              </div>
              <div class="badge-preview">
                <img :src="exampleBadges.opacity" :alt="'Badge with opacity and small caps example'" />
              </div>
            </div>

            <div class="example-block">
              <h3>Example 8: 3-Panel Advanced Styling</h3>
              <p>Combine multiple advanced effects on a 3-panel badge:</p>
              <div class="code-block">
                <pre><code>https://forthebadge.com/api/badges/generate?panels=3&primaryLabel=ULTRA&secondaryLabel=STYLED&tertiaryLabel=BADGE&primaryBGColor=%23F72585&secondaryBGColor=%237209B7&tertiaryBGColor=%234361EE&primaryTextShadowColor=%23000000&primaryTextShadowOffsetX=1&primaryTextShadowOffsetY=1&primaryTextShadowBlur=2&secondaryFontVariant=small-caps&secondaryTextTransform=none&tertiaryTextRotation=3&tertiaryTextOpacity=95</code></pre>
              </div>
              <div class="badge-preview">
                <img :src="exampleBadges.advancedThreePanel" :alt="'3-panel badge with advanced styling'" />
              </div>
            </div>

            <div class="example-block">
              <h3>Example 9: Glowing Effect</h3>
              <p>Create a glowing effect using blur without offset:</p>
              <div class="code-block">
                <pre><code>https://forthebadge.com/api/badges/generate?primaryLabel=NEON&secondaryLabel=GLOW&primaryBGColor=%23000000&secondaryBGColor=%231A1A1A&primaryTextColor=%2300FFF5&secondaryTextColor=%23FF00FF&primaryTextShadowColor=%2300FFF5&primaryTextShadowOffsetX=0&primaryTextShadowOffsetY=0&primaryTextShadowBlur=10&secondaryTextShadowColor=%23FF00FF&secondaryTextShadowOffsetX=0&secondaryTextShadowOffsetY=0&secondaryTextShadowBlur=10</code></pre>
              </div>
              <div class="badge-preview">
                <img :src="exampleBadges.glow" :alt="'Badge with glowing text effect'" />
              </div>
            </div>

            <div class="example-block">
              <h3>Example 10: Markdown Usage</h3>
              <p>Use any badge in your README with markdown:</p>
              <div class="code-block">
                <pre><code>[![Badge](https://forthebadge.com/api/badges/generate?primaryLabel=BUILT&secondaryLabel=AWESOME)](https://yourproject.com)</code></pre>
              </div>
            </div>

            <div class="example-block">
              <h3>Example 11: HTML Usage</h3>
              <p>Embed badges in HTML:</p>
              <div class="code-block">
                <pre><code>&lt;img src="https://forthebadge.com/api/badges/generate?primaryLabel=BUILT&secondaryLabel=AMAZING" alt="Badge" /&gt;</code></pre>
              </div>
            </div>
          </section>

          <!-- Styling -->
          <section id="styling" class="doc-section">
            <h2>Styling Options</h2>
            <p>The API provides comprehensive styling options to match your brand:</p>
            
            <div class="styling-section">
              <h3>Colors</h3>
              <p>Use any valid hex color code (with or without #). Remember to URL-encode the # symbol as %23:</p>
              <ul>
                <li><code>%23FF0000</code> → Red</li>
                <li><code>%2300FF00</code> → Green</li>
                <li><code>%230000FF</code> → Blue</li>
              </ul>
            </div>

            <div class="styling-section">
              <h3>Text Transform</h3>
              <p>Control how text is displayed:</p>
              <ul>
                <li><code>uppercase</code> - Convert to UPPERCASE (default)</li>
                <li><code>lowercase</code> - Convert to lowercase</li>
                <li><code>capitalize</code> - Capitalize First Letter</li>
                <li><code>none</code> - Keep original casing</li>
              </ul>
            </div>

            <div class="styling-section">
              <h3>Font Families</h3>
              <p>Supported font families include common web-safe fonts. The defaults are:</p>
              <ul>
                <li>Primary: Roboto</li>
                <li>Secondary: Montserrat</li>
                <li>Tertiary: Roboto</li>
              </ul>
            </div>

            <div class="styling-section">
              <h3>Font Sizes and Weights</h3>
              <p>Customize individual panel styling:</p>
              <ul>
                <li>Font sizes can be any positive number (default: 12px)</li>
                <li>Font weights range from 100 (thin) to 900 (black)</li>
                <li>Letter spacing controls the space between characters</li>
              </ul>
            </div>

            <div class="styling-section">
              <h3>Icons</h3>
              <p>Add icons to any panel using Simple Icons:</p>
              <ul>
                <li>Browse available icons at <a href="https://simpleicons.org" target="_blank" rel="noopener">simpleicons.org</a></li>
                <li>Use the icon slug (e.g., "react", "vue", "python") as the icon parameter</li>
                <li>Icons can be positioned left or right of the text</li>
                <li>Icon size can be adjusted from 12-24 pixels (16px default)</li>
                <li>Icon colors default to the panel text color but can be customized</li>
              </ul>
            </div>

            <div class="styling-section">
              <h3>Advanced Text Effects</h3>
              <p>Take your badges to the next level with advanced text styling:</p>
              
              <h4>Text Shadows</h4>
              <ul>
                <li><strong>Shadow Color:</strong> Choose any hex color for the shadow (default: #000000)</li>
                <li><strong>Offset X/Y:</strong> Move the shadow horizontally and vertically (-10 to 10 pixels)</li>
                <li><strong>Blur:</strong> Control shadow softness (0-10 pixels, 0 = sharp, 10 = soft)</li>
                <li><strong>Tip:</strong> Use no offset with high blur to create glowing effects</li>
              </ul>
              
              <h4>Text Rotation</h4>
              <ul>
                <li>Rotate text from -15° to +15° for dynamic, tilted badges</li>
                <li>Subtle rotations (±3-5°) work best for readability</li>
                <li>Different panels can have different rotations for creative effects</li>
              </ul>
              
              <h4>Text Opacity</h4>
              <ul>
                <li>Control text transparency from 0 (fully transparent) to 100 (fully opaque)</li>
                <li>Create watermark effects or subtle text with lower opacity (60-80%)</li>
                <li>Default is 100% opacity</li>
              </ul>
              
              <h4>Font Variant</h4>
              <ul>
                <li><code>normal</code> - Regular text rendering (default)</li>
                <li><code>small-caps</code> - Elegant small capital letters for sophisticated badges</li>
                <li>Works best with <code>textTransform=none</code> or <code>capitalize</code></li>
              </ul>
            </div>
          </section>

          <!-- Error Handling -->
          <section id="errors" class="doc-section">
            <h2>Error Handling</h2>
            <p>The API returns appropriate HTTP status codes and error messages:</p>
            <table class="params-table">
              <thead>
                <tr>
                  <th>Status Code</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>200 OK</code></td>
                  <td>Badge generated successfully</td>
                </tr>
                <tr>
                  <td><code>400 Bad Request</code></td>
                  <td>Missing or invalid parameters (e.g., missing required labels, invalid panel count)</td>
                </tr>
                <tr>
                  <td><code>500 Server Error</code></td>
                  <td>Internal server error while generating badge</td>
                </tr>
              </tbody>
            </table>
          </section>

          <!-- Footer CTA -->
          <section class="doc-footer">
            <canvas ref="particlesCanvas" class="particles-canvas"></canvas>
            <div class="footer-content">
              <NuxtLink to="/generator" class="btn btn-primary">
                <span class="btn-text">TRY THE GENERATOR</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                </svg>
              </NuxtLink>
            </div>
          </section>
        </main>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { isMobileDevice } from '~/utils/deviceDetection';

const activeSection = ref('overview');
const particlesCanvas = ref<HTMLCanvasElement | null>(null);

// Mobile detection
const isMobile = computed(() => {
  if (import.meta.client) {
    return isMobileDevice();
  }
  return false;
});

// Example badge URLs
const exampleBadges = {
  simple: 'https://forthebadge.com/api/badges/generate?primaryLabel=BUILT&secondaryLabel=WITH',
  colors: 'https://forthebadge.com/api/badges/generate?primaryLabel=MADE&secondaryLabel=WITH&primaryBGColor=%23FF6B6B&primaryTextColor=%23FFFFFF&secondaryBGColor=%234ECDC4&secondaryTextColor=%23FFFFFF',
  threePanels: 'https://forthebadge.com/api/badges/generate?panels=3&primaryLabel=BUILT&secondaryLabel=WITH&tertiaryLabel=LOVE&primaryBGColor=%2331C4F3&secondaryBGColor=%23389AD5&tertiaryBGColor=%232674A4',
  withIcon: 'https://forthebadge.com/api/badges/generate?panels=2&primaryLabel=Build&secondaryLabel=with+nuxt&primaryBGColor=%2331C4F3&primaryTextColor=%23FFFFFF&secondaryBGColor=%23389AD5&secondaryTextColor=%23FFFFFF&primaryFontSize=12&primaryFontWeight=600&primaryLetterSpacing=2&primaryFontFamily=Roboto&primaryTextTransform=uppercase&secondaryFontSize=12&secondaryFontWeight=900&secondaryLetterSpacing=2&secondaryFontFamily=Montserrat&secondaryTextTransform=uppercase&secondaryIcon=nuxt&secondaryIconColor=%23FFFFFF&secondaryIconSize=16&secondaryIconPosition=right',
  textShadow: 'https://forthebadge.com/api/badges/generate?primaryLabel=POWERED&secondaryLabel=BY+SHADOWS&primaryBGColor=%23FF6B35&secondaryBGColor=%23004E89&primaryTextShadowColor=%23000000&primaryTextShadowOffsetX=2&primaryTextShadowOffsetY=2&primaryTextShadowBlur=4&secondaryTextShadowColor=%2300F5FF&secondaryTextShadowOffsetX=0&secondaryTextShadowOffsetY=0&secondaryTextShadowBlur=8',
  rotated: 'https://forthebadge.com/api/badges/generate?primaryLabel=SLIGHTLY&secondaryLabel=TILTED&primaryBGColor=%23FFD23F&primaryTextColor=%23000000&secondaryBGColor=%23EE4266&primaryTextRotation=-5&secondaryTextRotation=5',
  opacity: 'https://forthebadge.com/api/badges/generate?primaryLabel=Elegant&secondaryLabel=Design&primaryBGColor=%232B2D42&secondaryBGColor=%238D99AE&primaryFontVariant=small-caps&secondaryFontVariant=small-caps&primaryTextOpacity=85&secondaryTextOpacity=90&primaryTextTransform=none&secondaryTextTransform=none',
  advancedThreePanel: 'https://forthebadge.com/api/badges/generate?panels=3&primaryLabel=ULTRA&secondaryLabel=STYLED&tertiaryLabel=BADGE&primaryBGColor=%23F72585&secondaryBGColor=%237209B7&tertiaryBGColor=%234361EE&primaryTextShadowColor=%23000000&primaryTextShadowOffsetX=1&primaryTextShadowOffsetY=1&primaryTextShadowBlur=2&secondaryFontVariant=small-caps&secondaryTextTransform=none&tertiaryTextRotation=3&tertiaryTextOpacity=95',
  glow: 'https://forthebadge.com/api/badges/generate?primaryLabel=NEON&secondaryLabel=GLOW&primaryBGColor=%23000000&secondaryBGColor=%231A1A1A&primaryTextColor=%2300FFF5&secondaryTextColor=%23FF00FF&primaryTextShadowColor=%2300FFF5&primaryTextShadowOffsetX=0&primaryTextShadowOffsetY=0&primaryTextShadowBlur=10&secondaryTextShadowColor=%23FF00FF&secondaryTextShadowOffsetX=0&secondaryTextShadowOffsetY=0&secondaryTextShadowBlur=10',
};

function scrollTo(sectionId: string) {
  activeSection.value = sectionId;
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Track active section on scroll
const handleScroll = () => {
  const sections = ['overview', 'quickstart', 'endpoint', 'parameters', 'response', 'examples', 'styling', 'errors'];
  
  for (const sectionId of sections) {
    const element = document.getElementById(sectionId);
    if (element) {
      const rect = element.getBoundingClientRect();
      if (rect.top < 200) {
        activeSection.value = sectionId;
      }
    }
  }
};

// Particles animation
let animationId: number;
function initParticles() {
  const canvas = particlesCanvas.value;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const particles: Array<{
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    hue: number;
  }> = [];

  const particleCount = 60;
  const rainbowColors = [
    0,    // Red
    30,   // Orange
    60,   // Yellow
    120,  // Green
    180,  // Cyan
    240,  // Blue
    280,  // Purple
    320,  // Magenta
  ];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      opacity: Math.random() * 0.4 + 0.4,
      hue: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
    });
  }

  function animate() {
    if (!canvas || !ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Slowly shift hue for color animation
      particle.hue = (particle.hue + 0.3) % 360;

      if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
    });

    animationId = requestAnimationFrame(animate);
  }

  animate();
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  if (import.meta.client) {
    initParticles();
    window.addEventListener('resize', () => {
      if (particlesCanvas.value) {
        particlesCanvas.value.width = particlesCanvas.value.offsetWidth;
        particlesCanvas.value.height = particlesCanvas.value.offsetHeight;
      }
    });
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});

definePageMeta({
  layout: false,
});
</script>

<style scoped>
.api-page {
  min-height: 100vh;
  background: #ffffff;
}


.api-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.api-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 3rem;
}

/* Sidebar */
.sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.nav-section h3 {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #000;
  margin: 0 0 0.75rem 0;
}

.nav-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-section a {
  font-size: 0.9rem;
  color: #666;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-left: 2px solid transparent;
  transition: all 0.2s;
  cursor: pointer;
}

.nav-section a:hover {
  color: #000;
  background: #f5f5f5;
}

.nav-section a.active {
  color: #000;
  border-left-color: #000;
  background: #f5f5f5;
  font-weight: 600;
}

/* Content */
.content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  min-width: 0;
  overflow-x: hidden;
}

.doc-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-x: hidden;
}

.doc-section h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #000;
  margin: 0;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e5e5;
}

.doc-section h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #000;
  margin: 1rem 0 0.5rem 0;
}

.doc-section p {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #555;
  margin: 0;
}

.doc-section ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #555;
}

.doc-section li {
  margin: 0.5rem 0;
  line-height: 1.6;
}

code {
  background: #f5f5f5;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9rem;
  color: #d63384;
}

.code-block {
  background: #f5f5f5;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 1rem;
  overflow-x: auto;
  margin: 0.5rem 0;
  max-width: 100%;
}

.code-block pre {
  margin: 0;
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #333;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  word-break: break-all;
}

.code-block code {
  background: none;
  padding: 0;
  color: #333;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.endpoint-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f5f5f5;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  border-left: 4px solid #31C4F3;
}

.method {
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.method.get {
  background: #E3F2FD;
  color: #1976D2;
}

.path {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9rem;
  font-weight: 600;
  color: #000;
}

.params-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.85rem;
  table-layout: fixed;
}

.params-table thead {
  background: #f5f5f5;
  border-bottom: 2px solid #e5e5e5;
}

.params-table th {
  padding: 0.75rem 0.5rem;
  text-align: left;
  font-weight: 600;
  color: #000;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.params-table td {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid #e5e5e5;
  color: #555;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
}

.params-table tbody tr:hover {
  background: #fafafa;
}

.params-section {
  margin: 2rem 0;
}

.params-section h3 {
  margin-top: 0;
}

.badge-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 2rem;
  margin: 1rem 0;
  min-height: 80px;
}

.badge-preview img {
  max-width: 100%;
  height: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
}

.example-block {
  background: #fafafa;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.example-block h3 {
  margin-top: 0;
}

.styling-section {
  margin: 1.5rem 0;
  padding: 1rem;
  background: #fafafa;
  border-left: 4px solid #31C4F3;
  border-radius: 4px;
}

.styling-section h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
}

.styling-section ul {
  margin: 0;
  padding-left: 1.5rem;
}

.doc-footer {
  position: relative;
  background: #f8f8f8;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  margin-top: 3rem;
  overflow: hidden;
}

.particles-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.footer-content {
  position: relative;
  z-index: 1;
}

.badge-style-heading {
  display: inline-flex;
  align-items: stretch;
  justify-content: center;
  margin: 0 0 1rem 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  overflow: hidden;
}

.heading-panel {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.heading-panel.primary {
  background: #000;
  color: white;
  font-weight: 600;
}

.heading-panel.secondary {
  background: white;
  color: #000;
  font-weight: 900;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 900;
  font-size: 0.85rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.btn-text {
  font-weight: 900;
}

.btn-primary {
  background: #000;
  color: white;
}

.btn-primary:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  transform: translateY(-1px);
}

@media (max-width: 1024px) {
  .api-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }

  .sidebar-nav {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
  }

  .nav-section a {
    font-size: 0.85rem;
    padding: 0.4rem 0.75rem;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 2rem 1rem;
  }

  .header-container {
    padding: 0 1rem;
  }

  .header-content h1 {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .api-wrapper {
    padding: 1.5rem 1rem;
  }

  .doc-section h2 {
    font-size: 1.3rem;
    padding-bottom: 0.75rem;
  }

  .doc-section h3 {
    font-size: 1rem;
  }

  .params-table {
    font-size: 0.75rem;
  }

  .params-table th,
  .params-table td {
    padding: 0.5rem 0.4rem;
    min-width: 90px;
  }

  .code-block {
    font-size: 0.7rem;
    padding: 0.75rem;
  }

  .example-block {
    padding: 1rem;
  }

  .sidebar-nav {
    grid-template-columns: repeat(2, 1fr);
  }

  .doc-section p {
    font-size: 0.9rem;
  }

  .doc-section ul {
    font-size: 0.9rem;
  }

  .doc-footer {
    padding: 1.25rem 1rem;
  }
}

@media (max-width: 480px) {
  .api-layout {
    gap: 1.5rem;
  }

  .page-header {
    padding: 1.5rem 1rem;
  }

  .header-content h1 {
    font-size: 1.5rem;
  }

  .api-wrapper {
    padding: 1rem;
  }

  .sidebar-nav {
    grid-template-columns: 1fr;
  }

  .nav-section a {
    font-size: 0.8rem;
    padding: 0.4rem 0.5rem;
  }

  .params-table {
    font-size: 0.7rem;
  }

  .params-table th,
  .params-table td {
    padding: 0.4rem 0.3rem;
    min-width: 70px;
  }

  .code-block {
    font-size: 0.65rem;
    padding: 0.5rem;
  }

  .badge-preview {
    padding: 1rem;
    min-height: 60px;
  }

  .endpoint-box {
    flex-direction: column;
    align-items: flex-start;
  }

  .doc-footer {
    padding: 1rem 0.75rem;
  }

  .btn {
    width: 100%;
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
}
</style>
