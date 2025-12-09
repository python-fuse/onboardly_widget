# Deployment & Testing Guide

This guide describes how to build, deploy, and test the Onboardly widget on live websites.

## 1. Build the Widget

To create the production-ready bundle, run:

```bash
pnpm build
```

This command generates the following file:
- `dist/onboardly.js`: The self-contained widget script (includes all logic and styles).

## 2. Hosting the Widget

To use the widget on external sites, you need to host the `onboardly.js` file so it's accessible via a URL.

### Option A: Static Hosting (Netlify, Vercel, Cloudflare Pages)
1. Upload the `dist/onboardly.js` file to your hosting provider.
2. Note the public URL (e.g., `https://my-cdn.com/onboardly.js`).

### Option B: S3 / Cloud Storage
1. Upload `dist/onboardly.js` to a public bucket.
2. Ensure permissions allow public read access.
3. Use the file's public URL.

## 3. Integrating on Websites

Add the following code to the `<body>` of any website where you want the tour to appear.

Replace `https://your-domain.com/onboardly.js` with your actual hosted URL.

```html
<!-- 1. Load the Widget -->
<script src="https://your-domain.com/onboardly.js"></script>

<!-- 2. Configure & Start Tour -->
<script>
  window.addEventListener('load', function() {
    if (window.TourWidget) {
      window.TourWidget.initWithConfig({
        tourId: 'my-onboarding-tour',
        autoStart: true,
        steps: [
          {
            id: 'step-1',
            targetSelector: '#header-logo', // Change this to a valid selector on your site
            title: 'Welcome!',
            content: 'This is the start of your journey.',
            placement: 'bottom'
          },
          // Add more steps here...
        ]
      });
    }
  });
</script>
```

## 4. Testing the Build Locally

Before deploying, you can verify the built artifact works correctly.

1. Create a `test-build.html` file in your project root:
   ```html
   <!DOCTYPE html>
   <html>
   <head><title>Build Test</title></head>
   <body>
     <h1 id="demo-target">Hello World</h1>
     
     <!-- Point to the local dist file -->
     <script src="./dist/onboardly.js"></script>
     
     <script>
       window.addEventListener('load', () => {
         window.TourWidget.initWithConfig({
           tourId: 'test-tour',
           steps: [
             {
               id: '1',
               targetSelector: '#demo-target',
               title: 'It Works!',
               content: 'The production build is loading correctly.',
               placement: 'bottom'
             }
           ]
         });
       });
     </script>
   </body>
   </html>
   ```

2. Open this file in your browser directly (or via a simple server like `npx serve .`).

## Troubleshooting

- **Styles Missing?** 
  The widget injects its own styles dynamically. If styles are missing, check if `onboardly.js` loaded successfully in the Network tab.
  
- **CORS Errors?**
  If hosting on a text CDN, ensure it supports Cross-Origin Resource Sharing (CORS) if you fetch configs remotely, though `initWithConfig` (local config) generally avoids this.
