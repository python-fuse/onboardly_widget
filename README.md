# 🎯 Onboardly Widget

A lightweight, beautiful product tour library for guiding users through your web application.

## Features

- ✨ **Beautiful UI** - Stunning tooltips with smooth animations
- 🎨 **Smart Spotlight** - Highlights elements with elegant overlays
- 📱 **Fully Responsive** - Works seamlessly on all devices
- ⚡ **Lightweight** - Tiny bundle size with zero dependencies
- 🧠 **Smart Positioning** - Automatically adjusts tooltip placement
- 💾 **State Persistence** - Remembers tour progress with localStorage
- 📊 **Analytics Ready** - Built-in event tracking

## Quick Start

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Then open http://localhost:5174/test.html to see the demo.

### Build

```bash
pnpm build
```

The compiled library will be in the `dist/` folder.

## Usage

### 1. Include the Widget

Add the widget script to your website's `<body>`.

**For Production (CDN / Hosting):**
```html
<script src="https://your-cdn-domain.com/onboardly.js"></script>
```

**For Local Development:**
```html
<script src="./dist/onboardly.js"></script>
```

### 2. Initialize the Tour

Initialize the widget with your configuration after the page loads.

```html
<script>
  window.addEventListener('load', function() {
    if (window.TourWidget) {
      window.TourWidget.initWithConfig({
        tourId: 'my-app-tour',
        autoStart: true,
        steps: [
          {
            id: 'step-1',
            targetSelector: '#welcome-element',
            title: 'Welcome!',
            content: 'This is the first step of your tour.',
            placement: 'bottom'
          },
          // ... more steps
        ]
      });
    }
  });
</script>
```

### Development Mode (ES Modules)

For contributing to the library itself, you can use ES modules directly:

```html
<script type="module">
  import "/src/main.ts";
  // ... initialization logic
</script>
```

## Deployment

For detailed instructions on building, hosting, and testing the widget in production, please see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

## Configuration

### TourConfig

```typescript
interface TourConfig {
  tourId: string; // Unique identifier for the tour
  steps: TourStep[]; // Array of tour steps
  autoStart?: boolean; // Auto-start the tour (default: false)
  showProgress?: boolean; // Show step progress (default: true)
  allowSkip?: boolean; // Allow skipping the tour (default: true)
}
```

### TourStep

```typescript
interface TourStep {
  id: string; // Unique step identifier
  targetSelector: string; // CSS selector for target element
  title: string; // Step title
  content: string; // Step content/description
  placement?: "top" | "bottom" | "left" | "right"; // Tooltip position
  action?: "click" | "hover" | "focus" | "none"; // Interaction type
}
```

## API Methods

### `TourWidget.init(tourId: string)`

Load tour configuration from a remote endpoint.

```javascript
await TourWidget.init("my-tour-id");
```

### `TourWidget.initWithConfig(config: TourConfig)`

Initialize tour with inline configuration.

```javascript
await TourWidget.initWithConfig({
  tourId: "inline-tour",
  autoStart: true,
  steps: [
    /* ... */
  ],
});
```

## Project Structure

```
widget/
├── src/
│   ├── main.ts              # Entry point
│   ├── core/
│   │   ├── tourEngine.ts    # Main tour orchestration
│   │   ├── stepManager.ts   # Step state management
│   │   └── configLoader.ts  # Config loading
│   ├── ui/
│   │   ├── Spotlight.ts     # Element highlighting
│   │   └── Tooltip.ts       # Tooltip component
│   ├── utils/
│   │   └── dom.ts          # DOM utilities
│   ├── analytics/
│   │   └── index.ts        # Event tracking
│   └── types/
│       └── index.ts        # TypeScript definitions
├── test.html               # Demo page
├── vite.config.ts         # Build configuration
└── package.json
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
