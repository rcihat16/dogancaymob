// â­ MÃœÅTERÄ° YORUMLARI VE ERP ONAY SÄ°STEMÄ° (GLOBAL SCOPE)
// =====================================================

function initErpReviewsListener() {
    let feed = document.getElementById('erpReviewsFeed');
    let badge = document.getElementById('erpReviewsBadge');
    if (!feed) return;
    
    db.collection("reviews").orderBy("timestamp", "desc").onSnapshot(snapshot => {
        if (snapshot.empty) {
            feed.innerHTML = '<div style="text-align:center; color:var(--text-muted); font-size:12px; padding:30px 0;">HenÃ¼z mÃ¼ÅŸteri yorumu bulunmamaktadÄ±r.</div>';
            if (badge) badge.innerText = "0 Yorum";
            return;
        }
        
        if (badge) badge.innerText = snapshot.size + " Yorum";
        feed.innerHTML = '';
        
        snapshot.forEach(doc => {
            let r = doc.data();
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                starsHtml += `<span style="color: ${i <= r.rating ? '#fbbf24' : 'var(--border)'}; font-size: 18px; margin-right: 2px;">â˜…</span>`;
            }

            let statusBadge = '';
            let statusColor = '';
            let statusText = '';
            let status = r.status || 'pending';
            
            if (status === 'approved') {
                statusColor = 'var(--success)';
                statusText = 'YayÄ±nda';
            } else if (status === 'hidden') {
                statusColor = 'var(--danger)';
                statusText = 'Gizlendi';
            } else {
                statusColor = '#d97706'; // amber-600
                statusText = 'Onay Bekliyor';
            }
            
            statusBadge = `<span style="background-color: ${statusColor}18; color: ${statusColor}; padding: 2px 8px; border-radius: 12px; font-size: 10px; font-weight: 700; margin-left: 8px;">${statusText}</span>`;
            
            let actionButtons = `
                <div style="display: flex; gap: 8px; margin-top: 10px; justify-content: flex-end; border-top: 1px dashed var(--border); padding-top: 10px;">
                    ${status !== 'approved' ? `
                        <button type="button" class="btn" onclick="guncelleYorumDurumu('${doc.id}', 'approved')" style="padding: 4px 10px; font-size: 11px; background-color: var(--success); color: white; border: none; border-radius: 4px; cursor: pointer; transition: opacity 0.2s;">
                            âœ“ YayÄ±nla
                        </button>
                    ` : ''}
                    ${status !== 'hidden' ? `
                        <button type="button" class="btn" onclick="guncelleYorumDurumu('${doc.id}', 'hidden')" style="padding: 4px 10px; font-size: 11px; background-color: var(--danger); color: white; border: none; border-radius: 4px; cursor: pointer; transition: opacity 0.2s;">
                            âŒ Gizle
                        </button>
                    ` : ''}
                </div>
            `;
            
            let item = document.createElement('div');
            item.className = 'review-feed-item';
            item.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                    <div>
                        <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 4px;">
                            <h4 style="margin: 0; font-size: 13px; font-weight: 700; color: var(--text-light);">${r.customerName || 'Ä°simsiz MÃ¼ÅŸteri'}</h4>
                            ${statusBadge}
                        </div>
                        <span style="font-size: 11px; color: var(--primary); font-weight: 500;">SipariÅŸ TÃ¼rÃ¼: ${r.mobilyaTuru || 'Bilinmiyor'}</span>
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
                <div style="font-size: 11px; color: var(--text-muted); font-style: italic;">Yorum yazÄ±lmadÄ±, sadece puan verdi.</div>
                `}
                ${actionButtons}
            `;
            feed.appendChild(item);
        });
    }, err => {
        console.error("ERP Yorum dinleme hatasÄ±:", err);
        feed.innerHTML = '<div style="text-align:center; color:var(--danger); font-size:12px; padding:30px 0;">Yorumlar yÃ¼klenirken bir hata oluÅŸtu!</div>';
    });
}

function guncelleYorumDurumu(docId, status) {
    db.collection("reviews").doc(docId).update({
        status: status
    }).then(() => {
        loadLoginReviews();
    }).catch(err => {
        alert("Yorum durumu gÃ¼ncellenirken hata oluÅŸtu: " + err.message);
    });
}

var currentInteractiveRating = 0;

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
            1: "Ã‡ok KÃ¶tÃ¼ ğŸ˜¡",
            2: "KÃ¶tÃ¼ ğŸ˜•",
            3: "Orta ğŸ˜",
            4: "Ä°yi ğŸ˜Š",
            5: "Harika! ğŸ˜"
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
        alert("LÃ¼tfen bir yÄ±ldÄ±z seÃ§erek puan veriniz!");
        return;
    }
    
    if (!window.currentTrackingData || !window.currentTrackingData.id) {
        alert("SipariÅŸ bilgisi bulunamadÄ±!");
        return;
    }
    
    let comment = document.getElementById('trackReviewComment').value.trim();
    let orderId = window.currentTrackingData.id;
    
    let btn = document.getElementById('btnSubmitReview');
    if (btn) {
        btn.disabled = true;
        btn.innerText = "GÃ¶nderiliyor...";
    }
    
    let reviewObj = {
        orderId: orderId,
        rating: currentInteractiveRating,
        comment: comment,
        customerName: window.currentTrackingData.musteri || "Ä°simsiz MÃ¼ÅŸteri",
        mobilyaTuru: window.currentTrackingData.mobilyaTuru || "Ã–zel Proje",
        timestamp: new Date().toISOString(),
        status: "pending"
    };
    
    db.collection("reviews").doc(orderId).set(reviewObj).then(() => {
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            starsHtml += `<span style="color: ${i <= currentInteractiveRating ? '#fbbf24' : 'var(--border)'}; font-size: 20px; margin-right: 2px;">â˜…</span>`;
        }
        
        document.getElementById('trackReviewFormContainer').style.display = 'none';
        let resultContainer = document.getElementById('trackReviewResultContainer');
        resultContainer.innerHTML = `
            <div style="background-color: var(--bg-dark); padding: 12px; border-radius: 8px; border: 1px solid var(--border); text-align: center;">
                <span style="font-size: 26px; display: block; margin-bottom: 8px;">ğŸ‰</span>
                <span style="font-size: 13px; color: var(--success); font-weight: 700; display: block; margin-bottom: 5px;">DeÄŸerlendirmeniz Ä°Ã§in TeÅŸekkÃ¼r Ederiz!</span>
                <p style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 10px;">Geri bildiriminiz Mustafa Usta'ya iletildi. OnaylandÄ±ktan sonra yayÄ±na alÄ±nacaktÄ±r.</p>
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 6px;">
                    <span style="font-size: 12px; font-weight: 700; color: var(--text-light);">PuanÄ±nÄ±z:</span>
                    <div>${starsHtml}</div>
                </div>
                ${comment ? `
                <div style="font-size: 12px; color: var(--text-muted); font-style: italic; line-height: 1.4; border-top: 1px solid var(--border); padding-top: 6px; margin-top: 6px; text-align: left;">
                    "${comment}"
                </div>` : ''}
            </div>
        `;
        resultContainer.style.display = 'block';
        
        alert("DeÄŸerlendirmeniz baÅŸarÄ±yla gÃ¶nderildi. TeÅŸekkÃ¼r ederiz!");
        loadLoginReviews();
    }).catch(err => {
        alert("Yorum gÃ¶nderilirken hata oluÅŸtu: " + err.message);
        if (btn) {
            btn.disabled = false;
            btn.innerText = "DeÄŸerlendirmeyi GÃ¶nder";
        }
    });
}

function loadLoginReviews() {
    let container = document.getElementById('loginTestimonialsContainer');
    if (!container) return;
    
    db.collection("reviews").orderBy("timestamp", "desc").limit(20).get().then(snapshot => {
        container.innerHTML = '';
        let approvedCount = 0;
        
        if (!snapshot.empty) {
            snapshot.forEach(doc => {
                let r = doc.data();
                if (r.status !== "approved" || approvedCount >= 3) return;
                
                approvedCount++;
                let starsHtml = '';
                for (let i = 1; i <= 5; i++) {
                    starsHtml += i <= r.rating ? 'â˜…' : 'â˜†';
                }
                
                let formattedName = "MÃ¼ÅŸteri";
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
                                <span style="font-size: 9px; color: var(--success); font-weight: 600;">âœ“ OnaylÄ± MÃ¼ÅŸteri</span>
                            </div>
                        </div>
                        <div style="color: #fbbf24; font-size: 10px;">${starsHtml}</div>
                    </div>
                    <p style="margin: 0; font-size: 11px; color: var(--text-muted); line-height: 1.4; font-style: italic;">
                        "${r.comment || 'Ã‡ok memnun kaldÄ±m, harika bir hizmet!'}"
                    </p>
                `;
                container.appendChild(item);
            });
        }
        
        // Fallback: If no approved reviews exist, render premium default reviews
        if (approvedCount === 0) {
            let defaultReviews = [
                { name: "Ahmet A.", rating: 5, comment: "Mustafa Usta ve ekibine Ã§ok teÅŸekkÃ¼r ederiz. Mutfak dolaplarÄ±mÄ±zÄ± tam gÃ¼nÃ¼nde ve kusursuz iÅŸÃ§ilikle teslim ettiler. GÃ¼venilir ve profesyonel hizmet!" },
                { name: "Selin K.", rating: 5, comment: "GardÄ±rop tasarÄ±mÄ± iÃ§in tam hayal ettiÄŸimiz gibi bir Ã§izim yapÄ±ldÄ±. Hem CAD Ã§izimi hem de imalat aÅŸamasÄ± son derece ÅŸeffaftÄ±. Ã‡ok memnun kaldÄ±k." },
                { name: "Mehmet T.", rating: 5, comment: "CanlÄ± sipariÅŸ takip sistemi sayesinde atÃ¶lyeden evimize kadar her anÄ± takip edebildik. DoÄŸanÃ§ay Mobilya kalitesi gerÃ§ekten baÅŸka." }
            ];
            defaultReviews.forEach(r => {
                let starsHtml = 'â˜…'.repeat(r.rating) + 'â˜†'.repeat(5 - r.rating);
                let item = document.createElement('div');
                item.className = 'testimonial-card';
                item.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #e0f2fe; color: #0284c7; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 11px;">
                                ${r.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                                <h5 style="margin: 0; font-size: 11px; font-weight: 700; color: var(--text-main);">${r.name}</h5>
                                <span style="font-size: 9px; color: var(--success); font-weight: 600;">âœ“ OnaylÄ± MÃ¼ÅŸteri</span>
                            </div>
                        </div>
                        <div style="color: #fbbf24; font-size: 10px;">${starsHtml}</div>
                    </div>
                    <p style="margin: 0; font-size: 11px; color: var(--text-muted); line-height: 1.4; font-style: italic;">
                        "${r.comment}"
                    </p>
                `;
                container.appendChild(item);
            });
        }
    }).catch(err => {
        console.log("GiriÅŸ yorumlarÄ± yÃ¼kleme hatasÄ±:", err);
    });
}