# Miss Marshmallow's 18th Birthday Surprise

This is a premium, 3D interactive birthday website built with React, Vite, Tailwind CSS, React Three Fiber, and Framer Motion.

## 📸 How to Add Photos

1. Go to the `public/photos/` folder.
2. Add your 4 photos.
3. Rename them exactly like this: `01.jpg`, `02.jpg`, `03.jpg`, `04.jpg`.
4. Ensure they are `.jpg` files.
5. The 3D Photo Galaxy will automatically use these 4 photos and repeat them beautifully 15 times!
6. In Scene 8 (The Letter), it currently loads `01.jpg`. You can change this in `src/scenes/TheLetter.tsx` if you prefer a different photo.

## 🎵 How to Add Background Music

1. Go to the `public/` folder.
2. Place your instrumental background music file here.
3. Name it `instrumental.mp3`.
4. The music starts playing automatically when the "Open your surprise" button is clicked.

## 🚀 How to Deploy to Vercel

If you want to host this website live (for free) on Vercel:
1. Push this code to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
3. Click **Add New... > Project**.
4. Import your new repository.
5. Vercel will automatically detect Vite and build the site. Click **Deploy**.
6. You will receive a live `.vercel.app` link to share!

## ✍️ How to Edit Text

All the text for the balloons, the 18 stars, and the final letter can be found in `src/config.ts`. You can edit this file to personalize the messages further.
