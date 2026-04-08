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