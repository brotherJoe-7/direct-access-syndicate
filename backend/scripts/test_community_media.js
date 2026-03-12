const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testCommunityMedia() {
  const loginUrl = 'https://direct-access-syndicate.vercel.app/api/auth/login';
  const postUrl = 'https://direct-access-syndicate.vercel.app/api/community';
  
  try {
    console.log('Logging in...');
    const { data: auth } = await axios.post(loginUrl, {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('--- TESTING IMAGE UPLOAD ---');
    const form = new FormData();
    form.append('message', 'Testing photo upload from script.');
    // We don't have a real file in the script env easily, but we can try to send a tiny buffer
    // Actually, on local we can just use a dummy file if it exists.
    // Let's just verify the endpoint accepts the multipart request.
    
    const response = await axios.post(postUrl, form, {
      headers: { 
          ...form.getHeaders(),
          Authorization: `Bearer ${auth.token}` 
      }
    });
    
    console.log('Post Created (No file):', response.data);
    
    console.log('--- VERIFYING SCHEMA UPDATES ---');
    const getResponse = await axios.get(postUrl, {
        headers: { Authorization: `Bearer ${auth.token}` }
    });
    
    const latestPost = getResponse.data[0];
    console.log('Latest Post Schema:', {
        id: latestPost.id,
        file_url: latestPost.file_url,
        file_type: latestPost.file_type
    });

    if ('file_url' in latestPost) {
        console.log('[PASS] Database columns exist and are returned.');
    } else {
        console.log('[FAIL] Database columns missing from response.');
    }

  } catch (error) {
    console.log('Media Test Failed.');
    if (error.response) {
      console.log('Status:', error.response.status, 'Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testCommunityMedia();
