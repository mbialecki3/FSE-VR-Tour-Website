import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Your actual Supabase Project URL and Anon Key
const supabaseUrl = 'https://eqpxmmbtkdqahkhzkytw.supabase.co'; 
const supabaseKey = 'sb_publishable_0aVhp2Owdebx5jgkV2Wp3A_ov0j0oMr';
export const supabase = createClient(supabaseUrl, supabaseKey);

// Generate or retrieve an anonymous session ID to track repeat visits without personal info
function getSessionId() {
  let sessionId = localStorage.getItem('vr_tour_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('vr_tour_session_id', sessionId);
  }
  return sessionId;
}

export const sessionId = getSessionId();

/**
 * Track an analytics event
 * @param {string} eventType - e.g., 'page_view', 'scene_view', 'hotspot_click'
 * @param {string} sceneId - e.g., 'library', 'cafeteria' (optional)
 * @param {object} metadata - Any extra data you want to store (optional)
 */
export async function trackEvent(eventType, sceneId = null, metadata = {}) {
  const { error } = await supabase
    .from('analytics_events')
    .insert([
      { session_id: sessionId, event_type: eventType, scene_id: sceneId, metadata: metadata }
    ]);
  
  if (error) console.error('Error tracking event:', error);
}

/**
 * Submit feedback for a specific scene
 * @param {string} sceneId - e.g., 'library'
 * @param {boolean} isHelpful - true or false
 * @param {number} rating - 1 to 5 (optional)
 * @param {string} comment - User's comment (optional)
 */
export async function submitFeedback(sceneId, isHelpful, rating = null, comment = null) {
  const { error } = await supabase
    .from('scene_feedback')
    .insert([
      { session_id: sessionId, scene_id: sceneId, is_helpful: isHelpful, rating: rating, comment: comment }
    ]);
    
  if (error) {
    console.error('Error submitting feedback:', error);
    return false;
  }
  return true;
}

// Automatically track a page view when this script loads
trackEvent('page_view');

// ==========================================
// FEEDBACK UI LOGIC
// ==========================================

const feedbackToggleBtn = document.getElementById('feedback-toggle-btn');
const feedbackModal = document.getElementById('feedback-modal');
const closeFeedbackBtn = document.getElementById('close-feedback-btn');
const btnYes = document.getElementById('btn-helpful-yes');
const btnNo = document.getElementById('btn-helpful-no');
const feedbackExtra = document.getElementById('feedback-extra');
const submitFeedbackBtn = document.getElementById('submit-feedback-btn');
const feedbackSuccess = document.getElementById('feedback-success');
const feedbackComment = document.getElementById('feedback-comment');

let isHelpfulSelection = null;

// Helper function: Find out which scene the user is currently looking at
function getCurrentSceneId() {
  // Your app.js adds the 'active' class to the sidebar list item of the current scene
  const activeSceneLi = document.querySelector('#scene-list li.active');
  return activeSceneLi ? activeSceneLi.dataset.sceneId : 'unknown_scene';
}

if (feedbackToggleBtn) {
  // 1. Open/Close Modal
  feedbackToggleBtn.addEventListener('click', () => {
    feedbackModal.classList.toggle('hidden');
  });

  closeFeedbackBtn.addEventListener('click', () => {
    feedbackModal.classList.add('hidden');
  });

  // 2. Handle Yes/No Clicks
  const handleHelpfulClick = (isHelpful) => {
    isHelpfulSelection = isHelpful;
    btnYes.classList.toggle('selected', isHelpful === true);
    btnNo.classList.toggle('selected', isHelpful === false);
    feedbackExtra.classList.remove('hidden'); // Show comment box
  };

  btnYes.addEventListener('click', () => handleHelpfulClick(true));
  btnNo.addEventListener('click', () => handleHelpfulClick(false));

  // 3. Handle Submit
  submitFeedbackBtn.addEventListener('click', async () => {
    if (isHelpfulSelection === null) return;
    
    const sceneId = getCurrentSceneId();
    const comment = feedbackComment.value.trim();

    // Disable button to prevent double-clicks
    submitFeedbackBtn.disabled = true;
    submitFeedbackBtn.innerText = 'Submitting...';

    // Call the function we wrote earlier
    const success = await submitFeedback(sceneId, isHelpfulSelection, null, comment);

    if (success) {
      // Hide the form, show success message
      document.querySelector('.feedback-helpful-btns').style.display = 'none';
      feedbackExtra.style.display = 'none';
      feedbackSuccess.classList.remove('hidden');
      document.querySelector('#feedback-content p').style.display = 'none';
      
      // Auto-close modal after 2 seconds
      setTimeout(() => {
        feedbackModal.classList.add('hidden');
        feedbackToggleBtn.style.display = 'none'; // Hide the button completely for this scene so they don't spam
      }, 2000);
    } else {
      submitFeedbackBtn.disabled = false;
      submitFeedbackBtn.innerText = 'Error. Try Again.';
    }
  });
}
