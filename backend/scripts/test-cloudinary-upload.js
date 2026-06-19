import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with inline credentials
cloudinary.config({
  cloud_name: 'dxg4xvaim',  // ← replace this
  api_key: '528624773755853',  // ← replace this
  api_secret: 'chd5lnbgLsRaNWVbdEhlg4OisZU',  // ← replace this
});

console.log('=== Cloudinary Onboarding Test ===\n');

async function testCloudinaryIntegration() {
  try {
    console.log('Step 1: Uploading image from Cloudinary demo...');
    
    // Upload a sample image from Cloudinary's demo domain
    const demoImageUrl = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
    
    const uploadResult = await cloudinary.uploader.upload(demoImageUrl, {
      folder: 'saborfit-test',
      public_id: 'test-upload-' + Date.now(),
    });

    console.log('✅ Upload successful!');
    console.log(`   Secure URL: ${uploadResult.secure_url}`);
    console.log(`   Public ID: ${uploadResult.public_id}`);
    console.log();

    console.log('Step 2: Getting image details...');
    
    // Fetch image details
    const resource = await cloudinary.api.resource(uploadResult.public_id);
    
    console.log('✅ Image metadata:');
    console.log(`   Width: ${resource.width}px`);
    console.log(`   Height: ${resource.height}px`);
    console.log(`   Format: ${resource.format}`);
    console.log(`   File Size: ${resource.bytes} bytes`);
    console.log();

    console.log('Step 3: Transforming image...');
    
    // f_auto: automatically selects the best format (WebP, AVIF, etc.) based on the browser
    // q_auto: automatically optimizes quality while maintaining visual appearance
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      transformation: [
        { fetch_format: 'auto', quality: 'auto' }
      ]
    });

    console.log('Done! Click link below to see optimized version of the image. Check the size and the format.');
    console.log(`Transformed URL: ${transformedUrl}`);
    console.log();

    console.log('=== TEST COMPLETED SUCCESSFULLY ===');
    
    // Cleanup: delete the test image
    await cloudinary.uploader.destroy(uploadResult.public_id);
    console.log('Test image cleaned up.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testCloudinaryIntegration();
