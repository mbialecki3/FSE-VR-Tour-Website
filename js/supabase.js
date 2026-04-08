import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Your actual Supabase Project URL and Anon Key
const supabaseUrl = 'https://eqpxmmbtkdqahkhzkytw.supabase.co'; 
const supabaseKey = 'sb_publishable_0aVhp2Owdebx5jgkV2Wp3A_ov0j0oMr';
export const supabase = createClient(supabaseUrl, supabaseKey);

function getSessionId() {
  let sessionId = localStorage.getItem('vr_tour_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('vr_tour_session_id', sessionId);
  }
  return sessionId;
}

export const sessionId = getSessionId();

export async function trackEvent(eventType, sceneId = null, metadata = {}) {
  const { error } = await supabase
    .from('analytics_events')
    .insert([{ session_id: sessionId, event_type: eventType, scene_id: sceneId, metadata: metadata }]);
  if (error) console.error('Error tracking event:', error);
}

export async function submitFeedback(sceneId, isHelpful, rating = null, comment = null) {
  const { error } = await supabase
    .from('scene_feedback')
    .insert([{ session_id: sessionId, scene_id: sceneId, is_helpful: isHelpful, rating: rating, comment: comment }]);
  if (error) {
    console.error('Error submitting feedback:', error);
    return false;
  }
  return true;
}

trackEvent('page_view');

// ==========================================
// FEEDBACK UI LOGIC (UPDATED FOR STARS)
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
const stars = document.querySelectorAll('.star'); // Grab the stars!

let isHelpfulSelection = null;
let selectedRating = null; // New variable to store 1-5 rating

function getCurrentSceneId() {
  const activeSceneLi = document.querySelector('#scene-list li.active');
  return activeSceneLi ? activeSceneLi.dataset.sceneId : 'unknown_scene';
}

if (feedbackToggleBtn) {
  feedbackToggleBtn.addEventListener('click', () => {
    feedbackModal.classList.toggle('hidden');
  });

  closeFeedbackBtn.addEventListener('click', () => {
    feedbackModal.classList.add('hidden');
  });

  const handleHelpfulClick = (isHelpful) => {
    isHelpfulSelection = isHelpful;
    btnYes.classList.toggle('selected', isHelpful === true);
    btnNo.classList.toggle('selected', isHelpful === false);
    feedbackExtra.classList.remove('hidden'); 
  };

  btnYes.addEventListener('click', () => handleHelpfulClick(true));
  btnNo.addEventListener('click', () => handleHelpfulClick(false));

  // --- STAR RATING LOGIC ---
  stars.forEach(star => {
    // Highlight stars on hover
    star.addEventListener('mouseover', function() {
      const val = parseInt(this.getAttribute('data-value'));
      stars.forEach(s => {
        const sVal = parseInt(s.getAttribute('data-value'));
        s.classList.toggle('hovered', sVal <= val);
      });
    });

    // Remove hover highlights when mouse leaves
    star.addEventListener('mouseout', function() {
      stars.forEach(s => s.classList.remove('hovered'));
    });

    // Lock in the rating on click
    star.addEventListener('click', function() {
      selectedRating = parseInt(this.getAttribute('data-value'));
      stars.forEach(s => {
        const sVal = parseInt(s.getAttribute('data-value'));
        s.classList.toggle('selected', sVal <= selectedRating);
      });
    });
  });

  // --- SUBMIT LOGIC ---
  submitFeedbackBtn.addEventListener('click', async () => {
    if (isHelpfulSelection === null) return;
    
    const sceneId = getCurrentSceneId();
    const comment = feedbackComment.value.trim();

    submitFeedbackBtn.disabled = true;
    submitFeedbackBtn.innerText = 'Submitting...';

    // Call the function with the selectedRating!
    const success = await submitFeedback(sceneId, isHelpfulSelection, selectedRating, comment);

    if (success) {
      document.querySelector('.feedback-helpful-btns').style.display = 'none';
      feedbackExtra.style.display = 'none';
      feedbackSuccess.classList.remove('hidden');
      document.querySelector('#feedback-content p').style.display = 'none';
      
      setTimeout(() => {
        feedbackModal.classList.add('hidden');
        feedbackToggleBtn.style.display = 'none'; 
      }, 2000);
    } else {
      submitFeedbackBtn.disabled = false;
      submitFeedbackBtn.innerText = 'Error. Try Again.';
    }
  });
}