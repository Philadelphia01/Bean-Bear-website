# Cloudinary Setup Guide

## Step 1: Get Your Cloudinary Credentials

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Sign in or create an account
3. Copy your **Cloud Name** from the dashboard

## Step 2: Create an Upload Preset

1. In Cloudinary Dashboard, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure:
   - **Preset name**: `menu-items-upload` (or any name you prefer)
   - **Signing mode**: Select **Unsigned** (for client-side uploads)
   - **Folder**: `menu-items` (optional, but recommended)
   - **Allowed formats**: Select image formats (jpg, png, gif, webp)
   - **Max file size**: 5MB (or your preference)
5. Click **Save**

## Step 3: Create Environment Variables

Create a `.env` file in the `Main Website` folder with the following:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name_here
```

**Example:**
```env
VITE_CLOUDINARY_CLOUD_NAME=my-coffee-shop
VITE_CLOUDINARY_UPLOAD_PRESET=menu-items-upload
```

## Step 4: Restart Your Development Server

After creating the `.env` file, restart your Vite development server:

```bash
npm run dev
```

## How to Use

1. Go to **Admin Dashboard** → **Menu Management**
2. Click **Add New Item** or edit an existing item
3. Click **Upload to Cloudinary** button
4. Select an image file (JPG, PNG, GIF, WebP - max 5MB)
5. The image will be uploaded and the URL will be automatically filled in
6. Or manually enter an image URL if you prefer

## Security Notes

- The upload preset should be **unsigned** for client-side uploads
- For production, consider using signed uploads with a backend API for better security
- Never commit your `.env` file to version control (it's already in `.gitignore`)

## Troubleshooting

- **"Cloudinary configuration is missing"**: Make sure your `.env` file exists and has the correct variable names
- **Upload fails**: Check that your upload preset is set to "Unsigned" mode
- **Image not showing**: Verify the uploaded URL is accessible and the image format is supported

