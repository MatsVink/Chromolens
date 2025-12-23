# ChronoLens: Time Travel Photo Booth

ChronoLens is an AI-powered experimental application that transports your likeness across the corridors of time. By leveraging Google's advanced Gemini models, the app seamlessly blends your portrait into historically accurate or imaginative futuristic scenes.

## 🚀 Key Features

- **Instant Time Travel**: Select from a curated list of eras including Ancient Egypt, Medieval Fantasy, Victorian London, and a Cyberpunk 2099 future.
- **AI-Powered Image Synthesis**: Uses `gemini-2.5-flash-image` to "re-imagine" your photo while maintaining your unique facial features.
- **Magic Editor**: A text-driven editing suite where you can refine results with natural language prompts (e.g., "Add a golden crown" or "Make it a charcoal sketch").
- **Temporal Analysis**: Utilize `gemini-3-pro-preview` to analyze images, providing detailed descriptions of clothing, historical accuracy, and stylistic elements.
- **Seamless Capture**: Integrated camera functionality and file upload support for instant results.
- **High-Quality Export**: Download your temporal portraits directly to your device.

## 🛠️ Technical Stack

- **Framework**: [React](https://react.dev/) (v19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **AI Engine**: [Google Gemini API](https://ai.google.dev/) via `@google/genai`
- **Icons**: [Lucide React](https://lucide.dev/)

## 📖 How to Use

1. **Enter the Booth**: Allow camera access or upload a photo from your local storage.
2. **Select an Epoch**: Navigate the "Time Travel" tab to pick a destination. Wait a few moments as the AI crafts your historical avatar.
3. **Refine Your Reality**: Use the "Editor" tab to type custom instructions if you want to tweak specific details of the generated image.
4. **Deep Dive**: Switch to the "Analyze" tab to generate a detailed report on the visual and historical components of your photo.
5. **Preserve the Moment**: Click the "Download" button to save your journey through time.

## ⚙️ Configuration

The application requires a Google Gemini API Key. In this environment, it is automatically provided through `process.env.API_KEY`.

## 🛡️ Permissions

This app requests the following permissions:
- **Camera**: To allow real-time photo capture for the "Time Travel" experience.
