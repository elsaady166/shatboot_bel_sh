/**
 * مساعد أكاديمية الشروق - Chatbot
 */


// الكود بيجهّز نفسه عشان يعرف يتحكم في كل حاجة في الصفحة.

const DOM = {
  sidebar: document.getElementById("sidebar"),
  toggleSidebarBtn: document.getElementById("toggleSidebar"),
  rightSidebar: document.getElementById("rightSidebar"),
  toggleRightSidebarBtn: document.getElementById("toggleRightSidebar"),
  overlay: document.getElementById("overlay"),
  chatInput: document.getElementById("chatInput"),
  sendButton: document.getElementById("sendButton"),
  refreshButton: document.getElementById("refreshButton"),
  chatMessages: document.getElementById("chatMessages"),
  suggestedPrompts: document.getElementById("suggestedPrompts"),
  typingIndicator: document.getElementById("typingIndicator"),
  previousChats: document.getElementById("previousChats"),
  newChatButton: document.getElementById("newChatButton"),
  mainContent: document.getElementById("mainContent"),
  welcomeMessage: document.getElementById("welcomeMessage"),
  themeToggle: document.getElementById("themeToggle")
};

// يعني AppState بيحفظ كل التفاصيل عشان الكود يعرف إيه اللي بيحصل.

const AppState = {
  userId: `user_${Math.random().toString(36).substr(2, 9)}`,
  currentConversationId: `conv_${Math.random().toString(36).substr(2, 9)}`,
  conversations: {},
  currentMessages: [],
  isBotTyping: false,
  sidebarOpen: false,
  rightSidebarOpen: false,
  conversationStarted: false,
  darkMode: localStorage.getItem("darkMode") === "true",
  API_URL: "https://sha-bot.onrender.com/chat"
};


//  الدالة دي زي اللي بتفتح الشغل  وتجهّز كل حاجة.
//  الدالة دي بتعمل كل حاجة عشان تجهز الصفحة وتخليها جاهزة للاستخدام.
// بتربط كل الأزرار مع الوظائف بتاعتها.
// بتخلي كل حاجة جاهزة عشان المستخدم يقدر يتفاعل مع الصفحة.

function initApp() {
  setupEventListeners();
  loadConversations();
  checkDarkMode();
  setupSuggestedPrompts();
  if (Object.keys(AppState.conversations).length === 0) {
    addSampleConversations();
  }
}



//  الدالة دي بتربط كل الأزرار مع الوظائف بتاعتها.
function setupEventListeners() {
  DOM.toggleSidebarBtn.addEventListener("click", toggleSidebar);
  DOM.toggleRightSidebarBtn.addEventListener("click", toggleRightSidebar);
  DOM.overlay.addEventListener("click", closeSidebars);
  DOM.sendButton.addEventListener("click", sendMessage);
  DOM.refreshButton.addEventListener("click", clearInput);
  DOM.newChatButton.addEventListener("click", startNewChat);
  DOM.themeToggle.addEventListener("click", toggleDarkMode);
  
  DOM.chatInput.addEventListener("input", adjustChatInputHeight);
  DOM.chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
  
  window.addEventListener("resize", handleResize);
}



//  الدالة دي بتغير ارتفاع صندوق الكتابة عشان يتناسب مع النص اللي فيه.
//  الدالة دي بتخلي صندوق الكتابة يتناسب مع النص اللي فيه عشان يبقى شكله حلو.
function adjustChatInputHeight() {
  DOM.chatInput.style.height = "auto";
  DOM.chatInput.style.height = `${Math.min(DOM.chatInput.scrollHeight, 100)}px`;
}



//  الدالة دي بتغير شكل الصفحة من الوضع الداكن للفاتح والعكس.
function toggleDarkMode() {
  AppState.darkMode = !AppState.darkMode;
  document.body.classList.toggle("dark-mode", AppState.darkMode);
  localStorage.setItem("darkMode", AppState.darkMode);
  updateThemeToggleText();
}



//  الدالة دي بتغير شكل الأيقونة بتاعة الوضع الداكن والفاتح.

function updateThemeToggleText() {
  const themeIcon = DOM.themeToggle.querySelector("i");
  const themeText = DOM.themeToggle.querySelector("span");
  if (AppState.darkMode) {
    themeIcon.className = "fas fa-sun";
    themeText.textContent = "الوضع الفاتح";
  } else {
    themeIcon.className = "fas fa-moon";
    themeText.textContent = "الوضع الداكن";
  }
}



//  الدالة دي بتضيف محادثات تجريبية عشان المستخدمين يعرفوا إزاي يستخدموا التطبيق.

function addSampleConversations() {
  const sampleConv1 = "conv_sample1";
  const sampleConv2 = "conv_sample2";
  AppState.conversations[sampleConv1] = {
    title: "ما هي مواد علوم حاسب؟",
    messages: [
      { messageId: `msg_${Math.random().toString(36).substr(2, 9)}`, sender: "user", text: "ما هي مواد علوم حاسب؟", timestamp: new Date().toISOString() },
      { messageId: `msg_${Math.random().toString(36).substr(2, 9)}`, sender: "bot", text: "تشمل مواد علوم الحاسب: البرمجة، هياكل البيانات، قواعد البيانات، شبكات الحاسب، نظم التشغيل، هندسة البرمجيات، الذكاء الاصطناعي، وأمن المعلومات.", timestamp: new Date().toISOString() }
    ],
    timestamp: new Date().toISOString(),
  };
  AppState.conversations[sampleConv2] = {
    title: "كيفية التحويل إلى أكاديمية الشروق",
    messages: [
      { messageId: `msg_${Math.random().toString(36).substr(2, 9)}`, sender: "user", text: "كيفية التحويل إلى أكاديمية الشروق والأوراق المطلوبة؟", timestamp: new Date().toISOString() },
      { messageId: `msg_${Math.random().toString(36).substr(2, 9)}`, sender: "bot", text: "للتحويل إلى أكاديمية الشروق تحتاج إلى: شهادة الثانوية العامة، صورة من بطاقة الرقم القومي، صور شخصية، وملء استمارة التحويل. يمكنك زيارة مكتب القبول بالأكاديمية للمزيد من المعلومات.", timestamp: new Date().toISOString() }
    ],
    timestamp: new Date().toISOString(),
  };
  saveConversations();
  updateConversationsList();
}



//    الدالة دي بتفتح أو تقفل الشريط الجانبي الشمال 
//  الدالة دي بتفتح أو تقفل الشريط الجانبي الشمال على حسب حالته الحالية.

function toggleSidebar() {
  AppState.sidebarOpen = !AppState.sidebarOpen;
  if (AppState.sidebarOpen) {
    DOM.sidebar.classList.add("open");
    DOM.mainContent.classList.add("sidebar-open");
    DOM.overlay.classList.add("active");
    if (AppState.rightSidebarOpen) toggleRightSidebar();
  } else {
    closeSidebar();
  }
}


//  الدالة دي بتفتح أو تقفل الشريط الجانبي اليمين
//  الدالة دي بتفتح أو تقفل الشريط الجانبي اليمين على حسب حالته الحالية.

function toggleRightSidebar() {
  AppState.rightSidebarOpen = !AppState.rightSidebarOpen;
  if (AppState.rightSidebarOpen) {
    DOM.rightSidebar.classList.add("open");
    DOM.mainContent.classList.add("right-sidebar-open");
    DOM.overlay.classList.add("active");
    if (AppState.sidebarOpen) toggleSidebar();
  } else {
    closeRightSidebar();
  }
}


//  الدالة دي بتقفل الشريط الجانبي الشمال
//  الدالة دي بتقفل الشريط الجانبي الشمال لو كان مفتوح.

function closeSidebar() {
  AppState.sidebarOpen = false;
  DOM.sidebar.classList.remove("open");
  DOM.mainContent.classList.remove("sidebar-open");
  if (!AppState.rightSidebarOpen) DOM.overlay.classList.remove("active");
}

//  الدالة دي بتقفل الشريط الجانبي اليمين
//  الدالة دي بتقفل الشريط الجانبي اليمين لو كان مفتوح.
function closeRightSidebar() {
  AppState.rightSidebarOpen = false;
  DOM.rightSidebar.classList.remove("open");
  DOM.mainContent.classList.remove("right-sidebar-open");
  if (!AppState.sidebarOpen) DOM.overlay.classList.remove("active");
}


//  الدالة دي بتقفل الشريطين الجانبيين لو كانوا مفتوحين.

function closeSidebars() {
  closeSidebar();
  closeRightSidebar();
}


//  الدالة دي بتخلي المستخدم يختار من بين مجموعة من الاقتراحات عشان يسهل عليه الكتابة.
//  الدالة دي بتضيف حدث click لكل زر من الأزرار اللي فيها اقتراحات.
function setupSuggestedPrompts() {
  const promptButtons = document.querySelectorAll(".prompt-button");
  promptButtons.forEach((button) => {
    button.addEventListener("click", () => {
      DOM.chatInput.value = button.textContent.trim();
      DOM.chatInput.focus();
      adjustChatInputHeight();
    });
  });
}


//  الدالة دي بتخلي المستخدم يكتب رسالة جديدة ويبعثها للسيرفر.
//  الدالة دي بتتحقق لو كان فيه رسالة مكتوبة، لو مفيش بتوقف التنفيذ.
//  لو فيه رسالة مكتوبة، بتبدأ محادثة جديدة لو مفيش محادثة شغالة.
//  بعد كده بتضيف الرسالة للمحادثة الحالية وبتخلي المستخدم يشوفها.

async function sendMessage() {
  const messageText = DOM.chatInput.value.trim();
  if (!messageText || AppState.isBotTyping) return;
  if (!AppState.conversationStarted) startConversation();
  const messageId = `msg_${Math.random().toString(36).substr(2, 9)}`;
  const userMessage = { messageId, sender: "user", text: messageText, timestamp: new Date().toISOString() };
  AppState.currentMessages.push(userMessage);
  addMessageToChat(userMessage);
  DOM.chatInput.value = "";
  adjustChatInputHeight();
  showTypingIndicator();
  try {
    const botResponse = await sendToAPI(userMessage);
    AppState.currentMessages.push(botResponse);
    addMessageToChat(botResponse);
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage = { messageId: `msg_${Math.random().toString(36).substr(2, 9)}`, sender: "bot", text: "عذرًا، السيرفر غير متاح حاليًا. حاول مرة أخرى لاحقًا. ", timestamp: new Date().toISOString() };
    AppState.currentMessages.push(errorMessage);
    addMessageToChat(errorMessage);
  } finally {
    hideTypingIndicator();
  }
  saveCurrentConversation();
}



//  الدالة دي بتبدأ المحادثة الجديدة.
//  الدالة دي بتخلي المستخدم يقدر يتفاعل مع المحادثة ويبدأ يتكلم مع البوت.
//  الدالة دي بتخفي الرسالة الترحيبية وبتخفي الاقتراحات.

function startConversation() {
  AppState.conversationStarted = true;
  DOM.welcomeMessage.style.display = "none";
  hideSuggestedPrompts();
}



//  الدالة دي بتضيف الرسالة للمحادثة الحالية وبتخليها تظهر في الشاشة.
//  الدالة دي بتضيف زر عشان ينسخ الرسالة لو المستخدم عايز.

function addMessageToChat(message) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", message.sender === "user" ? "user-message" : "bot-message");
  messageElement.setAttribute("data-message-id", message.messageId);
  const messageText = document.createElement("span");
  messageText.classList.add("message-text");
  messageText.textContent = message.text;
  messageElement.appendChild(messageText);
  const copyButton = document.createElement("button");
  copyButton.classList.add("copy-icon");
  copyButton.innerHTML = '<i class="fas fa-clone"></i>';
  copyButton.addEventListener("click", () => copyMessage(message.text));
  messageElement.appendChild(copyButton);
  DOM.chatMessages.appendChild(messageElement);
  scrollToBottom();
}


//  الدالة دي بتنسخ الرسالة اللي المستخدم عايز ينسخها.
//  الدالة دي بتستخدم واجهة Clipboard API عشان تنسخ النص للوحة المفاتيح.  
//  الدالة دي بتظهر رسالة في الكونسول لو النسخ تم بنجاح، أو بتظهر رسالة خطأ لو النسخ فشل
function copyMessage(message) {
  navigator.clipboard.writeText(message).then(() => {
    console.log("تم نسخ الرسالة:", message);
  }).catch(err => {
    console.error("فشل في النسخ:", err);
  });
}


//  الدالة دي بتظهر مؤشر الكتابة عشان تبين إن البوت شغال.
//  الدالة دي بتخلي المستخدم يعرف إن البوت شغال وبيكتب رد.

function showTypingIndicator() {
  AppState.isBotTyping = true;
  DOM.typingIndicator.style.display = "flex";
  scrollToBottom();
}


//  الدالة دي بتخفي مؤشر الكتابة بعد ما البوت يخلص كتابة الرد.
function hideTypingIndicator() {
  AppState.isBotTyping = false;
  DOM.typingIndicator.style.display = "none";
}


//  الدالة دي بتبعت الرسالة للسيرفر عشان البوت يرد.
//  الدالة دي بتستخدم Fetch API عشان تبعت الطلب للسيرفر.

async function sendToAPI(userMessage) {
  const response = await fetch(AppState.API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: AppState.userId,
      conversationId: AppState.currentConversationId,
      messageId: userMessage.messageId,
      message: userMessage.text,
      timestamp: userMessage.timestamp
    })
  });
  if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
  const data = await response.json();
  return { messageId: `msg_${Math.random().toString(36).substr(2, 9)}`, sender: "bot", text: data.response, timestamp: new Date().toISOString() };
}



// الدالة دي بتخزن المحادثة الحالية في التخزين المحلي عشان المستخدم يقدر يرجع لها بعدين.

function saveCurrentConversation() {
  if (AppState.currentMessages.length > 0) {
    const firstUserMessage = AppState.currentMessages.find(msg => msg.sender === "user");
    const title = firstUserMessage ? firstUserMessage.text : "محادثة جديدة";
    AppState.conversations[AppState.currentConversationId] = {
      title: title.length > 30 ? title.substring(0, 30) + "..." : title,
      messages: [...AppState.currentMessages],
      timestamp: new Date().toISOString()
    };
    saveConversations();
    updateConversationsList();
  }
}


// الدالة دي بتخزن المحادثات في التخزين المحلي. 
function saveConversations() {
  localStorage.setItem(`conversations_${AppState.userId}`, JSON.stringify(AppState.conversations));
}



//  الدالة دي بتخزن المحادثات القديمة من التخزين المحلي عشان المستخدم يقدر يرجع لها بعدين.
function loadConversations() {
  const savedConversations = localStorage.getItem(`conversations_${AppState.userId}`);
  if (savedConversations) {
    AppState.conversations = JSON.parse(savedConversations);
    updateConversationsList();
  }
}


//  الدالة دي بتحدث قائمة المحادثات القديمة عشان تظهر المحادثات اللي اتخزنت.

function updateConversationsList() {
  while (DOM.previousChats.firstChild) DOM.previousChats.removeChild(DOM.previousChats.firstChild);
  const sortedConversations = Object.entries(AppState.conversations).sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp));
  sortedConversations.forEach(([id, conversation]) => {
    const chatItem = document.createElement("div");
    chatItem.classList.add("chat-item");
    chatItem.setAttribute("data-conversation-id", id);
    if (id === AppState.currentConversationId) chatItem.classList.add("active");
    const chatText = document.createElement("span");
    chatText.textContent = conversation.title;
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-chat");
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteConversation(id);
    });
    chatItem.appendChild(chatText);
    chatItem.appendChild(deleteButton);
    chatItem.addEventListener("click", () => loadConversation(id));
    DOM.previousChats.appendChild(chatItem);
  });
}

//  الدالة دي بتظهر رسالة تأكيد قبل ما تحذف المحادثة.
let conversationToDelete = null;
function deleteConversation(conversationId) {
  conversationToDelete = conversationId;
  document.getElementById("deleteConfirmModal").style.display = "flex";
  document.getElementById("confirmDeleteButton").focus();
}


//  الدالة دي بتفتح المحادثة القديمة اللي المستخدم اختارها.
function loadConversation(conversationId) {
  if (AppState.conversations[conversationId]) {
    AppState.currentConversationId = conversationId;
    AppState.currentMessages = [...AppState.conversations[conversationId].messages];
    while (DOM.chatMessages.firstChild) DOM.chatMessages.removeChild(DOM.chatMessages.firstChild);
    DOM.welcomeMessage.style.display = "none";
    hideSuggestedPrompts();
    AppState.conversationStarted = true;
    AppState.currentMessages.forEach((message) => addMessageToChat(message));
    updateConversationsList();
    if (isMobile()) closeSidebar();
  }
}

//  الدالة دي بتخلي الاقتراحات تختفي لو المستخدم مش عايزها.
function hideSuggestedPrompts() {
  DOM.suggestedPrompts.style.display = "none";
}

// الدالة دي بتخلي الاقتراحات تظهر لو المستخدم عايزها.
function showSuggestedPrompts() {
  DOM.suggestedPrompts.style.display = "flex";
}

//  الدالة دي بتخلي المستخدم يكتب رسالة جديدة ويبعثها للسيرفر.
function clearInput() {
  DOM.chatInput.value = "";
  adjustChatInputHeight();
  DOM.chatInput.focus();
}

//  الدالة دي بتبدأ محادثة جديدة.
function startNewChat() {
  saveCurrentConversation();
  resetChat();
  AppState.currentConversationId = `conv_${Math.random().toString(36).substr(2, 9)}`;
  AppState.currentMessages = [];
  updateConversationsList();
}

//  الدالة دي بتخلي المحادثة ترجع للوضع الافتراضي.
function resetChat() {
  while (DOM.chatMessages.firstChild) DOM.chatMessages.removeChild(DOM.chatMessages.firstChild);
  AppState.conversationStarted = false;
  DOM.welcomeMessage.style.display = "block";
  showSuggestedPrompts();
  DOM.chatInput.value = "";
  adjustChatInputHeight();
}

//  الدالة دي بتخلي الصفحة تنزل لآخر الرسائل عشان المستخدم يشوفها.
function scrollToBottom() {
  DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
}


//  الدالة دي بتتحقق لو الوضع الداكن مفعل ولا لأ.
//  لو مفعل، بتضيف الكلاس "dark-mode" للجسم وبتحدث النص بتاع الزر عشان يوضح الوضع الحالي.
function checkDarkMode() {
  if (AppState.darkMode) {
    document.body.classList.add("dark-mode");
    updateThemeToggleText();
  }
}


//  الدالة دي بتتحقق لو الشاشة صغيرة ولا لأ.
function isMobile() {
  return window.innerWidth <= 768;
}

//  الدالة دي بتقفل الشريطين الجانبيين لو الشاشة صغيرة.
function handleResize() {
  if (!isMobile()) closeSidebars();
}


document.addEventListener("DOMContentLoaded", initApp);

const openFeedbackModal = document.getElementById("openFeedbackModal");
const feedbackModal = document.getElementById("feedbackModal");
const closeFeedbackModal = document.getElementById("closeFeedbackModal");
const submitFeedback = document.getElementById("submitFeedback");
const feedbackInput = document.getElementById("feedbackInput");
const thankYouModal = document.getElementById("thankYouModal");
const closeThankYouModal = document.getElementById("closeThankYouModal");
const warningModal = document.getElementById("warningModal");
const closeWarningModal = document.getElementById("closeWarningModal");
const likeModal = document.getElementById("likeModal");
const closeLikeModal = document.getElementById("closeLikeModal");
const dislikeModal = document.getElementById("dislikeModal");
const closeDislikeModal = document.getElementById("closeDislikeModal");
const deleteConfirmModal = document.getElementById("deleteConfirmModal");
const closeDeleteConfirmModal = document.getElementById("closeDeleteConfirmModal");
const confirmDeleteButton = document.getElementById("confirmDeleteButton");
const cancelDeleteButton = document.getElementById("cancelDeleteButton");
const likeButton = document.getElementById("likeButton");
const dislikeButton = document.getElementById("dislikeButton");

openFeedbackModal.addEventListener("click", (e) => {
  feedbackModal.style.display = "flex";
  e.stopPropagation();
});
closeFeedbackModal.addEventListener("click", () => {
  feedbackModal.style.display = "none";
  feedbackInput.value = "";
});
window.addEventListener("click", (e) => {
  if (e.target === feedbackModal) {
    feedbackModal.style.display = "none";
    feedbackInput.value = "";
  }
});
submitFeedback.addEventListener("click", () => {
  const feedbackText = feedbackInput.value.trim();
  if (feedbackText) {
    sendFeedbackToBackend(feedbackText);
    feedbackModal.style.display = "none";
    thankYouModal.style.display = "flex";
    feedbackInput.value = "";
  } else {
    warningModal.style.display = "flex";
  }
});
closeThankYouModal.addEventListener("click", () => thankYouModal.style.display = "none");
window.addEventListener("click", (e) => { if (e.target === thankYouModal) thankYouModal.style.display = "none"; });
closeWarningModal.addEventListener("click", () => warningModal.style.display = "none");
window.addEventListener("click", (e) => { if (e.target === warningModal) warningModal.style.display = "none"; });
likeButton.addEventListener("click", (e) => { e.stopPropagation(); likeModal.style.display = "flex"; });
closeLikeModal.addEventListener("click", () => likeModal.style.display = "none");
window.addEventListener("click", (e) => { if (e.target === likeModal) likeModal.style.display = "none"; });
dislikeButton.addEventListener("click", (e) => { e.stopPropagation(); dislikeModal.style.display = "flex"; });
closeDislikeModal.addEventListener("click", () => dislikeModal.style.display = "none");
window.addEventListener("click", (e) => { if (e.target === dislikeModal) dislikeModal.style.display = "none"; });
closeDeleteConfirmModal.addEventListener("click", () => {
  deleteConfirmModal.style.display = "none";
  conversationToDelete = null;
});
window.addEventListener("click", (e) => {
  if (e.target === deleteConfirmModal) {
    deleteConfirmModal.style.display = "none";
    conversationToDelete = null;
  }
});
confirmDeleteButton.addEventListener("click", () => {
  if (conversationToDelete) {
    delete AppState.conversations[conversationToDelete];
    saveConversations();
    if (AppState.currentConversationId === conversationToDelete) startNewChat();
    else updateConversationsList();
    deleteConfirmModal.style.display = "none";
    conversationToDelete = null;
  }
});
cancelDeleteButton.addEventListener("click", () => {
  deleteConfirmModal.style.display = "none";
  conversationToDelete = null;
});
let focusedButton = confirmDeleteButton;
window.addEventListener("keydown", (e) => {
  if (deleteConfirmModal.style.display === "flex") {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      focusedButton = (focusedButton === confirmDeleteButton) ? cancelDeleteButton : confirmDeleteButton;
      focusedButton.focus();
    } else if (e.key === "Enter") {
      focusedButton.click();
    }
  }
});
function sendFeedbackToBackend(feedbackText) {
  const feedbackData = { feedback: feedbackText, timestamp: new Date().toISOString() };
  fetch("https://your-backend-api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(feedbackData),
  })
    .then(response => response.json())
    .then(data => console.log("Feedback sent successfully:", data))
    .catch(error => console.error("Error sending feedback:", error));
}