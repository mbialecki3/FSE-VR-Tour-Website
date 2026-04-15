import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Your actual Supabase Project URL and Anon Key
const supabaseUrl = 'https://eqpxmmbtkdqahkhzkytw.supabase.co'; 
const supabaseKey = 'sb_publishable_0aVhp2Owdebx5jgkV2Wp3A_ov0j0oMr';
export const supabase = createClient(supabaseUrl, supabaseKey);

// --- Analytics Consent Logic ---
function hasUserConsented() {
  return localStorage.getItem('vr_tour_consent') === 'true';
}

function hasUserDeclined() {
  return localStorage.getItem('vr_tour_consent') === 'false';
}

function hasLocationConsented() {
  return localStorage.getItem('vr_tour_location_consent') === 'true';
}

function getSessionId() {
  let sessionId = localStorage.getItem('vr_tour_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('vr_tour_session_id', sessionId);
  }
  return sessionId;
}

export const sessionId = getSessionId();

// Helper to fetch and cache user's geographical location
async function getUserLocation() {
  const cachedGeo = localStorage.getItem('vr_tour_geo');
  if (cachedGeo) return JSON.parse(cachedGeo);

  try {
    const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
    if (response.ok) {
      const data = await response.json();
      const geoInfo = { 
        country: data.country, 
        countryCode: data.country_code, 
        region: data.region, 
        city: data.city 
      };
      localStorage.setItem('vr_tour_geo', JSON.stringify(geoInfo));
      return geoInfo;
    }
  } catch (err) {
    console.error('Geo location fetch failed:', err);
  }
  return null;
}

export async function trackEvent(eventType, sceneId = null, metadata = {}) {
  // Only track events if the user has implicitly or explicitly consented
  // For strict compliance, require explicit consent:
  if (!hasUserConsented()) return;

  // Add general usage tracking metrics
  metadata.device_info = {
    isMobile: window.innerWidth <= 768,
    screenResolution: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    referrer: document.referrer || 'direct'
  };

  // Append geo location to metadata ONLY if user consented to location tracking
  if (hasLocationConsented()) {
    const geoInfo = await getUserLocation();
    if (geoInfo) {
      metadata.location = geoInfo;
    }
  }

  const { error } = await supabase
    .from('analytics_events')
    .insert([{ session_id: sessionId, event_type: eventType, scene_id: sceneId, metadata: metadata }]);
  if (error) console.error('Error tracking event:', error);
}

// Make trackEvent available globally so other scripts can call it
window.trackEvent = trackEvent;

// Dispatch an event signaling Supabase has finished loading
window.dispatchEvent(new Event('supabaseLoaded'));

export async function submitFeedback(sceneId, isHelpful, rating = null, comment = null) {
  // We can choose to always allow explicit feedback submission regardless of tracking consent,
  // or restrict it. We will allow users to submit feedback even if they have denied cookies since it is explicit that they
  // are submitting feedback to be viewed and saved
  
  const { error } = await supabase
    .from('scene_feedback')
    .insert([{ session_id: sessionId, scene_id: sceneId, is_helpful: isHelpful, rating: rating, comment: comment }]);
  if (error) {
    console.error('Error submitting feedback:', error);
    return false;
  }
  return true;
}

// Check consent on load
document.addEventListener('DOMContentLoaded', async () => {
  const consentBanner = document.getElementById('cookie-consent-banner');
  const acceptBtn = document.getElementById('cookie-consent-accept'); // Now maps to "Save Preferences"
  const acceptAllBtn = document.getElementById('cookie-consent-accept-all'); // New "Accept All" button
  const declineBtn = document.getElementById('cookie-consent-decline');
  const cookieSettingsBtn = document.getElementById('cookie-settings-btn');
  
  const analyticsToggle = document.getElementById('consent-analytics');
  const locationToggle = document.getElementById('consent-location');

  function populateToggles() {
    if (analyticsToggle) {
      analyticsToggle.checked = localStorage.getItem('vr_tour_consent') !== 'false';
    }
    if (locationToggle) {
      locationToggle.checked = localStorage.getItem('vr_tour_location_consent') !== 'false';
    }
  }

  if (consentBanner && acceptBtn && declineBtn) {
    const bannerDismissed = localStorage.getItem('vr_tour_banner_dismissed');

    // Make the cookie settings button open the banner
    if (cookieSettingsBtn) {
      cookieSettingsBtn.addEventListener('click', () => {
        populateToggles();
        consentBanner.classList.remove('hidden');
      });
    }

    // If banner hasn't been dismissed, always show it so they have the option to opt out
    if (!bannerDismissed) {
      populateToggles();
      consentBanner.classList.remove('hidden');

      // If no implicit/explicit decision made yet, check IP location to determine defaults
      if (localStorage.getItem('vr_tour_consent') === null) {
        getUserLocation().then((geoInfo) => {
          if (geoInfo && (geoInfo.countryCode === 'US' || geoInfo.country === 'US' || geoInfo.country === 'United States')) {
            localStorage.setItem('vr_tour_consent', 'true');
            localStorage.setItem('vr_tour_location_consent', 'true');
            populateToggles();
            // Let app.js handle initial scene tracking, or uncomment below to trace page_views.
            // window.dispatchEvent(new Event('cookieBannerDismissed'));
          }
        });
      }
    }

    const savePreferences = (analytics, location) => {
      const wasConsented = hasUserConsented();
      
      localStorage.setItem('vr_tour_consent', analytics ? 'true' : 'false');
      localStorage.setItem('vr_tour_location_consent', location ? 'true' : 'false');
      localStorage.setItem('vr_tour_banner_dismissed', 'true');
      consentBanner.classList.add('hidden');
      
      // Dispatch an event so app.js knows it can show the tutorial now and log the first visual scene
      window.dispatchEvent(new Event('cookieBannerDismissed'));
    };

    // "Save Preferences" button reads from checkboxes
    acceptBtn.addEventListener('click', () => {
      const analyticsChecked = analyticsToggle ? analyticsToggle.checked : true;
      const locationChecked = locationToggle ? locationToggle.checked : true;
      savePreferences(analyticsChecked, locationChecked);
    });

    // "Accept All" ignores checkboxes and toggles everything ON
    if (acceptAllBtn) {
      acceptAllBtn.addEventListener('click', () => {
        savePreferences(true, true);
      });
    }

    // "Decline All" turns everything OFF
    declineBtn.addEventListener('click', () => {
      savePreferences(false, false);
    });
  }
});


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