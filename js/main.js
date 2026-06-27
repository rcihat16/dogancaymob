import { db } from './firebase-config.js';
window.db = db;
    // Default Price Matrix Configuration (Will sync with bulut Firestore dynamic data)
    window.dynamicPrices = {
        lake: 4800,
        mdf: 3200,
        cam: 1200,
        ark4: 450,
        r_tele: 400,
        r_tandem: 950,
        r_blum: 1800,
        samet: 80,
        blum: 180,
        montaj: 3500,
        kesim_m2: 350,
        
        // New items defaults
        tezgah_laminat: 1500,
        tezgah_ahsap: 3000,
        tezgah_granit: 5000,
        tezgah_cimstone: 7500,
        vestiyer_m2: 3600,
        banyo_m2: 4000,
        kapaksiz: 6350
    };

    window.isPatron = false;
    window.previewMode = 'blueprint';

    function setPreviewMode(mode) {
        previewMode = mode;
        let btnBlueprint = document.getElementById('btnModeBlueprint');
        let btnLux = document.getElementById('btnModeLux');
        if (btnBlueprint && btnLux) {
            if (mode === 'lux') {
                btnBlueprint.classList.remove('active');
                btnLux.classList.add('active');
            } else {
                btnBlueprint.classList.add('active');
                btnLux.classList.remove('active');
            }
        }
        hesaplaVeCiz();
    }

    function switchLoginTab(tab) {
        let btnStaff = document.getElementById('tabStaffLogin');
        let btnCustomer = document.getElementById('tabCustomerTrack');
        let btnDesign = document.getElementById('tabSelfDesign');
        let staffGroup = document.getElementById('staffLoginGroup');
        let customerGroup = document.getElementById('customerSearchGroup');
        
        if (tab === 'staff') {
            btnStaff.classList.add('active');
            btnCustomer.classList.remove('active');
            if (btnDesign) btnDesign.classList.remove('active');
            staffGroup.style.display = 'flex';
            customerGroup.style.display = 'none';
        } else if (tab === 'customer') {
            btnStaff.classList.remove('active');
            btnCustomer.classList.add('active');
            if (btnDesign) btnDesign.classList.remove('active');
            staffGroup.style.display = 'none';
            customerGroup.style.display = 'flex';
        } else if (tab === 'design') {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('selfDesignScreen').style.display = 'block';
            initDesignerCabinet();
        }
    }

    // 💾 AUTO SESSION LOGIN ON LOAD
    window.onload = function() {
        // Listen for changes in Material Prices from Firestore globally
        db.collection("ayarlar").doc("malzeme_fiyatlari").onSnapshot((doc) => {
            if(doc.exists) {
                dynamicPrices = { ...dynamicPrices, ...doc.data() };
                fiyatInputlariniDoldur();
            }
            if (document.getElementById('appScreen').style.display === 'block') {
                hesaplaVeCiz();
            }
            if (document.getElementById('selfDesignScreen').style.display === 'block') {
                updateDesignerCabinet();
            }
        });

        let urlParams = new URLSearchParams(window.location.search);
        let takipDocId = urlParams.get('takip');
        
        if (takipDocId) {
            db.collection("ortak_teklifler").doc(takipDocId).get().then((doc) => {
                if (doc.exists) {
                    loadOrderTracking(doc.id, doc.data());
                } else {
                    alert("Girdiğiniz Takip Linki geçersiz veya sipariş bulunamadı!");
                    window.history.replaceState({}, document.title, window.location.pathname);
                    checkAutoLogin();
                }
            }).catch(err => {
                console.error("Takip hatası:", err);
                checkAutoLogin();
            });
        } else {
            checkAutoLogin();
        }
        
        // Add 3 default empty rows to Cut Optimization table
        optYasarYeniSatir();
        optYasarYeniSatir();
        optYasarYeniSatir();
    };

    function checkAutoLogin() {
        let kayitliUser = localStorage.getItem('dogancay_user');
        let kayitliPass = localStorage.getItem('dogancay_pass');
        
        if (kayitliUser && kayitliPass) {
            document.getElementById('loginUser').value = kayitliUser;
            document.getElementById('loginPass').value = kayitliPass;
            girisYap(true);
        }
    }

    function girisYap(isAuto) {
        if (isAuto === undefined || isAuto === null) { isAuto = false; }
        
        let user = document.getElementById('loginUser').value.trim();
        let pass = document.getElementById('loginPass').value.trim();
        
        if((user === "ortak" && pass === "5566") || (user === "patron" && pass === "1234")) {
            localStorage.setItem('dogancay_user', user);
            localStorage.setItem('dogancay_pass', pass);

            document.getElementById('loginScreen').style.display = "none";
            document.getElementById('appScreen').style.display = "block";
            
            // Set User Profiles Visuals
            document.getElementById('avatarName').innerText = user.charAt(0).toUpperCase();
            document.getElementById('profileName').innerText = user === "patron" ? "Patron (Yönetim)" : "Ortak Girişi";
            document.getElementById('profileRole').innerText = "Doğançay Mobilya Yetkilisi";
            let mProfile = document.getElementById('mobileProfileName');
            if (mProfile) mProfile.innerText = user === "patron" ? "Patron (Yönetim)" : "Ortak Girişi";

            if(user === "patron") {
                isPatron = true;
                // Show admin views in Nav Menu
                document.getElementById('navMuhasebe').style.display = "flex";
                document.getElementById('navAyarlar').style.display = "flex";
                document.getElementById('mNavMuhasebe').style.display = "flex";
                document.getElementById('mNavAyarlar').style.display = "flex";
                muhasebeHesapla();
            }
            
            // Listen for changes in Material Prices is handled globally on page load
            hesaplaVeCiz();

            // Run Live updates for Tracking Pool list
            canliGezgin();
            initErpReviewsListener();
        } else {
            if(isAuto === false) { alert("Hatalı kullanıcı adı veya şifre!"); }
        }
    }

    function cikisYap() {
        if(confirm("Sistem oturumunu kapatmak istediğinize emin misiniz?")) {
            localStorage.removeItem('dogancay_user');
            localStorage.removeItem('dogancay_pass');
            location.reload();
        }
    }

    function switchTab(viewId, buttonEl) {
        // Close payments modal when switching tabs
        if (typeof closePaymentModal === 'function') {
            closePaymentModal();
        }

        // Toggle view container visibilities
        document.querySelectorAll('.view-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(viewId).classList.add('active');

        // Toggle nav items highlight styles
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.bottom-nav-item').forEach(btn => btn.classList.remove('active'));

        // Handle active indicators
        if(buttonEl) {
            buttonEl.classList.add('active');
        }

        // Trigger redraw if returning to calculator screen
        if(viewId === 'teklifView') {
            setTimeout(hesaplaVeCiz, 50);
        }
    }

    function selectFurnitureType(type, element) {
        document.getElementById('mobilyaTuru').value = type;
        
        // Toggle selection visuals
        document.querySelectorAll('.type-card').forEach(card => card.classList.remove('active'));
        if(element) {
            element.classList.add('active');
        } else {
            document.querySelectorAll('.type-card').forEach(card => {
                let clk = card.getAttribute('onclick');
                if(clk && clk.includes("'" + type + "'")) {
                    card.classList.add('active');
                }
            });
        }

        // Toggle input segments
        document.querySelectorAll('.furniture-form-group').forEach(fg => fg.style.display = 'none');
        
        if (type === 'gardırop') {
            document.getElementById('formGardırop').style.display = 'block';
        } else if (type === 'mutfak') {
            document.getElementById('formMutfak').style.display = 'block';
        } else if (type === 'vestiyer') {
            document.getElementById('formVestiyer').style.display = 'block';
        } else if (type === 'banyo') {
            document.getElementById('formBanyo').style.display = 'block';
        } else if (type === 'ozel') {
            document.getElementById('formOzel').style.display = 'block';
            adjustOzelMethodLabel();
        } else if (type === 'udolap') {
            document.getElementById('formUDolap').style.display = 'block';
        }

        hesaplaVeCiz();
    }

    function adjustOzelMethodLabel() {
        let method = document.getElementById('o_method').value;
        let lbl = document.getElementById('lblOzelQty');
        if(method === 'm2') {
            lbl.innerText = "Ölçü Alanı (m²)";
        } else if(method === 'mt') {
            lbl.innerText = "Uzunluk (Metretül)";
        } else {
            lbl.innerText = "Miktar / Adet";
        }
    }

    function fiyatInputlariniDoldur() {
        try {
            // Levha
            document.getElementById('p_lake').value = dynamicPrices.lake;
            document.getElementById('p_mdf').value = dynamicPrices.mdf;
            document.getElementById('p_cam').value = dynamicPrices.cam;
            document.getElementById('p_ark4').value = dynamicPrices.ark4;
            document.getElementById('p_kapaksiz').value = dynamicPrices.kapaksiz || 6350;
            
            // Ray
            document.getElementById('p_r_tele').value = dynamicPrices.r_tele;
            document.getElementById('p_r_tandem').value = dynamicPrices.r_tandem;
            document.getElementById('p_r_blum').value = dynamicPrices.r_blum;
            
            // Menteşe
            document.getElementById('p_samet').value = dynamicPrices.samet;
            document.getElementById('p_blum').value = dynamicPrices.blum;
            
            // Mutfak Tezgahı
            document.getElementById('p_t_laminat').value = dynamicPrices.tezgah_laminat || 1500;
            document.getElementById('p_t_ahsap').value = dynamicPrices.tezgah_ahsap || 3000;
            document.getElementById('p_t_granit').value = dynamicPrices.tezgah_granit || 5000;
            document.getElementById('p_t_cimstone').value = dynamicPrices.tezgah_cimstone || 7500;
            
            // Vestiyer & Banyo
            document.getElementById('p_vestiyer').value = dynamicPrices.vestiyer_m2 || 3600;
            document.getElementById('p_banyo').value = dynamicPrices.banyo_m2 || 4000;
            
            // Atölye
            document.getElementById('p_kesim_m2').value = dynamicPrices.kesim_m2 || 350;
            document.getElementById('p_montaj').value = dynamicPrices.montaj || 3500;
        } catch(e) {
            console.error("Fiyat doldurma hatası: ", e);
        }
    }

    function fiyatlariBulutaKaydet() {
        try {
            db.collection("ayarlar").doc("malzeme_fiyatlari").set({
                lake: parseFloat(document.getElementById('p_lake').value),
                mdf: parseFloat(document.getElementById('p_mdf').value),
                cam: parseFloat(document.getElementById('p_cam').value),
                ark4: parseFloat(document.getElementById('p_ark4').value),
                kapaksiz: parseFloat(document.getElementById('p_kapaksiz').value),
                
                r_tele: parseFloat(document.getElementById('p_r_tele').value),
                r_tandem: parseFloat(document.getElementById('p_r_tandem').value),
                r_blum: parseFloat(document.getElementById('p_r_blum').value),
                
                samet: parseFloat(document.getElementById('p_samet').value),
                blum: parseFloat(document.getElementById('p_blum').value),
                
                tezgah_laminat: parseFloat(document.getElementById('p_t_laminat').value),
                tezgah_ahsap: parseFloat(document.getElementById('p_t_ahsap').value),
                tezgah_granit: parseFloat(document.getElementById('p_t_granit').value),
                tezgah_cimstone: parseFloat(document.getElementById('p_t_cimstone').value),
                
                vestiyer_m2: parseFloat(document.getElementById('p_vestiyer').value),
                banyo_m2: parseFloat(document.getElementById('p_banyo').value),
                
                kesim_m2: parseFloat(document.getElementById('p_kesim_m2').value),
                montaj: parseFloat(document.getElementById('p_montaj').value)
            }).then(() => {
                alert("Yeni fiyat listesi başarıyla buluta kilitlendi!");
                switchTab('teklifView');
            }).catch(err => {
                alert("Kaydetme başarısız (Firebase Hatası): " + err.message);
            });
        } catch(e) {
            alert("Sistem Hatası (JS Exception): " + e.message);
        }
    }

    // 🎨 DİNAMİK DETAY METNİ DERLEYİCİ
    function getSpecificationText() {
        let type = document.getElementById('mobilyaTuru').value;
        let origText = "";

        if(type === 'gardırop') {
            let w = parseFloat(document.getElementById('g_width').value) || 0;
            let h = parseFloat(document.getElementById('g_height').value) || 0;
            let d = parseInt(document.getElementById('g_doors').value) || 0;
            let dr = parseInt(document.getElementById('g_drawers').value) || 0;
            let mat = document.getElementById('g_material').value.toUpperCase();
            let ray = document.getElementById('g_ray').options[document.getElementById('g_ray').selectedIndex].text;
            let bck = document.getElementById('g_back').options[document.getElementById('g_back').selectedIndex].text;
            origText = `Gardırop (${w.toFixed(2)}x${h.toFixed(2)}m) - ${d} Kapak (${mat}) - ${dr} Çekmece (${ray}) - Arkalık: ${bck}`;
        } 
        else if(type === 'mutfak') {
            let ul = parseFloat(document.getElementById('k_upper_len').value) || 0;
            let ll = parseFloat(document.getElementById('k_lower_len').value) || 0;
            let mat = document.getElementById('k_material').value.toUpperCase();
            let dr = parseInt(document.getElementById('k_drawers').value) || 0;
            let ray = document.getElementById('k_ray').options[document.getElementById('k_ray').selectedIndex].text;
            let count = document.getElementById('k_countertop').options[document.getElementById('k_countertop').selectedIndex].text;
            origText = `Mutfak Dolabı (Alt: ${ll.toFixed(2)}m / Üst: ${ul.toFixed(2)}m) - Kapak: ${mat} - ${dr} Çekmece (${ray}) - Tezgah: ${count}`;
        }
        else if(type === 'vestiyer') {
            let w = parseFloat(document.getElementById('v_width').value) || 0;
            let h = parseFloat(document.getElementById('v_height').value) || 0;
            let mat = document.getElementById('v_material').value.toUpperCase();
            let dr = parseInt(document.getElementById('v_drawers').value) || 0;
            let hooks = parseInt(document.getElementById('v_hooks').value) || 0;
            let mirror = document.getElementById('v_mirror').options[document.getElementById('v_mirror').selectedIndex].text;
            origText = `Vestiyer (${w.toFixed(2)}x${h.toFixed(2)}m) - Kapak: ${mat} - ${dr} Çekmece - Askı Kancası: ${hooks} Adet - Ayna Sınıfı: ${mirror}`;
        }
        else if(type === 'banyo') {
            let w = parseFloat(document.getElementById('b_width').value) || 0;
            let h = parseFloat(document.getElementById('b_height').value) || 0;
            let mat = document.getElementById('b_material').value.toUpperCase();
            let dr = parseInt(document.getElementById('b_drawers').value) || 0;
            let ext = document.getElementById('b_extras').options[document.getElementById('b_extras').selectedIndex].text;
            origText = `Banyo Dolabı (${w.toFixed(2)}x${h.toFixed(2)}m) - Kapak: ${mat} - ${dr} Çekmece - Ekstra Modül: ${ext}`;
        }
        else if(type === 'ozel') {
            let desc = document.getElementById('o_desc').value.trim() || "Özel Mobilya Projesi";
            let method = document.getElementById('o_method').options[document.getElementById('o_method').selectedIndex].text;
            let qty = parseFloat(document.getElementById('o_qty').value) || 0;
            origText = `Özel Tasarım: ${desc} (Hesap: ${qty} x ${method})`;
        }
        else if(type === 'udolap') {
            let left = parseFloat(document.getElementById('u_left').value) || 0;
            let back = parseFloat(document.getElementById('u_back').value) || 0;
            let right = parseFloat(document.getElementById('u_right').value) || 0;
            let h = parseFloat(document.getElementById('u_height').value) || 0;
            let dr = parseInt(document.getElementById('u_drawers').value) || 0;
            let mat = document.getElementById('u_material').options[document.getElementById('u_material').selectedIndex].text;
            let ray = document.getElementById('u_ray').options[document.getElementById('u_ray').selectedIndex].text;
            let bck = document.getElementById('u_back_panel').options[document.getElementById('u_back_panel').selectedIndex].text;
            origText = `U Dolap (Sol: ${left.toFixed(2)}m, Arka: ${back.toFixed(2)}m, Sağ: ${right.toFixed(2)}m, Boy: ${h.toFixed(2)}m) - Kapak: ${mat} - ${dr} Çekmece (${ray}) - Arkalık: ${bck}`;
        }

        let useSheetCosting = document.getElementById('chkUseSheetCosting') && document.getElementById('chkUseSheetCosting').checked;
        if (useSheetCosting && type !== 'ozel') {
            let parts = getPartsListFromCurrentOffer();
            let gSheets = calculateSheetsDryRun(parts);
            
            let w = 2800; let h = 2100;
            let sizeSelect = document.getElementById('opt_stock_size') ? document.getElementById('opt_stock_size').value : '2800x2100';
            if(sizeSelect === '2800x2100') { w = 2800; h = 2100; }
            else if(sizeSelect === '3660x1830') { w = 3660; h = 1830; }
            else if(document.getElementById('opt_stock_w')) {
                w = parseInt(document.getElementById('opt_stock_w').value) || 2800;
                h = parseInt(document.getElementById('opt_stock_h').value) || 2100;
            }
            let sheetArea = (w * h) / 1000000;
            
            let calcM2 = 0;
            if (type === 'gardırop') {
                let gw = parseFloat(document.getElementById('g_width').value) || 0;
                let gh = parseFloat(document.getElementById('g_height').value) || 0;
                calcM2 = gw * gh;
            } else if (type === 'udolap') {
                let left = parseFloat(document.getElementById('u_left').value) || 0;
                let back = parseFloat(document.getElementById('u_back').value) || 0;
                let right = parseFloat(document.getElementById('u_right').value) || 0;
                let uh = parseFloat(document.getElementById('u_height').value) || 0;
                calcM2 = (left + back + right) * uh;
            } else if (type === 'mutfak') {
                let ul = parseFloat(document.getElementById('k_upper_len').value) || 0;
                calcM2 = ul * 0.8;
            } else if (type === 'vestiyer') {
                calcM2 = (parseFloat(document.getElementById('v_width').value) || 0) * (parseFloat(document.getElementById('v_height').value) || 0);
            } else if (type === 'banyo') {
                calcM2 = (parseFloat(document.getElementById('b_width').value) || 0) * (parseFloat(document.getElementById('b_height').value) || 0);
            }
            
            let aSheets = Math.ceil(calcM2 / sheetArea);
            origText += ` [Plaka Bazlı: ${gSheets} Plaka Gövde + ${aSheets} Plaka Arkalık (${w}x${h}mm)]`;
        }

        return origText;
    }

    // ==========================================
    // 🎨 LÜKS 2D ÇİZİM VE HESAPLAMA YARDIMCILARI
    // ==========================================


    // ☁️ BULUT VERİ HAVUZUNA YENİ TEKLİF KAYDET
    function kaydetSistem() {
        let name = document.getElementById('customerName').value.trim();
        let phone = document.getElementById('customerPhone').value.trim();
        let deliveryDateVal = document.getElementById('customerDeliveryDate').value;
        if (!deliveryDateVal) {
            let targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 25);
            let year = targetDate.getFullYear();
            let month = String(targetDate.getMonth() + 1).padStart(2, '0');
            let day = String(targetDate.getDate()).padStart(2, '0');
            deliveryDateVal = `${year}-${month}-${day}`;
        }
        if(!name) { alert("Lütfen müşteri adını girin!"); return; }
        
        let v = hesaplaVeCiz(); 
        let staff = document.getElementById('staffName').value;
        
        let selectRay = "Ray Yok";
        if(v.type === 'gardırop') selectRay = document.getElementById('g_ray').options[document.getElementById('g_ray').selectedIndex].text;
        if(v.type === 'mutfak') selectRay = document.getElementById('k_ray').options[document.getElementById('k_ray').selectedIndex].text;
        if(v.type === 'vestiyer') selectRay = document.getElementById('v_ray').options[document.getElementById('v_ray').selectedIndex].text;
        if(v.type === 'banyo') selectRay = document.getElementById('b_ray').options[document.getElementById('b_ray').selectedIndex].text;
        if(v.type === 'udolap') selectRay = document.getElementById('u_ray').options[document.getElementById('u_ray').selectedIndex].text;

        let matName = "Malzeme Belirtilmedi";
        if(v.type === 'gardırop') matName = document.getElementById('g_material').options[document.getElementById('g_material').selectedIndex].text;
        if(v.type === 'mutfak') matName = document.getElementById('k_material').options[document.getElementById('k_material').selectedIndex].text;
        if(v.type === 'vestiyer') matName = document.getElementById('v_material').options[document.getElementById('v_material').selectedIndex].text;
        if(v.type === 'banyo') matName = document.getElementById('b_material').options[document.getElementById('b_material').selectedIndex].text;
        if(v.type === 'udolap') matName = document.getElementById('u_material').options[document.getElementById('u_material').selectedIndex].text;

        // Compile inputState for edit restoration
        let inputState = {};
        if(v.type === 'gardırop') {
            inputState = {
                g_width: parseFloat(document.getElementById('g_width').value) || 0,
                g_height: parseFloat(document.getElementById('g_height').value) || 0,
                g_doors: parseInt(document.getElementById('g_doors').value) || 0,
                g_drawers: parseInt(document.getElementById('g_drawers').value) || 0,
                g_ray: document.getElementById('g_ray').value,
                g_material: document.getElementById('g_material').value,
                g_back: document.getElementById('g_back').value,
                g_hinges: parseInt(document.getElementById('g_hinges').value) || 0,
                g_hinge_type: document.getElementById('g_hinge_type').value,
                g_advance: parseFloat(document.getElementById('g_advance').value) || 0
            };
            if (editingGModules) {
                inputState.g_modules = editingGModules;
            }
            if (editingGHandle) {
                inputState.g_handle = editingGHandle;
            }
            if (editingGLed) {
                inputState.g_led = editingGLed;
            }
        } else if(v.type === 'mutfak') {
            inputState = {
                k_lower_len: parseFloat(document.getElementById('k_lower_len').value) || 0,
                k_upper_len: parseFloat(document.getElementById('k_upper_len').value) || 0,
                k_material: document.getElementById('k_material').value,
                k_drawers: parseInt(document.getElementById('k_drawers').value) || 0,
                k_ray: document.getElementById('k_ray').value,
                k_hinges: parseInt(document.getElementById('k_hinges').value) || 0,
                k_hinge_type: document.getElementById('k_hinge_type').value,
                k_countertop: document.getElementById('k_countertop').value,
                k_advance: parseFloat(document.getElementById('k_advance').value) || 0
            };
        } else if(v.type === 'vestiyer') {
            inputState = {
                v_width: parseFloat(document.getElementById('v_width').value) || 0,
                v_height: parseFloat(document.getElementById('v_height').value) || 0,
                v_material: document.getElementById('v_material').value,
                v_drawers: parseInt(document.getElementById('v_drawers').value) || 0,
                v_ray: document.getElementById('v_ray').value,
                v_hooks: parseInt(document.getElementById('v_hooks').value) || 0,
                v_hinges: parseInt(document.getElementById('v_hinges').value) || 0,
                v_hinge_type: document.getElementById('v_hinge_type').value,
                v_mirror: document.getElementById('v_mirror').value,
                v_advance: parseFloat(document.getElementById('v_advance').value) || 0
            };
        } else if(v.type === 'banyo') {
            inputState = {
                b_width: parseFloat(document.getElementById('b_width').value) || 0,
                b_height: parseFloat(document.getElementById('b_height').value) || 0,
                b_material: document.getElementById('b_material').value,
                b_drawers: parseInt(document.getElementById('b_drawers').value) || 0,
                b_ray: document.getElementById('b_ray').value,
                b_hinges: parseInt(document.getElementById('b_hinges').value) || 0,
                b_extras: document.getElementById('b_extras').value,
                b_advance: parseFloat(document.getElementById('b_advance').value) || 0
            };
        } else if(v.type === 'ozel') {
            inputState = {
                o_desc: document.getElementById('o_desc').value,
                o_method: document.getElementById('o_method').value,
                o_qty: parseFloat(document.getElementById('o_qty').value) || 0,
                o_unit_price: parseFloat(document.getElementById('o_unit_price').value) || 0,
                o_extras: parseFloat(document.getElementById('o_extras').value) || 0,
                o_advance: parseFloat(document.getElementById('o_advance').value) || 0
            };
        } else if(v.type === 'udolap') {
            inputState = {
                u_left: parseFloat(document.getElementById('u_left').value) || 0,
                u_back: parseFloat(document.getElementById('u_back').value) || 0,
                u_right: parseFloat(document.getElementById('u_right').value) || 0,
                u_height: parseFloat(document.getElementById('u_height').value) || 0,
                u_drawers: parseInt(document.getElementById('u_drawers').value) || 0,
                u_ray: document.getElementById('u_ray').value,
                u_material: document.getElementById('u_material').value,
                u_back_panel: document.getElementById('u_back_panel').value,
                u_hinges: parseInt(document.getElementById('u_hinges').value) || 0,
                u_hinge_type: document.getElementById('u_hinge_type').value,
                u_advance: parseFloat(document.getElementById('u_advance').value) || 0
            };
        }

        inputState.customerPhone = phone;
        inputState.customerDeliveryDate = deliveryDateVal;
        inputState.chkUseSheetCosting = document.getElementById('chkUseSheetCosting').checked;

        let savePromise;
        if(editingDocId) {
            savePromise = db.collection("ortak_teklifler").doc(editingDocId).get().then((doc) => {
                if(doc.exists) {
                    let docData = doc.data();
                    let odemeler = docData.odemeler || [];
                    
                    if(odemeler.length === 0) {
                        if (v.kaparo > 0) {
                            odemeler = [{
                                tutar: v.kaparo,
                                aciklama: "İlk Kaparo",
                                tarih: docData.tarih || new Date().toLocaleDateString('tr-TR')
                            }];
                        }
                    } else {
                        // İlk ödeme kaydını formda düzenlenen yeni kaparo değerine göre güncelle
                        odemeler[0].tutar = v.kaparo;
                    }
                    
                    let totalAlinan = odemeler.reduce((sum, item) => sum + parseFloat(item.tutar || 0), 0);
                    let kalanVal = v.toplam - totalAlinan;
                    
                    return db.collection("ortak_teklifler").doc(editingDocId).update({
                        musteri: name,
                        telefon: phone,
                        tahminiTeslimat: deliveryDateVal,
                        personel: staff,
                        m2: v.m2.toFixed(2),
                        kapakAdet: v.kapakAdet,
                        kapak: matName,
                        ray: selectRay,
                        toplamNum: v.toplam,
                        kaparoNum: totalAlinan,
                        kalanNum: kalanVal,
                        toplam: v.toplam.toLocaleString('tr-TR') + " ₺",
                        kaparo: totalAlinan.toLocaleString('tr-TR') + " ₺",
                        kalan: kalanVal.toLocaleString('tr-TR') + " ₺",
                        mobilyaTuru: v.type,
                        detaylar: v.detailsText,
                        inputState: inputState,
                        odemeler: odemeler
                    });
                } else {
                    throw new Error("Sipariş bulunamadı!");
                }
            });
        } else {
            let odemeler = [];
            if(v.kaparo > 0) {
                odemeler = [{
                    tutar: v.kaparo,
                    aciklama: "İlk Kaparo",
                    tarih: new Date().toLocaleDateString('tr-TR')
                }];
            }
            
            savePromise = db.collection("ortak_teklifler").add({
                musteri: name,
                telefon: phone,
                tahminiTeslimat: deliveryDateVal,
                personel: staff,
                durum: "Teklif Verildi",
                tarih: new Date().toLocaleDateString('tr-TR'),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                m2: v.m2.toFixed(2),
                kapakAdet: v.kapakAdet,
                kapak: matName,
                ray: selectRay,
                toplamNum: v.toplam,
                kaparoNum: v.kaparo,
                kalanNum: v.kalan,
                toplam: v.toplam.toLocaleString('tr-TR') + " ₺",
                kaparo: v.kaparo.toLocaleString('tr-TR') + " ₺",
                kalan: v.kalan.toLocaleString('tr-TR') + " ₺",
                mobilyaTuru: v.type,
                detaylar: v.detailsText,
                inputState: inputState,
                odemeler: odemeler
            });
        }

        savePromise.then(() => {
            alert(editingDocId ? "Sipariş başarıyla güncellendi!" : "Teklif başarıyla bulut havuzuna kaydedildi!");
            duzenlemeyiIptalEt(true);
            switchTab('takipView');
        }).catch(err => {
            alert("Kayıt hatası: " + err.message);
        });
    }

    // 💸 YENİ GİDER KAYDETME
    function giderKaydet() {
        let tur = document.getElementById('expType').value;
        let tutar = parseFloat(document.getElementById('expAmount').value) || 0;
        let desc = document.getElementById('expDesc').value.trim();
        
        if(tutar <= 0) { alert("Lütfen geçerli bir tutar girin!"); return; }

        db.collection("giderler").add({
            tur: tur,
            tutar: tutar,
            aciklama: desc,
            tarih: new Date().toLocaleDateString('tr-TR'),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert("Gider başarıyla kasaya işlendi!");
            document.getElementById('expAmount').value = "";
            document.getElementById('expDesc').value = "";
        }).catch(err => {
            alert("Gider kaydı hatası: " + err.message);
        });
    }

    // 📊 MUHASEBE RAPOR HESAPLAYICISI
    function muhasebeHesapla() {
        db.collection("ortak_teklifler").onSnapshot((snapshot) => {
            let totalCiro = 0; 
            let totalAlacak = 0;
            snapshot.forEach((doc) => {
                let data = doc.data();
                // We count ciro for any confirmed order (Imalat, Montaj, Tamamlandi)
                if(data.durum !== "Teklif Verildi") {
                    totalCiro += (data.toplamNum || 0);
                    totalAlacak += (data.kalanNum || 0);
                }
            });

            db.collection("giderler").onSnapshot((gSnapshot) => {
                let totalGider = 0;
                let giderDiv = document.getElementById('giderList');
                giderDiv.innerHTML = "";

                gSnapshot.forEach((gDoc) => {
                    let g = gDoc.data();
                    totalGider += g.tutar;

                    let gItem = document.createElement('div');
                    gItem.className = "expense-item";
                    gItem.innerHTML = `
                        <div class="expense-item-info">
                            <span class="expense-item-desc">${g.aciklama || g.tur}</span>
                            <span class="expense-item-cat">${g.tur} (${g.tarih})</span>
                        </div>
                        <div class="expense-item-cost">-${g.tutar.toLocaleString('tr-TR')} ₺</div>
                        ${isPatron ? `<button class="btn-delete-item" title="Sil" onclick="giderSil('${gDoc.id}')">
                            <svg style="width:16px; height:16px; fill:currentColor;" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>` : ''}
                    `;
                    giderDiv.appendChild(gItem);
                });

                if(gSnapshot.empty) {
                    giderDiv.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px 0;">Gider kaydı bulunmuyor.</div>';
                }

                let netKar = totalCiro - totalGider;
                
                // Write numbers in UI
                document.getElementById('m_ciro').innerText = totalCiro.toLocaleString('tr-TR') + " ₺";
                document.getElementById('m_gider').innerText = totalGider.toLocaleString('tr-TR') + " ₺";
                document.getElementById('m_kar').innerText = netKar.toLocaleString('tr-TR') + " ₺";
                document.getElementById('m_alacak').innerText = totalAlacak.toLocaleString('tr-TR') + " ₺";

                // Visual Bars and Percentages
                let totalPool = totalCiro > 0 ? totalCiro : (totalGider > 0 ? totalGider : 1);
                let expPercent = Math.min(100, Math.round((totalGider / totalPool) * 100));
                let profitPercent = Math.max(0, 100 - expPercent);
                
                if (totalCiro === 0 && totalGider > 0) {
                    expPercent = 100;
                    profitPercent = 0;
                }

                document.getElementById('giderOran').innerText = expPercent + "%";
                document.getElementById('karOran').innerText = profitPercent + "%";
                document.getElementById('barGider').style.width = expPercent + "%";
                document.getElementById('barKar').style.width = profitPercent + "%";
            });
        });
    }

    // 🌟 MÜŞTERİ YORUMLARI ERP LİSTENER'I
    // 🗄️ CANLI SİPARİŞ TAKİP HAREKETLERİ LİSTESİ
    function canliGezgin() {
        let search = document.getElementById('searchClient').value.toLowerCase().trim();
        let statusFilter = document.getElementById('filterStatus').value;

        db.collection("ortak_teklifler").orderBy("timestamp", "desc").onSnapshot((querySnapshot) => {
            let listeDiv = document.getElementById('archiveList'); 
            listeDiv.innerHTML = "";
            let counter = 0;

            querySnapshot.forEach((doc) => {
                let k = doc.data();
                
                // Search Filters
                if(search && !k.musteri.toLowerCase().includes(search)) return;
                if(statusFilter && k.durum !== statusFilter) return;

                counter++;

                let item = document.createElement('div');
                let cssClass = "status-teklif";
                let badgeClass = "badge-teklif";
                
                if(k.durum === "Onaylandı / İmalatta") { cssClass = "status-imalat"; badgeClass = "badge-imalat"; }
                else if(k.durum === "Montaj Aşamasında") { cssClass = "status-montaj"; badgeClass = "badge-montaj"; }
                else if(k.durum === "Tamamlandı") { cssClass = "status-tamam"; badgeClass = "badge-tamam"; }

                // Fallback for old database rows missing detailed descriptions
                let specsText = k.detaylar || `${k.m2} m² / ${k.kapakAdet} Kapak (${k.kapak || 'Lake'}) - Ray: ${k.ray || 'Klasik'}`;
                
                // Clean short variables for WhatsApp sharing from list
                let waMusteri = k.musteri;
                let waSpec = specsText;
                let waToplam = k.toplam;
                let waKaparo = k.kaparo;
                let waKalan = k.kalan;
                let trackingLink = window.location.origin + window.location.pathname + "?takip=" + doc.id;
                let shareMsg = `*DOĞANÇAY MOBİLYA*\n-----------------------------\n*Müşteri:* ${waMusteri}\n*Sipariş Detayı:* ${waSpec}\n\n*Ödeme Özeti:*\n💵 *Toplam:* ${waToplam}\n💰 *Kaparo:* ${waKaparo}\n⏳ *Kalan Bakiye:* *${waKalan}*\n\n*Canlı Sipariş Takip Linki:*\n${trackingLink}\n\nSipariş durumunu sistemimizden canlı takip edebilirsiniz. Hayırlı günler dileriz.`;

                item.className = `archive-card ${cssClass}`;
                item.innerHTML = `
                    <div class="archive-top">
                        <span class="archive-client">👤 ${k.musteri}</span>
                        <span class="archive-date">📅 ${k.tarih}</span>
                    </div>
                    <div class="archive-details">
                        ✍️ <b>Tasarımcı:</b> ${k.personel}<br>
                        📐 <b>Özellikler:</b> ${specsText}<br>
                        💵 <b>Hesap:</b> Toplam: <b style="color:var(--primary); font-size:14px;">${k.toplam}</b> | Alınan: <span style="color:var(--success); font-weight:600;">${k.kaparo}</span> | Kalan Alacak: <b style="color:#38bdf8;">${k.kalan}</b>
                    </div>
                    <div class="archive-actions">
                        <div>
                            <span class="badge ${badgeClass}">${k.durum}</span>
                            <select onchange="durumGuncelle('${doc.id}', this.value)" style="margin-left:8px; display:inline-block; vertical-align:middle; border-radius:4px; padding:3px 5px;">
                                <option value="">⚙️ Durumu Değiştir</option>
                                <option value="Teklif Verildi">🟡 Teklif Aşaması</option>
                                <option value="Onaylandı / İmalatta">🔵 İmalat Aşaması</option>
                                <option value="Montaj Aşamasında">🟣 Montaj Aşaması</option>
                                <option value="Tamamlandı">🟢 Tamamlandı (Teslim)</option>
                            </select>
                        </div>
                        <div style="display:flex; gap: 8px; align-items:center;">
                            <button class="btn btn-secondary" style="padding:6px 10px; font-size:11px; background-color: var(--primary); color: #000; font-weight: bold; border: none;" onclick="teklifDuzenle('${doc.id}')">
                                Düzenle
                            </button>
                            <button class="btn btn-secondary" style="padding:6px 10px; font-size:11px; background-color: #22c55e; color: #000; font-weight: bold; border: none;" onclick="openPaymentModal('${doc.id}')">
                                💳 Ödemeler
                            </button>
                            <button class="btn btn-secondary" style="padding:6px 10px; font-size:11px; background-color: #0f172a; color: #fff; border: 1px solid #475569;" onclick="kopyalaTakipLinki('${doc.id}')" title="Müşteri Sipariş Takip Linki Kopyala">
                                🔗 Takip Linki
                            </button>
                            <button class="btn btn-secondary" style="padding:6px 10px; font-size:11px;" onclick="whatsappPaylas('${encodeURIComponent(shareMsg)}')">
                                WhatsApp
                            </button>
                            <button class="btn btn-secondary" style="padding:6px 10px; font-size:11px;" onclick="yazdirListeden('${doc.id}')">
                                Yazdır (PDF)
                            </button>
                            ${isPatron ? `<button class="btn-delete-item" title="Kayıt Sil" onclick="sistemdenSil('${doc.id}')">
                                <svg style="width:18px; height:18px; fill:currentColor;" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                            </button>` : ''}
                        </div>
                    </div>
                `;
                listeDiv.appendChild(item);
            });

            if(counter === 0) {
                listeDiv.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 40px 0;">Arama kriterlerine uygun sipariş bulunamadı.</div>';
            }
        });
    }

    function durumGuncelle(docId, yeniDurum) { 
        if(yeniDurum) {
            db.collection("ortak_teklifler").doc(docId).update({ 
                durum: yeniDurum 
            }).then(() => {
                alert("Sipariş durumu güncellendi!");
            }).catch(err => {
                alert("Hata: " + err.message);
            });
        } 
    }
    
    function sistemdenSil(docId) { 
        if(confirm("Bu kaydı bulut veri tabanından tamamen silmek istediğinize emin misiniz? (Bu işlem geri alınamaz!)")) {
            db.collection("ortak_teklifler").doc(docId).delete().then(() => {
                alert("Kayıt silindi!");
            }); 
        }
    }

    function giderSil(docId) {
        if(confirm("Bu gider kaydını kasadan silmek istediğinize emin misiniz?")) {
            db.collection("giderler").doc(docId).delete().then(() => {
                alert("Gider silindi!");
            });
        }
    }

    // 💬 WHATSAPP MESAJ GÖNDERİMİ (AKTİF TASARIM EKRANINDAN)
    function whatsappSistem() {
        let musteri = document.getElementById('customerName').value.trim() || "Değerli Müşterimiz";
        let spec = getSpecificationText();
        let v = hesaplaVeCiz();
        
        let typeNames = { gardırop: "Gardırop", mutfak: "Mutfak Dolabı", vestiyer: "Vestiyer", banyo: "Banyo Dolabı", ozel: "Özel Tasarım Mobilya", udolap: "U Dolap" };
        
        let mesaj = `*DOĞANÇAY MOBİLYA*\n`;
        mesaj += `-----------------------------\n`;
        mesaj += `*Müşteri:* ${musteri}\n`;
        mesaj += `*Ürün Grubu:* ${typeNames[v.type]}\n`;
        mesaj += `*Tasarım Detayı:* ${spec}\n\n`;
        mesaj += `*ÖDEME PLANI ÖZETİ:*\n`;
        mesaj += `💵 *Toplam Tutar:* *${v.toplam.toLocaleString('tr-TR')} ₺*\n`;
        mesaj += `💰 *Alınan Kaparo:* ${v.kaparo.toLocaleString('tr-TR')} ₺\n`;
        mesaj += `⏳ *Montaj Sonu Kalan:* *${v.kalan.toLocaleString('tr-TR')} ₺*\n\n`;
        mesaj += `Sipariş detaylarınız atölye imalat havuzumuza kaydedilmiştir. Bizi tercih ettiğiniz için teşekkür ederiz.`;
        
        window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(mesaj), '_blank');
    }

    function whatsappPaylas(msgString) {
        window.open("https://api.whatsapp.com/send?text=" + msgString, '_blank');
    }

    function kopyalaTakipLinki(docId) {
        let link = window.location.origin + window.location.pathname + "?takip=" + docId;
        navigator.clipboard.writeText(link).then(() => {
            alert("Müşteri sipariş takip linki panoya kopyalandı:\n" + link);
        }).catch(err => {
            alert("Link kopyalanamadı: " + err);
        });
    }

    // 🖨️ PDF YAZDIRICI (AKTİF TASARIM EKRANINDAN)
    function yazdirTeklif() {
        let canvas = document.getElementById('dolapCanvas');
        let printImg = document.getElementById('printCanvasImg');
        printImg.src = canvas.toDataURL("image/png");
        
        document.getElementById('printCustomer').innerText = document.getElementById('customerName').value.trim() || "Müşteri Belirtilmedi";
        document.getElementById('printStaff').innerText = document.getElementById('staffName').value;
        document.getElementById('printDate').innerText = new Date().toLocaleDateString('tr-TR');
        
        let type = document.getElementById('mobilyaTuru').value;
        let typeNames = { gardırop: "Gardırop", mutfak: "Mutfak Dolabı", vestiyer: "Vestiyer", banyo: "Banyo Dolabı", ozel: "Özel Tasarım", udolap: "U Dolap" };
        document.getElementById('printType').innerText = typeNames[type];
        document.getElementById('printSpecs').innerText = getSpecificationText();
        
        let v = hesaplaVeCiz();
        document.getElementById('printTotal').innerText = v.toplam.toLocaleString('tr-TR') + " ₺";
        document.getElementById('printAdvance').innerText = v.kaparo.toLocaleString('tr-TR') + " ₺";
        document.getElementById('printBalance').innerText = v.kalan.toLocaleString('tr-TR') + " ₺";
        
        document.body.classList.add('print-mode-teklif');
        window.print();
        document.body.classList.remove('print-mode-teklif');
    }

    // 🖨️ LİSTEDEN YAZDIRMA (KAYITLI ESKİ/YENİ SİPARİŞİ PDF YAPMA)
    function yazdirListeden(docId) {
        db.collection("ortak_teklifler").doc(docId).get().then((doc) => {
            if(doc.exists) {
                let data = doc.data();
                
                document.getElementById('printCustomer').innerText = data.musteri;
                document.getElementById('printStaff').innerText = data.personel;
                document.getElementById('printDate').innerText = data.tarih || new Date().toLocaleDateString('tr-TR');
                
                let typeNames = { gardırop: "Gardırop", mutfak: "Mutfak Dolabı", vestiyer: "Vestiyer", banyo: "Banyo Dolabı", ozel: "Özel Tasarım", udolap: "U Dolap" };
                document.getElementById('printType').innerText = typeNames[data.mobilyaTuru] || "Gardırop";
                document.getElementById('printSpecs').innerText = data.detaylar || `${data.m2} m² / ${data.kapakAdet} Kapak (${data.kapak}) - Ray: ${data.ray}`;
                
                document.getElementById('printTotal').innerText = data.toplam;
                document.getElementById('printAdvance').innerText = data.kaparo;
                document.getElementById('printBalance').innerText = data.kalan;
                
                // Hide canvas drawing block in list prints since we print old details
                document.getElementById('printCanvasImg').parentElement.style.display = 'none';
                
                document.body.classList.add('print-mode-teklif');
                window.print();
                document.body.classList.remove('print-mode-teklif');
                
                // Reset visibility for canvas box
                document.getElementById('printCanvasImg').parentElement.style.display = 'block';
            }
        });
    }

    window.editingDocId = null;
    window.editingGModules = null;
    window.editingGHandle = null;
    window.editingGLed = null;

    function teklifDuzenle(docId) {
        db.collection("ortak_teklifler").doc(docId).get().then((doc) => {
            if(doc.exists) {
                let data = doc.data();
                editingDocId = docId;
                
                document.getElementById('editClientName').innerText = data.musteri || "";
                document.getElementById('editModeBanner').style.display = 'flex';
                document.getElementById('btnKaydet').innerHTML = `
                    <svg style="width: 18px; height: 18px; fill: currentColor;" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"/></svg>
                    Değişiklikleri Kaydet (Siparişi Güncelle)
                `;
                
                document.getElementById('customerName').value = data.musteri || "";
                document.getElementById('staffName').value = data.personel || "Mustafa Doğançay";
                
                let type = data.mobilyaTuru || "gardırop";
                selectFurnitureType(type);
                
                if(data.inputState) {
                    for(let key in data.inputState) {
                        let el = document.getElementById(key);
                        if(el) {
                            if (el.type === 'checkbox') {
                                  el.checked = !!data.inputState[key];
                            } else {
                                  el.value = data.inputState[key];
                            }
                        }
                    }
                    
                    if (data.inputState.g_modules) {
                        editingGModules = data.inputState.g_modules;
                    } else {
                        editingGModules = null;
                    }
                    if (data.inputState.g_handle) {
                        editingGHandle = data.inputState.g_handle;
                    } else {
                        editingGHandle = null;
                    }
                    if (data.inputState.g_led) {
                        editingGLed = data.inputState.g_led;
                    } else {
                        editingGLed = null;
                    }
                } else {
                    editingGModules = null;
                    editingGHandle = null;
                }
                
                switchTab('teklifView');
                hesaplaVeCiz();
            } else {
                alert("Sipariş bulunamadı!");
            }
        }).catch(err => {
            alert("Hata: " + err.message);
        });
    }

    function duzenlemeyiIptalEt(onlyClearState) {
        editingDocId = null;
        editingGModules = null;
        editingGHandle = null;
        editingGLed = null;
        document.getElementById('editModeBanner').style.display = 'none';
        document.getElementById('btnKaydet').innerHTML = `
            <svg style="width: 18px; height: 18px; fill: currentColor;" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"/></svg>
            Siparişi Ortak Bulut Havuzuna Kaydet
        `;

        if (!onlyClearState) {
            document.getElementById('customerName').value = "";
            if (document.getElementById('customerPhone')) {
                document.getElementById('customerPhone').value = "";
            }
            if (document.getElementById('customerDeliveryDate')) {
                document.getElementById('customerDeliveryDate').value = "";
            }
            
            // Reset advance payments and check state
            document.getElementById('g_advance').value = "0";
            document.getElementById('k_advance').value = "0";
            document.getElementById('v_advance').value = "0";
            document.getElementById('b_advance').value = "0";
            document.getElementById('o_advance').value = "0";
            document.getElementById('u_advance').value = "0";
            
            if (document.getElementById('chkUseSheetCosting')) {
                document.getElementById('chkUseSheetCosting').checked = false;
            }
            
            hesaplaVeCiz();
        }
    }

    // ==========================================
    // 🪵 2D GİYOTİN PLAKA KESİM OPTİMİZASYON KODLARI
    // ==========================================

    // ==========================================
    // 📊 MÜŞTERİ SİPARİŞ TAKİP PORTALI KODLARI
    // ==========================================
    window.currentTrackingData = null;

    function sorgulaSiparis() {
        let query = document.getElementById('trackSearchInput').value.trim();
        if (!query) { alert("Lütfen Sipariş Kodu veya Telefon Numarası girin!"); return; }
        
        let isPhone = /^[0-9+\s()-]{7,15}$/.test(query);
        let cleanQuery = query.replace(/[^0-9]/g, "");
        
        if (isPhone) {
            let phoneQuery1 = cleanQuery;
            let phoneQuery2 = cleanQuery.startsWith('0') ? cleanQuery.substring(1) : '0' + cleanQuery;
            
            db.collection("ortak_teklifler")
                .where("telefon", "in", [phoneQuery1, phoneQuery2, query])
                .get()
                .then((snapshot) => {
                    if (snapshot.empty) {
                        alert("Bu telefon numarasına ait aktif sipariş bulunamadı!");
                    } else if (snapshot.size === 1) {
                        let doc = snapshot.docs[0];
                        loadOrderTracking(doc.id, doc.data());
                    } else {
                        showMultiSelectTracking(snapshot);
                    }
                })
                .catch(err => {
                    alert("Arama hatası: " + err.message);
                });
        } else {
            let docId = query;
            if (query.startsWith("dm_")) {
                docId = query.substring(3);
            }
            db.collection("ortak_teklifler").doc(docId).get().then((doc) => {
                if (doc.exists) {
                    loadOrderTracking(doc.id, doc.data());
                } else {
                    alert("Girdiğiniz Sipariş Kodu bulunamadı! Lütfen kodu kontrol edin.");
                }
            }).catch(err => {
                alert("Arama hatası: " + err.message);
            });
        }
    }

    function showMultiSelectTracking(snapshot) {
        document.getElementById('trackingMultiSelect').style.display = 'block';
        document.getElementById('trackingDetailsPanel').style.display = 'none';
        
        let listContainer = document.getElementById('trackingMultiList');
        listContainer.innerHTML = '';
        
        let localTypeNames = {
            gardırop: "Gardırop",
            mutfak: "Mutfak Dolabı",
            vestiyer: "Vestiyer",
            banyo: "Banyo Dolabı",
            udolap: "U-Dolap",
            ozel: "Özel Tasarım"
        };
        
        snapshot.forEach((doc) => {
            let data = doc.data();
            let div = document.createElement('div');
            div.style.padding = '12px';
            div.style.border = '1px solid var(--border)';
            div.style.borderRadius = '6px';
            div.style.backgroundColor = 'var(--bg-dark)';
            div.style.cursor = 'pointer';
            div.style.display = 'flex';
            div.style.justifyContent = 'space-between';
            div.style.alignItems = 'center';
            div.style.transition = 'border-color 0.2s';
            
            div.onmouseover = function() { this.style.borderColor = 'var(--primary)'; };
            div.onmouseout = function() { this.style.borderColor = 'var(--border)'; };
            
            let mobType = localTypeNames[data.mobilyaTuru] || "Mobilya Siparişi";
            div.innerHTML = `
                <div>
                    <strong style="color:var(--text-light); font-size:13px;">${mobType} (${data.tarih})</strong>
                    <div style="font-size:11px; color:var(--text-muted); margin-top:3px;">Tutar: ${data.toplam} | Kalan: ${data.kalan}</div>
                </div>
                <span class="badge badge-teklif" style="margin:0;">${data.durum}</span>
            `;
            
            div.onclick = function() {
                loadOrderTracking(doc.id, data);
            };
            listContainer.appendChild(div);
        });
        
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('customerTrackingScreen').style.display = 'block';
    }

    function loadOrderTracking(docId, data) {
        currentTrackingData = data;
        currentTrackingData.id = docId;
        
        document.getElementById('trackingMultiSelect').style.display = 'none';
        document.getElementById('trackingDetailsPanel').style.display = 'block';
        
        document.getElementById('trackMusteriVal').innerText = data.musteri || "-";
        document.getElementById('trackTarihVal').innerText = data.tarih || "-";
        document.getElementById('trackPersonelVal').innerText = data.personel || "Mustafa Doğançay";
        
        let localTypeNames = {
            gardırop: "Gardırop",
            mutfak: "Mutfak Dolabı",
            vestiyer: "Vestiyer",
            banyo: "Banyo Dolabı",
            udolap: "U-Dolap",
            ozel: "Özel Tasarım"
        };
        document.getElementById('trackTurVal').innerText = localTypeNames[data.mobilyaTuru] || "Özel Proje";
        
        let specsText = data.detaylar || `${data.m2} m² / ${data.kapakAdet} Kapak (${data.kapak}) - Ray: ${data.ray}`;
        document.getElementById('trackSpecsVal').innerText = specsText;
        
        // Ödemeler geçmişini topla
        let odemeler = data.odemeler || [];
        if (odemeler.length === 0 && (data.kaparoNum || 0) > 0) {
            odemeler = [{
                tutar: data.kaparoNum,
                aciklama: "İlk Kaparo",
                tarih: data.tarih || new Date().toLocaleDateString('tr-TR')
            }];
        }
        
        let totalAlinan = odemeler.reduce((sum, item) => sum + parseFloat(item.tutar || 0), 0);
        let totalNum = data.toplamNum || 0;
        let kalan = totalNum - totalAlinan;
        
        document.getElementById('trackToplamVal').innerText = data.toplam || "0 ₺";
        document.getElementById('trackKaparoVal').innerText = totalAlinan.toLocaleString('tr-TR') + " ₺";
        document.getElementById('trackKalanVal').innerText = kalan.toLocaleString('tr-TR') + " ₺";
        
        // Müşteri için ödeme geçmişi listesi çiz
        let trackHistoryCard = document.getElementById('trackPaymentHistoryCard');
        let trackHistoryList = document.getElementById('trackPaymentHistoryList');
        if (trackHistoryCard && trackHistoryList) {
            if (odemeler.length > 0) {
                trackHistoryList.innerHTML = '';
                odemeler.forEach((pay) => {
                    let item = document.createElement('div');
                    item.className = 'payment-history-item';
                    item.style.backgroundColor = 'var(--bg-dark)';
                    item.innerHTML = `
                        <div>
                            <span style="font-weight:600; color:var(--text-light);">${pay.tutar.toLocaleString('tr-TR')} ₺</span>
                            <span style="color:var(--text-muted); margin-left:8px; font-size:11px;">(${pay.aciklama})</span>
                        </div>
                        <span style="color:var(--text-muted); font-size:11px;">${pay.tarih}</span>
                    `;
                    trackHistoryList.appendChild(item);
                });
                trackHistoryCard.style.display = 'block';
            } else {
                trackHistoryCard.style.display = 'none';
            }
        }
        
        setTrackingTimeline(data.durum);
        
        // --- Tahmini Teslimat Tarihi Gösterimi ---
        let trackTeslimatVal = document.getElementById('trackTeslimatVal');
        if (trackTeslimatVal) {
            if (data.tahminiTeslimat) {
                let parts = data.tahminiTeslimat.split('-');
                if (parts.length === 3) {
                    trackTeslimatVal.innerText = `${parts[2]}.${parts[1]}.${parts[0]}`;
                } else {
                    trackTeslimatVal.innerText = data.tahminiTeslimat;
                }
            } else {
                trackTeslimatVal.innerText = "-";
            }
        }
        
        // --- Dinamik Teslimat Geri Sayım Sayacı ---
        let countdownBadge = document.getElementById('trackCountdownBadge');
        if (countdownBadge) {
            if (data.durum === "Tamamlandı" || !data.tahminiTeslimat) {
                countdownBadge.style.display = 'none';
            } else {
                let deliveryDate = new Date(data.tahminiTeslimat);
                deliveryDate.setHours(0, 0, 0, 0);
                
                let today = new Date();
                today.setHours(0, 0, 0, 0);
                
                let diffTime = deliveryDate.getTime() - today.getTime();
                let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                countdownBadge.style.display = 'inline-block';
                if (diffDays > 0) {
                    countdownBadge.innerHTML = `🚚 Montaj ve Teslime Son <strong>${diffDays}</strong> Gün!`;
                    countdownBadge.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.15))';
                    countdownBadge.style.color = 'var(--primary)';
                    countdownBadge.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                } else if (diffDays === 0) {
                    countdownBadge.innerHTML = `🎉 Bugün Montaj ve Teslimat Günü!`;
                    countdownBadge.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))';
                    countdownBadge.style.color = 'var(--success)';
                    countdownBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                } else {
                    countdownBadge.innerHTML = `🛠️ Montaj Hazırlıkları ve Son Rötuşlar Yapılıyor`;
                    countdownBadge.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(29, 78, 216, 0.15))';
                    countdownBadge.style.color = 'var(--info)';
                    countdownBadge.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                }
            }
        }

        // --- Dinamik Mobilya Kullanım & Bakım Rehberi ---
        let careGuideCard = document.getElementById('trackCareGuideCard');
        let careGuideList = document.getElementById('trackCareGuideList');
        if (careGuideCard && careGuideList) {
            careGuideList.innerHTML = '';
            let hasGuide = false;
            
            let kapakLower = (data.kapak || '').toLowerCase();
            if (kapakLower.includes('lake')) {
                hasGuide = true;
                let box = document.createElement('div');
                box.className = 'care-guide-box';
                box.innerHTML = `
                    <div class="care-guide-title">🎨 Lake Mobilya Temizlik & Bakım Rehberi</div>
                    <ul class="care-guide-list">
                        <li><strong>Yumuşak Bez Kullanın:</strong> Sadece nemlendirilmiş yumuşak mikrofiber bezler tercih edin. Aşındırıcı sünger veya tel bez kullanmayın.</li>
                        <li><strong>Kimyasallardan Kaçının:</strong> Tiner, çamaşır suyu, aseton, alkol bazlı temizleyiciler lake cilasına kalıcı zarar verir. Hafif sabunlu ılık su yeterlidir.</li>
                        <li><strong>Hemen Kurulayın:</strong> Nemli bezle silindikten sonra yüzeyde su damlacığı bırakılmamalı, kuru bezle hafifçe kurulanmalıdır.</li>
                        <li><strong>Güneş Işığından Koruyun:</strong> Doğrudan ve yoğun güneş ışığı lake renginin zamanla sararmasına yol açabilir.</li>
                    </ul>
                `;
                careGuideList.appendChild(box);
            } else if (kapakLower.includes('mdf') || kapakLower.includes('suntalam') || kapakLower.includes('gövde')) {
                hasGuide = true;
                let box = document.createElement('div');
                box.className = 'care-guide-box';
                box.innerHTML = `
                    <div class="care-guide-title">🪵 MDF Lam & Ahşap Yüzeyler Bakım Rehberi</div>
                    <ul class="care-guide-list">
                        <li><strong>Neme Karşı Koruyun:</strong> Yüzeyler neme dayanıklı olsa da birleşim noktalarından su sızması şişme yapabilir. Dökülen sıvıları hemen kurulayın.</li>
                        <li><strong>Hafif Temizlik:</strong> Nemli sabunlu bezle silinip hemen kurulanması yeterlidir. Çok ıslak temizlikten kaçının.</li>
                        <li><strong>Çizilmelere Dikkat:</strong> Yüzey üzerinde sert veya keskin objeleri sürüklemeyin, altlık kullanmaya özen gösterin.</li>
                    </ul>
                `;
                careGuideList.appendChild(box);
            } else if (kapakLower.includes('cam')) {
                hasGuide = true;
                let box = document.createElement('div');
                box.className = 'care-guide-box';
                box.innerHTML = `
                    <div class="care-guide-title">✨ Cam & Metal Aksesuar Bakım Rehberi</div>
                    <ul class="care-guide-list">
                        <li><strong>Cam Temizleyici:</strong> Standart cam temizleyiciler ve mikrofiber bez kullanılabilir.</li>
                        <li><strong>Metal Çerçeveler:</strong> Alüminyum profilleri aşındırıcı asidik temizleyicilerle silmeyin.</li>
                        <li><strong>Menteşe Bakımı:</strong> Kapakları sertçe çarpmayın, fren mekanizmalarının sağlıklı çalışması için menteşeleri zorlamayın.</li>
                    </ul>
                `;
                careGuideList.appendChild(box);
            }
            
            if (data.mobilyaTuru === 'mutfak' && data.inputState) {
                let countertop = data.inputState.k_countertop || 'yok';
                if (countertop === 'ahsap') {
                    hasGuide = true;
                    let box = document.createElement('div');
                    box.className = 'care-guide-box';
                    box.innerHTML = `
                        <div class="care-guide-title">🌳 Doğal Masif Ahşap Tezgah Kullanım Rehberi</div>
                        <ul class="care-guide-list">
                            <li><strong>Sıcak ve Islaklık:</strong> Üzerinde doğrudan sıcak tencere bırakmayın. Su birikintilerini derhal kurulayın.</li>
                            <li><strong>Periyodik Yağlama:</strong> Tezgahınızın ömrünü uzatmak için yılda 1-2 kez koruyucu doğal yağ (örneğin keten tohumu yağı) uygulayınız.</li>
                            <li><strong>Kesme Tahtası Kullanımı:</strong> Tezgah üzerinde doğrudan kesim yapmayın, bıçak izleri ahşabı zedeleyebilir.</li>
                        </ul>
                    `;
                    careGuideList.appendChild(box);
                } else if (countertop === 'granit') {
                    hasGuide = true;
                    let box = document.createElement('div');
                    box.className = 'care-guide-box';
                    box.innerHTML = `
                        <div class="care-guide-title">💎 Doğal Granit Tezgah Kullanım Rehberi</div>
                        <ul class="care-guide-list">
                            <li><strong>Kimyasal Koruma:</strong> Por çözücü, tuz ruhu veya güçlü asidik temizlik kimyasalları granitin cilasını matlaştırır. Nötr sabunlu su kullanın.</li>
                            <li><strong>Sıcaklık Dayanımı:</strong> Granit sıcağa oldukça dayanıklıdır ancak ani termal şokları önlemek için sıcak tencerelerin altına nihale koyulması tavsiye edilir.</li>
                        </ul>
                    `;
                    careGuideList.appendChild(box);
                } else if (countertop === 'cimstone') {
                    hasGuide = true;
                    let box = document.createElement('div');
                    box.className = 'care-guide-box';
                    box.innerHTML = `
                        <div class="care-guide-title">💠 Çimstone & Kuvars Tezgah Kullanım Rehberi</div>
                        <ul class="care-guide-list">
                            <li><strong>Leke Direnci:</strong> Gözeneksiz yapısı sayesinde leke tutmaz. Ancak çay, kahve veya limon gibi asidik gıdalar döküldüğünde kurumadan silinmelidir.</li>
                            <li><strong>Kimyasal Hassasiyeti:</strong> Çamaşır suyu veya asidik temizleyiciler yerine pH nötr genel temizleyiciler kullanın.</li>
                        </ul>
                    `;
                    careGuideList.appendChild(box);
                } else if (countertop === 'laminat') {
                    hasGuide = true;
                    let box = document.createElement('div');
                    box.className = 'care-guide-box';
                    box.innerHTML = `
                        <div class="care-guide-title">🎛️ Laminat Tezgah Kullanım Rehberi</div>
                        <ul class="care-guide-list">
                            <li><strong>Isı ve Kesme:</strong> Doğrudan sıcak tencere koymayın, laminat yüzeyi eriyebilir veya kabarcık yapabilir. Doğrudan üzerinde kesim yapmayın.</li>
                            <li><strong>Su Sızdırmazlığı:</strong> Evye birleşim yerlerinde ve kenar bantlarında su birikmesini önleyin, aksi takdirde MDF gövde şişebilir.</li>
                        </ul>
                    `;
                    careGuideList.appendChild(box);
                }
            }
            
            if (!hasGuide) {
                let box = document.createElement('div');
                box.className = 'care-guide-box';
                box.innerHTML = `
                    <div class="care-guide-title">🛋️ Genel Mobilya Kullanım Rehberi</div>
                    <ul class="care-guide-list">
                        <li><strong>Temizlik:</strong> Nemli yumuşak mikrofiber bezle silip hemen kurulayınız. Aşındırıcı sünger ve sert kimyasal kullanmayınız.</li>
                        <li><strong>Nem ve Isı:</strong> Mobilyaları aşırı sıcak, soğuk veya nemli ortamlardan koruyunuz.</li>
                        <li><strong>Kullanım:</strong> Kapak ve çekmeceleri sert kapatmayınız, aşırı yüklemeden kaçınınız.</li>
                    </ul>
                `;
                careGuideList.appendChild(box);
            }
            
            careGuideCard.style.display = 'block';
        }
        
        if (data.inputState) {
            renderTrackingDesign(data.inputState);
        } else {
            document.getElementById('customerCanvasWrapper').innerHTML = '<div style="color:var(--text-muted); font-size:12px;">Bu sipariş için 2D tasarım modeli bulunmamaktadır.</div>';
        }
        
        // --- Siparişi Değerlendir Paneli (Yorum & Puanlama) ---
        let trackReviewCard = document.getElementById('trackReviewCard');
        if (trackReviewCard) {
            if (data.durum === "Tamamlandı") {
                trackReviewCard.style.display = 'block';
                // Check if a review already exists in database
                db.collection("reviews").doc(docId).get().then((reviewDoc) => {
                    if (reviewDoc.exists) {
                        let reviewData = reviewDoc.data();
                        let starsHtml = '';
                        for (let i = 1; i <= 5; i++) {
                            starsHtml += `<span style="color: ${i <= reviewData.rating ? '#fbbf24' : 'var(--border)'}; font-size: 20px; margin-right: 2px;">★</span>`;
                        }
                        document.getElementById('trackReviewFormContainer').style.display = 'none';
                        let resultContainer = document.getElementById('trackReviewResultContainer');
                        resultContainer.innerHTML = `
                            <div style="background-color: var(--bg-dark); padding: 12px; border-radius: 8px; border: 1px solid var(--border);">
                                <span style="font-size: 11px; color: var(--success); font-weight: 600; display: block; margin-bottom: 5px;">✓ Değerlendirmeniz Kaydedildi</span>
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                    <span style="font-size: 12px; font-weight: 700; color: var(--text-light);">Puanınız:</span>
                                    <div>${starsHtml}</div>
                                </div>
                                ${reviewData.comment ? `
                                <div style="font-size: 12px; color: var(--text-muted); font-style: italic; line-height: 1.4; border-top: 1px solid var(--border); padding-top: 6px; margin-top: 6px;">
                                    "${reviewData.comment}"
                                </div>` : ''}
                            </div>
                        `;
                        resultContainer.style.display = 'block';
                    } else {
                        // Reset form
                        document.getElementById('trackReviewFormContainer').style.display = 'block';
                        document.getElementById('trackReviewResultContainer').style.display = 'none';
                        resetInteractiveRating();
                    }
                }).catch(err => {
                    console.error("Yorum kontrol hatası:", err);
                    document.getElementById('trackReviewFormContainer').style.display = 'block';
                    document.getElementById('trackReviewResultContainer').style.display = 'none';
                    resetInteractiveRating();
                });
            } else {
                trackReviewCard.style.display = 'none';
            }
        }
        
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('customerTrackingScreen').style.display = 'block';
    }

    function setTrackingTimeline(status) {
        let steps = ['step_teklif', 'step_imalat', 'step_montaj', 'step_tamam'];
        steps.forEach(id => {
            let el = document.getElementById(id);
            if (el) el.className = 'timeline-step';
        });
        
        let progressLine = document.getElementById('trackProgressLine');
        let banner = document.getElementById('trackStatusBanner');
        
        let activeIndex = 0;
        
        if (status === "Teklif Verildi") {
            activeIndex = 0;
            banner.innerText = "🟡 Teklif Hazırlandı - Onay Bekliyor";
            banner.style.backgroundColor = "rgba(217, 119, 6, 0.1)";
            banner.style.color = "#d97706";
        } else if (status === "Onaylandı / İmalatta") {
            activeIndex = 1;
            banner.innerText = "🔵 Siparişiniz Atölyede İmalat Aşamasında";
            banner.style.backgroundColor = "rgba(59, 130, 246, 0.15)";
            banner.style.color = "#3b82f6";
        } else if (status === "Montaj Aşamasında") {
            activeIndex = 2;
            banner.innerText = "🟣 Ürünleriniz Adrese Nakliye ve Montaj Aşamasında";
            banner.style.backgroundColor = "rgba(168, 85, 247, 0.15)";
            banner.style.color = "#a855f7";
        } else if (status === "Tamamlandı") {
            activeIndex = 3;
            banner.innerText = "🟢 Siparişiniz Tamamlandı ve Teslim Edildi";
            banner.style.backgroundColor = "rgba(34, 197, 94, 0.15)";
            banner.style.color = "#22c55e";
        }
        
        for(let i = 0; i <= activeIndex; i++) {
            let stepId = steps[i];
            let el = document.getElementById(stepId);
            if (el) {
                if (i === activeIndex) {
                    el.className = 'timeline-step active';
                } else {
                    el.className = 'timeline-step completed';
                }
            }
        }
        
        let percent = (activeIndex / (steps.length - 1)) * 100;
        if (progressLine) progressLine.style.width = percent + "%";
    }

    // ==========================================

    function renderTrackingDesign(inputState) {
        let canvas = document.getElementById('dolapCanvas');
        let trackWrapper = document.getElementById('customerCanvasWrapper');
        if (canvas && trackWrapper) {
            trackWrapper.innerHTML = '';
            trackWrapper.appendChild(canvas);
        }
        
        for (let key in inputState) {
            let el = document.getElementById(key);
            if (el) {
                if (el.type === 'checkbox') {
                    el.checked = !!inputState[key];
                } else {
                    el.value = inputState[key];
                }
            }
        }
        
        let savedPreviewMode = 'lux';
        setTrackPreviewMode(savedPreviewMode);
    }

    function setTrackPreviewMode(mode) {
        let btnBlueprint = document.getElementById('btnTrackBlueprint');
        let btnLux = document.getElementById('btnTrackLux');
        
        if (btnBlueprint && btnLux) {
            if (mode === 'lux') {
                btnBlueprint.classList.remove('active');
                btnLux.classList.add('active');
            } else {
                btnBlueprint.classList.add('active');
                btnLux.classList.remove('active');
            }
        }
        setPreviewMode(mode);
    }

    function takipKapat() {
        let canvas = document.getElementById('dolapCanvas');
        let originalWrapper = document.querySelector('#appScreen .canvas-wrapper');
        if (canvas && originalWrapper) {
            originalWrapper.insertBefore(canvas, originalWrapper.firstChild);
        }
        
        duzenlemeyiIptalEt(false);
        
        document.getElementById('customerTrackingScreen').style.display = 'none';
        document.getElementById('selfDesignScreen').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'block';
    }

    // ==========================================
    // 💳 KISMİ ÖDEME (TAHSİLAT) TAKİP KODLARI
    // ==========================================
    window.activePaymentDocId = null;
    window.activePaymentDocData = null;

    function openPaymentModal(docId) {
        activePaymentDocId = docId;
        
        db.collection("ortak_teklifler").doc(docId).get().then((doc) => {
            if (doc.exists) {
                let data = doc.data();
                activePaymentDocData = data;
                
                document.getElementById('payModalMusteri').innerText = data.musteri || "";
                document.getElementById('payModalToplam').innerText = data.toplam || "0 ₺";
                
                // Ödeme geçmişi dizisini al veya mevcut kaparo bilgisini ilk ödeme olarak yükle
                let odemeler = data.odemeler || [];
                if (odemeler.length === 0 && (data.kaparoNum || 0) > 0) {
                    odemeler = [{
                        tutar: data.kaparoNum,
                        aciklama: "İlk Kaparo",
                        tarih: data.tarih || new Date().toLocaleDateString('tr-TR')
                    }];
                }
                
                // Toplam tahsilatı ve kalan bakiyeyi hesapla
                let totalAlinan = odemeler.reduce((sum, item) => sum + parseFloat(item.tutar || 0), 0);
                let totalNum = data.toplamNum || 0;
                let kalan = totalNum - totalAlinan;
                
                document.getElementById('payModalAlinan').innerText = totalAlinan.toLocaleString('tr-TR') + " ₺";
                document.getElementById('payModalKalan').innerText = kalan.toLocaleString('tr-TR') + " ₺";
                
                // Ödeme listesini modal arayüzüne çiz
                let historyContainer = document.getElementById('payModalHistoryList');
                historyContainer.innerHTML = '';
                
                if (odemeler.length === 0) {
                    historyContainer.innerHTML = '<div style="color:var(--text-muted); font-size:11px; text-align:center; padding:10px;">Henüz ödeme kaydı bulunmuyor.</div>';
                } else {
                    odemeler.forEach((pay, idx) => {
                        let item = document.createElement('div');
                        item.className = 'payment-history-item';
                        item.innerHTML = `
                            <div>
                                <span style="font-weight:600; color:var(--text-light);">${pay.tutar.toLocaleString('tr-TR')} ₺</span>
                                <span style="color:var(--text-muted); margin-left:8px; font-size:11px;">(${pay.aciklama})</span>
                            </div>
                            <div style="color:var(--text-muted); font-size:11px; display:flex; gap:10px; align-items:center;">
                                <span>${pay.tarih}</span>
                                <button onclick="deletePayment(${idx})" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-size:16px; padding:0 4px; line-height:1;" title="Ödemeyi Sil">×</button>
                            </div>
                        `;
                        historyContainer.appendChild(item);
                    });
                }
                
                // Giriş alanlarını temizle ve bugünün tarihini at
                document.getElementById('payModalAmountInput').value = '';
                document.getElementById('payModalDescInput').value = '';
                
                let today = new Date();
                let year = today.getFullYear();
                let month = String(today.getMonth() + 1).padStart(2, '0');
                let day = String(today.getDate()).padStart(2, '0');
                document.getElementById('payModalDateInput').value = `${year}-${month}-${day}`;
                
                document.getElementById('paymentModalOverlay').style.display = 'flex';
            } else {
                alert("Sipariş bulunamadı!");
            }
        }).catch(err => {
            alert("Ödeme geçmişi yüklenirken hata oluştu: " + err.message);
        });
    }

    function closePaymentModal() {
        document.getElementById('paymentModalOverlay').style.display = 'none';
        activePaymentDocId = null;
        activePaymentDocData = null;
    }

    function handleOverlayClick(e) {
        if (e.target.id === 'paymentModalOverlay') {
            closePaymentModal();
        }
    }

    function saveNewPayment() {
        let amount = parseFloat(document.getElementById('payModalAmountInput').value) || 0;
        let desc = document.getElementById('payModalDescInput').value.trim() || "Ara Ödeme";
        let dateVal = document.getElementById('payModalDateInput').value;
        
        if (amount <= 0) {
            alert("Lütfen geçerli bir ödeme tutarı girin!");
            return;
        }
        
        let formattedDate = new Date().toLocaleDateString('tr-TR');
        if (dateVal) {
            let parts = dateVal.split('-');
            if (parts.length === 3) {
                formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
            }
        }
        
        let odemeler = activePaymentDocData.odemeler || [];
        if (odemeler.length === 0 && (activePaymentDocData.kaparoNum || 0) > 0) {
            odemeler = [{
                tutar: activePaymentDocData.kaparoNum,
                aciklama: "İlk Kaparo",
                tarih: activePaymentDocData.tarih || new Date().toLocaleDateString('tr-TR')
            }];
        }
        
        // Yeni ödeme kaydını ekle
        odemeler.push({
            tutar: amount,
            aciklama: desc,
            tarih: formattedDate
        });
        
        let totalAlinan = odemeler.reduce((sum, item) => sum + parseFloat(item.tutar || 0), 0);
        let totalNum = activePaymentDocData.toplamNum || 0;
        let kalan = totalNum - totalAlinan;
        
        db.collection("ortak_teklifler").doc(activePaymentDocId).update({
            odemeler: odemeler,
            kaparoNum: totalAlinan,
            kalanNum: kalan,
            kaparo: totalAlinan.toLocaleString('tr-TR') + " ₺",
            kalan: kalan.toLocaleString('tr-TR') + " ₺"
        }).then(() => {
            alert("Ödeme kaydı başarıyla eklendi!");
            openPaymentModal(activePaymentDocId);
        }).catch(err => {
            alert("Ödeme kaydedilirken hata oluştu: " + err.message);
        });
    }

    function deletePayment(idx) {
        if (!confirm("Seçtiğiniz ödeme kaydını silmek istediğinize emin misiniz?")) return;
        
        let odemeler = activePaymentDocData.odemeler || [];
        if (odemeler.length === 0 && (activePaymentDocData.kaparoNum || 0) > 0) {
            odemeler = [{
                tutar: activePaymentDocData.kaparoNum,
                aciklama: "İlk Kaparo",
                tarih: activePaymentDocData.tarih || new Date().toLocaleDateString('tr-TR')
            }];
        }
        
        odemeler.splice(idx, 1);
        
        let totalAlinan = odemeler.reduce((sum, item) => sum + parseFloat(item.tutar || 0), 0);
        let totalNum = activePaymentDocData.toplamNum || 0;
        let kalan = totalNum - totalAlinan;
        
        db.collection("ortak_teklifler").doc(activePaymentDocId).update({
            odemeler: odemeler,
            kaparoNum: totalAlinan,
            kalanNum: kalan,
            kaparo: totalAlinan.toLocaleString('tr-TR') + " ₺",
            kalan: kalan.toLocaleString('tr-TR') + " ₺"
        }).then(() => {
            alert("Ödeme kaydı silindi!");
            openPaymentModal(activePaymentDocId);
        }).catch(err => {
            alert("Ödeme silinirken hata oluştu: " + err.message);
        });
    }

    // =========================================================================
    // 🎨 ETKİLEŞİMLİ MÜŞTERİ DOLAP TASARIM SİHİRBAZI (KENDİN TASARLA) MANTIĞI
    function openDesignQuoteModal() {
        document.getElementById('quoteClientName').value = "";
        document.getElementById('quoteClientPhone').value = "";
        document.getElementById('quoteClientAddress').value = "";
        document.getElementById('designQuoteModal').style.display = 'flex';
    }

    function closeDesignQuoteModal() {
        document.getElementById('designQuoteModal').style.display = 'none';
    }

    function handleDesignOverlayClick(event) {
        if(event.target === document.getElementById('designQuoteModal')) {
            closeDesignQuoteModal();
        }
    }

    function submitDesignQuote() {
        let name = document.getElementById('quoteClientName').value.trim();
        let phone = document.getElementById('quoteClientPhone').value.trim();
        let note = document.getElementById('quoteClientAddress').value.trim();
        
        if (!name) { alert("Lütfen adınızı soyadınızı giriniz!"); return; }
        if (!phone) { alert("Lütfen telefon numaranızı giriniz!"); return; }
        
        let widthVal = parseInt(document.getElementById('designWidth').value) || 200;
        let heightVal = parseInt(document.getElementById('designHeight').value) || 220;
        let w = widthVal / 100;
        let h = heightVal / 100;
        let m2 = w * h;
        
        let matKey = designerCabinet.hasDoors === 'no' ? 'kapaksiz' : designerCabinet.material;
        let basePrice = dynamicPrices[matKey] || 3200;
        let dolapTutar = m2 * basePrice;
        let arkalikTutar = m2 * (dynamicPrices.ark4 || 450);
        let kesimGideri = m2 * (dynamicPrices.kesim_m2 || 350);
        let montajTutar = dynamicPrices.montaj || 3500;
        
        let totalDrawers = designerCabinet.modules.filter(m => m === 'drawer').length * 2;
        let cekmeceTutar = totalDrawers * (dynamicPrices.r_tandem || 950);
        
        let totalHinges = designerCabinet.hasDoors === 'yes' ? designerCabinet.modules.length * 4 : 0;
        let menteseTutar = totalHinges * (dynamicPrices.samet || 80);
        
        let ledTutar = designerCabinet.led === 'var' ? 2500 : 0;
        
        let totalPrice = Math.round(dolapTutar + arkalikTutar + montajTutar + cekmeceTutar + menteseTutar + ledTutar);
        
        let customCode = "dm_" + Math.random().toString(36).substr(2, 7).toUpperCase();
        
        let matName = "Lake Kapak";
        if (matKey === 'mdf') matName = "MDF Lam Kapak";
        if (matKey === 'cam') matName = "Alüminyum Cam Kapak";
        if (matKey === 'kapaksiz') matName = "Kapaksız (Açık Dolap)";
        
        let inputState = {
            g_width: w,
            g_height: h,
            g_doors: designerCabinet.hasDoors === 'yes' ? designerCabinet.modules.length : 0,
            g_drawers: totalDrawers,
            g_material: matKey,
            g_ray: "r_tandem",
            g_back: "ark4",
            g_hinges: totalHinges,
            g_hinge_type: "samet",
            g_advance: 0,
            g_modules: designerCabinet.modules,
            g_handle: designerCabinet.handle,
            g_led: designerCabinet.led,
            customerPhone: phone,
            chkUseSheetCosting: false
        };
        
        // Auto default delivery date to +25 days from today
        let targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 25);
        let year = targetDate.getFullYear();
        let month = String(targetDate.getMonth() + 1).padStart(2, '0');
        let day = String(targetDate.getDate()).padStart(2, '0');
        let deliveryDateVal = `${year}-${month}-${day}`;
        
        let detailText = `Müşteri Kendin Tasarla Planı - Ebat: ${widthVal}x${heightVal}cm, Bölmeler: ${designerCabinet.modules.join(', ')} - Notlar: ${note}`;
        
        db.collection("ortak_teklifler").doc(customCode).set({
            musteri: "Tasarım: " + name,
            telefon: phone,
            tahminiTeslimat: deliveryDateVal,
            personel: "Berat Aziz Doğançay",
            durum: "Teklif Verildi",
            tarih: new Date().toLocaleDateString('tr-TR'),
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            m2: m2.toFixed(2),
            kapakAdet: designerCabinet.hasDoors === 'yes' ? designerCabinet.modules.length : 0,
            kapak: matName,
            ray: "Frenli Tandem Gizli Ray",
            toplamNum: totalPrice,
            kaparoNum: 0,
            kalanNum: totalPrice,
            toplam: totalPrice.toLocaleString('tr-TR') + " ₺",
            kaparo: "0 ₺",
            kalan: totalPrice.toLocaleString('tr-TR') + " ₺",
            mobilyaTuru: "gardırop",
            detaylar: detailText,
            inputState: inputState,
            odemeler: []
        }).then(() => {
            alert(`Tasarımınız başarıyla kaydedildi ve Mustafa Usta'ya iletildi!\n\nSipariş Takip Kodunuz: ${customCode}\n\nBu kodla siparişinizin durumunu "Sipariş Takibi" sekmesinden izleyebilirsiniz.`);
            closeDesignQuoteModal();
            takipKapat(); // return to login screen
        }).catch(err => {
            alert("Teklif iletilirken hata oluştu: " + err.message);
        });
    }


// Bind main functions and variables to window for global access
window.setPreviewMode = setPreviewMode;
window.switchLoginTab = switchLoginTab;
window.checkAutoLogin = checkAutoLogin;
window.girisYap = girisYap;
window.cikisYap = cikisYap;
window.switchTab = switchTab;
window.selectFurnitureType = selectFurnitureType;
window.adjustOzelMethodLabel = adjustOzelMethodLabel;
window.fiyatInputlariniDoldur = fiyatInputlariniDoldur;
window.fiyatlariBulutaKaydet = fiyatlariBulutaKaydet;
window.getSpecificationText = getSpecificationText;
window.kaydetSistem = kaydetSistem;
window.giderKaydet = giderKaydet;
window.muhasebeHesapla = muhasebeHesapla;
window.canliGezgin = canliGezgin;
window.durumGuncelle = durumGuncelle;
window.sistemdenSil = sistemdenSil;
window.giderSil = giderSil;
window.whatsappSistem = whatsappSistem;
window.whatsappPaylas = whatsappPaylas;
window.kopyalaTakipLinki = kopyalaTakipLinki;
window.yazdirTeklif = yazdirTeklif;
window.yazdirListeden = yazdirListeden;
window.teklifDuzenle = teklifDuzenle;
window.duzenlemeyiIptalEt = duzenlemeyiIptalEt;
window.sorgulaSiparis = sorgulaSiparis;
window.showMultiSelectTracking = showMultiSelectTracking;
window.loadOrderTracking = loadOrderTracking;
window.setTrackingTimeline = setTrackingTimeline;
window.renderTrackingDesign = renderTrackingDesign;
window.setTrackPreviewMode = setTrackPreviewMode;
window.takipKapat = takipKapat;
window.openPaymentModal = openPaymentModal;
window.closePaymentModal = closePaymentModal;
window.handleOverlayClick = handleOverlayClick;
window.saveNewPayment = saveNewPayment;
window.deletePayment = deletePayment;
window.openDesignQuoteModal = openDesignQuoteModal;
window.closeDesignQuoteModal = closeDesignQuoteModal;
window.handleDesignOverlayClick = handleDesignOverlayClick;
window.submitDesignQuote = submitDesignQuote;

// Initial calls on load
document.addEventListener('DOMContentLoaded', () => {
    checkAutoLogin();
});

