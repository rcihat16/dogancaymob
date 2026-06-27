import { db } from './firebase-config.js';

function initErpReviewsListener() {
    let feed = document.getElementById('erpReviewsFeed');
    let badge = document.getElementById('erpReviewsBadge');
    if (!feed) return;
    
    db.collection("reviews").orderBy("timestamp", "desc").onSnapshot(snapshot => {
        if (snapshot.empty) {
            feed.innerHTML = '<div style="text-align:center; color:var(--text-muted); font-size:12px; padding:30px 0;">Henüz müşteri yorumu bulunmamaktadır.</div>';
            if (badge) badge.innerText = "0 Yorum";
            return;
        }
        
        if (badge) badge.innerText = snapshot.size + " Yorum";
        feed.innerHTML = '';
        
        snapshot.forEach(doc => {
            let r = doc.data();
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                starsHtml += `<span style="color: ${i <= r.rating ? '#fbbf24' : 'var(--border)'}; font-size: 18px; margin-right: 2px;">★</span>`;
            }

            let item = document.createElement('div');
            item.className = 'review-feed-item';
            item.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                    <div>
                        <h4 style="margin: 0; font-size: 13px; font-weight: 700; color: var(--text-light);">${r.customerName || 'İsimsiz Müşteri'}</h4>
                        <span style="font-size: 11px; color: var(--primary); font-weight: 500;">Sipariş Türü: ${r.mobilyaTuru || 'Bilinmiyor'}</span>
                    </div>
                    <div style="text-align: right;">
                        <div style="margin-bottom: 3px;">${starsHtml}</div>
                        <span style="font-size: 10px; color: var(--text-muted);">${r.timestamp ? new Date(r.timestamp).toLocaleDateString('tr-TR') : '-'}</span>
                    </div>
                </div>
                ${r.comment ? `
                <div style="background-color: var(--bg-dark); padding: 10px; border-radius: 6px; font-size: 12px; color: var(--text-muted); line-height: 1.4; border-left: 3px solid var(--primary);">
                    "${r.comment}"
                </div>` : `
                <div style="font-size: 11px; color: var(--text-muted); font-style: italic;">Yorum yazılmadı, sadece puan verdi.</div>
                `}
            `;
            feed.appendChild(item);
        });
    }, err => {
        console.error("ERP Yorum dinleme hatası:", err);
        feed.innerHTML = '<div style="text-align:center; color:var(--danger); font-size:12px; padding:30px 0;">Yorumlar yüklenirken bir hata oluştu!</div>';
    });
}

// ⭐ MÜŞTERİ DEĞERLENDİRME & YORUM FONKSİYONLARI
// ==========================================
let currentInteractiveRating = 0;

function setInteractiveRating(rating) {
    currentInteractiveRating = rating;
    let stars = document.querySelectorAll('.rating-stars-interactive .interactive-star');
    stars.forEach(star => {
        let val = parseInt(star.getAttribute('data-value'));
        if (val <= rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
    
    let label = document.getElementById('interactiveRatingLabel');
    if (label) {
        let ratingTexts = {
            1: "Çok Kötü 😡",
            2: "Kötü 😕",
            3: "Orta 😐",
            4: "İyi 😊",
            5: "Harika! 😍"
        };
        label.innerText = ratingTexts[rating] || "-";
    }
}

function resetInteractiveRating() {
    currentInteractiveRating = 0;
    let stars = document.querySelectorAll('.rating-stars-interactive .interactive-star');
    stars.forEach(star => star.classList.remove('active'));
    let label = document.getElementById('interactiveRatingLabel');
    if (label) label.innerText = "-";
    let commentArea = document.getElementById('trackReviewComment');
    if (commentArea) commentArea.value = "";
}

function gonderMusteriYorumu() {
    if (currentInteractiveRating === 0) {
        alert("Lütfen bir yıldız seçerek puan veriniz!");
        return;
    }
    
    // Read currentTrackingData from window since it is declared globally in main.js
    if (!window.currentTrackingData || !window.currentTrackingData.id) {
        alert("Sipariş bilgisi bulunamadı!");
        return;
    }
    
    let comment = document.getElementById('trackReviewComment').value.trim();
    let orderId = window.currentTrackingData.id;
    
    let btn = document.getElementById('btnSubmitReview');
    if (btn) {
        btn.disabled = true;
        btn.innerText = "Gönderiliyor...";
    }
    
    let reviewObj = {
        orderId: orderId,
        rating: currentInteractiveRating,
        comment: comment,
        customerName: window.currentTrackingData.musteri || "İsimsiz Müşteri",
        mobilyaTuru: window.currentTrackingData.mobilyaTuru || "Özel Proje",
        timestamp: new Date().toISOString()
    };
    
    db.collection("reviews").doc(orderId).set(reviewObj).then(() => {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += `<span style="color: ${i <= currentInteractiveRating ? '#fbbf24' : 'var(--border)'}; font-size: 20px; margin-right: 2px;">★</span>`;
        }
        
        document.getElementById('trackReviewFormContainer').style.display = 'none';
        let resultContainer = document.getElementById('trackReviewResultContainer');
        resultContainer.innerHTML = `
            <div style="background-color: var(--bg-dark); padding: 12px; border-radius: 8px; border: 1px solid var(--border); text-align: center;">
                <span style="font-size: 26px; display: block; margin-bottom: 8px;">🎉</span>
                <span style="font-size: 13px; color: var(--success); font-weight: 700; display: block; margin-bottom: 5px;">Değerlendirmeniz İçin Teşekkür Ederiz!</span>
                <p style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 10px;">Geri bildiriminiz başarıyla kaydedildi.</p>
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 6px;">
                    <span style="font-size: 12px; font-weight: 700; color: var(--text-light);">Puanınız:</span>
                    <div>${starsHtml}</div>
                </div>
                ${comment ? `
                <div style="font-size: 12px; color: var(--text-muted); font-style: italic; line-height: 1.4; border-top: 1px solid var(--border); padding-top: 6px; margin-top: 6px; text-align: left;">
                    "${comment}"
                </div>` : ''}
            </div>
        `;
        resultContainer.style.display = 'block';
        
        alert("Değerlendirmeniz başarıyla gönderildi. Teşekkür ederiz!");
        loadLoginReviews();
    }).catch(err => {
        alert("Yorum gönderilirken hata oluştu: " + err.message);
        if (btn) {
            btn.disabled = false;
            btn.innerText = "Değerlendirmeyi Gönder";
        }
    });
}

function loadLoginReviews() {
    let container = document.getElementById('loginTestimonialsContainer');
    if (!container) return;
    
    db.collection("reviews").orderBy("timestamp", "desc").limit(3).get().then(snapshot => {
        if (snapshot.empty) return;
        
        container.innerHTML = '';
        snapshot.forEach(doc => {
            let r = doc.data();
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                starsHtml += i <= r.rating ? '★' : '☆';
            }
            
            let formattedName = "Müşteri";
            if (r.customerName) {
                let parts = r.customerName.trim().split(/\s+/);
                if (parts.length > 1) {
                    formattedName = parts[0] + " " + parts[parts.length - 1].substring(0, 1) + ".";
                } else {
                    formattedName = parts[0];
                }
            }
            
            let item = document.createElement('div');
            item.className = 'testimonial-card';
            item.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 11px;">
                            ${formattedName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h5 style="margin: 0; font-size: 11px; font-weight: 700; color: var(--text-main);">${formattedName}</h5>
                            <span style="font-size: 9px; color: var(--success); font-weight: 600;">✓ Onaylı Müşteri</span>
                        </div>
                    </div>
                    <div style="color: #fbbf24; font-size: 10px;">${starsHtml}</div>
                </div>
                <p style="margin: 0; font-size: 11px; color: var(--text-muted); line-height: 1.4; font-style: italic;">
                    "${r.comment || 'Çok memnun kaldım, harika bir hizmet!'}"
                </p>
            `;
            container.appendChild(item);
        });
    }).catch(err => {
        console.log("Giriş yorumları yükleme hatası:", err);
    });
}

// Bind review functions to window for global access
window.initErpReviewsListener = initErpReviewsListener;
window.setInteractiveRating = setInteractiveRating;
window.resetInteractiveRating = resetInteractiveRating;
window.gonderMusteriYorumu = gonderMusteriYorumu;
window.loadLoginReviews = loadLoginReviews;
