```markdown
# AEOS Visualizer

A powerful data visualization tool that transforms raw data into beautiful, animated infographics using AI-powered insights.

![AEOS Visualizer](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200)

## Features

- 🎨 Beautiful, animated visualizations
- 📊 Multiple chart types (Pie, Bar, Treemap)
- 🎯 AI-powered data insights
- 🌙 Dark/Light mode
- 🎬 Video export capabilities
- 📱 Responsive design
- 🔄 Real-time updates
- 💾 Data labeling and analysis

## Quick Start

1. Clone and install dependencies:

```bash
git clone https://github.com/yourusername/aeos-visualizer.git
cd aeos-visualizer
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage Guide

### Data Input

1. Enter your data in one of two formats:
   - Text input: "30% for Category A, 45% for Category B, 25% for Category C"
   - File upload: Upload a CSV or text file with your data

2. Click "Generate" to create your visualization

### Customization Options

- **Chart Types**: Switch between Pie, Bar, and Treemap visualizations
- **Themes**: Choose from multiple color themes
- **Dark/Light Mode**: Toggle between dark and light interfaces
- **Animation Styles**: Select different animation styles for your charts

### Exporting

1. **Image Export**
   - Click "Export Image" to save as PNG
   - High-resolution output with transparent background

2. **Video Export**
   - Click "Export Video"
   - Choose quality (up to 4K)
   - Select animation style
   - Set duration
   - Export as WebM video

### Data Insights

The system automatically generates:
- Key insights about your data
- Distribution analysis
- Trend predictions
- Market analysis
- Growth indicators

## Project Structure

```
src/
├── components/        # React components
├── hooks/            # Custom React hooks
├── types/            # TypeScript definitions
└── utils/            # Utility functions
    ├── dataProcessor/  # Data processing logic
    └── videoExporter/  # Video export functionality
```

## Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide Icons
- HTML-to-Image
- Canvas Capture

## Browser Support

- Chrome (recommended for video export)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```