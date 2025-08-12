const mongoose = require('mongoose');
const Video = require('../models/Video');
require('dotenv').config();

// Helper function to generate URL slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
}

async function migrateVideoSlugs() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/deepminds-research-lab');
    console.log('✅ Connected to MongoDB');

    // Find all videos without slugs
    const videosWithoutSlugs = await Video.find({ 
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: '' }
      ]
    });

    console.log(`📹 Found ${videosWithoutSlugs.length} videos without slugs`);

    if (videosWithoutSlugs.length === 0) {
      console.log('✅ All videos already have slugs');
      process.exit(0);
    }

    // Generate slugs for each video
    for (const video of videosWithoutSlugs) {
      let baseSlug = generateSlug(video.title);
      let slug = baseSlug;
      let counter = 1;

      // Ensure slug uniqueness
      while (await Video.findOne({ slug, _id: { $ne: video._id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Update the video with the new slug
      await Video.updateOne(
        { _id: video._id },
        { $set: { slug } }
      );

      console.log(`✅ Updated "${video.title}" with slug: "${slug}"`);
    }

    console.log(`🎉 Successfully migrated ${videosWithoutSlugs.length} video slugs`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the migration
migrateVideoSlugs();