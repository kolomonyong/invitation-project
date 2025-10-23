# Deployment Guide for Invitation Project

This guide outlines the steps to deploy your Next.js invitation project to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com/) account
2. A [Supabase](https://supabase.com/) project (already set up)
3. Your project code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Pre-deployment Steps

### 1. ESLint Configuration

The ESLint configuration has been updated in `eslint.config.mjs` to disable specific rules causing warnings during build. This should resolve the deployment errors you were encountering.

### 2. Environment Variables

Make sure to add the following environment variables in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### 3. Images Configuration

The Next.js configuration (`next.config.ts`) has been set up to allow images from your Supabase storage.

## Deployment Steps

1. **Connect your Git repository to Vercel**:

   - Log in to Vercel
   - Click "Add New" > "Project"
   - Select your Git repository
   - Click "Import"

2. **Configure project settings**:

   - Select the framework preset: "Next.js"
   - Build and Output Settings: Leave as default
   - Root Directory: `./` (project root)
   - Add environment variables (from step 2 above)

3. **Deploy**:
   - Click "Deploy"
   - Wait for the build and deployment to complete

## Post-deployment Steps

1. **Test your application**:

   - Verify that all pages load correctly
   - Test the invitation creation flow
   - Test the RSVP functionality

2. **Set up a custom domain (optional)**:
   - In your Vercel project dashboard, go to "Settings" > "Domains"
   - Add your custom domain and follow the verification steps

## Troubleshooting

If you encounter build errors:

1. Check the Vercel build logs for specific errors
2. Ensure all environment variables are correctly set
3. If you see ESLint errors despite the configuration, you may need to further modify the ESLint configuration

## Regular Maintenance

For future deployments:

1. Push your changes to your Git repository
2. Vercel will automatically deploy the changes
3. Check the deployment logs for any issues
