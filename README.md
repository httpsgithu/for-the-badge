# For the Badge

[![Built with Nuxt](https://forthebadge.com/api/badges/generate?primaryLabel=BUILT%20WITH&secondaryLabel=NUXT&primaryBGColor=%2331C4F3&secondaryBGColor=%2300DC82)](https://nuxt.com)
[![Deployed on Cloudflare](https://forthebadge.com/api/badges/generate?primaryLabel=DEPLOYED%20ON&secondaryLabel=CLOUDFLARE&primaryBGColor=%23F38020&secondaryBGColor=%23E16A10)](https://workers.cloudflare.com)
[![License: MIT](https://forthebadge.com/api/badges/generate?primaryLabel=LICENSE&secondaryLabel=MIT&primaryBGColor=%23F0C419&secondaryBGColor=%23D4A017)](https://opensource.org/licenses/MIT)
[![Open Collective](https://forthebadge.com/api/badges/generate?primaryLabel=OPEN%20COLLECTIVE&secondaryLabel=SUPPORT%20US&primaryBGColor=%237FADF2&secondaryBGColor=%235D8ED8)](https://opencollective.com/forthebadge)

**Badges for badges' sake.**

🌐 **Live Site:** [forthebadge.com](https://forthebadge.com)

## Features

- 🎨 **Custom Badge Creator** - Design badges with custom text, colors, and icons
- 📦 **Pre-made Badges** - Browse a library of ready-to-use badges
- 🏆 **Developer Awards** - Earn and display achievement badges
- 👤 **User Accounts** - Save and manage your badge collections
- 🔗 **Easy Sharing** - Copy badge URLs or download as images

## Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com) (Vue 3)
- **Deployment:** [Cloudflare Workers](https://workers.cloudflare.com) via [NuxtHub](https://hub.nuxt.com)
- **Database:** [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite)
- **KV Storage:** [Cloudflare KV](https://developers.cloudflare.com/kv/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team)
- **Auth:** [nuxt-auth-utils](https://github.com/Atinux/nuxt-auth-utils)
- **Security:** [nuxt-security](https://nuxt-security.vercel.app)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [Yarn](https://yarnpkg.com/) (via Corepack)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (for Cloudflare deployment)

### Installation

```bash
# Enable Corepack for Yarn
corepack enable

# Clone the repository
git clone https://github.com/forthebadge/for-the-badge.git
cd for-the-badge

# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env
# Edit .env with your values
```

### Development

```bash
# Start development server
yarn dev
```

The app will be available at `http://localhost:3000`.

### Building

```bash
# Build for production
yarn build

# Preview production build locally
yarn preview
```

## Configuration

### Environment Variables

See [`.env.example`](.env.example) for all available configuration options.

**Required variables:**
- `NUXT_SESSION_PASSWORD` - Session encryption password
- `PASSWORD_PEPPER` - Additional password hashing security
- `ACCOUNT_HMAC_SECRET` - HMAC secret for account operations
- `BADGE_ENCRYPTION_KEY` - Encryption key for badge data
- `REFERRAL_SQIDS_ALPHABET` - Alphabet for generating referral IDs

### Cloudflare Setup

1. Create a D1 database:
   ```bash
   wrangler d1 create forthebadge
   ```

2. Create a KV namespace:
   ```bash
   wrangler kv:namespace create KV
   ```

3. Update `wrangler.jsonc` with your database and KV IDs

4. Set secrets:
   ```bash
   wrangler secret put NUXT_SESSION_PASSWORD
   wrangler secret put PASSWORD_PEPPER
   wrangler secret put ACCOUNT_HMAC_SECRET
   wrangler secret put BADGE_ENCRYPTION_KEY
   wrangler secret put REFERRAL_SQIDS_ALPHABET
   ```

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start development server |
| `yarn build` | Build for production |
| `yarn preview` | Preview production build |
| `yarn test` | Run tests |
| `yarn test:coverage` | Run tests with coverage |
| `yarn db:generate` | Generate database migrations |
| `yarn security:check` | Run security audits |

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Security

For security concerns, please see [SECURITY.md](SECURITY.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you find For the Badge useful, consider supporting us on [Open Collective](https://opencollective.com/forthebadge).

## Acknowledgments

- Original [For the Badge](https://forthebadge.com) concept
- All our [contributors](https://github.com/forthebadge/for-the-badge/graphs/contributors)
- The Nuxt and Cloudflare communities
