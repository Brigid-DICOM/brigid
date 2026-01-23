# Brigid Video

This package uses [Remotion](https://www.remotion.dev/) to create a promotional video for Brigid.

## Setup

1. Install dependencies from the root:
   ```bash
   pnpm install
   ```

2. Start the preview:
   ```bash
   pnpm --filter @brigid/video start
   ```

3. Render the video:
   ```bash
   pnpm --filter @brigid/video build
   ```

## Structure

- `src/Root.tsx`: The entry point for Remotion, defining compositions.
- `src/Composition.tsx`: The main video content and animations.
- `src/components/`: Reusable video components.
