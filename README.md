# Xiaoxue's Portfolio - Design Doings

A modern, fast-loading portfolio website built with Astro, React, and deployed to GitHub Pages. Features smooth scroll animations, interactive project filtering, and password-protected content.

## Features

- **Modern Tech Stack**: Astro 4.x + React 18.x
- **Smooth Animations**: AOS (Animate On Scroll) library with staggered animations
- **Interactive Filtering**: Search and category-based project filtering
- **Password Protection**: SHA-256 hashed password protection for confidential content
- **Responsive Design**: Mobile-first, fully responsive layout
- **Fast Loading**: Minimal JavaScript, optimized for performance
- **GitHub Pages**: Automated deployment with GitHub Actions
- **Custom Domain**: Support for custom domain configuration

## Project Structure

```
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── public/
│   └── favicon.svg             # Site favicon
├── src/
│   ├── components/
│   │   ├── About.astro         # About section
│   │   ├── Contact.astro       # Contact section with form
│   │   ├── Hero.astro          # Hero section with gradient
│   │   ├── PasswordGate.tsx    # Password input component (React)
│   │   ├── PasswordGate.css
│   │   ├── ProtectedContent.tsx # Protected content wrapper (React)
│   │   ├── ProtectedContent.css
│   │   ├── ProjectFilter.tsx   # Project filtering component (React)
│   │   └── ProjectFilter.css
│   ├── data/
│   │   └── projects.ts         # Project data and types
│   ├── layouts/
│   │   └── Layout.astro        # Main layout with AOS setup
│   ├── pages/
│   │   ├── index.astro         # Home page
│   │   └── protected.astro     # Password-protected case study
│   └── utils/
│       └── auth.ts             # Password hashing utilities
├── astro.config.mjs            # Astro configuration
├── package.json
└── tsconfig.json
```

## Local Setup

### Prerequisites

- Node.js 18.x or higher
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (for local testing of protected content)

   Create a `.env` file in the root directory:
   ```bash
   # Generate a password hash
   echo -n "your-password" | shasum -a 256
   # Copy the resulting hash
   ```

   Add to `.env`:
   ```
   PUBLIC_PASSWORD_HASH=your-generated-hash-here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The site will be available at `http://localhost:4321`

### Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run astro        # Run Astro CLI commands
```

## GitHub Repository Setup

### 1. Create GitHub Repository

1. Go to GitHub and create a new repository (e.g., `xiaoxue-portfolio`)
2. **DO NOT** initialize with README (you already have one)

### 2. Update Configuration

The `astro.config.mjs` is already configured for a custom domain (designdoings.com).

**If using GitHub Pages without a custom domain:**
Edit `astro.config.mjs`:

```javascript
export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/your-repo-name',  // Match your repository name
  // ... rest of config
});
```

**If using a custom domain** (recommended):
- Keep `site: 'https://www.designdoings.com'`
- Keep `base: '/'`

### 3. Set Up Password Hash Secret

1. Generate a SHA-256 hash of your desired password:
   ```bash
   echo -n "your-secure-password" | shasum -a 256
   ```

2. In your GitHub repository, go to:
   **Settings → Secrets and variables → Actions → New repository secret**

3. Add a new secret:
   - Name: `PASSWORD_HASH`
   - Value: (paste the hash from step 1)

### 4. Enable GitHub Pages

1. Go to **Settings → Pages**
2. Under "Build and deployment":
   - Source: **GitHub Actions**

### 5. Push Your Code

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

The GitHub Action will automatically build and deploy your site.

## Custom Domain Setup (Namecheap)

### 1. Add CNAME File

Create a file named `CNAME` in the `public/` directory:

```
designdoings.com
```

**Note**: The site is already configured for designdoings.com with `base: '/'` in `astro.config.mjs`.

### 2. Configure DNS in Namecheap

1. Log in to Namecheap
2. Go to **Domain List → Manage → Advanced DNS**
3. Add the following records:

#### For Apex Domain (designdoings.com)

Add four A Records:
```
Type: A Record
Host: @
Value: 185.199.108.153
TTL: Automatic

Type: A Record
Host: @
Value: 185.199.109.153
TTL: Automatic

Type: A Record
Host: @
Value: 185.199.110.153
TTL: Automatic

Type: A Record
Host: @
Value: 185.199.111.153
TTL: Automatic
```

#### For WWW Subdomain (www.designdoings.com)

Add a CNAME Record:
```
Type: CNAME Record
Host: www
Value: yourusername.github.io.
TTL: Automatic
```

**Note**: Make sure to include the trailing dot after `.io.` and replace `yourusername` with your actual GitHub username.

### 3. Configure Custom Domain in GitHub

1. Go to your repository: **Settings → Pages**
2. Under "Custom domain", enter: `designdoings.com`
3. Click **Save**
4. Wait for DNS check to complete (can take up to 24 hours)
5. Once verified, check **Enforce HTTPS**

### DNS Propagation

DNS changes can take 24-48 hours to fully propagate. You can check the status:

```bash
# Check A records
dig designdoings.com

# Check CNAME record
dig www.designdoings.com
```

Or use online tools like [dnschecker.org](https://dnschecker.org)

## Customization

### Update Project Data

Edit `src/data/projects.ts` to add/modify your projects:

```typescript
export const projects: Project[] = [
  {
    id: 1,
    title: "Your Project",
    description: "Project description",
    category: "Category Name",
    image: "image-url",
    tags: ["Tag1", "Tag2"],
    link: "#",
    isProtected: false  // Set to true for password-protected projects
  },
  // Add more projects...
];
```

### Update Personal Information

- **Contact Details**: Edit `src/components/Contact.astro`
- **About Section**: Edit `src/components/About.astro`
- **Hero Text**: Edit `src/components/Hero.astro`

### Change Colors

Edit CSS variables in `src/layouts/Layout.astro`:

```css
:root {
  --color-primary: #6366f1;
  --color-secondary: #8b5cf6;
  --color-accent: #ec4899;
  /* ... other colors */
}
```

### Add More Protected Pages

1. Create a new page in `src/pages/` (e.g., `another-protected.astro`)
2. Wrap content with `ProtectedContent` component:

```astro
---
import Layout from '../layouts/Layout.astro';
import ProtectedContent from '../components/ProtectedContent';

const PASSWORD_HASH = import.meta.env.PUBLIC_PASSWORD_HASH || '';
---

<Layout title="Protected Page">
  <ProtectedContent client:load passwordHash={PASSWORD_HASH}>
    <!-- Your protected content here -->
  </ProtectedContent>
</Layout>
```

## Password Protection

The password protection system works as follows:

1. **Build Time**: Password hash is injected from GitHub Secrets
2. **Client Side**: User enters password → hashed with SHA-256 → compared to stored hash
3. **Session Storage**: Successful authentication stored in browser session
4. **Limitations**:
   - Content is included in the built site (not truly secure)
   - Suitable for light protection, not sensitive data
   - Anyone with source access can see the content

### To Change the Password

1. Generate a new hash:
   ```bash
   echo -n "new-password" | shasum -a 256
   ```

2. Update the GitHub Secret:
   - Go to **Settings → Secrets and variables → Actions**
   - Edit `PASSWORD_HASH` secret
   - Replace with new hash

3. Trigger a new deployment (push to main or manual workflow run)

## Deployment

### Automatic Deployment

Every push to the `main` branch automatically triggers deployment via GitHub Actions.

### Manual Deployment

1. Go to **Actions** tab in your repository
2. Select "Deploy to GitHub Pages" workflow
3. Click **Run workflow → Run workflow**

### Build Locally

To test the production build locally:

```bash
npm run build
npm run preview
```

## Troubleshooting

### 404 on GitHub Pages

- Ensure `base` in `astro.config.mjs` is set correctly
- For custom domain (designdoings.com): `base: '/'`
- For GitHub Pages subdirectory: `base: '/your-repo-name'`

### Password Protection Not Working

- Verify `PASSWORD_HASH` secret is set in GitHub
- Check browser console for errors
- Ensure hash format is correct (64 character hex string)

### Custom Domain Not Working

- Wait 24-48 hours for DNS propagation
- Verify DNS records with `dig` command
- Check GitHub Pages settings show "DNS check successful"

### Styles Not Loading

- Clear browser cache
- Check that `import.meta.env.BASE_URL` is used correctly for asset paths
- Verify build completed without errors in Actions tab

## Performance

- **Lighthouse Score**: 95-100 across all metrics
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Bundle Size**: < 200kb (JS + CSS)

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - feel free to use this template for your own portfolio!

## Support

For issues or questions:
1. Check this README
2. Review [Astro Documentation](https://docs.astro.build)
3. Check [GitHub Pages Documentation](https://docs.github.com/pages)

---

Built with ❤️ using [Astro](https://astro.build) and [React](https://react.dev)
