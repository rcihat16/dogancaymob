    function fillMaterialTexture(ctx, x, y, w, h, materialKey) {
        if (previewMode === 'blueprint') {
            ctx.fillStyle = materialKey === 'lake' ? '#f8fafc' : (materialKey === 'cam' ? '#38bdf8' : (materialKey === 'kapaksiz' ? '#1e293b' : '#b45309'));
            ctx.fillRect(x, y, w, h);
            return;
        }
        
        // Lüks 2D Modu Dokuları
        if (materialKey === 'lake') {
            // Parlak lake kaplama degrade
            let grad = ctx.createLinearGradient(x, y, x + w, y + h);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.3, '#f8fafc');
            grad.addColorStop(0.7, '#f1f5f9');
            grad.addColorStop(1, '#e2e8f0');
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, w, h);
            
            // Parlama / Işıltı çizgisi
            ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.clip();
            
            let shineGrad = ctx.createLinearGradient(x, y, x + w, y + h);
            shineGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            shineGrad.addColorStop(0.48, 'rgba(255, 255, 255, 0)');
            shineGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.45)');
            shineGrad.addColorStop(0.52, 'rgba(255, 255, 255, 0)');
            shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = shineGrad;
            ctx.fillRect(x, y, w, h);
            
            ctx.restore();
        } else if (materialKey === 'cam') {
            // Yansımalı cam kaplama
            let grad = ctx.createLinearGradient(x, y, x + w, y + h);
            grad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
            grad.addColorStop(0.5, 'rgba(14, 165, 233, 0.2)');
            grad.addColorStop(1, 'rgba(3, 105, 161, 0.4)');
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, w, h);
            
            // Alüminyum profil çerçeve
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 4;
            ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, w, h);
            
            // Cam yansıma şeritleri
            ctx.save();
            ctx.beginPath();
            ctx.rect(x + 4, y + 4, w - 8, h - 8);
            ctx.clip();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - 20, y);
            ctx.lineTo(x + w, y + h);
            ctx.moveTo(x - 10, y);
            ctx.lineTo(x + w + 10, y + h);
            ctx.stroke();
            ctx.restore();
        } else if (materialKey === 'kapaksiz') {
            // Koyu iç derinlik gölgelemesi
            let grad = ctx.createLinearGradient(x, y, x, y + h);
            grad.addColorStop(0, '#1e293b');
            grad.addColorStop(1, '#0f172a');
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, w, h);
            
            let radGrad = ctx.createRadialGradient(x + w/2, y + h/2, Math.min(w, h)/4, x + w/2, y + h/2, Math.max(w, h)/1.3);
            radGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
            radGrad.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
            ctx.fillStyle = radGrad;
            ctx.fillRect(x, y, w, h);
        } else {
            // Ahşap / MDF Lam damarlı dokusu
            let grad = ctx.createLinearGradient(x, y, x + w, y);
            grad.addColorStop(0, '#a16207');
            grad.addColorStop(0.5, '#b45309');
            grad.addColorStop(1, '#78350f');
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, w, h);
            
            // Dalgalı ağaç damar çizgileri
            ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.clip();
            
            ctx.strokeStyle = 'rgba(67, 20, 7, 0.15)';
            ctx.lineWidth = 1;
            for (let gx = x - 30; gx < x + w + 30; gx += 16) {
                ctx.beginPath();
                ctx.moveTo(gx, y);
                let cp1x = gx + 15 * Math.sin(y / 15);
                let cp2x = gx - 15 * Math.sin((y + h) / 15);
                ctx.bezierCurveTo(cp1x, y + h/3, cp2x, y + 2*h/3, gx, y + h);
                ctx.stroke();
            }
            ctx.restore();
        }
    }

    function getPartsListFromCurrentOffer() {
        let type = document.getElementById('mobilyaTuru').value;
        let partsList = [];

        if (type === 'gardırop') {
            let w = Math.round(parseFloat(document.getElementById('g_width').value) * 1000) || 0;
            let h = Math.round(parseFloat(document.getElementById('g_height').value) * 1000) || 0;
            let doors = parseInt(document.getElementById('g_doors').value) || 0;
            let drawers = parseInt(document.getElementById('g_drawers').value) || 0;
            let mat = document.getElementById('g_material').value;

            if (w > 0 && h > 0) {
                partsList.push({ name: "Gardırop Yan Dikme", w: 600, h: h, qty: 2, rotate: false });
                partsList.push({ name: "Gardırop Tavan/Taban", w: 600, h: w - 36, qty: 2, rotate: false });
                let partitions = Math.max(1, Math.round(doors / 2));
                if (partitions > 1) {
                    partsList.push({ name: "Gardırop Ara Dikme", w: 550, h: h - 180, qty: partitions - 1, rotate: false });
                }
                partsList.push({ name: "Gardırop Baza", w: 100, h: w - 36, qty: 2, rotate: false });
                let partitionWidth = Math.round((w - 36 - (partitions - 1)*18) / partitions);
                partsList.push({ name: "Gardırop Raf", w: 550, h: partitionWidth, qty: partitions * 3, rotate: true });
                
                if (mat !== 'kapaksiz') {
                    let doorW = Math.round((w / doors) - 4);
                    let doorH = h - 80;
                    partsList.push({ name: "Gardırop Kapak", w: doorW, h: doorH, qty: doors, rotate: false });
                }
                
                if (drawers > 0) {
                    partsList.push({ name: "Çekmece Önü", w: partitionWidth - 10, h: 200, qty: drawers, rotate: false });
                    partsList.push({ name: "Çekmece Kutu Yan", w: 500, h: 120, qty: drawers * 2, rotate: true });
                    partsList.push({ name: "Çekmece Kutu Ön/Arka", w: partitionWidth - 90, h: 120, qty: drawers * 2, rotate: true });
                }
            }
        } 
        else if (type === 'udolap') {
            let left = Math.round(parseFloat(document.getElementById('u_left').value) * 1000) || 0;
            let back = Math.round(parseFloat(document.getElementById('u_back').value) * 1000) || 0;
            let right = Math.round(parseFloat(document.getElementById('u_right').value) * 1000) || 0;
            let h = Math.round(parseFloat(document.getElementById('u_height').value) * 1000) || 0;
            let drawers = parseInt(document.getElementById('u_drawers').value) || 0;
            let mat = document.getElementById('u_material').value;

            if (left > 0 && back > 0 && right > 0 && h > 0) {
                partsList.push({ name: "U-Dolap Sol Yan", w: 600, h: h, qty: 1, rotate: false });
                partsList.push({ name: "U-Dolap Sağ Yan", w: 600, h: h, qty: 1, rotate: false });
                partsList.push({ name: "Köşe Dikme (Sol)", w: 582, h: h - 100, qty: 1, rotate: false });
                partsList.push({ name: "Köşe Dikme (Sağ)", w: 582, h: h - 100, qty: 1, rotate: false });

                partsList.push({ name: "Sol Tavan/Taban", w: 600, h: left - 18, qty: 2, rotate: false });
                partsList.push({ name: "Arka Tavan/Taban", w: 600, h: back - 36, qty: 2, rotate: false });
                partsList.push({ name: "Sağ Tavan/Taban", w: 600, h: right - 18, qty: 2, rotate: false });

                partsList.push({ name: "Sol Baza", w: 100, h: left - 18, qty: 2, rotate: false });
                partsList.push({ name: "Arka Baza", w: 100, h: back - 36, qty: 2, rotate: false });
                partsList.push({ name: "Sağ Baza", w: 100, h: right - 18, qty: 2, rotate: false });

                partsList.push({ name: "Gövde Rafı (Sol)", w: 550, h: 500, qty: 4, rotate: true });
                partsList.push({ name: "Gövde Rafı (Arka)", w: 550, h: 600, qty: 6, rotate: true });
                partsList.push({ name: "Gövde Rafı (Sağ)", w: 550, h: 500, qty: 4, rotate: true });

                if (mat !== 'kapaksiz') {
                    partsList.push({ name: "Sol Dolap Kapak", w: 450, h: h - 80, qty: 2, rotate: false });
                    partsList.push({ name: "Arka Dolap Kapak", w: 496, h: h - 80, qty: 4, rotate: false });
                    partsList.push({ name: "Sağ Dolap Kapak", w: 450, h: h - 80, qty: 2, rotate: false });
                }

                if (drawers > 0) {
                    partsList.push({ name: "Çekmece Önü", w: 490, h: 200, qty: drawers, rotate: false });
                    partsList.push({ name: "Çekmece Kutu Yan", w: 500, h: 120, qty: drawers * 2, rotate: true });
                    partsList.push({ name: "Çekmece Kutu Ön/Arka", w: 410, h: 120, qty: drawers * 2, rotate: true });
                }
            }
        } 
        else if (type === 'mutfak') {
            let ul = parseFloat(document.getElementById('k_upper_len').value) || 0;
            let ll = parseFloat(document.getElementById('k_lower_len').value) || 0;
            let drawers = parseInt(document.getElementById('k_drawers').value) || 0;

            if (ul > 0) {
                let ulMm = Math.round(ul * 1000);
                let modules = Math.ceil(ulMm / 600);
                partsList.push({ name: "Üst Dolap Yan", w: 320, h: 800, qty: modules * 2, rotate: false });
                partsList.push({ name: "Üst Dolap Alt/Üst", w: 300, h: 564, qty: modules * 2, rotate: false });
                partsList.push({ name: "Üst Dolap Raf", w: 300, h: 564, qty: modules, rotate: true });
                partsList.push({ name: "Üst Dolap Kapak", w: 296, h: 796, qty: modules * 2, rotate: false });
            }

            if (ll > 0) {
                let llMm = Math.round(ll * 1000);
                let modules = Math.ceil(llMm / 600);
                partsList.push({ name: "Alt Dolap Yan", w: 560, h: 720, qty: modules * 2, rotate: false });
                partsList.push({ name: "Alt Dolap Alt/Bant", w: 560, h: 564, qty: modules * 2, rotate: false });
                partsList.push({ name: "Alt Dolap Raf", w: 540, h: 564, qty: modules, rotate: true });
                partsList.push({ name: "Alt Dolap Kapak", w: 296, h: 716, qty: (modules - (drawers > 0 ? 1 : 0)) * 2, rotate: false });
                partsList.push({ name: "Mutfak Baza", w: 120, h: llMm - 36, qty: 1, rotate: false });
            }

            if (drawers > 0) {
                partsList.push({ name: "Mutfak Çekmece Önü", w: 596, h: 176, qty: drawers, rotate: false });
                partsList.push({ name: "Çekmece Kutu Yan", w: 500, h: 120, qty: drawers * 2, rotate: true });
                partsList.push({ name: "Çekmece Kutu Ön/Arka", w: 510, h: 120, qty: drawers * 2, rotate: true });
            }
        } 
        else if (type === 'vestiyer') {
            let w = Math.round(parseFloat(document.getElementById('v_width').value) * 1000) || 0;
            let h = Math.round(parseFloat(document.getElementById('v_height').value) * 1000) || 0;
            let drawers = parseInt(document.getElementById('v_drawers').value) || 0;

            if (w > 0 && h > 0) {
                partsList.push({ name: "Vestiyer Yan Dikme", w: 400, h: h, qty: 2, rotate: false });
                partsList.push({ name: "Vestiyer Tavan/Taban", w: 400, h: w - 36, qty: 2, rotate: false });
                partsList.push({ name: "Vestiyer Orta Dikme", w: 380, h: h - 180, qty: 1, rotate: false });
                partsList.push({ name: "Ayakkabılık Rafları", w: 380, h: Math.round(w / 2) - 27, qty: 6, rotate: true });
                partsList.push({ name: "Vestiyer Kapak", w: Math.round(w / 2) - 10, h: h - 80, qty: 2, rotate: false });

                if (drawers > 0) {
                    partsList.push({ name: "Vestiyer Çekmece Önü", w: Math.round(w / 2) - 10, h: 180, qty: drawers, rotate: false });
                    partsList.push({ name: "Çekmece Kutu Yan", w: 350, h: 120, qty: drawers * 2, rotate: true });
                    partsList.push({ name: "Çekmece Kutu Ön/Arka", w: Math.round(w / 2) - 90, h: 120, qty: drawers * 2, rotate: true });
                }
            }
        }
        else if (type === 'banyo') {
            let w = Math.round(parseFloat(document.getElementById('b_width').value) * 1000) || 0;
            let h = Math.round(parseFloat(document.getElementById('b_height').value) * 1000) || 0;
            let drawers = parseInt(document.getElementById('b_drawers').value) || 0;

            if (w > 0 && h > 0) {
                partsList.push({ name: "Banyo Dolabı Yan", w: 500, h: 750, qty: 2, rotate: false });
                partsList.push({ name: "Banyo Dolabı Alt/Bant", w: 500, h: w - 36, qty: 2, rotate: false });
                partsList.push({ name: "Banyo Dolabı Kapak", w: Math.round(w / 2) - 8, h: 716, qty: 2, rotate: false });

                if (drawers > 0) {
                    partsList.push({ name: "Çekmece Önü", w: w - 10, h: 220, qty: drawers, rotate: false });
                    partsList.push({ name: "Çekmece Kutu Yan", w: 450, h: 120, qty: drawers * 2, rotate: true });
                    partsList.push({ name: "Çekmece Kutu Ön/Arka", w: w - 90, h: 120, qty: drawers * 2, rotate: true });
                }
            }
        } else {
            partsList.push({ name: "Özel Tasarım Panel 1", w: 600, h: 1000, qty: 5, rotate: true });
            partsList.push({ name: "Özel Tasarım Panel 2", w: 400, h: 800, qty: 10, rotate: true });
        }

        return partsList;
    }

    function calculateSheetsDryRun(parts) {
        if (!parts || parts.length === 0) return 0;
        
        let sizeSelect = document.getElementById('opt_stock_size') ? document.getElementById('opt_stock_size').value : '2800x2100';
        let stockW = 2800;
        let stockH = 2100;
        if(sizeSelect === '2800x2100') {
            stockW = 2800; stockH = 2100;
        } else if(sizeSelect === '3660x1830') {
            stockW = 3660; stockH = 1830;
        } else if (document.getElementById('opt_stock_w')) {
            stockW = parseInt(document.getElementById('opt_stock_w').value) || 2800;
            stockH = parseInt(document.getElementById('opt_stock_h').value) || 2100;
        }
        
        let kerf = document.getElementById('opt_kerf') ? (parseInt(document.getElementById('opt_kerf').value) || 0) : 4;
        let margin = document.getElementById('opt_margin') ? (parseInt(document.getElementById('opt_margin').value) || 0) : 20;
        
        let flatParts = [];
        parts.forEach(p => {
            for(let i = 0; i < p.qty; i++) {
                flatParts.push({
                    id: p.name + "_" + i,
                    name: p.name,
                    w: p.w,
                    h: p.h,
                    rotate: p.rotate
                });
            }
        });
        
        let effStockW = stockW - 2 * margin;
        let effStockH = stockH - 2 * margin;
        
        if (effStockW <= 0 || effStockH <= 0) return 1;
        
        flatParts.sort((a, b) => {
            let maxA = Math.max(a.w, a.h);
            let maxB = Math.max(b.w, b.h);
            if (maxA !== maxB) return maxB - maxA;
            return (b.w * b.h) - (a.w * a.h);
        });
        
        let sheets = [];
        flatParts.forEach(part => {
            let packed = false;
            
            for(let sheet of sheets) {
                let placement = sheet.packer.insert(part.w, part.h, part.rotate);
                if (placement) {
                    packed = true;
                    break;
                }
            }
            
            if(!packed) {
                let newPacker = new GuillotinePacker(effStockW, effStockH, kerf);
                let placement = newPacker.insert(part.w, part.h, part.rotate);
                sheets.push({ packer: newPacker });
            }
        });
        
        return sheets.length;
    }

    // 📐 HESAPLAMA MOTORU VE CAD CANVAS ÇİZİCİ
    function hesaplaVeCiz() {
        let type = document.getElementById('mobilyaTuru').value;
        let canvas = document.getElementById('dolapCanvas'); 
        let ctx = canvas.getContext('2d');
        
        // Clear Canvas and Draw Blueprint Grid
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1;
        for(let x = 0; x < canvas.width; x += 20) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for(let y = 0; y < canvas.height; y += 20) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }

        // Shared calculation vars
        let m2 = 0;
        let dolapTutar = 0;
        let arkalikTutar = 0;
        let cekmeceTutar = 0;
        let menteseTutar = 0;
        let ekstralarTutar = 0;
        let kesimGideri = 0;
        let montajTutar = 0;
        let advancePayment = 0;
        let kapakAdet = 0;
        let matKey = "mdf";
        let rayKey = "r_tele";

        if(type === 'gardırop') {
            let w = parseFloat(document.getElementById('g_width').value) || 0;
            let h = parseFloat(document.getElementById('g_height').value) || 0;
            let doorsVal = document.getElementById('g_doors').value;
            kapakAdet = doorsVal !== "" ? parseInt(doorsVal) : 1;
            let drawers = parseInt(document.getElementById('g_drawers').value) || 0;
            let hinges = parseInt(document.getElementById('g_hinges').value) || 0;
            advancePayment = parseFloat(document.getElementById('g_advance').value) || 0;
            matKey = document.getElementById('g_material').value;
            rayKey = document.getElementById('g_ray').value;
            let hingeKey = document.getElementById('g_hinge_type').value;
            let backKey = document.getElementById('g_back').value;

            m2 = w * h;
            dolapTutar = m2 * dynamicPrices[matKey];
            arkalikTutar = m2 * (backKey === 'ark4' ? dynamicPrices.ark4 : dynamicPrices.mdf);
            cekmeceTutar = drawers * dynamicPrices[rayKey];
            menteseTutar = hinges * dynamicPrices[hingeKey];
            kesimGideri = m2 * (dynamicPrices.kesim_m2 || 350);
            montajTutar = dynamicPrices.montaj || 3500;
            if (editingGLed === 'var') {
                ekstralarTutar = 2500;
            }

            // DRAW WARDROBE
            let scale = Math.min(260 / w, 180 / h);
            let sW = w * scale;
            let sH = h * scale;
            let xStart = (canvas.width - sW) / 2;
            let yStart = (canvas.height - sH) / 2;

            // Outer Cabinet Box
            fillMaterialTexture(ctx, xStart, yStart, sW, sH, matKey);
            if (previewMode === 'lux') {
                ctx.strokeStyle = matKey === 'lake' ? '#cbd5e1' : (matKey === 'kapaksiz' ? '#b45309' : '#78350f');
                ctx.lineWidth = 4;
            } else {
                ctx.strokeStyle = "#64748b";
                ctx.lineWidth = 3;
            }
            ctx.strokeRect(xStart, yStart, sW, sH);

            if (matKey === 'kapaksiz' || kapakAdet === 0) {
                // Draw wood frame border thickness
                ctx.strokeStyle = previewMode === 'lux' ? '#78350f' : '#b45309';
                ctx.lineWidth = previewMode === 'lux' ? 8 : 6;
                ctx.strokeRect(xStart, yStart, sW, sH);

                // Divide into vertical sections
                let sections = Math.max(2, Math.round(w)); 
                if (editingGModules && editingGModules.length > 0) {
                    sections = editingGModules.length;
                }
                let sectionW = (sW - 12) / sections;
                ctx.strokeStyle = previewMode === 'lux' ? '#78350f' : '#b45309';
                ctx.lineWidth = 3;
                for(let i = 1; i < sections; i++) {
                    let divX = xStart + 6 + i * sectionW;
                    ctx.beginPath();
                    ctx.moveTo(divX, yStart + 6);
                    ctx.lineTo(divX, yStart + sH - 6);
                    ctx.stroke();
                }

                // Draw shelves and hanger rods in each section
                ctx.strokeStyle = previewMode === 'lux' ? '#78350f' : '#b45309';
                ctx.lineWidth = previewMode === 'lux' ? 4 : 3;

                for(let i = 0; i < sections; i++) {
                    let secX1 = xStart + 6 + i * sectionW;
                    let secX2 = secX1 + sectionW;

                    let moduleType = "shelf";
                    if (editingGModules && editingGModules[i]) {
                        moduleType = editingGModules[i];
                    } else {
                        moduleType = (i % 2 === 0) ? "shelf" : "rod";
                    }

                    if (moduleType === 'shelf') {
                        // Section with shelves
                        let shelfCount = 4;
                        let shelfH = (sH - 12) / (shelfCount + 1);
                        for(let j = 1; j <= shelfCount; j++) {
                            let shelfY = yStart + 6 + j * shelfH;
                            
                            // LED glow under shelf
                            if (previewMode === 'lux') {
                                let glow = ctx.createLinearGradient(0, shelfY, 0, shelfY + 16);
                                glow.addColorStop(0, 'rgba(253, 224, 71, 0.28)');
                                glow.addColorStop(1, 'rgba(253, 224, 71, 0)');
                                ctx.fillStyle = glow;
                                ctx.fillRect(secX1, shelfY, secX2 - secX1, 16);
                            }
                            
                            ctx.beginPath();
                            ctx.moveTo(secX1, shelfY);
                            ctx.lineTo(secX2, shelfY);
                            ctx.stroke();
                        }
                    } else if (moduleType === 'rod') {
                        // Section with top shelf, hanger rod
                        let topShelfY = yStart + 6 + (sH - 12) * 0.2;
                        
                        // LED glow under top shelf
                        if (previewMode === 'lux') {
                            let glow = ctx.createLinearGradient(0, topShelfY, 0, topShelfY + 25);
                            glow.addColorStop(0, 'rgba(253, 224, 71, 0.25)');
                            glow.addColorStop(1, 'rgba(253, 224, 71, 0)');
                            ctx.fillStyle = glow;
                            ctx.fillRect(secX1, topShelfY, secX2 - secX1, 25);
                        }
                        
                        ctx.beginPath();
                        ctx.moveTo(secX1, topShelfY);
                        ctx.lineTo(secX2, topShelfY);
                        ctx.stroke();

                        // hanger rod
                        let rodY = topShelfY + 12;
                        if (previewMode === 'lux') {
                            let chrome = ctx.createLinearGradient(0, rodY - 2, 0, rodY + 2);
                            chrome.addColorStop(0, '#cbd5e1');
                            chrome.addColorStop(0.5, '#ffffff');
                            chrome.addColorStop(1, '#64748b');
                            ctx.strokeStyle = chrome;
                            ctx.lineWidth = 3;
                        } else {
                            ctx.strokeStyle = '#94a3b8';
                            ctx.lineWidth = 2;
                        }
                        ctx.beginPath();
                        ctx.moveTo(secX1 + 4, rodY);
                        ctx.lineTo(secX2 - 4, rodY);
                        ctx.stroke();

                        ctx.strokeStyle = previewMode === 'lux' ? '#78350f' : '#b45309';
                        ctx.lineWidth = previewMode === 'lux' ? 4 : 3;

                        // simple hanger representation
                        let hangerCount = 3;
                        let hangerStep = (secX2 - secX1 - 10) / (hangerCount + 1);
                        for (let k = 1; k <= hangerCount; k++) {
                            let hX = secX1 + 5 + k * hangerStep;
                            ctx.fillStyle = previewMode === 'lux' ? '#ca8a04' : '#475569';
                            ctx.beginPath();
                            ctx.arc(hX, rodY + 2, 2, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.fillStyle = previewMode === 'lux' ? 'rgba(254, 240, 138, 0.35)' : 'rgba(245, 158, 11, 0.4)';
                            ctx.fillRect(hX - 5, rodY + 4, 10, 35);
                        }
                    } else if (moduleType === 'drawer') {
                        // Top shelf + Hanger rod + 2 Drawers at bottom
                        let topShelfY = yStart + 6 + (sH - 12) * 0.2;
                        if (previewMode === 'lux') {
                            let glow = ctx.createLinearGradient(0, topShelfY, 0, topShelfY + 25);
                            glow.addColorStop(0, 'rgba(253, 224, 71, 0.25)');
                            glow.addColorStop(1, 'rgba(253, 224, 71, 0)');
                            ctx.fillStyle = glow;
                            ctx.fillRect(secX1, topShelfY, secX2 - secX1, 25);
                        }
                        
                        ctx.beginPath(); ctx.moveTo(secX1, topShelfY); ctx.lineTo(secX2, topShelfY); ctx.stroke();
                        
                        let rodY = topShelfY + 12;
                        if (previewMode === 'lux') {
                            let chrome = ctx.createLinearGradient(0, rodY - 2, 0, rodY + 2);
                            chrome.addColorStop(0, '#cbd5e1'); chrome.addColorStop(0.5, '#ffffff'); chrome.addColorStop(1, '#64748b');
                            ctx.strokeStyle = chrome; ctx.lineWidth = 3;
                        } else {
                            ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
                        }
                        ctx.beginPath(); ctx.moveTo(secX1 + 4, rodY); ctx.lineTo(secX2 - 4, rodY); ctx.stroke();
                        ctx.strokeStyle = previewMode === 'lux' ? '#78350f' : '#b45309';
                        ctx.lineWidth = previewMode === 'lux' ? 4 : 3;

                        // simple hanger representation
                        let hangerCount = 3;
                        let hangerStep = (secX2 - secX1 - 10) / (hangerCount + 1);
                        for (let k = 1; k <= hangerCount; k++) {
                            let hX = secX1 + 5 + k * hangerStep;
                            ctx.fillStyle = previewMode === 'lux' ? '#ca8a04' : '#475569';
                            ctx.beginPath(); ctx.arc(hX, rodY + 2, 2, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = previewMode === 'lux' ? 'rgba(254, 240, 138, 0.35)' : 'rgba(245, 158, 11, 0.4)';
                            ctx.fillRect(hX - 5, rodY + 4, 10, 35);
                        }

                        // Draw 2 Drawers at bottom
                        let drawerAreaH = (sH - 12) * 0.25;
                        let drawerH = drawerAreaH / 2 - 4;
                        for (let d = 0; d < 2; d++) {
                            let dY = yStart + sH - 6 - drawerAreaH + d * (drawerH + 4) + 2;
                            ctx.fillStyle = "#1e293b";
                            ctx.fillRect(secX1 + 4, dY, sectionW - 8, drawerH);
                            ctx.strokeRect(secX1 + 4, dY, sectionW - 8, drawerH);
                            ctx.fillStyle = editingGHandle === 'chrome' ? '#cbd5e1' : '#080c14';
                            ctx.fillRect(secX1 + sectionW/2 - 10, dY + drawerH/2 - 1, 20, 2);
                        }
                    } else if (moduleType === 'longrod') {
                        // Long hanging rod
                        let rodY = yStart + 6 + 18;
                        if (previewMode === 'lux') {
                            let chrome = ctx.createLinearGradient(0, rodY - 2, 0, rodY + 2);
                            chrome.addColorStop(0, '#cbd5e1'); chrome.addColorStop(0.5, '#ffffff'); chrome.addColorStop(1, '#64748b');
                            ctx.strokeStyle = chrome; ctx.lineWidth = 3;
                        } else {
                            ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
                        }
                        ctx.beginPath(); ctx.moveTo(secX1 + 4, rodY); ctx.lineTo(secX2 - 4, rodY); ctx.stroke();
                        ctx.strokeStyle = previewMode === 'lux' ? '#78350f' : '#b45309';
                        ctx.lineWidth = previewMode === 'lux' ? 4 : 3;

                        // Draw hanger representation (long coats)
                        let hangerCount = 3;
                        let hangerStep = (secX2 - secX1 - 10) / (hangerCount + 1);
                        for (let k = 1; k <= hangerCount; k++) {
                            let hX = secX1 + 5 + k * hangerStep;
                            ctx.fillStyle = previewMode === 'lux' ? '#ca8a04' : '#475569';
                            ctx.beginPath(); ctx.arc(hX, rodY + 2, 2, 0, Math.PI * 2); ctx.fill();
                            ctx.fillStyle = previewMode === 'lux' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.3)';
                            ctx.fillRect(hX - 5, rodY + 4, 10, 55);
                        }
                    }
                }
            } else {
                // Door Divisions & Handles
                let doorW = sW / kapakAdet;
                ctx.strokeStyle = previewMode === 'lux' ? (matKey === 'lake' ? '#cbd5e1' : '#78350f') : "#475569";
                ctx.lineWidth = previewMode === 'lux' ? 2 : 1.5;
                for(let i = 0; i < kapakAdet; i++) {
                    let dx = xStart + (i * doorW);
                    if (i > 0) {
                        ctx.beginPath();
                        ctx.moveTo(dx, yStart);
                        ctx.lineTo(dx, yStart + sH);
                        ctx.stroke();
                    }
                    if (previewMode === 'lux') {
                        fillMaterialTexture(ctx, dx + 1.5, yStart + 1.5, doorW - 3, sH - 3, matKey);
                    }
                }

                // Draw handles (Chrome, Black, or Hidden based on customer configuration)
                if (editingGHandle !== 'gizli') {
                    for(let i = 0; i < kapakAdet; i++) {
                        let handleX = xStart + (i * doorW) + (doorW / 2);
                        let handleY = yStart + (sH / 2) - 15;
                        
                        if (previewMode === 'lux') {
                            ctx.save();
                            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
                            ctx.shadowBlur = 3;
                            ctx.shadowOffsetX = 1;
                            ctx.shadowOffsetY = 1;
                            
                            // Use custom handles colors (Black or Chrome silver), fallback to gold if older proposal
                            if (editingGHandle === 'black') {
                                ctx.fillStyle = '#1e293b'; // matte black mount brackets
                                ctx.fillRect(handleX - 4, handleY, 8, 2);
                                ctx.fillRect(handleX - 4, handleY + 28, 8, 2);
                                ctx.fillStyle = '#0f172a'; // black handle bar
                                ctx.fillRect(handleX - 2, handleY - 2, 4, 34);
                            } else if (editingGHandle === 'chrome') {
                                ctx.fillStyle = '#94a3b8'; // chrome brackets
                                ctx.fillRect(handleX - 4, handleY, 8, 2);
                                ctx.fillRect(handleX - 4, handleY + 28, 8, 2);
                                let handleGrad = ctx.createLinearGradient(handleX - 2, handleY, handleX + 2, handleY);
                                handleGrad.addColorStop(0, '#cbd5e1');
                                handleGrad.addColorStop(0.5, '#ffffff');
                                handleGrad.addColorStop(1, '#94a3b8');
                                ctx.fillStyle = handleGrad; // silver handle bar
                                ctx.fillRect(handleX - 2, handleY - 2, 4, 34);
                            } else {
                                // Default gold
                                ctx.fillStyle = '#b45309'; 
                                ctx.fillRect(handleX - 4, handleY, 8, 2);
                                ctx.fillRect(handleX - 4, handleY + 28, 8, 2);
                                let handleGrad = ctx.createLinearGradient(handleX - 2, handleY, handleX + 2, handleY);
                                handleGrad.addColorStop(0, '#fef08a');
                                handleGrad.addColorStop(0.5, '#eab308');
                                handleGrad.addColorStop(1, '#ca8a04');
                                ctx.fillStyle = handleGrad;
                                ctx.fillRect(handleX - 2, handleY - 2, 4, 34);
                            }
                            ctx.restore();
                        } else {
                            ctx.fillStyle = editingGHandle === 'chrome' ? '#cbd5e1' : (editingGHandle === 'black' ? '#1e293b' : '#f59e0b');
                            ctx.fillRect(handleX - 2, handleY, 4, 30);
                        }
                    }
                }
            }

            // Draw internal drawers if open concept wireframe is imagined
            if(drawers > 0) {
                let drawerH = 16;
                let drawerSectionW = sW / (matKey === 'kapaksiz' ? Math.max(2, Math.round(w)) : 2);
                for(let j = 0; j < drawers; j++) {
                    let dY = (yStart + sH) - (j * (drawerH + 4)) - drawerH - 10;
                    if(dY > yStart) {
                        if (previewMode === 'lux') {
                            fillMaterialTexture(ctx, xStart + 10, dY, drawerSectionW - 20, drawerH, matKey === 'kapaksiz' ? 'mdf' : matKey);
                            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(xStart + 10, dY, drawerSectionW - 20, drawerH);
                            
                            let centerKx = xStart + 10 + (drawerSectionW - 20)/2;
                            let centerKy = dY + drawerH/2;
                            ctx.fillStyle = '#fef08a';
                            ctx.beginPath();
                            ctx.arc(centerKx, centerKy, 2.5, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.strokeStyle = '#ca8a04';
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        } else {
                            ctx.fillStyle = "rgba(0,0,0,0.3)";
                            ctx.fillRect(xStart + 10, dY, drawerSectionW - 20, drawerH);
                            ctx.strokeStyle = "#64748b";
                            ctx.lineWidth = 1;
                            ctx.strokeRect(xStart + 10, dY, drawerSectionW - 20, drawerH);
                        }
                    }
                }
            }

            // Dimension Tags
            drawDimension(ctx, xStart, yStart - 10, xStart + sW, yStart - 10, w.toFixed(2) + " m", false);
            drawDimension(ctx, xStart - 12, yStart, xStart - 12, yStart + sH, h.toFixed(2) + " m", true);
        }
        else if(type === 'udolap') {
            let left = parseFloat(document.getElementById('u_left').value) || 0;
            let back = parseFloat(document.getElementById('u_back').value) || 0;
            let right = parseFloat(document.getElementById('u_right').value) || 0;
            let h = parseFloat(document.getElementById('u_height').value) || 0;
            let drawers = parseInt(document.getElementById('u_drawers').value) || 0;
            let hinges = parseInt(document.getElementById('u_hinges').value) || 0;
            advancePayment = parseFloat(document.getElementById('u_advance').value) || 0;
            matKey = document.getElementById('u_material').value;
            rayKey = document.getElementById('u_ray').value;
            let hingeKey = document.getElementById('u_hinge_type').value;
            let backKey = document.getElementById('u_back_panel').value;

            m2 = (left + back + right) * h;
            dolapTutar = m2 * dynamicPrices[matKey];
            arkalikTutar = m2 * (backKey === 'ark4' ? dynamicPrices.ark4 : dynamicPrices.mdf);
            cekmeceTutar = drawers * dynamicPrices[rayKey];
            menteseTutar = hinges * dynamicPrices[hingeKey];
            kesimGideri = m2 * (dynamicPrices.kesim_m2 || 350);
            montajTutar = dynamicPrices.montaj * 1.5; // corner complexity 1.5x

            // DRAW U-DOLAP (Unfolded Blueprint Layout)
            let wTotal = left + back + right;
            let scale = Math.min(300 / wTotal, 180 / h);
            
            // Total visual size
            let sTotalW = wTotal * scale;
            let sH = h * scale;
            
            let xStart = (canvas.width - sTotalW) / 2;
            let yStart = (canvas.height - sH) / 2;

            let sLeftW = left * scale;
            let sBackW = back * scale;
            let sRightW = right * scale;

            // Draw segments
            drawWallSegment(ctx, xStart, yStart, sLeftW, sH, "Sol Duvar (" + left.toFixed(2) + " m)", matKey, drawers, 0);
            drawWallSegment(ctx, xStart + sLeftW, yStart, sBackW, sH, "Arka Duvar (" + back.toFixed(2) + " m)", matKey, 0, hinges);
            drawWallSegment(ctx, xStart + sLeftW + sBackW, yStart, sRightW, sH, "Sağ Duvar (" + right.toFixed(2) + " m)", matKey, 0, 0);

            // Draw Wall Seperators (Dashed vertical lines or gold strips)
            if (previewMode === 'lux') {
                ctx.strokeStyle = "rgba(2, 132, 199, 0.8)";
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(xStart + sLeftW, yStart);
                ctx.lineTo(xStart + sLeftW, yStart + sH);
                ctx.moveTo(xStart + sLeftW + sBackW, yStart);
                ctx.lineTo(xStart + sLeftW + sBackW, yStart + sH);
                ctx.stroke();
            } else {
                ctx.strokeStyle = "rgba(2, 132, 199, 0.5)";
                ctx.setLineDash([4, 4]);
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(xStart + sLeftW, yStart);
                ctx.lineTo(xStart + sLeftW, yStart + sH);
                ctx.moveTo(xStart + sLeftW + sBackW, yStart);
                ctx.lineTo(xStart + sLeftW + sBackW, yStart + sH);
                ctx.stroke();
                ctx.setLineDash([]); // Reset line dash
            }

            // Dimensions
            drawDimension(ctx, xStart, yStart - 12, xStart + sTotalW, yStart - 12, wTotal.toFixed(2) + " m", false);
            drawDimension(ctx, xStart - 12, yStart, xStart - 12, yStart + sH, h.toFixed(2) + " m", true);
        }
        else if(type === 'mutfak') {
            let ul = parseFloat(document.getElementById('k_upper_len').value) || 0;
            let ll = parseFloat(document.getElementById('k_lower_len').value) || 0;
            kapakAdet = Math.ceil((ul + ll) * 2); // Approximation of doors
            let drawers = parseInt(document.getElementById('k_drawers').value) || 0;
            let hinges = parseInt(document.getElementById('k_hinges').value) || 0;
            advancePayment = parseFloat(document.getElementById('k_advance').value) || 0;
            matKey = document.getElementById('k_material').value;
            rayKey = document.getElementById('k_ray').value;
            let hingeKey = document.getElementById('k_hinge_type').value;
            let countertop = document.getElementById('k_countertop').value;

            // Calculations
            let ustM2 = ul * 0.8;
            let altM2 = ll * 0.72;
            m2 = ustM2 + altM2;

            dolapTutar = m2 * dynamicPrices[matKey];
            arkalikTutar = ul * 0.8 * dynamicPrices.ark4;
            cekmeceTutar = drawers * dynamicPrices[rayKey];
            menteseTutar = hinges * dynamicPrices[hingeKey];
            kesimGideri = m2 * (dynamicPrices.kesim_m2 || 350);
            montajTutar = dynamicPrices.montaj;

            if(countertop === 'laminat') ekstralarTutar = ll * (dynamicPrices.tezgah_laminat || 1500);
            else if(countertop === 'ahsap') ekstralarTutar = ll * (dynamicPrices.tezgah_ahsap || 3000);
            else if(countertop === 'granit') ekstralarTutar = ll * (dynamicPrices.tezgah_granit || 5000);
            else if(countertop === 'cimstone') ekstralarTutar = ll * (dynamicPrices.tezgah_cimstone || 7500);

            // DRAW KITCHEN (FRONT VIEW)
            let maxLen = Math.max(ul, ll);
            let scale = 250 / maxLen;
            let sU = ul * scale;
            let sL = ll * scale;
            let xStartU = (canvas.width - sU) / 2;
            let xStartL = (canvas.width - sL) / 2;

            // 1. Backsplash Tiles Area
            ctx.fillStyle = "#1e293b";
            ctx.fillRect(Math.min(xStartU, xStartL), 110, Math.max(sU, sL), 40);
            ctx.strokeStyle = "#334155";
            ctx.lineWidth = 0.5;
            for(let tx = Math.min(xStartU, xStartL); tx < Math.min(xStartU, xStartL) + Math.max(sU, sL); tx += 15) {
                ctx.strokeRect(tx, 110, 15, 40);
            }

            // 2. Upper Cabinet
            fillMaterialTexture(ctx, xStartU, 60, sU, 50, matKey);
            ctx.strokeStyle = previewMode === 'lux' ? (matKey === 'lake' ? '#cbd5e1' : '#78350f') : "#e2e8f0";
            ctx.lineWidth = 2;
            ctx.strokeRect(xStartU, 60, sU, 50);
            
            // Upper door division lines
            let uDoorsCount = Math.round(ul * 2);
            let uDoorW = sU / uDoorsCount;
            ctx.strokeStyle = previewMode === 'lux' ? (matKey === 'lake' ? '#cbd5e1' : '#78350f') : "#475569";
            ctx.lineWidth = 1;
            for(let i = 0; i < uDoorsCount; i++) {
                let dx = xStartU + (i*uDoorW);
                if (i > 0) {
                    ctx.beginPath(); ctx.moveTo(dx, 60); ctx.lineTo(dx, 110); ctx.stroke();
                }
                if (previewMode === 'lux') {
                    fillMaterialTexture(ctx, dx + 1, 61, uDoorW - 2, 48, matKey);
                    
                    // Small gold knob handle for upper door
                    let handleX = dx + (uDoorW / 2);
                    let handleY = 100;
                    ctx.fillStyle = '#fef08a';
                    ctx.beginPath(); ctx.arc(handleX, handleY, 2, 0, Math.PI * 2); ctx.fill();
                    ctx.strokeStyle = '#ca8a04';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // 3. Countertop Slab
            if (countertop !== 'yok') {
                if (previewMode === 'lux') {
                    let ctColorsGrad = ctx.createLinearGradient(xStartL - 4, 150, xStartL - 4, 158);
                    if (countertop === 'laminat') {
                        ctColorsGrad.addColorStop(0, '#cbd5e1'); ctColorsGrad.addColorStop(1, '#64748b');
                    } else if (countertop === 'ahsap') {
                        ctColorsGrad.addColorStop(0, '#fbbf24'); ctColorsGrad.addColorStop(1, '#b45309');
                    } else if (countertop === 'granit') {
                        ctColorsGrad.addColorStop(0, '#4b5563'); ctColorsGrad.addColorStop(1, '#1f2937');
                    } else if (countertop === 'cimstone') {
                        ctColorsGrad.addColorStop(0, '#ffffff'); ctColorsGrad.addColorStop(1, '#cbd5e1');
                    }
                    ctx.fillStyle = ctColorsGrad;
                    ctx.fillRect(xStartL - 4, 150, sL + 8, 8);
                    
                    // Specular shine line on edge
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(xStartL - 4, 150.5); ctx.lineTo(xStartL + sL + 4, 150.5); ctx.stroke();
                } else {
                    let ctColors = { laminat: '#94a3b8', ahsap: '#d97706', granit: '#4b5563', cimstone: '#e2e8f0' };
                    ctx.fillStyle = ctColors[countertop] || '#64748b';
                    ctx.fillRect(xStartL - 4, 150, sL + 8, 8);
                    ctx.strokeStyle = "#fff";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(xStartL - 4, 150, sL + 8, 8);
                }
            }

            // 4. Lower Cabinet
            fillMaterialTexture(ctx, xStartL, 158, sL, 60, matKey);
            ctx.strokeStyle = previewMode === 'lux' ? (matKey === 'lake' ? '#cbd5e1' : '#78350f') : "#e2e8f0";
            ctx.lineWidth = 2;
            ctx.strokeRect(xStartL, 158, sL, 60);
            
            // Lower doors divisions
            let lDoorsCount = Math.round(ll * 2);
            let lDoorW = sL / lDoorsCount;
            ctx.strokeStyle = previewMode === 'lux' ? (matKey === 'lake' ? '#cbd5e1' : '#78350f') : "#475569";
            for(let i = 0; i < lDoorsCount; i++) {
                let dx = xStartL + (i*lDoorW);
                if (i > 0) {
                    ctx.beginPath(); ctx.moveTo(dx, 158); ctx.lineTo(dx, 218); ctx.stroke();
                }
                if (previewMode === 'lux') {
                    fillMaterialTexture(ctx, dx + 1, 159, lDoorW - 2, 58, matKey);
                    
                    // Draw nice gold bar handles for lower doors
                    let handleX = dx + (lDoorW / 2);
                    let handleY = 168;
                    ctx.fillStyle = '#b45309';
                    ctx.fillRect(handleX - 1.5, handleY, 3, 10);
                    ctx.fillStyle = '#fef08a';
                    ctx.fillRect(handleX - 0.5, handleY, 1, 10);
                }
            }
            // Draw sink faucet if countertop is set
            if(countertop !== 'yok' && sL > 60) {
                if (previewMode === 'lux') {
                    // Chrome faucet styling
                    ctx.strokeStyle = "#cbd5e1";
                    ctx.lineWidth = 3.5;
                    ctx.beginPath();
                    ctx.moveTo(xStartL + (sL/2), 150);
                    ctx.lineTo(xStartL + (sL/2), 138);
                    ctx.arc(xStartL + (sL/2) - 4, 138, 4, 0, Math.PI, true);
                    ctx.stroke();
                    
                    // Faucet handle
                    ctx.strokeStyle = "#94a3b8";
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(xStartL + (sL/2) - 1, 145);
                    ctx.lineTo(xStartL + (sL/2) + 3, 143);
                    ctx.stroke();
                } else {
                    ctx.strokeStyle = "#cbd5e1";
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.moveTo(xStartL + (sL/2), 150);
                    ctx.lineTo(xStartL + (sL/2), 138);
                    ctx.arc(xStartL + (sL/2) - 4, 138, 4, 0, Math.PI, true);
                    ctx.stroke();
                }
            }

            // Dimension labels
            drawDimension(ctx, xStartU, 45, xStartU + sU, 45, "Üst: " + ul.toFixed(2) + " m", false);
            drawDimension(ctx, xStartL, 235, xStartL + sL, 235, "Alt: " + ll.toFixed(2) + " m", false);
        }
        else if(type === 'vestiyer') {
            let w = parseFloat(document.getElementById('v_width').value) || 0;
            let h = parseFloat(document.getElementById('v_height').value) || 0;
            let drawers = parseInt(document.getElementById('v_drawers').value) || 0;
            let hinges = parseInt(document.getElementById('v_hinges').value) || 0;
            let hooks = parseInt(document.getElementById('v_hooks').value) || 0;
            let mirror = document.getElementById('v_mirror').value;
            advancePayment = parseFloat(document.getElementById('v_advance').value) || 0;
            matKey = document.getElementById('v_material').value;
            rayKey = document.getElementById('v_ray').value;
            let hingeKey = document.getElementById('v_hinge_type').value;

            m2 = w * h;
            dolapTutar = m2 * (dynamicPrices.vestiyer_m2 || 3600);
            arkalikTutar = m2 * dynamicPrices.ark4;
            cekmeceTutar = drawers * dynamicPrices[rayKey];
            menteseTutar = hinges * dynamicPrices[hingeKey];
            kesimGideri = m2 * (dynamicPrices.kesim_m2 || 350);
            montajTutar = dynamicPrices.montaj;

            if(mirror === 'kucuk') ekstralarTutar = 600;
            else if(mirror === 'boy') ekstralarTutar = 1200;

            // DRAW VESTIYER
            let scale = Math.min(260 / w, 180 / h);
            let sW = w * scale;
            let sH = h * scale;
            let xStart = (canvas.width - sW) / 2;
            let yStart = (canvas.height - sH) / 2;

            // Cabinet Shell
            fillMaterialTexture(ctx, xStart, yStart, sW, sH, 'kapaksiz');
            ctx.strokeStyle = previewMode === 'lux' ? '#78350f' : "#e2e8f0";
            ctx.lineWidth = 2.5;
            ctx.strokeRect(xStart, yStart, sW, sH);

            // Left Section (Closed Wardrobe doors)
            let secW = sW / 2;
            fillMaterialTexture(ctx, xStart, yStart, secW, sH, matKey);
            ctx.strokeStyle = previewMode === 'lux' ? (matKey === 'lake' ? '#cbd5e1' : '#78350f') : "#e2e8f0";
            ctx.lineWidth = previewMode === 'lux' ? 2 : 1.5;
            ctx.strokeRect(xStart, yStart, secW, sH);
            
            // Draw left section doors separation and handles
            if (previewMode === 'lux') {
                let subW = secW / 2;
                fillMaterialTexture(ctx, xStart + 1, yStart + 1, subW - 2, sH - 2, matKey);
                fillMaterialTexture(ctx, xStart + subW + 1, yStart + 1, subW - 2, sH - 2, matKey);
                ctx.strokeRect(xStart, yStart, subW, sH);
                ctx.strokeRect(xStart + subW, yStart, subW, sH);
                
                // 2 Gold handles
                for (let k = 0; k < 2; k++) {
                    let handleX = xStart + (k * subW) + (subW / 2);
                    let handleY = yStart + (sH / 2) - 15;
                    ctx.save();
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
                    ctx.shadowBlur = 3;
                    ctx.shadowOffsetX = 1;
                    ctx.shadowOffsetY = 1;
                    ctx.fillStyle = '#b45309'; 
                    ctx.fillRect(handleX - 3, handleY, 6, 2);
                    ctx.fillRect(handleX - 3, handleY + 28, 6, 2);
                    let handleGrad = ctx.createLinearGradient(handleX - 1.5, handleY, handleX + 1.5, handleY);
                    handleGrad.addColorStop(0, '#fef08a');
                    handleGrad.addColorStop(0.5, '#eab308');
                    handleGrad.addColorStop(1, '#ca8a04');
                    ctx.fillStyle = handleGrad;
                    ctx.fillRect(handleX - 1.5, handleY - 1, 3, 32);
                    ctx.restore();
                }
            } else {
                let handleX = xStart + (secW / 2);
                let handleY = yStart + (sH / 2) - 15;
                ctx.fillStyle = "#0284c7";
                ctx.fillRect(handleX - 2, handleY, 4, 30);
            }

            // Right Section: Mirror and Hook Area
            if (mirror === 'boy') {
                let mirW = secW * 0.5;
                if (previewMode === 'lux') {
                    let gr = ctx.createLinearGradient(xStart + secW, yStart, xStart + secW + mirW, yStart);
                    gr.addColorStop(0, '#e0f2fe');
                    gr.addColorStop(0.5, '#bae6fd');
                    gr.addColorStop(1, '#bae6fd');
                    ctx.fillStyle = gr;
                    ctx.fillRect(xStart + secW, yStart, mirW, sH - 40);
                    
                    // Golden mirror frame border
                    ctx.strokeStyle = "#ca8a04";
                    ctx.lineWidth = 2.5;
                    ctx.strokeRect(xStart + secW + 1, yStart + 1, mirW - 2, sH - 42);
                } else {
                    let gr = ctx.createLinearGradient(xStart + secW, yStart, xStart + secW + mirW, yStart);
                    gr.addColorStop(0, '#bae6fd');
                    gr.addColorStop(1, '#e0f2fe');
                    ctx.fillStyle = gr;
                    ctx.fillRect(xStart + secW, yStart, mirW, sH - 40);
                    ctx.strokeStyle = "#e2e8f0";
                    ctx.lineWidth = 1.5;
                    ctx.strokeRect(xStart + secW, yStart, mirW, sH - 40);
                }

                // Draw mirror diagonal shine
                ctx.strokeStyle = "rgba(255,255,255,0.6)";
                ctx.lineWidth = previewMode === 'lux' ? 2.5 : 1.5;
                ctx.beginPath();
                ctx.moveTo(xStart + secW + 5, yStart + 20);
                ctx.lineTo(xStart + secW + mirW - 5, yStart + mirW + 10);
                ctx.stroke();

                // Open coat hooks panel (Remaining 1/2 of right section)
                fillMaterialTexture(ctx, xStart + secW + mirW, yStart, secW - mirW, sH - 40, 'kapaksiz');
                
                // Draw hook circles
                ctx.fillStyle = previewMode === 'lux' ? "#fef08a" : "#f59e0b";
                for(let h = 0; h < hooks; h++) {
                    let hX = xStart + secW + mirW + (secW - mirW)/2;
                    let hY = yStart + 25 + (h * 22);
                    if(hY < yStart + sH - 60) {
                        ctx.beginPath(); ctx.arc(hX, hY, previewMode === 'lux' ? 3.5 : 3, 0, 2*Math.PI); ctx.fill();
                        ctx.strokeStyle = previewMode === 'lux' ? '#ca8a04' : '#f59e0b';
                        ctx.lineWidth = 1.5;
                        ctx.beginPath(); ctx.moveTo(hX, hY); ctx.lineTo(hX + 3, hY + 5); ctx.stroke();
                    }
                }
            } else {
                // No mirror or small, draw coat hangers
                fillMaterialTexture(ctx, xStart + secW, yStart, secW, sH - 40, 'kapaksiz');
                ctx.fillStyle = previewMode === 'lux' ? "#fef08a" : "#f59e0b";
                ctx.strokeStyle = previewMode === 'lux' ? '#ca8a04' : '#f59e0b';
                ctx.lineWidth = 1.5;
                for(let h = 0; h < hooks; h++) {
                    let hX = xStart + secW + (h * (secW / (hooks + 1))) + (secW / (hooks + 1));
                    let hY = yStart + 30;
                    ctx.beginPath(); ctx.arc(hX, hY, previewMode === 'lux' ? 3.5 : 3, 0, 2*Math.PI); ctx.fill();
                    ctx.beginPath(); ctx.moveTo(hX, hY); ctx.lineTo(hX + 3, hY + 5); ctx.stroke();
                }
            }

            // Bottom drawer unit
            fillMaterialTexture(ctx, xStart + secW, yStart + sH - 40, secW, 40, matKey);
            ctx.strokeStyle = previewMode === 'lux' ? (matKey === 'lake' ? '#cbd5e1' : '#78350f') : "#334155";
            ctx.lineWidth = 2;
            ctx.strokeRect(xStart + secW, yStart + sH - 40, secW, 40);
            
            // Draw drawers
            if(drawers > 0) {
                let drW = secW;
                let drH = 40 / drawers;
                ctx.strokeStyle = previewMode === 'lux' ? (matKey === 'lake' ? '#cbd5e1' : '#78350f') : "#e2e8f0";
                ctx.lineWidth = 1;
                for(let d = 0; d < drawers; d++) {
                    let dy = yStart + sH - 40 + (d*drH);
                    if (previewMode === 'lux') {
                        fillMaterialTexture(ctx, xStart + secW + 1, dy + 1, drW - 2, drH - 2, matKey);
                        ctx.strokeRect(xStart + secW, dy, drW, drH);
                        
                        // Golden drawer knob
                        let centerKx = xStart + secW + drW/2;
                        let centerKy = dy + drH/2;
                        ctx.fillStyle = '#fef08a';
                        ctx.beginPath(); ctx.arc(centerKx, centerKy, 2.5, 0, Math.PI * 2); ctx.fill();
                        ctx.strokeStyle = '#ca8a04';
                        ctx.stroke();
                    } else {
                        ctx.strokeRect(xStart + secW, dy, drW, drH);
                        ctx.fillStyle = "#0284c7";
                        ctx.fillRect(xStart + secW + (drW/2) - 10, dy + (drH/2) - 1, 20, 2);
                    }
                }
            }

            drawDimension(ctx, xStart, yStart - 10, xStart + sW, yStart - 10, w.toFixed(2) + " m", false);
            drawDimension(ctx, xStart - 12, yStart, xStart - 12, yStart + sH, h.toFixed(2) + " m", true);
        }
        else if(type === 'banyo') {
            let w = parseFloat(document.getElementById('b_width').value) || 0;
            let h = parseFloat(document.getElementById('b_height').value) || 0;
            let drawers = parseInt(document.getElementById('b_drawers').value) || 0;
            let hinges = parseInt(document.getElementById('b_hinges').value) || 0;
            let extras = document.getElementById('b_extras').value;
            advancePayment = parseFloat(document.getElementById('b_advance').value) || 0;
            matKey = document.getElementById('b_material').value;
            rayKey = document.getElementById('b_ray').value;

            m2 = w * h;
            dolapTutar = m2 * (dynamicPrices.banyo_m2 || 4000);
            arkalikTutar = m2 * dynamicPrices.ark4;
            cekmeceTutar = drawers * dynamicPrices[rayKey];
            menteseTutar = hinges * dynamicPrices.samet;
            kesimGideri = m2 * (dynamicPrices.kesim_m2 || 350);
            montajTutar = dynamicPrices.montaj / 2; // cheaper assembly

            if(extras === 'ayna') ekstralarTutar = 800;
            else if(extras === 'lavabo') ekstralarTutar = 1500;
            else if(extras === 'ikisi_de') ekstralarTutar = 2300;

            // DRAW BATH VANITY
            let scale = Math.min(260 / w, 180 / h);
            let sW = w * scale;
            let sH = h * scale;
            let xStart = (canvas.width - sW) / 2;
            let yStart = (canvas.height - sH) / 2;

            // Bottom Vanity cabinet (usually 80cm high)
            let vH = sH * 0.45;
            fillMaterialTexture(ctx, xStart, yStart + sH - vH, sW, vH, matKey);
            ctx.strokeStyle = previewMode === 'lux' ? (matKey === 'lake' ? '#cbd5e1' : '#78350f') : "#fff";
            ctx.lineWidth = 2;
            ctx.strokeRect(xStart, yStart + sH - vH, sW, vH);

            // Draw drawers
            if(drawers > 0) {
                let dH = vH / drawers;
                ctx.strokeStyle = previewMode === 'lux' ? (matKey === 'lake' ? '#cbd5e1' : '#78350f') : "#475569";
                for(let d = 0; d < drawers; d++) {
                    let dY = yStart + sH - vH + (d*dH);
                    if (previewMode === 'lux') {
                        fillMaterialTexture(ctx, xStart + 1.5, dY + 1.5, sW - 3, dH - 3, matKey);
                        ctx.strokeRect(xStart, dY, sW, dH);
                        
                        // Golden drawer handle in center
                        let hX = xStart + sW/2;
                        let hY = dY + dH/2 - 1;
                        ctx.fillStyle = '#b45309';
                        ctx.fillRect(hX - 10, hY, 20, 2);
                        ctx.fillStyle = '#fef08a';
                        ctx.fillRect(hX - 10, hY - 0.5, 20, 1);
                    } else {
                        ctx.strokeRect(xStart, dY, sW, dH);
                    }
                }
            }

            // Draw Sink / Basin (on top of cabinet)
            if(extras === 'lavabo' || extras === 'ikisi_de') {
                ctx.fillStyle = "#fff";
                ctx.fillRect(xStart + 6, yStart + sH - vH - 6, sW - 12, 6);
                ctx.strokeStyle = "#94a3b8";
                ctx.lineWidth = 1;
                ctx.strokeRect(xStart + 6, yStart + sH - vH - 6, sW - 12, 6);
                
                // Chrome Tap/faucet
                if (previewMode === 'lux') {
                    ctx.strokeStyle = "#cbd5e1";
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.moveTo(xStart + (sW/2), yStart + sH - vH - 6);
                    ctx.lineTo(xStart + (sW/2), yStart + sH - vH - 18);
                    ctx.lineTo(xStart + (sW/2) - 4, yStart + sH - vH - 18);
                    ctx.stroke();
                } else {
                    ctx.strokeStyle = "#cbd5e1";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(xStart + (sW/2), yStart + sH - vH - 6);
                    ctx.lineTo(xStart + (sW/2), yStart + sH - vH - 18);
                    ctx.lineTo(xStart + (sW/2) - 4, yStart + sH - vH - 18);
                    ctx.stroke();
                }
            }

            // Upper Mirror Module
            if(extras === 'ayna' || extras === 'ikisi_de') {
                let mH = sH * 0.45;
                if (previewMode === 'lux') {
                    let gr = ctx.createLinearGradient(xStart + 15, yStart, xStart + sW - 15, yStart);
                    gr.addColorStop(0, '#e0f2fe');
                    gr.addColorStop(0.5, '#bae6fd');
                    gr.addColorStop(1, '#bae6fd');
                    ctx.fillStyle = gr;
                    ctx.fillRect(xStart + 15, yStart, sW - 30, mH);
                    
                    // Golden mirror frame border
                    ctx.strokeStyle = "#ca8a04";
                    ctx.lineWidth = 2.5;
                    ctx.strokeRect(xStart + 16, yStart + 1, sW - 32, mH - 2);
                    
                    // Diagonal mirror reflection lines
                    ctx.strokeStyle = "rgba(255,255,255,0.6)";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(xStart + 25, yStart + 15);
                    ctx.lineTo(xStart + 70, yStart + mH - 15);
                    ctx.stroke();
                } else {
                    let gr = ctx.createLinearGradient(xStart + 15, yStart, xStart + sW - 15, yStart);
                    gr.addColorStop(0, '#bae6fd');
                    gr.addColorStop(1, '#e0f2fe');
                    ctx.fillStyle = gr;
                    ctx.fillRect(xStart + 15, yStart, sW - 30, mH);
                    ctx.strokeStyle = "#f59e0b";
                    ctx.lineWidth = 1.5;
                    ctx.strokeRect(xStart + 15, yStart, sW - 30, mH);
                }
            }

            drawDimension(ctx, xStart, yStart - 10, xStart + sW, yStart - 10, w.toFixed(2) + " m", false);
            drawDimension(ctx, xStart - 12, yStart, xStart - 12, yStart + sH, h.toFixed(2) + " m", true);
        }
        else if(type === 'ozel') {
            let method = document.getElementById('o_method').value;
            let qty = parseFloat(document.getElementById('o_qty').value) || 0;
            let unitPrice = parseFloat(document.getElementById('o_unit_price').value) || 0;
            let extras = parseFloat(document.getElementById('o_extras').value) || 0;
            advancePayment = parseFloat(document.getElementById('o_advance').value) || 0;

            m2 = method === 'm2' ? qty : 0;
            dolapTutar = method === 'sabit' ? unitPrice : (qty * unitPrice);
            ekstralarTutar = extras;
            montajTutar = 0; // included in custom prices

            // DRAW BLUEPRINT LOGO ON CANVAS
            ctx.fillStyle = "rgba(2, 132, 199, 0.08)";
            ctx.beginPath();
            ctx.arc(200, 150, 60, 0, 2*Math.PI);
            ctx.fill();

            // Draw isometric drafting cube
            ctx.strokeStyle = "#0284c7";
            ctx.lineWidth = 1.5;
            // Draw cube lines
            ctx.beginPath();
            ctx.moveTo(200, 100);
            ctx.lineTo(250, 125);
            ctx.lineTo(250, 185);
            ctx.lineTo(200, 210);
            ctx.lineTo(150, 185);
            ctx.lineTo(150, 125);
            ctx.closePath();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(200, 210); ctx.lineTo(200, 150);
            ctx.moveTo(150, 125); ctx.lineTo(200, 150);
            ctx.moveTo(250, 125); ctx.lineTo(200, 150);
            ctx.stroke();

            // Label text inside blueprint
            ctx.fillStyle = "#94a3b8";
            ctx.font = "bold 11px Inter";
            ctx.textAlign = "center";
            ctx.fillText("ÖZEL TASARIM PROJELENDİRME", 200, 240);
        }

        // CALCULATE FINAL SUMMARIES
        let gövdeSheetCount = 0;
        let arkalikSheetCount = 0;
        let useSheetCosting = document.getElementById('chkUseSheetCosting') && document.getElementById('chkUseSheetCosting').checked;

        if (useSheetCosting && type !== 'ozel') {
            // Get plate dimensions
            let sizeSelect = document.getElementById('opt_stock_size') ? document.getElementById('opt_stock_size').value : '2800x2100';
            let stockW = 2800; let stockH = 2100;
            if(sizeSelect === '2800x2100') { stockW = 2800; stockH = 2100; }
            else if(sizeSelect === '3660x1830') { stockW = 3660; stockH = 1830; }
            else if(document.getElementById('opt_stock_w')) {
                stockW = parseInt(document.getElementById('opt_stock_w').value) || 2800;
                stockH = parseInt(document.getElementById('opt_stock_h').value) || 2100;
            }
            let sheetArea = (stockW * stockH) / 1000000;
            
            // Get parts list and run optimization dry run
            let parts = getPartsListFromCurrentOffer();
            gövdeSheetCount = calculateSheetsDryRun(parts);
            
            // Override dolapTutar
            let mPrice = dynamicPrices[matKey];
            if (type === 'vestiyer') mPrice = dynamicPrices.vestiyer_m2 || 3600;
            if (type === 'banyo') mPrice = dynamicPrices.banyo_m2 || 4000;
            let sheetPrice = sheetArea * mPrice;
            dolapTutar = gövdeSheetCount * sheetPrice;
            
            // Override arkalikTutar
            let arkalikM2 = m2;
            if (type === 'mutfak') {
                let ul = parseFloat(document.getElementById('k_upper_len').value) || 0;
                arkalikM2 = ul * 0.8;
            }
            arkalikSheetCount = Math.ceil(arkalikM2 / sheetArea);
            
            let backKey = 'ark4';
            if (type === 'gardırop') backKey = document.getElementById('g_back').value;
            if (type === 'udolap') backKey = document.getElementById('u_back_panel').value;
            
            let backMatPrice = (backKey === 'ark4' ? dynamicPrices.ark4 : dynamicPrices.mdf);
            let backSheetPrice = sheetArea * backMatPrice;
            arkalikTutar = arkalikSheetCount * backSheetPrice;
            
            // Override kesimGideri
            kesimGideri = (gövdeSheetCount + arkalikSheetCount) * sheetArea * (dynamicPrices.kesim_m2 || 350);
        }

        let toplam = dolapTutar + arkalikTutar + cekmeceTutar + menteseTutar + ekstralarTutar + montajTutar;
        let kalan = toplam - advancePayment;

        // Populate Summary fields
        if (useSheetCosting && type !== 'ozel') {
            document.getElementById('lblM2').innerText = `${gövdeSheetCount} Plaka Gövde / ${arkalikSheetCount} Plaka Arkalık`;
        } else {
            document.getElementById('lblM2').innerText = type === 'ozel' ? (document.getElementById('o_qty').value + " " + document.getElementById('o_method').value.toUpperCase()) : (m2.toFixed(2) + " m²");
        }
        document.getElementById('lblDolap').innerText = dolapTutar.toLocaleString('tr-TR') + " ₺";
        document.getElementById('lblCekmece').innerText = cekmeceTutar.toLocaleString('tr-TR') + " ₺";
        document.getElementById('lblMentese').innerText = menteseTutar.toLocaleString('tr-TR') + " ₺";
        document.getElementById('lblEkstralar').innerText = ekstralarTutar.toLocaleString('tr-TR') + " ₺";
        document.getElementById('lblKesimGider').innerText = kesimGideri.toLocaleString('tr-TR') + " ₺";
        document.getElementById('lblMontajBedel').innerText = montajTutar.toLocaleString('tr-TR') + " ₺";
        document.getElementById('lblToplam').innerText = toplam.toLocaleString('tr-TR') + " ₺";
        document.getElementById('lblKalan').innerText = kalan.toLocaleString('tr-TR') + " ₺";

        return { m2, toplam, kaparo: advancePayment, kalan, kapakAdet, type, detailsText: getSpecificationText(), useSheetCosting, gövdeSheetCount, arkalikSheetCount };
    }

    // Helper to draw CAD dimensions
    function drawDimension(ctx, x1, y1, x2, y2, text, isVertical) {
        ctx.strokeStyle = "#64748b";
        ctx.fillStyle = "#64748b";
        ctx.lineWidth = 1;
        ctx.font = "bold 10px Inter";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        
        if(isVertical) {
            ctx.beginPath();
            ctx.moveTo(x1 - 4, y1); ctx.lineTo(x1 + 4, y1);
            ctx.moveTo(x2 - 4, y2); ctx.lineTo(x2 + 4, y2);
            ctx.stroke();

            ctx.save();
            ctx.translate(x1 - 10, (y1+y2)/2);
            ctx.rotate(-Math.PI/2);
            ctx.fillText(text, 0, 0);
            ctx.restore();
        } else {
            ctx.beginPath();
            ctx.moveTo(x1, y1 - 4); ctx.lineTo(x1, y1 + 4);
            ctx.moveTo(x2, y2 - 4); ctx.lineTo(x2, y2 + 4);
            ctx.stroke();

            ctx.fillStyle = "#0c111e";
            let tw = ctx.measureText(text).width + 6;
            ctx.fillRect((x1+x2)/2 - tw/2, y1 - 6, tw, 12);
            ctx.fillStyle = "#94a3b8";
            ctx.fillText(text, (x1+x2)/2, y1);
        }
    }

    // Helper to draw a single wall segment in U-Dolap
    function drawWallSegment(ctx, x, y, w, h, label, mat, drawersCount, hingesCount) {
        // Draw background based on material
        ctx.fillStyle = mat === 'lake' ? '#f8fafc' : (mat === 'cam' ? '#38bdf8' : (mat === 'kapaksiz' ? '#1e293b' : '#b45309'));
        ctx.globalAlpha = 0.85;
        ctx.fillRect(x, y, w, h);
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);

        if (mat === 'kapaksiz') {
            // Draw wood frame border
            ctx.strokeStyle = '#b45309';
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, w, h);

            // Dividers
            let sections = Math.max(1, Math.round(w / 45)); 
            let secW = (w - 8) / sections;
            ctx.strokeStyle = '#b45309';
            ctx.lineWidth = 2;
            for(let i = 1; i < sections; i++) {
                let divX = x + 4 + i*secW;
                ctx.beginPath();
                ctx.moveTo(divX, y + 4);
                ctx.lineTo(divX, y + h - 4);
                ctx.stroke();
            }

            // Draw shelves/hangers
            for(let i = 0; i < sections; i++) {
                let secX1 = x + 4 + i*secW;
                let secX2 = secX1 + secW;
                if(i % 2 === 0) {
                    // shelves
                    let shelfCount = 3;
                    let shelfH = (h - 8) / (shelfCount + 1);
                    for(let j = 1; j <= shelfCount; j++) {
                        let shelfY = y + 4 + j*shelfH;
                        ctx.beginPath();
                        ctx.moveTo(secX1, shelfY);
                        ctx.lineTo(secX2, shelfY);
                        ctx.stroke();
                    }
                } else {
                    // hanger
                    let topShelfY = y + 4 + (h - 8)*0.2;
                    ctx.beginPath(); ctx.moveTo(secX1, topShelfY); ctx.lineTo(secX2, topShelfY); ctx.stroke();
                    
                    let rodY = topShelfY + 8;
                    ctx.strokeStyle = '#94a3b8';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.moveTo(secX1 + 2, rodY); ctx.lineTo(secX2 - 2, rodY); ctx.stroke();
                    ctx.strokeStyle = '#b45309';
                    ctx.lineWidth = 2;

                    ctx.fillStyle = 'rgba(245, 158, 11, 0.4)';
                    ctx.fillRect(secX1 + secW/2 - 4, rodY + 3, 8, 20);
                }
            }
        } else {
            // Closed segment
            let doors = Math.max(1, Math.round(w / 45)); 
            let doorW = w / doors;
            ctx.strokeStyle = "#475569";
            ctx.lineWidth = 1.5;
            for(let i = 1; i < doors; i++) {
                ctx.beginPath();
                ctx.moveTo(x + i*doorW, y);
                ctx.lineTo(x + i*doorW, y + h);
                ctx.stroke();
            }

            // Draw handles
            ctx.fillStyle = "#0284c7";
            for(let i = 0; i < doors; i++) {
                let hX = x + i*doorW + doorW/2;
                ctx.fillRect(hX - 1.5, y + h/2 - 10, 3, 20);
            }
        }

        // Draw drawers if any in this segment
        if (drawersCount > 0) {
            ctx.fillStyle = "rgba(0,0,0,0.35)";
            let drawerH = 12;
            let drawSectionW = w / (mat === 'kapaksiz' ? Math.max(1, Math.round(w / 45)) : 1);
            for(let j = 0; j < drawersCount; j++) {
                let dY = (y + h) - (j * (drawerH + 3)) - drawerH - 8;
                if(dY > y) {
                    ctx.fillRect(x + 4, dY, drawSectionW - 8, drawerH);
                    ctx.strokeStyle = "#64748b";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x + 4, dY, drawSectionW - 8, drawerH);
                }
            }
        }

        // Draw label
        ctx.fillStyle = "#94a3b8";
        ctx.font = "bold 9px Inter";
        ctx.textAlign = "center";
        ctx.fillText(label, x + w/2, y + h - 6);
    }



    let designerCabinet = {
        width: 200,
        height: 220,
        material: 'lake',
        handle: 'black',
        hasDoors: 'yes',
        led: 'yok',
        modules: ['shelf', 'rod', 'drawer'],
        activeModuleIdx: 0,
        doorsOpen: false
    };
    
    let designerActiveTab = 'dolap';
    let showDesignerRulers = true;
    let showDesignerSilhouette = true;

    function initDesignerCabinet() {
        designerCabinet = {
            width: 200,
            height: 220,
            material: 'lake',
            handle: 'black',
            hasDoors: 'yes',
            led: 'yok',
            modules: ['shelf', 'rod', 'drawer'],
            activeModuleIdx: 0,
            doorsOpen: false
        };
        
        // Reset HTML range inputs
        document.getElementById('designWidth').value = 200;
        document.getElementById('designHeight').value = 220;
        
        // Reset state variables
        designerActiveTab = 'dolap';
        showDesignerRulers = true;
        showDesignerSilhouette = true;
        
        // Sync segmented controls
        switchDesignerTab('dolap');
        selectSegmentedOption('hasDoors', 'yes');
        selectSegmentedOption('material', 'lake');
        selectSegmentedOption('handle', 'black');
        selectSegmentedOption('led', 'yok');
        
        // Sync float button classes
        let btnDoors = document.getElementById('btnFloatDoors');
        let btnRulers = document.getElementById('btnFloatRulers');
        let btnSil = document.getElementById('btnFloatSilhouette');
        
        if(btnDoors) {
            btnDoors.classList.remove('active');
            btnDoors.innerHTML = "🚪";
            btnDoors.style.display = "flex";
        }
        if(btnRulers) btnRulers.classList.add('active');
        if(btnSil) btnSil.classList.add('active');
        
        updateDesignerCabinet();
    }
    
    function switchDesignerTab(tab) {
        designerActiveTab = tab;
        document.getElementById('tabDesignDolap').classList.toggle('active', tab === 'dolap');
        document.getElementById('tabDesignModul').classList.toggle('active', tab === 'modul');
        document.getElementById('designerTabContentDolap').style.display = tab === 'dolap' ? 'flex' : 'none';
        document.getElementById('designerTabContentModul').style.display = tab === 'modul' ? 'flex' : 'none';
    }
    
    function selectSegmentedOption(key, value) {
        designerCabinet[key] = value;
        
        // Sync active class on buttons
        if (key === 'hasDoors') {
            document.getElementById('optDoors_yes').classList.toggle('active', value === 'yes');
            document.getElementById('optDoors_no').classList.toggle('active', value === 'no');
            
            // Toggle sub-options visibility
            document.getElementById('groupMaterial').style.display = value === 'yes' ? 'block' : 'none';
            
            // Toggle handles (cam has integrated design or hidden bas-ac doesn't need handle selection sometimes, but let's follow logic)
            document.getElementById('groupHandle').style.display = (value === 'yes' && designerCabinet.material !== 'cam') ? 'block' : 'none';
            
            let btnDoors = document.getElementById('btnFloatDoors');
            if (value === 'no') {
                designerCabinet.doorsOpen = true; // force open if no doors
                if (btnDoors) btnDoors.style.display = 'none';
            } else {
                designerCabinet.doorsOpen = false; // default close when door added
                if (btnDoors) {
                    btnDoors.style.display = 'flex';
                    btnDoors.classList.remove('active');
                }
            }
        } else if (key === 'material') {
            document.getElementById('optMat_lake').classList.toggle('active', value === 'lake');
            document.getElementById('optMat_mdf').classList.toggle('active', value === 'mdf');
            document.getElementById('optMat_cam').classList.toggle('active', value === 'cam');
            
            // Show handle group unless material is aluminum cam (glass)
            document.getElementById('groupHandle').style.display = (designerCabinet.hasDoors === 'yes' && value !== 'cam') ? 'block' : 'none';
        } else if (key === 'handle') {
            document.getElementById('optHandle_black').classList.toggle('active', value === 'black');
            document.getElementById('optHandle_chrome').classList.toggle('active', value === 'chrome');
            document.getElementById('optHandle_gizli').classList.toggle('active', value === 'gizli');
        } else if (key === 'led') {
            document.getElementById('optLed_yok').classList.toggle('active', value === 'yok');
            document.getElementById('optLed_var').classList.toggle('active', value === 'var');
        }
        
        updateDesignerCabinet();
    }
    
    function toggleDesignerDoors() {
        designerCabinet.doorsOpen = !designerCabinet.doorsOpen;
        let btn = document.getElementById('btnFloatDoors');
        if (btn) {
            btn.classList.toggle('active', designerCabinet.doorsOpen);
        }
        drawSelfDesignerCabinet();
    }
    
    function toggleDesignerRulers() {
        showDesignerRulers = !showDesignerRulers;
        let btn = document.getElementById('btnFloatRulers');
        if (btn) btn.classList.toggle('active', showDesignerRulers);
        drawSelfDesignerCabinet();
    }
    
    function toggleDesignerSilhouette() {
        showDesignerSilhouette = !showDesignerSilhouette;
        let btn = document.getElementById('btnFloatSilhouette');
        if (btn) btn.classList.toggle('active', showDesignerSilhouette);
        drawSelfDesignerCabinet();
    }

    function updateDesignerCabinet() {
        let widthInput = parseInt(document.getElementById('designWidth').value) || 200;
        let heightInput = parseInt(document.getElementById('designHeight').value) || 220;
        
        designerCabinet.width = widthInput;
        designerCabinet.height = heightInput;
        
        // Update Labels
        document.getElementById('lblDesignWidth').innerText = widthInput + " cm";
        document.getElementById('lblDesignHeight').innerText = heightInput + " cm";
        
        // Calculate appropriate section count based on width:
        // 100-150cm -> 2 modules
        // 151-220cm -> 3 modules
        // 221-300cm -> 4 modules
        let requiredSections = 3;
        if (widthInput <= 150) {
            requiredSections = 2;
        } else if (widthInput <= 220) {
            requiredSections = 3;
        } else {
            requiredSections = 4;
        }
        
        document.getElementById('lblTotalSections').innerText = requiredSections + " Bölme";
        
        // Re-adjust modules array size
        let currentSections = designerCabinet.modules.length;
        if (currentSections !== requiredSections) {
            if (requiredSections > currentSections) {
                // Add default modules
                for (let i = currentSections; i < requiredSections; i++) {
                    let defaultType = i % 2 === 0 ? 'shelf' : 'rod';
                    if (i === 2 && requiredSections >= 3) defaultType = 'drawer';
                    designerCabinet.modules.push(defaultType);
                }
            } else {
                // Trim modules
                designerCabinet.modules = designerCabinet.modules.slice(0, requiredSections);
            }
            // Ensure activeModuleIdx is within bounds
            if (designerCabinet.activeModuleIdx >= requiredSections) {
                designerCabinet.activeModuleIdx = 0;
            }
        }
        
        // Render section tabs as segmented pills
        let tabsContainer = document.getElementById('designerSectionTabs');
        if (tabsContainer) {
            tabsContainer.innerHTML = '';
            for (let i = 0; i < requiredSections; i++) {
                let btn = document.createElement('button');
                btn.type = 'button';
                btn.style.flex = '1';
                btn.style.border = 'none';
                btn.style.background = 'transparent';
                btn.style.padding = '6px 8px';
                btn.style.fontSize = '12px';
                btn.style.fontWeight = '600';
                btn.style.borderRadius = '9999px';
                btn.style.cursor = 'pointer';
                btn.style.transition = 'all 0.2s';
                
                if (i === designerCabinet.activeModuleIdx) {
                    btn.style.backgroundColor = '#ffffff';
                    btn.style.color = '#0284c7';
                    btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                } else {
                    btn.style.color = '#475569';
                }
                
                btn.innerText = 'Bölme ' + (i + 1);
                btn.onclick = (function(idx) {
                    return function() { selectDesignerModule(idx); };
                })(i);
                tabsContainer.appendChild(btn);
            }
        }
        
        // Highlight active template card
        let activeTemplate = designerCabinet.modules[designerCabinet.activeModuleIdx];
        let templates = ['shelf', 'rod', 'drawer', 'longrod'];
        templates.forEach(t => {
            let el = document.getElementById('tmpl_' + t);
            if (el) {
                if (t === activeTemplate) {
                    el.classList.add('active');
                } else {
                    el.classList.remove('active');
                }
            }
        });
        
        // Total pricing math
        let w = widthInput / 100;
        let h = heightInput / 100;
        let m2 = w * h;
        
        let matKey = designerCabinet.hasDoors === 'no' ? 'kapaksiz' : designerCabinet.material;
        let basePrice = dynamicPrices[matKey] || 3200;
        let dolapTutar = m2 * basePrice;
        let arkalikTutar = m2 * (dynamicPrices.ark4 || 450);
        let montajTutar = dynamicPrices.montaj || 3500;
        
        let totalDrawers = designerCabinet.modules.filter(m => m === 'drawer').length * 2;
        let cekmeceTutar = totalDrawers * (dynamicPrices.r_tandem || 950);
        
        let totalHinges = designerCabinet.hasDoors === 'yes' ? requiredSections * 4 : 0;
        let menteseTutar = totalHinges * (dynamicPrices.samet || 80);
        
        let ledTutar = designerCabinet.led === 'var' ? 2500 : 0;
        
        let totalEstimatedPrice = Math.round(dolapTutar + arkalikTutar + montajTutar + cekmeceTutar + menteseTutar + ledTutar);
        
        document.getElementById('designTotalPrice').innerText = totalEstimatedPrice.toLocaleString('tr-TR') + " ₺";
        
        drawSelfDesignerCabinet();
    }

    function selectDesignerModule(idx) {
        designerCabinet.activeModuleIdx = idx;
        updateDesignerCabinet();
    }

    function selectSectionTemplate(templateType) {
        designerCabinet.modules[designerCabinet.activeModuleIdx] = templateType;
        updateDesignerCabinet();
    }

    function drawHumanSilhouette(ctx, x, y, h) {
        ctx.save();
        ctx.fillStyle = 'rgba(148, 163, 184, 0.28)';
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
        ctx.lineWidth = 1.5;
        
        // Head
        let headRadius = h * 0.08;
        let headX = x;
        let headY = y - h + headRadius;
        ctx.beginPath();
        ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Torso & Legs
        let shoulderW = h * 0.18;
        let hipW = h * 0.13;
        let torsoTop = headY + headRadius + 4;
        let torsoBottom = torsoTop + h * 0.35;
        let feetY = y;
        
        ctx.beginPath();
        ctx.moveTo(x - shoulderW/2, torsoTop);
        ctx.lineTo(x + shoulderW/2, torsoTop);
        ctx.lineTo(x + hipW/2, torsoBottom);
        ctx.lineTo(x + hipW/3, feetY);
        ctx.lineTo(x - hipW/3, feetY);
        ctx.lineTo(x - hipW/2, torsoBottom);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Arms
        ctx.beginPath();
        ctx.moveTo(x - shoulderW/2, torsoTop);
        ctx.lineTo(x - shoulderW/2 - 4, torsoTop + h * 0.2);
        ctx.lineTo(x - 2, torsoTop + h * 0.25);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(x + shoulderW/2, torsoTop);
        ctx.lineTo(x + shoulderW/2 + 4, torsoTop + h * 0.2);
        ctx.lineTo(x + 2, torsoTop + h * 0.25);
        ctx.stroke();
        
        ctx.restore();
    }

    // Helper function to draw rounded dimension pills
    function drawDimensionPill(ctx, text, x, y) {
        ctx.save();
        ctx.font = "bold 9px Inter";
        let textWidth = ctx.measureText(text).width;
        let padX = 6;
        let padY = 3;
        let rectW = textWidth + padX * 2;
        let rectH = 14;
        
        // Soft Shadow
        ctx.shadowColor = "rgba(15, 23, 42, 0.08)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 1;
        
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1;
        
        let rx = x - rectW / 2;
        let ry = y - rectH / 2;
        let radius = 4;
        
        ctx.beginPath();
        ctx.moveTo(rx + radius, ry);
        ctx.lineTo(rx + rectW - radius, ry);
        ctx.quadraticCurveTo(rx + rectW, ry, rx + rectW, ry + radius);
        ctx.lineTo(rx + rectW, ry + rectH - radius);
        ctx.quadraticCurveTo(rx + rectW, ry + rectH, rx + rectW - radius, ry + rectH);
        ctx.lineTo(rx + radius, ry + rectH);
        ctx.quadraticCurveTo(rx, ry + rectH, rx, ry + rectH - radius);
        ctx.lineTo(rx, ry + radius);
        ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.shadowColor = "transparent";
        ctx.fillStyle = "#475569";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    // Helper to draw visual clothes hanging in wardrobe
    function drawHangingClothes(ctx, x, y, width) {
        // Clothes hangers & garments visualization
        let clothCount = Math.floor(width / 20);
        if (clothCount < 1) clothCount = 1;
        let colors = ["#f87171", "#60a5fa", "#34d399", "#fbbf24", "#a78bfa", "#f472b6"];
        let step = width / (clothCount + 1);
        
        for (let k = 1; k <= clothCount; k++) {
            let cx = x + k * step;
            let cy = y + 4;
            
            ctx.save();
            // Draw Hanger hook
            ctx.strokeStyle = "#94a3b8";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(cx, cy - 2, 2, Math.PI, 0);
            ctx.stroke();
            
            // Hanger triangle
            ctx.beginPath();
            ctx.moveTo(cx - 5, cy);
            ctx.lineTo(cx + 5, cy);
            ctx.lineTo(cx, cy - 2);
            ctx.closePath();
            ctx.stroke();
            
            // Garment
            ctx.fillStyle = colors[(k - 1) % colors.length];
            ctx.fillRect(cx - 7, cy + 1, 14, 28);
            
            // Garment details (collar fold)
            ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
            ctx.beginPath();
            ctx.moveTo(cx - 3, cy + 1);
            ctx.lineTo(cx, cy + 5);
            ctx.lineTo(cx + 3, cy + 1);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    function drawSelfDesignerCabinet() {
        let canvas = document.getElementById('designCanvas');
        if (!canvas) return;
        let ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Studio Background (Light gray studio mode)
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        let w = designerCabinet.width;
        let h = designerCabinet.height;
        
        // pxPerCm scale configuration to fit nicely in 600x420 canvas
        let scale = 300 / Math.max(260, w, h);
        let sW = w * scale;
        let sH = h * scale;
        
        // Shift right of human silhouette (human at x=75, canvas width=600)
        let xStart = 160 + (360 - sW) / 2;
        let yStart = 350 - sH;
        
        // Ground line
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(10, 350);
        ctx.lineTo(canvas.width - 10, 350);
        ctx.stroke();
        
        // Human silhouette next to wardrobe
        if (showDesignerSilhouette) {
            let humanHeightCm = 175;
            let sHumanH = humanHeightCm * scale;
            drawHumanSilhouette(ctx, 75, 350, sHumanH);
            
            // Human label
            ctx.fillStyle = "#64748b";
            ctx.font = "600 10px Inter";
            ctx.textAlign = "center";
            ctx.fillText("İnsan Boyu (1.75m)", 75, 368);
        }
        
        // Cabinet Interior Box Background
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(xStart, yStart, sW, sH);
        
        let sections = designerCabinet.modules.length;
        let sectionW = (sW - 12) / sections;
        let realSectionW = Math.round(w / sections);
        
        // Draw module contents
        for (let i = 0; i < sections; i++) {
            let secX1 = xStart + 6 + i * sectionW;
            let secX2 = secX1 + sectionW;
            let moduleType = designerCabinet.modules[i];
            
            // Sensor LED lighting visual glow representation (soft warm glow)
            if (designerCabinet.led === 'var') {
                let glow = ctx.createLinearGradient(0, yStart + 6, 0, yStart + 90);
                glow.addColorStop(0, 'rgba(245, 158, 11, 0.16)');
                glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
                ctx.fillStyle = glow;
                ctx.fillRect(secX1, yStart + 6, sectionW, sH - 12);
            }
            
            if (moduleType === 'shelf') {
                // Soft pink pastel background for shelf section
                ctx.fillStyle = "rgba(244, 63, 94, 0.03)";
                ctx.fillRect(secX1, yStart + 6, sectionW, sH - 12);
                
                let shelfCount = 4;
                let shelfH = (sH - 12) / (shelfCount + 1);
                let realShelfH = Math.round(h / (shelfCount + 1));
                
                // Draw wood planks instead of lines
                ctx.fillStyle = "#cbd5e1";
                for(let j = 1; j <= shelfCount; j++) {
                    let shelfY = yStart + 6 + j * shelfH;
                    ctx.fillRect(secX1, shelfY - 1.5, sectionW, 3);
                }
                
                // Write height labels inside shelf spaces
                if (showDesignerRulers) {
                    for (let j = 0; j <= shelfCount; j++) {
                        let labelY = yStart + 6 + (j + 0.5) * shelfH;
                        drawDimensionPill(ctx, realShelfH + " cm", secX1 + sectionW/2, labelY);
                    }
                }
                
            } else if (moduleType === 'rod') {
                // Soft gold pastel background for rod section
                ctx.fillStyle = "rgba(234, 179, 8, 0.03)";
                ctx.fillRect(secX1, yStart + 6, sectionW, sH - 12);
                
                let topShelfPercent = 0.2;
                let topShelfY = yStart + 6 + (sH - 12) * topShelfPercent;
                
                // Top shelf plank
                ctx.fillStyle = "#cbd5e1";
                ctx.fillRect(secX1, topShelfY - 1.5, sectionW, 3);
                
                // Hanger rod
                let rodY = topShelfY + 12;
                drawHangingClothes(ctx, secX1, rodY, sectionW);
                
                // Height labels
                if (showDesignerRulers) {
                    drawDimensionPill(ctx, Math.round(h * topShelfPercent) + " cm", secX1 + sectionW/2, yStart + 6 + ((sH - 12) * topShelfPercent)/2);
                    drawDimensionPill(ctx, Math.round(h * (1 - topShelfPercent)) + " cm", secX1 + sectionW/2, topShelfY + ((sH - 12) * (1 - topShelfPercent))/2);
                }
                
            } else if (moduleType === 'drawer') {
                // Soft steel blue pastel background for drawer section
                ctx.fillStyle = "rgba(71, 85, 105, 0.03)";
                ctx.fillRect(secX1, yStart + 6, sectionW, sH - 12);
                
                let topShelfPercent = 0.2;
                let topShelfY = yStart + 6 + (sH - 12) * topShelfPercent;
                
                // Top shelf plank
                ctx.fillStyle = "#cbd5e1";
                ctx.fillRect(secX1, topShelfY - 1.5, sectionW, 3);
                
                // Hanger rod & Clothes
                let rodY = topShelfY + 12;
                drawHangingClothes(ctx, secX1, rodY, sectionW);
                
                let drawerAreaH = (sH - 12) * 0.25;
                let drawerH = drawerAreaH / 2 - 4;
                for (let d = 0; d < 2; d++) {
                    let dY = yStart + sH - 6 - drawerAreaH + d * (drawerH + 4) + 2;
                    
                    // Draw drawer panel front
                    ctx.fillStyle = "#e2e8f0";
                    ctx.fillRect(secX1 + 4, dY, sectionW - 8, drawerH);
                    ctx.strokeStyle = "#cbd5e1";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(secX1 + 4, dY, sectionW - 8, drawerH);
                    
                    // Shadow gap simulated
                    ctx.fillStyle = "rgba(15, 23, 42, 0.05)";
                    ctx.fillRect(secX1 + 4, dY + drawerH - 2, sectionW - 8, 2);
                    
                    // Draw non-gold handles (chrome or dark gray/black handle)
                    ctx.fillStyle = designerCabinet.handle === 'chrome' ? '#94a3b8' : '#0f172a';
                    ctx.fillRect(secX1 + sectionW/2 - 12, dY + drawerH/2 - 1.5, 24, 3);
                }
                
                // Height labels
                if (showDesignerRulers) {
                    drawDimensionPill(ctx, Math.round(h * topShelfPercent) + " cm", secX1 + sectionW/2, yStart + 6 + ((sH - 12) * topShelfPercent)/2);
                    drawDimensionPill(ctx, Math.round(h * (1 - topShelfPercent - 0.25)) + " cm", secX1 + sectionW/2, topShelfY + ((sH - 12) * (1 - topShelfPercent - 0.25))/2);
                    drawDimensionPill(ctx, Math.round(h * 0.25) + " cm", secX1 + sectionW/2, yStart + sH - 6 - drawerAreaH/2);
                }
                
            } else if (moduleType === 'longrod') {
                // Soft green pastel background
                ctx.fillStyle = "rgba(16, 185, 129, 0.03)";
                ctx.fillRect(secX1, yStart + 6, sectionW, sH - 12);
                
                let rodY = yStart + 6 + 18;
                drawHangingClothes(ctx, secX1, rodY, sectionW);
                
                // Height label
                if (showDesignerRulers) {
                    drawDimensionPill(ctx, Math.round(h) + " cm", secX1 + sectionW/2, yStart + sH/2);
                }
            }
            
            // Draw section width label inside the section (above ground)
            if (showDesignerRulers) {
                drawDimensionPill(ctx, realSectionW + " cm", secX1 + sectionW/2, yStart + sH - 14);
            }
        }
        
        // Draw Outer Carcass Frame
        ctx.strokeStyle = '#334155'; // Dark slate steel frame
        ctx.lineWidth = 8;
        ctx.strokeRect(xStart, yStart, sW, sH);
        
        // Draw inner dividers
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        for(let i = 1; i < sections; i++) {
            let divX = xStart + 6 + i * sectionW;
            ctx.beginPath();
            ctx.moveTo(divX, yStart + 6);
            ctx.lineTo(divX, yStart + sH - 6);
            ctx.stroke();
        }
        
        // Highlight active module selection visually (cyan frame)
        if (designerCabinet.doorsOpen) {
            let activeX = xStart + 6 + designerCabinet.activeModuleIdx * sectionW;
            ctx.strokeStyle = "#0284c7"; // sky blue active highlight
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 3]);
            ctx.strokeRect(activeX + 2, yStart + 8, sectionW - 4, sH - 16);
            ctx.setLineDash([]);
        }
        
        // Draw closed doors if configured
        if (designerCabinet.hasDoors === 'yes' && designerCabinet.doorsOpen === false) {
            let doorW = sW / sections;
            let matKey = designerCabinet.material;
            
            let doorFillStyle = "rgba(241, 245, 249, 0.97)"; // lake default (Gloss White)
            if (matKey === 'mdf') {
                doorFillStyle = "#b45309"; // mdf lam warm brown wood
            } else if (matKey === 'cam') {
                doorFillStyle = "rgba(14, 165, 233, 0.28)"; // glassy blue transparent
            }
            
            for (let i = 0; i < sections; i++) {
                let dx = xStart + i * doorW;
                
                // Door panel filling
                ctx.fillStyle = doorFillStyle;
                ctx.fillRect(dx + 2, yStart + 2, doorW - 4, sH - 4);
                
                // MDF vertical grain pattern simulation
                if (matKey === 'mdf') {
                    ctx.strokeStyle = "#92400e";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(dx + doorW / 3, yStart + 5);
                    ctx.lineTo(dx + doorW / 3, yStart + sH - 5);
                    ctx.moveTo(dx + (doorW * 2) / 3, yStart + 15);
                    ctx.lineTo(dx + (doorW * 2) / 3, yStart + sH - 15);
                    ctx.stroke();
                }
                
                // Door frame outline
                ctx.strokeStyle = matKey === 'cam' ? 'rgba(2, 132, 199, 0.65)' : 'rgba(0,0,0,0.1)';
                ctx.lineWidth = matKey === 'cam' ? 3 : 1.5;
                ctx.strokeRect(dx + 2, yStart + 2, doorW - 4, sH - 4);
                
                // Glass glossy diagonal shines for Cam
                if (matKey === 'cam') {
                    ctx.strokeStyle = "rgba(255,255,255,0.45)";
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(dx + 12, yStart + 24);
                    ctx.lineTo(dx + doorW - 12, yStart + 24 + doorW - 24);
                    ctx.stroke();
                }
                
                // Draw handle (avoiding gold handles, using black or chrome as requested)
                if (designerCabinet.handle !== 'gizli' && matKey !== 'cam') {
                    let handleX = dx + doorW / 2;
                    let handleY = yStart + sH / 2 - 15;
                    ctx.fillStyle = designerCabinet.handle === 'chrome' ? '#cbd5e1' : '#1e293b'; // chrome silver or black steel
                    
                    ctx.save();
                    ctx.shadowColor = 'rgba(0,0,0,0.12)';
                    ctx.shadowBlur = 3;
                    ctx.shadowOffsetY = 1;
                    
                    ctx.fillRect(handleX - 2, handleY, 4, 30);
                    ctx.restore();
                }
                
                // Cam vertical profile handles
                if (matKey === 'cam') {
                    let handleX = dx + doorW - 5;
                    if (i === sections - 1) handleX = dx + 5; // Left edge of the last door
                    ctx.fillStyle = '#0f172a'; // Profile color black
                    ctx.fillRect(handleX - 1.5, yStart + 15, 3, sH - 30);
                }
            }
        }
        
        // Rulers
        if (showDesignerRulers) {
            ctx.strokeStyle = "#0284c7";
            ctx.fillStyle = "#0284c7";
            ctx.lineWidth = 1.5;
            
            // Height Ruler
            let rulerX = xStart - 25;
            ctx.beginPath(); ctx.moveTo(rulerX, yStart); ctx.lineTo(rulerX, yStart + sH); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(rulerX - 4, yStart + 6); ctx.lineTo(rulerX, yStart); ctx.lineTo(rulerX + 4, yStart + 6);
            ctx.moveTo(rulerX - 4, yStart + sH - 6); ctx.lineTo(rulerX, yStart + sH); ctx.lineTo(rulerX + 4, yStart + sH - 6);
            ctx.fill();
            
            ctx.save();
            ctx.translate(rulerX - 12, yStart + sH/2);
            ctx.rotate(-Math.PI/2);
            ctx.font = "bold 11px Outfit";
            ctx.textAlign = "center";
            ctx.fillText(h + " cm", 0, 0);
            ctx.restore();
            
            // Width Ruler
            let rulerY = yStart + sH + 20;
            ctx.beginPath(); ctx.moveTo(xStart, rulerY); ctx.lineTo(xStart + sW, rulerY); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(xStart + 6, rulerY - 4); ctx.lineTo(xStart, rulerY); ctx.lineTo(xStart + 6, rulerY + 4);
            ctx.moveTo(xStart + sW - 6, rulerY - 4); ctx.lineTo(xStart + sW, rulerY); ctx.lineTo(xStart + sW - 6, rulerY + 4);
            ctx.fill();
            
            ctx.font = "bold 11px Outfit";
            ctx.textAlign = "center";
            ctx.fillText(w + " cm", xStart + sW/2, rulerY + 15);
        }
    }

// Bind CAD functions and state variables to window for global access
window.fillMaterialTexture = fillMaterialTexture;
window.getPartsListFromCurrentOffer = getPartsListFromCurrentOffer;
window.calculateSheetsDryRun = calculateSheetsDryRun;
window.hesaplaVeCiz = hesaplaVeCiz;
window.drawDimension = drawDimension;
window.drawWallSegment = drawWallSegment;
window.initDesignerCabinet = initDesignerCabinet;
window.switchDesignerTab = switchDesignerTab;
window.selectSegmentedOption = selectSegmentedOption;
window.toggleDesignerDoors = toggleDesignerDoors;
window.toggleDesignerRulers = toggleDesignerRulers;
window.toggleDesignerSilhouette = toggleDesignerSilhouette;
window.updateDesignerCabinet = updateDesignerCabinet;
window.selectDesignerModule = selectDesignerModule;
window.selectSectionTemplate = selectSectionTemplate;
window.drawHumanSilhouette = drawHumanSilhouette;
window.drawDimensionPill = drawDimensionPill;
window.drawHangingClothes = drawHangingClothes;
window.drawSelfDesignerCabinet = drawSelfDesignerCabinet;

