// Danh sách từ cấm - các comment chứa từ này sẽ được flag
const BANNED_WORDS = [
  // Nhóm từ tục tiểu/bộ phận nhạy cảm (Tiếng Việt)
  'đm', 'đcm', 'đmm', 'đmcc', 'đêck', 'đệt', 'đỵt', 'địt', 'vcl', 'vcll', 'vl', 'cc', 'cac', 'cặc', 
  'cáu', 'cứt', 'buồi', 'bòi', 'lồn', 'loz', 'lờ', 'nứng', 'gạ chịch', 'đụ', 'đụ mẹ', 'đụ má', 
  'con cặc', 'thằng cặc', 'cái lồn', 'dcm', 'cl', 'củ cặc', 'cái l', 'đm m', 'địt mẹ', 'địt cha', 
  'địt cụ', 'cặc chó', 'vãi lồn', 'vãi lol', 'vãi đái', 'vãi cặc', 'chim', 'cu', 'bướm',

  // Nhóm từ miệt thị/xúc phạm
  'chó chết', 'ngu như chó', 'thằng chó', 'con đĩ', 'đĩ', 'điếm', 'óc chó', 'đầu bò', 'bố láo', 
  'cặn bã', 'thối nát', 'đồ ngu', 'óc lợn', 'đần độn', 'hãm', 'hãm l', 'hãm lồn', 'dốt', 'ngu', 
  'bất hiếu', 'súc vật', 'thằng điên', 'con điên', 'rác rưởi', 'ăn hại', 'phế vật', 'bại não',

  // Nhóm từ tiếng Anh
  'fuck', 'fucker', 'fucking', 'shit', 'shitty', 'bitch', 'asshole', 'dick', 'pussy', 'cunt', 'whore', 
  'slut', 'bastard', 'motherfucker', 'nigga', 'nigger', 'faggot', 'cock', 'dickhead', 'jerk', 'wanker', 
  'douche', 'douchebag', 'moron', 'idiot', 'stupid', 'retard', 'hoe', 'choad', 'blowjob', 'handjob', 'anal',

  // Nhóm từ lóng/viết lại
  'dkm', 'dmm', 'clgt', 'vll', 'l', 'c', 'f.u.c.k', 's.h.i.t', 'c.a.c', 'đ m', 'd.m', 'đ.m', 
  'djt', 'đjt'
];

/**
 * Kiểm tra xem comment có chứa từ cấm không
 * @param {string} text - Nội dung comment
 * @returns {boolean} true nếu chứa từ cấm
 */
function containsBannedWords(text) {
  if (!text) return false;
  
  const lowerText = text.toLowerCase().trim();
  
  // Kiểm tra từ khóa
  for (const word of BANNED_WORDS) {
    // Dùng regex để match toàn từ (không match substring)
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b|${word}`, 'gi');
    if (regex.test(lowerText)) {
      return true;
    }
  }
  
  return false;
}

module.exports = {
  BANNED_WORDS,
  containsBannedWords
};
