// Cross-module proxy functions to bypass ESM strict scope limitations
const getSpecificationText = (...args) => window.getSpecificationText(...args);
    function fillMaterialTexture(ctx, x, y, w, h, materialKey) {
        if (previewMode === 'blueprint') {
            ctx.fillStyle = materialKey === 'lake' ? '#f8fafc' : (materialKey === 'cam' ? '#38bdf8' : (materialKey === 'kapaksiz' ? '#1e293b' : '#b45309'));
            ctx.fillRect(x, y, w, h);
            return;
        }
        
        // LÃ¼ks 2D Modu DokularÄ±
        if (materialKey === 'lake') {
            // Parlak lake kaplama degrade
            let grad = ctx.createLinearGradient(x, y, x + w, y + h);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(0.3, '#f8fafc');
            grad.addColorStop(0.7, '#f1f5f9');
            grad.addColorStop(1, '#e2e8f0');
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, w, h);
            
            // Parlama / IÅŸÄ±ltÄ± Ã§izgisi
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
            // YansÄ±malÄ± cam kaplama
            let grad = ctx.createLinearGradient(x, y, x + w, y + h);
            grad.addColorStop(0, 'rgba(56, 189, 248, 0.35)');
            grad.addColorStop(0.5, 'rgba(14, 165, 233, 0.2)');
            grad.addColorStop(1, 'rgba(3, 105, 161, 0.4)');
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, w, h);
            
            // AlÃ¼minyum profil Ã§erÃ§eve
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 4;
            ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, w, h);
            
            // Cam yansÄ±ma ÅŸeritleri
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
            // Koyu iÃ§ derinlik gÃ¶lgelemesi
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
            // AhÅŸap / MDF Lam damarlÄ± dokusu
            let grad = ctx.createLinearGradient(x, y, x + w, y);
            grad.addColorStop(0, '#a16207');
            grad.addColorStop(0.5, '#b45309');
            grad.addColorStop(1, '#78350f');
            ctx.fillStyle = grad;
            ctx.fillRect(x, y, w, h);
            
            // DalgalÄ± aÄŸaÃ§ damar Ã§izgileri
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

        if (type === 'gardÄ±rop') {
            let w = Math.round(parseFloat(document.getElementById('g_width').value) * 1000) || 0;
            let h = Math.round(parseFloat(document.getElementById('g_height').value) * 1000) || 0;
            let doors = parseInt(document.getElementById('g_doors').value) || 0;
            let drawers = parseInt(document.getElementById('g_drawers').value) || 0;
            let mat = document.getElementById('g_material').value;

            if (w > 0 && h > 0) {
                partsList.push({ name: "GardÄ±rop Yan Dikme", w: 600, h: h, qty: 2, rotate: false });
                partsList.push({ name: "GardÄ±rop Tavan/Taban", w: 600, h: w - 36, qty: 2, rotate: false });
                let partitions = Math.max(1, Math.round(doors / 2));
                if (partitions > 1) {
                    partsList.push({ name: "GardÄ±rop Ara Dikme", w: 550, h: h - 180, qty: partitions - 1, rotate: false });
                }
                partsList.push({ name: "GardÄ±rop Baza", w: 100, h: w - 36, qty: 2, rotate: false });
                let partitionWidth = Math.round((w - 36 - (partitions - 1)*18) / partitions);
                partsList.push({ name: "GardÄ±rop Raf", w: 550, h: partitionWidth, qty: partitions * 3, rotate: true });
                
                if (mat !== 'kapaksiz') {
                    let doorW = Math.round((w / doors) - 4);
                    let doorH = h - 80;
                    partsList.push({ name: "GardÄ±rop Kapak", w: doorW, h: doorH, qty: doors, rotate: false });
                }
                
                if (drawers > 0) {
                    partsList.push({ name: "Ã‡ekmece Ã–nÃ¼", w: partitionWidth - 10, h: 200, qty: drawers, rotate: false });
                    partsList.push({ name: "Ã‡ekmece Kutu Yan", w: 500, h: 120, qty: drawers * 2, rotate: true });
                    partsList.push({ name: "Ã‡ekmece Kutu Ã–n/Arka", w: partitionWidth - 90, h: 120, qty: drawers * 2, rotate: true });
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
                partsList.push({ name: "U-Dolap SaÄŸ Yan", w: 600, h: h, qty: 1, rotate: false });
                partsList.push({ name: "KÃ¶ÅŸe Dikme (Sol)", w: 582, h: h - 100, qty: 1, rotate: false });
                partsList.push({ name: "KÃ¶ÅŸe Dikme (SaÄŸ)", w: 582, h: h - 100, qty: 1, rotate: false });

                partsList.push({ name: "Sol Tavan/Taban", w: 600, h: left - 18, qty: 2, rotate: false });
                partsList.push({ name: "Arka Tavan/Taban", w: 600, h: back - 36, qty: 2, rotate: false });
                partsList.push({ name: "SaÄŸ Tavan/Taban", w: 600, h: right - 18, qty: 2, rotate: false });

                partsList.push({ name: "Sol Baza", w: 100, h: left - 18, qty: 2, rotate: false });
                partsList.push({ name: "Arka Baza", w: 100, h: back - 36, qty: 2, rotate: false });
                partsList.push({ name: "SaÄŸ Baza", w: 100, h: right - 18, qty: 2, rotate: false });

                partsList.push({ name: "GÃ¶vde RafÄ± (Sol)", w: 550, h: 500, qty: 4, rotate: true });
                partsList.push({ name: "GÃ¶vde RafÄ± (Arka)", w: 550, h: 600, qty: 6, rotate: true });
                partsList.push({ name: "GÃ¶vde RafÄ± (SaÄŸ)", w: 550, h: 500, qty: 4, rotate: true });

                if (mat !== 'kapaksiz') {
                    partsList.push({ name: "Sol Dolap Kapak", w: 450, h: h - 80, qty: 2, rotate: false });
                    partsList.push({ name: "Arka Dolap Kapak", w: 496, h: h - 80, qty: 4, rotate: false });
                    partsList.push({ name: "SaÄŸ Dolap Kapak", w: 450, h: h - 80, qty: 2, rotate: false });
                }

                if (drawers > 0) {
                    partsList.push({ name: "Ã‡ekmece Ã–nÃ¼", w: 490, h: 200, qty: drawers, rotate: false });
                    partsList.push({ name: "Ã‡ekmece Kutu Yan", w: 500, h: 120, qty: drawers * 2, rotate: true });
                    partsList.push({ name: "Ã‡ekmece Kutu Ã–n/Arka", w: 410, h: 120, qty: drawers * 2, rotate: true });
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
                partsList.push({ name: "Ãœst Dolap Yan", w: 320, h: 800, qty: modules * 2, rotate: false });
                partsList.push({ name: "Ãœst Dolap Alt/Ãœst", w: 300, h: 564, qty: modules * 2, rotate: false });
                partsList.push({ name: "Ãœst Dolap Raf", w: 300, h: 564, qty: modules, rotate: true });
                partsList.push({ name: "Ãœst Dolap Kapak", w: 296, h: 796, qty: modules * 2, rotate: false });
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
                partsList.push({ name: "Mutfak Ã‡ekmece Ã–nÃ¼", w: 596, h: 176, qty: drawers, rotate: false });
                partsList.push({ name: "Ã‡ekmece Kutu Yan", w: 500, h: 120, qty: drawers * 2, rotate: true });
                partsList.push({ name: "Ã‡ekmece Kutu Ã–n/Arka", w: 510, h: 120, qty: drawers * 2, rotate: true });
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
                partsList.push({ name: "AyakkabÄ±lÄ±k RaflarÄ±", w: 380, h: Math.round(w / 2) - 27, qty: 6, rotate: true });
                partsList.push({ name: "Vestiyer Kapak", w: Math.round(w / 2) - 10, h: h - 80, qty: 2, rotate: false });

                if (drawers > 0) {
                    partsList.push({ name: "Vestiyer Ã‡ekmece Ã–nÃ¼", w: Math.round(w / 2) - 10, h: 180, qty: drawers, rotate: false });
                    partsList.push({ name: "Ã‡ekmece Kutu Yan", w: 350, h: 120, qty: drawers * 2, rotate: true });
                    partsList.push({ name: "Ã‡ekmece Kutu Ã–n/Arka", w: Math.round(w / 2) - 90, h: 120, qty: drawers * 2, rotate: true });
                }
            }
        }
        else if (type === 'banyo') {
            let w = Math.round(parseFloat(document.getElementById('b_width').value) * 1000) || 0;
            let h = Math.round(parseFloat(document.getElementById('b_height').value) * 1000) || 0;
            let drawers = parseInt(document.getElementById('b_drawers').value) || 0;

            if (w > 0 && h > 0) {
                partsList.push({ name: "Banyo DolabÄ± Yan", w: 500, h: 750, qty: 2, rotate: false });
                partsList.push({ name: "Banyo DolabÄ± Alt/Bant", w: 500, h: w - 36, qty: 2, rotate: false });
                partsList.push({ name: "Banyo DolabÄ± Kapak", w: Math.round(w / 2) - 8, h: 716, qty: 2, rotate: false });

                if (drawers > 0) {
                    partsList.push({ name: "Ã‡ekmece Ã–nÃ¼", w: w - 10, h: 220, qty: drawers, rotate: false });
                    partsList.push({ name: "Ã‡ekmece Kutu Yan", w: 450, h: 120, qty: drawers * 2, rotate: true });
                    partsList.push({ name: "Ã‡ekmece Kutu Ã–n/Arka", w: w - 90, h: 120, qty: drawers * 2, rotate: true });
                }
            }
        } else {
            partsList.push({ name: "Ã–zel TasarÄ±m Panel 1", w: 600, h: 1000, qty: 5, rotate: true });
            partsList.push({ name: "Ã–zel TasarÄ±m Panel 2", w: 400, h: 800, qty: 10, rotate: true });
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
        
        ctx.save();
        // Zoom and Pan
        let scale = window.dolapCanvasZoomScale || 1.0;
        let panX = window.dolapCanvasPanX || 0;
        let panY = window.dolapCanvasPanY || 0;
        ctx.translate(panX, panY);
        ctx.scale(scale, scale);
        
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1;
        
        // Extended grid coordinates to support panning
        let gridMinX = -canvas.width * 2;
        let gridMaxX = canvas.width * 3;
        let gridMinY = -canvas.height * 2;
        let gridMaxY = canvas.height * 3;
        
        for(let x = gridMinX; x < gridMaxX; x += 20) {
            ctx.beginPath(); ctx.moveTo(x, gridMinY); ctx.lineTo(x, gridMaxY); ctx.stroke();
        }
        for(let y = gridMinY; y < gridMaxY; y += 20) {
            ctx.beginPath(); ctx.moveTo(gridMinX, y); ctx.lineTo(gridMaxX, y); ctx.stroke();
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

        if(type === 'gardÄ±rop') {
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
            drawWallSegment(ctx, xStart + sLeftW + sBackW, yStart, sRightW, sH, "SaÄŸ Duvar (" + right.toFixed(2) + " m)", matKey, 0, 0);

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
            drawDimension(ctx, xStartU, 45, xStartU + sU, 45, "Ãœst: " + ul.toFixed(2) + " m", false);
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
            ctx.fillText("Ã–ZEL TASARIM PROJELENDÄ°RME", 200, 240);
        }

        // CALCULATE FINAL SUMMARIES
        let gÃ¶vdeSheetCount = 0;
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
            gÃ¶vdeSheetCount = calculateSheetsDryRun(parts);
            
            // Override dolapTutar
            let mPrice = dynamicPrices[matKey];
            if (type === 'vestiyer') mPrice = dynamicPrices.vestiyer_m2 || 3600;
            if (type === 'banyo') mPrice = dynamicPrices.banyo_m2 || 4000;
            let sheetPrice = sheetArea * mPrice;
            dolapTutar = gÃ¶vdeSheetCount * sheetPrice;
            
            // Override arkalikTutar
            let arkalikM2 = m2;
            if (type === 'mutfak') {
                let ul = parseFloat(document.getElementById('k_upper_len').value) || 0;
                arkalikM2 = ul * 0.8;
            }
            arkalikSheetCount = Math.ceil(arkalikM2 / sheetArea);
            
            let backKey = 'ark4';
            if (type === 'gardÄ±rop') backKey = document.getElementById('g_back').value;
            if (type === 'udolap') backKey = document.getElementById('u_back_panel').value;
            
            let backMatPrice = (backKey === 'ark4' ? dynamicPrices.ark4 : dynamicPrices.mdf);
            let backSheetPrice = sheetArea * backMatPrice;
            arkalikTutar = arkalikSheetCount * backSheetPrice;
            
            // Override kesimGideri
            kesimGideri = (gÃ¶vdeSheetCount + arkalikSheetCount) * sheetArea * (dynamicPrices.kesim_m2 || 350);
        }

        let toplam = dolapTutar + arkalikTutar + cekmeceTutar + menteseTutar + ekstralarTutar + montajTutar;
        let kalan = toplam - advancePayment;

        // Populate Summary fields
        if (useSheetCosting && type !== 'ozel') {
            document.getElementById('lblM2').innerText = `${gÃ¶vdeSheetCount} Plaka GÃ¶vde / ${arkalikSheetCount} Plaka ArkalÄ±k`;
        } else {
            document.getElementById('lblM2').innerText = type === 'ozel' ? (document.getElementById('o_qty').value + " " + document.getElementById('o_method').value.toUpperCase()) : (m2.toFixed(2) + " mÂ²");
        }
        document.getElementById('lblDolap').innerText = dolapTutar.toLocaleString('tr-TR') + " â‚º";
        document.getElementById('lblCekmece').innerText = cekmeceTutar.toLocaleString('tr-TR') + " â‚º";
        document.getElementById('lblMentese').innerText = menteseTutar.toLocaleString('tr-TR') + " â‚º";
        document.getElementById('lblEkstralar').innerText = ekstralarTutar.toLocaleString('tr-TR') + " â‚º";
        document.getElementById('lblKesimGider').innerText = kesimGideri.toLocaleString('tr-TR') + " â‚º";
        document.getElementById('lblMontajBedel').innerText = montajTutar.toLocaleString('tr-TR') + " â‚º";
        document.getElementById('lblToplam').innerText = toplam.toLocaleString('tr-TR') + " â‚º";
        document.getElementById('lblKalan').innerText = kalan.toLocaleString('tr-TR') + " â‚º";

        ctx.restore();
        return { m2, toplam, kaparo: advancePayment, kalan, kapakAdet, type, detailsText: getSpecificationText(), useSheetCosting, gÃ¶vdeSheetCount, arkalikSheetCount };
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

    // â˜ï¸ BULUT VERÄ° HAVUZUNA YENÄ° TEKLÄ°F KAYDET
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
        if(!name) { alert("LÃ¼tfen mÃ¼ÅŸteri adÄ±nÄ± girin!"); return; }
        
        let v = hesaplaVeCiz(); 
        let staff = document.getElementById('staffName').value;
        
        let selectRay = "Ray Yok";
        if(v.type === 'gardÄ±rop') selectRay = document.getElementById('g_ray').options[document.getElementById('g_ray').selectedIndex].text;
        if(v.type === 'mutfak') selectRay = document.getElementById('k_ray').options[document.getElementById('k_ray').selectedIndex].text;
        if(v.type === 'vestiyer') selectRay = document.getElementById('v_ray').options[document.getElementById('v_ray').selectedIndex].text;
        if(v.type === 'banyo') selectRay = document.getElementById('b_ray').options[document.getElementById('b_ray').selectedIndex].text;
        if(v.type === 'udolap') selectRay = document.getElementById('u_ray').options[document.getElementById('u_ray').selectedIndex].text;

        let matName = "Malzeme Belirtilmedi";
        if(v.type === 'gardÄ±rop') matName = document.getElementById('g_material').options[document.getElementById('g_material').selectedIndex].text;
        if(v.type === 'mutfak') matName = document.getElementById('k_material').options[document.getElementById('k_material').selectedIndex].text;
        if(v.type === 'vestiyer') matName = document.getElementById('v_material').options[document.getElementById('v_material').selectedIndex].text;
        if(v.type === 'banyo') matName = document.getElementById('b_material').options[document.getElementById('b_material').selectedIndex].text;
        if(v.type === 'udolap') matName = document.getElementById('u_material').options[document.getElementById('u_material').selectedIndex].text;

        // Compile inputState for edit restoration
        let inputState = {};
        if(v.type === 'gardÄ±rop') {
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
                                aciklama: "Ä°lk Kaparo",
                                tarih: docData.tarih || new Date().toLocaleDateString('tr-TR')
                            }];
                        }
                    } else {
                        // Ä°lk Ã¶deme kaydÄ±nÄ± formda dÃ¼zenlenen yeni kaparo deÄŸerine gÃ¶re gÃ¼ncelle
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
                        toplam: v.toplam.toLocaleString('tr-TR') + " â‚º",
                        kaparo: totalAlinan.toLocaleString('tr-TR') + " â‚º",
                        kalan: kalanVal.toLocaleString('tr-TR') + " â‚º",
                        mobilyaTuru: v.type,
                        detaylar: v.detailsText,
                        inputState: inputState,
                        odemeler: odemeler
                    });
                } else {
                    throw new Error("SipariÅŸ bulunamadÄ±!");
                }
            });
        } else {
            let odemeler = [];
            if(v.kaparo > 0) {
                odemeler = [{
                    tutar: v.kaparo,
                    aciklama: "Ä°lk Kaparo",
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
                toplam: v.toplam.toLocaleString('tr-TR') + " â‚º",
                kaparo: v.kaparo.toLocaleString('tr-TR') + " â‚º",
                kalan: v.kalan.toLocaleString('tr-TR') + " â‚º",
                mobilyaTuru: v.type,
                detaylar: v.detailsText,
                inputState: inputState,
                odemeler: odemeler
            });
        }

        savePromise.then(() => {
            alert(editingDocId ? "SipariÅŸ baÅŸarÄ±yla gÃ¼ncellendi!" : "Teklif baÅŸarÄ±yla bulut havuzuna kaydedildi!");
            duzenlemeyiIptalEt(true);
            switchTab('takipView');
        }).catch(err => {
            alert("KayÄ±t hatasÄ±: " + err.message);
        });
    }

    // ğŸ’¸ YENÄ° GÄ°DER KAYDETME
    function giderKaydet() {
        let tur = document.getElementById('expType').value;
        let tutar = parseFloat(document.getElementById('expAmount').value) || 0;
        let desc = document.getElementById('expDesc').value.trim();
        
        if(tutar <= 0) { alert("LÃ¼tfen geÃ§erli bir tutar girin!"); return; }

        db.collection("giderler").add({
            tur: tur,
            tutar: tutar,
            aciklama: desc,
            tarih: new Date().toLocaleDateString('tr-TR'),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert("Gider baÅŸarÄ±yla kasaya iÅŸlendi!");
            document.getElementById('expAmount').value = "";
            document.getElementById('expDesc').value = "";
        }).catch(err => {
            alert("Gider kaydÄ± hatasÄ±: " + err.message);
        });
    }

    // ğŸ“Š MUHASEBE RAPOR HESAPLAYICISI
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
                        <div class="expense-item-cost">-${g.tutar.toLocaleString('tr-TR')} â‚º</div>
                        ${isPatron ? `<button class="btn-delete-item" title="Sil" onclick="giderSil('${gDoc.id}')">
                            <svg style="width:16px; height:16px; fill:currentColor;" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>` : ''}
                    `;
                    giderDiv.appendChild(gItem);
                });

                if(gSnapshot.empty) {
                    giderDiv.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px 0;">Gider kaydÄ± bulunmuyor.</div>';
                }

                let netKar = totalCiro - totalGider;
                
                // Write numbers in UI
                document.getElementById('m_ciro').innerText = totalCiro.toLocaleString('tr-TR') + " â‚º";
                document.getElementById('m_gider').innerText = totalGider.toLocaleString('tr-TR') + " â‚º";
                document.getElementById('m_kar').innerText = netKar.toLocaleString('tr-TR') + " â‚º";
                document.getElementById('m_alacak').innerText = totalAlacak.toLocaleString('tr-TR') + " â‚º";

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

    // ğŸŒŸ MÃœÅTERÄ° YORUMLARI ERP LÄ°STENER'I
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
                
                let item = document.createElement('div');
                item.className = 'review-feed-item';
                item.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
                        <div>
                            <h4 style="margin: 0; font-size: 13px; font-weight: 700; color: var(--text-light);">${r.customerName || 'Ä°simsiz MÃ¼ÅŸteri'}</h4>
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
                `;
                feed.appendChild(item);
            });
        }, err => {
            console.error("ERP Yorum dinleme hatasÄ±:", err);
            feed.innerHTML = '<div style="text-align:center; color:var(--danger); font-size:12px; padding:30px 0;">Yorumlar yÃ¼klenirken bir hata oluÅŸtu!</div>';
        });
    }

    // ğŸ—„ï¸ CANLI SÄ°PARÄ°Å TAKÄ°P HAREKETLERÄ° LÄ°STESÄ°
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
                
                if(k.durum === "OnaylandÄ± / Ä°malatta") { cssClass = "status-imalat"; badgeClass = "badge-imalat"; }
                else if(k.durum === "Montaj AÅŸamasÄ±nda") { cssClass = "status-montaj"; badgeClass = "badge-montaj"; }
                else if(k.durum === "TamamlandÄ±") { cssClass = "status-tamam"; badgeClass = "badge-tamam"; }

                // Fallback for old database rows missing detailed descriptions
                let specsText = k.detaylar || `${k.m2} mÂ² / ${k.kapakAdet} Kapak (${k.kapak || 'Lake'}) - Ray: ${k.ray || 'Klasik'}`;
                
                // Clean short variables for WhatsApp sharing from list
                let waMusteri = k.musteri;
                let waSpec = specsText;
                let waToplam = k.toplam;
                let waKaparo = k.kaparo;
                let waKalan = k.kalan;
                let trackingLink = window.location.origin + window.location.pathname + "?takip=" + doc.id;
                let shareMsg = `*DOÄANÃ‡AY MOBÄ°LYA*\n-----------------------------\n*MÃ¼ÅŸteri:* ${waMusteri}\n*SipariÅŸ DetayÄ±:* ${waSpec}\n\n*Ã–deme Ã–zeti:*\nğŸ’µ *Toplam:* ${waToplam}\nğŸ’° *Kaparo:* ${waKaparo}\nâ³ *Kalan Bakiye:* *${waKalan}*\n\n*CanlÄ± SipariÅŸ Takip Linki:*\n${trackingLink}\n\nSipariÅŸ durumunu sistemimizden canlÄ± takip edebilirsiniz. HayÄ±rlÄ± gÃ¼nler dileriz.`;

                item.className = `archive-card ${cssClass}`;
                item.innerHTML = `
                    <div class="archive-top">
                        <span class="archive-client">ğŸ‘¤ ${k.musteri}</span>
                        <span class="archive-date">ğŸ“… ${k.tarih}</span>
                    </div>
                    <div class="archive-details">
                        âœï¸ <b>TasarÄ±mcÄ±:</b> ${k.personel}<br>
                        ğŸ“ <b>Ã–zellikler:</b> ${specsText}<br>
                        ğŸ’µ <b>Hesap:</b> Toplam: <b style="color:var(--primary); font-size:14px;">${k.toplam}</b> | AlÄ±nan: <span style="color:var(--success); font-weight:600;">${k.kaparo}</span> | Kalan Alacak: <b style="color:#38bdf8;">${k.kalan}</b>
                    </div>
                    <div class="archive-actions">
                        <div>
                            <span class="badge ${badgeClass}">${k.durum}</span>
                            <select onchange="durumGuncelle('${doc.id}', this.value)" style="margin-left:8px; display:inline-block; vertical-align:middle; border-radius:4px; padding:3px 5px;">
                                <option value="">âš™ï¸ Durumu DeÄŸiÅŸtir</option>
                                <option value="Teklif Verildi">ğŸŸ¡ Teklif AÅŸamasÄ±</option>
                                <option value="OnaylandÄ± / Ä°malatta">ğŸ”µ Ä°malat AÅŸamasÄ±</option>
                                <option value="Montaj AÅŸamasÄ±nda">ğŸŸ£ Montaj AÅŸamasÄ±</option>
                                <option value="TamamlandÄ±">ğŸŸ¢ TamamlandÄ± (Teslim)</option>
                            </select>
                        </div>
                        <div style="display:flex; gap: 8px; align-items:center;">
                            <button class="btn btn-secondary" style="padding:6px 10px; font-size:11px; background-color: var(--primary); color: #000; font-weight: bold; border: none;" onclick="teklifDuzenle('${doc.id}')">
                                DÃ¼zenle
                            </button>
                            <button class="btn btn-secondary" style="padding:6px 10px; font-size:11px; background-color: #22c55e; color: #000; font-weight: bold; border: none;" onclick="openPaymentModal('${doc.id}')">
                                ğŸ’³ Ã–demeler
                            </button>
                            <button class="btn btn-secondary" style="padding:6px 10px; font-size:11px; background-color: #0f172a; color: #fff; border: 1px solid #475569;" onclick="kopyalaTakipLinki('${doc.id}')" title="MÃ¼ÅŸteri SipariÅŸ Takip Linki Kopyala">
                                ğŸ”— Takip Linki
                            </button>
                            <button class="btn btn-secondary" style="padding:6px 10px; font-size:11px;" onclick="whatsappPaylas('${encodeURIComponent(shareMsg)}')">
                                WhatsApp
                            </button>
                            <button class="btn btn-secondary" style="padding:6px 10px; font-size:11px;" onclick="yazdirListeden('${doc.id}')">
                                YazdÄ±r (PDF)
                            </button>
                            ${isPatron ? `<button class="btn-delete-item" title="KayÄ±t Sil" onclick="sistemdenSil('${doc.id}')">
                                <svg style="width:18px; height:18px; fill:currentColor;" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                            </button>` : ''}
                        </div>
                    </div>
                `;
                listeDiv.appendChild(item);
            });

            if(counter === 0) {
                listeDiv.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 40px 0;">Arama kriterlerine uygun sipariÅŸ bulunamadÄ±.</div>';
            }
        });
    }

    function durumGuncelle(docId, yeniDurum) { 
        if(yeniDurum) {
            db.collection("ortak_teklifler").doc(docId).update({ 
                durum: yeniDurum 
            }).then(() => {
                alert("SipariÅŸ durumu gÃ¼ncellendi!");
            }).catch(err => {
                alert("Hata: " + err.message);
            });
        } 
    }
    
    function sistemdenSil(docId) { 
        if(confirm("Bu kaydÄ± bulut veri tabanÄ±ndan tamamen silmek istediÄŸinize emin misiniz? (Bu iÅŸlem geri alÄ±namaz!)")) {
            db.collection("ortak_teklifler").doc(docId).delete().then(() => {
                alert("KayÄ±t silindi!");
            }); 
        }
    }

    function giderSil(docId) {
        if(confirm("Bu gider kaydÄ±nÄ± kasadan silmek istediÄŸinize emin misiniz?")) {
            db.collection("giderler").doc(docId).delete().then(() => {
                alert("Gider silindi!");
            });
        }
    }

    // ğŸ’¬ WHATSAPP MESAJ GÃ–NDERÄ°MÄ° (AKTÄ°F TASARIM EKRANINDAN)
    function whatsappSistem() {
        let musteri = document.getElementById('customerName').value.trim() || "DeÄŸerli MÃ¼ÅŸterimiz";
        let spec = getSpecificationText();
        let v = hesaplaVeCiz();
        
        let typeNames = { gardÄ±rop: "GardÄ±rop", mutfak: "Mutfak DolabÄ±", vestiyer: "Vestiyer", banyo: "Banyo DolabÄ±", ozel: "Ã–zel TasarÄ±m Mobilya", udolap: "U Dolap" };
        
        let mesaj = `*DOÄANÃ‡AY MOBÄ°LYA*\n`;
        mesaj += `-----------------------------\n`;
        mesaj += `*MÃ¼ÅŸteri:* ${musteri}\n`;
        mesaj += `*ÃœrÃ¼n Grubu:* ${typeNames[v.type]}\n`;
        mesaj += `*TasarÄ±m DetayÄ±:* ${spec}\n\n`;
        mesaj += `*Ã–DEME PLANI Ã–ZETÄ°:*\n`;
        mesaj += `ğŸ’µ *Toplam Tutar:* *${v.toplam.toLocaleString('tr-TR')} â‚º*\n`;
        mesaj += `ğŸ’° *AlÄ±nan Kaparo:* ${v.kaparo.toLocaleString('tr-TR')} â‚º\n`;
        mesaj += `â³ *Montaj Sonu Kalan:* *${v.kalan.toLocaleString('tr-TR')} â‚º*\n\n`;
        mesaj += `SipariÅŸ detaylarÄ±nÄ±z atÃ¶lye imalat havuzumuza kaydedilmiÅŸtir. Bizi tercih ettiÄŸiniz iÃ§in teÅŸekkÃ¼r ederiz.`;
        
        window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(mesaj), '_blank');
    }

    function whatsappPaylas(msgString) {
        window.open("https://api.whatsapp.com/send?text=" + msgString, '_blank');
    }

    function kopyalaTakipLinki(docId) {
        let link = window.location.origin + window.location.pathname + "?takip=" + docId;
        navigator.clipboard.writeText(link).then(() => {
            alert("MÃ¼ÅŸteri sipariÅŸ takip linki panoya kopyalandÄ±:\n" + link);
        }).catch(err => {
            alert("Link kopyalanamadÄ±: " + err);
        });
    }

    // ğŸ–¨ï¸ PDF YAZDIRICI (AKTÄ°F TASARIM EKRANINDAN)
    function yazdirTeklif() {
        let canvas = document.getElementById('dolapCanvas');
        let printImg = document.getElementById('printCanvasImg');
        printImg.src = canvas.toDataURL("image/png");
        
        document.getElementById('printCustomer').innerText = document.getElementById('customerName').value.trim() || "MÃ¼ÅŸteri Belirtilmedi";
        document.getElementById('printStaff').innerText = document.getElementById('staffName').value;
        document.getElementById('printDate').innerText = new Date().toLocaleDateString('tr-TR');
        
        let type = document.getElementById('mobilyaTuru').value;
        let typeNames = { gardÄ±rop: "GardÄ±rop", mutfak: "Mutfak DolabÄ±", vestiyer: "Vestiyer", banyo: "Banyo DolabÄ±", ozel: "Ã–zel TasarÄ±m", udolap: "U Dolap" };
        document.getElementById('printType').innerText = typeNames[type];
        document.getElementById('printSpecs').innerText = getSpecificationText();
        
        let v = hesaplaVeCiz();
        document.getElementById('printTotal').innerText = v.toplam.toLocaleString('tr-TR') + " â‚º";
        document.getElementById('printAdvance').innerText = v.kaparo.toLocaleString('tr-TR') + " â‚º";
        document.getElementById('printBalance').innerText = v.kalan.toLocaleString('tr-TR') + " â‚º";
        
        document.body.classList.add('print-mode-teklif');
        window.print();
        document.body.classList.remove('print-mode-teklif');
    }

    // ğŸ–¨ï¸ LÄ°STEDEN YAZDIRMA (KAYITLI ESKÄ°/YENÄ° SÄ°PARÄ°ÅÄ° PDF YAPMA)
    function yazdirListeden(docId) {
        db.collection("ortak_teklifler").doc(docId).get().then((doc) => {
            if(doc.exists) {
                let data = doc.data();
                
                document.getElementById('printCustomer').innerText = data.musteri;
                document.getElementById('printStaff').innerText = data.personel;
                document.getElementById('printDate').innerText = data.tarih || new Date().toLocaleDateString('tr-TR');
                
                let typeNames = { gardÄ±rop: "GardÄ±rop", mutfak: "Mutfak DolabÄ±", vestiyer: "Vestiyer", banyo: "Banyo DolabÄ±", ozel: "Ã–zel TasarÄ±m", udolap: "U Dolap" };
                document.getElementById('printType').innerText = typeNames[data.mobilyaTuru] || "GardÄ±rop";
                document.getElementById('printSpecs').innerText = data.detaylar || `${data.m2} mÂ² / ${data.kapakAdet} Kapak (${data.kapak}) - Ray: ${data.ray}`;
                
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

    let editingDocId = null;
    let editingGModules = null;
    let editingGHandle = null;
    let editingGLed = null;

    function teklifDuzenle(docId) {
        db.collection("ortak_teklifler").doc(docId).get().then((doc) => {
            if(doc.exists) {
                let data = doc.data();
                editingDocId = docId;
                
                document.getElementById('editClientName').innerText = data.musteri || "";
                document.getElementById('editModeBanner').style.display = 'flex';
                document.getElementById('btnKaydet').innerHTML = `
                    <svg style="width: 18px; height: 18px; fill: currentColor;" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z"/></svg>
                    DeÄŸiÅŸiklikleri Kaydet (SipariÅŸi GÃ¼ncelle)
                `;
                
                document.getElementById('customerName').value = data.musteri || "";
                document.getElementById('staffName').value = data.personel || "Mustafa DoÄŸanÃ§ay";
                
                let type = data.mobilyaTuru || "gardÄ±rop";
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
                alert("SipariÅŸ bulunamadÄ±!");
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
            SipariÅŸi Ortak Bulut Havuzuna Kaydet
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
    // ğŸªµ 2D GÄ°YOTÄ°N PLAKA KESÄ°M OPTÄ°MÄ°ZASYON KODLARI
    // ==========================================

    function toggleOptCustomStock() {
        let size = document.getElementById('opt_stock_size').value;
        if(size === 'custom') {
            document.getElementById('opt_custom_w_group').style.display = 'block';
            document.getElementById('opt_custom_h_group').style.display = 'block';
        } else {
            document.getElementById('opt_custom_w_group').style.display = 'none';
            document.getElementById('opt_custom_h_group').style.display = 'none';
        }
    }

    function optYasarYeniSatir() {
        optYasarEkleSatirVeri("", "", "", "", false);
    }

    function optYasarEkleSatirVeri(name, w, h, qty, damarli) {
        let body = document.getElementById('optPartsBody');
        let tr = document.createElement('tr');
        tr.style.borderBottom = "1px solid var(--border)";
        
        tr.innerHTML = `
            <td style="padding: 6px 10px;">
                <input type="text" class="opt-part-name" value="${name}" placeholder="Ã–rn: Yan Dikme" style="width:100%; border:1px solid var(--border); border-radius:4px; padding:4px 6px; font-size:12px; background:var(--bg-dark); color:var(--text-main); box-sizing:border-box;">
            </td>
            <td style="padding: 6px 10px;">
                <input type="number" class="opt-part-w" value="${w || ''}" placeholder="mm" style="width:100%; border:1px solid var(--border); border-radius:4px; padding:4px 6px; font-size:12px; background:var(--bg-dark); color:var(--text-main); box-sizing:border-box;">
            </td>
            <td style="padding: 6px 10px;">
                <input type="number" class="opt-part-h" value="${h || ''}" placeholder="mm" style="width:100%; border:1px solid var(--border); border-radius:4px; padding:4px 6px; font-size:12px; background:var(--bg-dark); color:var(--text-main); box-sizing:border-box;">
            </td>
            <td style="padding: 6px 10px;">
                <input type="number" class="opt-part-qty" value="${qty || ''}" min="1" placeholder="Adet" style="width:100%; border:1px solid var(--border); border-radius:4px; padding:4px 6px; font-size:12px; background:var(--bg-dark); color:var(--text-main); box-sizing:border-box;">
            </td>
            <td style="padding: 6px 10px; text-align:center;">
                <input type="checkbox" class="opt-part-damarli" ${damarli ? 'checked' : ''} style="transform: scale(1.2);">
            </td>
            <td style="padding: 6px 10px; text-align:center;">
                <button type="button" style="color:var(--danger); border:none; background:none; padding:4px; cursor:pointer;" onclick="optYasarSatirSil(this)">
                    <svg style="width:16px; height:16px; fill:currentColor;" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
            </td>
        `;
        body.appendChild(tr);
    }

    function optYasarSatirSil(btn) {
        let tr = btn.closest('tr');
        if(tr) tr.remove();
    }

    function optYasarListeyiTemizle() {
        document.getElementById('optPartsBody').innerHTML = "";
        let toggleAll = document.getElementById('toggleAllDamar');
        if (toggleAll) toggleAll.checked = false;
    }

    function optYasarHepsiniTikla(checked) {
        document.querySelectorAll('#optPartsBody .opt-part-damarli').forEach(cb => {
            cb.checked = checked;
        });
    }

    function tekliftenKesimListesiCikar() {
        let type = document.getElementById('mobilyaTuru').value;
        if (type === 'gardÄ±rop' || type === 'vestiyer' || type === 'banyo') {
            let w = parseFloat(document.getElementById(type === 'gardÄ±rop' ? 'g_width' : (type === 'vestiyer' ? 'v_width' : 'b_width')).value) || 0;
            let h = parseFloat(document.getElementById(type === 'gardÄ±rop' ? 'g_height' : (type === 'vestiyer' ? 'v_height' : 'b_height')).value) || 0;
            if (w <= 0 || h <= 0) { alert("LÃ¼tfen teklif ekranÄ±nda en ve boy deÄŸerlerini girin!"); return; }
        } else if (type === 'udolap') {
            let left = parseFloat(document.getElementById('u_left').value) || 0;
            let back = parseFloat(document.getElementById('u_back').value) || 0;
            let right = parseFloat(document.getElementById('u_right').value) || 0;
            let h = parseFloat(document.getElementById('u_height').value) || 0;
            if (left <= 0 || back <= 0 || right <= 0 || h <= 0) { alert("LÃ¼tfen teklif ekranÄ±nda tÃ¼m duvar Ã¶lÃ§Ã¼lerini girin!"); return; }
        } else if (type === 'mutfak') {
            let ul = parseFloat(document.getElementById('k_upper_len').value) || 0;
            let ll = parseFloat(document.getElementById('k_lower_len').value) || 0;
            if (ul <= 0 && ll <= 0) { alert("LÃ¼tfen teklif ekranÄ±nda mutfak uzunluklarÄ±nÄ± girin!"); return; }
        }

        let partsList = getPartsListFromCurrentOffer();
        
        // Clean and reload parts
        optYasarListeyiTemizle();
        partsList.forEach(p => {
            optYasarEkleSatirVeri(p.name, p.w, p.h, p.qty, !p.rotate);
        });
        
        alert("Teklif detaylarÄ±ndaki Ã¶lÃ§Ã¼lere gÃ¶re kesim parÃ§alarÄ± oluÅŸturulup tabloya eklendi!");
    }

    // binary tree guillotine split structures
    class GuillotineNode {
        constructor(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
            this.used = false;
            this.right = null;
            this.down = null;
        }
    }

    class GuillotinePacker {
        constructor(width, height, kerf) {
            this.width = width;
            this.height = height;
            this.kerf = kerf;
            this.root = new GuillotineNode(0, 0, width, height);
        }

        insert(w, h, allowRotation) {
            let fit = this.findNode(this.root, w, h, allowRotation);
            if (fit) {
                let node = fit.node;
                let rotate = fit.rotate;
                
                let useW = rotate ? h : w;
                let useH = rotate ? w : h;
                
                let splitW = Math.min(node.w, useW + this.kerf);
                let splitH = Math.min(node.h, useH + this.kerf);
                
                this.split(node, splitW, splitH);
                return {
                    x: node.x,
                    y: node.y,
                    w: useW,
                    h: useH,
                    rotated: rotate
                };
            }
            return null;
        }

        findNode(node, w, h, allowRotation) {
            if (node.right || node.down) {
                let fit = this.findNode(node.right, w, h, allowRotation);
                if (fit) return fit;
                return this.findNode(node.down, w, h, allowRotation);
            }
            if (node.used) return null;

            let fitsNormal = (w <= node.w && h <= node.h);
            let fitsRotated = allowRotation && (h <= node.w && w <= node.h);

            if (!fitsNormal && !fitsRotated) return null;

            let rotate = false;
            if (fitsNormal && fitsRotated) {
                rotate = false;
            } else if (fitsRotated) {
                rotate = true;
            }

            return { node: node, rotate: rotate };
        }

        split(node, w, h) {
            node.used = true;
            
            // Split along the longer dimension of the placed piece.
            // If the piece is wider than it is tall, we split horizontally (making a vertical cut all the way down).
            // If it is taller than it is wide, we split vertically (making a horizontal cut all the way across).
            // This keeps the remaining column or row intact as a single contiguous piece (e.g. 796x2080 mm),
            // allowing other parts to utilize it, mimicking how a human carpenter stacks cuts.
            if (w >= h) {
                // Horizontal split
                node.right = new GuillotineNode(node.x + w, node.y, node.w - w, node.h);
                node.down = new GuillotineNode(node.x, node.y + h, w, node.h - h);
            } else {
                // Vertical split
                node.right = new GuillotineNode(node.x + w, node.y, node.w - w, h);
                node.down = new GuillotineNode(node.x, node.y + h, node.w, node.h - h);
            }
        }
    }

    function optimizasyonHesaplaCiz() {
        let sizeSelect = document.getElementById('opt_stock_size').value;
        let stockW = 2800;
        let stockH = 2100;
        if(sizeSelect === '2800x2100') {
            stockW = 2800; stockH = 2100;
        } else if(sizeSelect === '3660x1830') {
            stockW = 3660; stockH = 1830;
        } else {
            stockW = parseInt(document.getElementById('opt_stock_w').value) || 2800;
            stockH = parseInt(document.getElementById('opt_stock_h').value) || 2100;
        }

        let kerf = parseInt(document.getElementById('opt_kerf').value) || 0;
        let margin = parseInt(document.getElementById('opt_margin').value) || 0;

        // Read parts from table
        let partsInput = [];
        let rows = document.querySelectorAll('#optPartsBody tr');
        rows.forEach(tr => {
            let nameInput = tr.querySelector('.opt-part-name');
            let wInput = tr.querySelector('.opt-part-w');
            let hInput = tr.querySelector('.opt-part-h');
            let qtyInput = tr.querySelector('.opt-part-qty');
            let damarliInput = tr.querySelector('.opt-part-damarli');
            
            if (nameInput && wInput && hInput && qtyInput) {
                let name = nameInput.value.trim() || "ParÃ§a";
                let w = parseInt(wInput.value) || 0;
                let h = parseInt(hInput.value) || 0;
                let qty = parseInt(qtyInput.value) || 0;
                let damarli = damarliInput.checked;
                let rotate = !damarli;
                
                if(w > 0 && h > 0 && qty > 0) {
                    partsInput.push({ name, w, h, qty, rotate });
                }
            }
        });

        if(partsInput.length === 0) {
            alert("LÃ¼tfen optimizasyon iÃ§in en az bir geÃ§erli parÃ§a girin!");
            return;
        }

        // Flatten parts list
        let flatParts = [];
        partsInput.forEach(p => {
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

        if (effStockW <= 0 || effStockH <= 0) {
            alert("Kenar temizleme payÄ± plaka boyutunu aÅŸÄ±yor!");
            return;
        }

        // Validate sizes
        for(let p of flatParts) {
            let fitsNormal = (p.w <= effStockW && p.h <= effStockH);
            let fitsRotated = p.rotate && (p.h <= effStockW && p.w <= effStockH);
            if(!fitsNormal && !fitsRotated) {
                alert(`Hata: "${p.name}" (${p.w}x${p.h} mm) plaka boyutundan (${effStockW}x${effStockH} mm) bÃ¼yÃ¼ktÃ¼r!`);
                return;
            }
        }

        // Helper to find the largest unused contiguous area in a GuillotineNode tree.
        // We use this as a secondary score to choose the best layout among ties in sheet counts.
        function getLargestOffcut(node) {
            if (!node) return 0;
            if (node.right || node.down) {
                return Math.max(getLargestOffcut(node.right), getLargestOffcut(node.down));
            }
            if (!node.used) {
                return node.w * node.h;
            }
            return 0;
        }

        // Define multiple sorting heuristics to evaluate.
        // Multiple-Heuristic Search finds the absolute best arrangement among different sorting options.
        let sortingHeuristics = [
            // 1. Longest Side First (LSF) - Standard for panel packing
            (a, b) => {
                let maxA = Math.max(a.w, a.h);
                let maxB = Math.max(b.w, b.h);
                if (maxA !== maxB) return maxB - maxA;
                return (b.w * b.h) - (a.w * a.h);
            },
            // 2. Area Descending - Fits large pieces first
            (a, b) => {
                let areaA = a.w * a.h;
                let areaB = b.w * b.h;
                if (areaA !== areaB) return areaB - areaA;
                return Math.max(b.w, b.h) - Math.max(a.w, a.h);
            },
            // 3. Shortest Side First (SSF) - Helps with stacking
            (a, b) => {
                let minA = Math.min(a.w, a.h);
                let minB = Math.min(b.w, b.h);
                if (minA !== minB) return minB - minA;
                return (b.w * b.h) - (a.w * a.h);
            },
            // 4. Width Descending
            (a, b) => {
                if (b.w !== a.w) return b.w - a.w;
                return b.h - a.h;
            },
            // 5. Height Descending
            (a, b) => {
                if (b.h !== a.h) return b.h - a.h;
                return b.w - a.w;
            }
        ];

        let bestResult = null;
        let bestScore = Infinity;

        sortingHeuristics.forEach((sortFn) => {
            // Clone and sort flatParts
            let testParts = [];
            flatParts.forEach(p => {
                testParts.push({
                    id: p.id,
                    name: p.name,
                    w: p.w,
                    h: p.h,
                    rotate: p.rotate
                });
            });
            testParts.sort(sortFn);
            
            let testSheets = [];
            
            testParts.forEach(part => {
                let packed = false;
                
                for(let sheet of testSheets) {
                    let placement = sheet.packer.insert(part.w, part.h, part.rotate);
                    if (placement) {
                        sheet.placed.push({
                            name: part.name,
                            w: placement.w,
                            h: placement.h,
                            x: placement.x + margin,
                            y: placement.y + margin,
                            rotated: placement.rotated
                        });
                        packed = true;
                        break;
                    }
                }
                
                if(!packed) {
                    let newPacker = new GuillotinePacker(effStockW, effStockH, kerf);
                    let placement = newPacker.insert(part.w, part.h, part.rotate);
                    if (placement) {
                        testSheets.push({
                            packer: newPacker,
                            placed: [{
                                name: part.name,
                                w: placement.w,
                                h: placement.h,
                                x: placement.x + margin,
                                y: placement.y + margin,
                                rotated: placement.rotated
                            }]
                        });
                    }
                }
            });
            
            if (testSheets.length > 0) {
                // Calculate score:
                // Primary: sheets count (minimize)
                // Secondary: -largestOffcutArea (maximize offcut area, i.e. minimize score)
                let maxOffcut = Math.max(...testSheets.map(s => getLargestOffcut(s.packer.root)));
                let score = testSheets.length * 100000000 - maxOffcut;
                
                if (score < bestScore) {
                    bestScore = score;
                    bestResult = testSheets;
                }
            }
        });

        let sheets = bestResult || [];

        renderOptResults(sheets, stockW, stockH, margin, flatParts);
    }

    function renderOptResults(sheets, stockW, stockH, margin, allParts) {
        let container = document.getElementById('optLayoutsContainer');
        container.innerHTML = "";
        
        if (sheets.length === 0) {
            container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 50px 0;">SÄ±ÄŸan parÃ§a bulunamadÄ±.</div>`;
            return;
        }

        document.getElementById('btnOptPrint').style.display = 'block';

        let totalSheetArea = sheets.length * (stockW * stockH) / 1000000;
        let totalPlacedArea = 0;
        let totalPlacedCount = 0;
        
        sheets.forEach(sheet => {
            sheet.placed.forEach(p => {
                totalPlacedArea += (p.w * p.h) / 1000000;
                totalPlacedCount++;
            });
        });

        let yieldPercentage = (totalPlacedArea / totalSheetArea) * 100;
        let wasteArea = totalSheetArea - totalPlacedArea;

        document.getElementById('optResSheets').innerText = sheets.length;
        document.getElementById('optResYield').innerText = yieldPercentage.toFixed(1) + "%";
        document.getElementById('optResParts').innerText = totalPlacedCount;
        document.getElementById('optResWaste').innerText = wasteArea.toFixed(2) + " mÂ²";

        sheets.forEach((sheet, idx) => {
            let card = document.createElement('div');
            card.className = "card";
            card.style.background = "rgba(255,255,255,0.01)";
            card.style.border = "1px solid var(--border)";
            card.style.padding = "15px";
            card.style.marginBottom = "0";

            let header = document.createElement('h4');
            header.style.margin = "0 0 10px 0";
            header.style.color = "var(--primary)";
            header.style.fontSize = "13px";
            
            let sheetPlacedArea = 0;
            sheet.placed.forEach(p => sheetPlacedArea += (p.w * p.h) / 1000000);
            let sheetYield = (sheetPlacedArea / ((stockW * stockH) / 1000000)) * 100;

            header.innerText = `Plaka #${idx + 1} (${stockW} x ${stockH} mm) - Verimlilik: ${sheetYield.toFixed(1)}%`;
            card.appendChild(header);

            let canvasWrapper = document.createElement('div');
            canvasWrapper.className = "canvas-wrapper";
            canvasWrapper.style.background = "#0c111e";
            canvasWrapper.style.borderRadius = "8px";
            canvasWrapper.style.padding = "10px";
            canvasWrapper.style.display = "flex";
            canvasWrapper.style.justifyContent = "center";

            let canvas = document.createElement('canvas');
            canvas.width = 600;
            canvas.height = 450;
            canvas.style.maxWidth = "100%";
            canvas.style.height = "auto";
            canvasWrapper.appendChild(canvas);
            card.appendChild(canvasWrapper);
            container.appendChild(card);

            drawSheetLayout(canvas, sheet, stockW, stockH, margin);
        });
    }

    function drawSheetLayout(canvas, sheet, stockW, stockH, margin) {
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#f8fafc";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let scale = Math.min((canvas.width - 40) / stockW, (canvas.height - 40) / stockH);
        let ox = (canvas.width - stockW * scale) / 2;
        let oy = (canvas.height - stockH * scale) / 2;

        ctx.fillStyle = "#e2e8f0";
        ctx.fillRect(ox, oy, stockW * scale, stockH * scale);
        
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 2;
        ctx.strokeRect(ox, oy, stockW * scale, stockH * scale);

        ctx.strokeStyle = "rgba(15, 23, 42, 0.03)";
        ctx.lineWidth = 1;
        for (let i = -canvas.width; i < canvas.width; i += 20) {
            ctx.beginPath();
            ctx.moveTo(ox + i, oy);
            ctx.lineTo(ox + i + stockH * scale, oy + stockH * scale);
            ctx.stroke();
        }

        if(margin > 0) {
            ctx.strokeStyle = "rgba(239, 68, 68, 0.4)";
            ctx.setLineDash([4, 4]);
            ctx.strokeRect(ox + margin * scale, oy + margin * scale, (stockW - 2 * margin) * scale, (stockH - 2 * margin) * scale);
            ctx.setLineDash([]);
        }

        sheet.placed.forEach((p, pIdx) => {
            let px = ox + p.x * scale;
            let py = oy + p.y * scale;
            let pw = p.w * scale;
            let ph = p.h * scale;

            let hues = [195, 35, 145, 280, 80];
            let hue = hues[pIdx % hues.length];
            
            ctx.fillStyle = `hsla(${hue}, 85%, 45%, 0.12)`;
            ctx.strokeStyle = `hsla(${hue}, 85%, 45%, 1.0)`;
            ctx.lineWidth = 1.5;
            
            ctx.fillRect(px, py, pw, ph);
            ctx.strokeRect(px, py, pw, ph);

            ctx.strokeStyle = `hsla(${hue}, 85%, 45%, 0.25)`;
            ctx.lineWidth = 1;
            if (p.rotated) {
                for (let gy = py + 6; gy < py + ph - 2; gy += 6) {
                    ctx.beginPath(); ctx.moveTo(px + 4, gy); ctx.lineTo(px + pw - 4, gy); ctx.stroke();
                }
            } else {
                for (let gx = px + 6; gx < px + pw - 2; gx += 6) {
                    ctx.beginPath(); ctx.moveTo(gx, py + 4); ctx.lineTo(gx, py + ph - 4); ctx.stroke();
                }
            }

            ctx.fillStyle = `hsla(${hue}, 90%, 20%, 1.0)`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            let fontSize = Math.min(11, Math.max(7, Math.floor(pw / 10)));
            ctx.font = `600 ${fontSize}px Inter`;

            let label = p.name;
            let dims = `${p.w} x ${p.h}`;

            if (pw > 50 && ph > 30) {
                ctx.fillText(label, px + pw / 2, py + ph / 2 - fontSize/2 - 1);
                ctx.font = `${fontSize - 1}px Inter`;
                ctx.fillStyle = `hsla(${hue}, 90%, 25%, 0.75)`;
                ctx.fillText(dims + (p.rotated ? " ğŸ”„" : ""), px + pw / 2, py + ph / 2 + fontSize/2 + 1);
            } else if (pw > 30 && ph > 15) {
                ctx.fillText(dims, px + pw / 2, py + ph / 2);
            }
        });
    }

    function yazdirOptPlan() {
        let sizeSelect = document.getElementById('opt_stock_size').value;
        let stockW = 2800;
        let stockH = 2100;
        if(sizeSelect === '2800x2100') {
            stockW = 2800; stockH = 2100;
        } else if(sizeSelect === '3660x1830') {
            stockW = 3660; stockH = 1830;
        } else {
            stockW = parseInt(document.getElementById('opt_stock_w').value) || 2800;
            stockH = parseInt(document.getElementById('opt_stock_h').value) || 2100;
        }

        document.getElementById('printOptDate').innerText = new Date().toLocaleDateString('tr-TR');
        let customer = document.getElementById('customerName').value.trim();
        document.getElementById('printOptCustomer').innerText = customer ? (customer + " SipariÅŸ Kesim PlanÄ±") : "AtÃ¶lye Kesim Listesi";
        
        document.getElementById('printOptResSheetsVal').innerText = document.getElementById('optResSheets').innerText;
        document.getElementById('printOptResYieldVal').innerText = document.getElementById('optResYield').innerText;
        document.getElementById('printOptResPartsVal').innerText = document.getElementById('optResParts').innerText;
        document.getElementById('printOptResWasteVal').innerText = document.getElementById('optResWaste').innerText;

        let container = document.getElementById('printOptCanvasContainer');
        container.innerHTML = "";

        let canvases = document.querySelectorAll('#optLayoutsContainer canvas');
        canvases.forEach((c, idx) => {
            let img = document.createElement('img');
            img.src = c.toDataURL("image/png");
            img.style.width = "100%";
            img.style.maxWidth = "700px";
            img.style.border = "1px solid #333";
            img.style.borderRadius = "6px";
            img.style.marginBottom = "20px";
            img.style.boxSizing = "border-box";
            
            let label = document.createElement('div');
            label.style.fontWeight = "bold";
            label.style.fontSize = "12px";
            label.style.marginBottom = "6px";
            label.style.color = "#000";
            label.innerText = `PLAKA #${idx + 1} (${stockW}x${stockH} mm)`;
            
            let block = document.createElement('div');
            block.style.display = "flex";
            block.style.flexDirection = "column";
            block.style.alignItems = "center";
            block.style.pageBreakAfter = "always";
            block.appendChild(label);
            block.appendChild(img);
            
            container.appendChild(block);
        });

        document.body.classList.add('print-mode-kesim');
        window.print();
    }

    // ==========================================
    // ğŸ“Š MÃœÅTERÄ° SÄ°PARÄ°Å TAKÄ°P PORTALI KODLARI
    // ==========================================
    let currentTrackingData = null;

    function sorgulaSiparis() {
        let query = document.getElementById('trackSearchInput').value.trim();
        if (!query) { alert("LÃ¼tfen SipariÅŸ Kodu veya Telefon NumarasÄ± girin!"); return; }
        
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
                        alert("Bu telefon numarasÄ±na ait aktif sipariÅŸ bulunamadÄ±!");
                    } else if (snapshot.size === 1) {
                        let doc = snapshot.docs[0];
                        loadOrderTracking(doc.id, doc.data());
                    } else {
                        showMultiSelectTracking(snapshot);
                    }
                })
                .catch(err => {
                    alert("Arama hatasÄ±: " + err.message);
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
                    alert("GirdiÄŸiniz SipariÅŸ Kodu bulunamadÄ±! LÃ¼tfen kodu kontrol edin.");
                }
            }).catch(err => {
                alert("Arama hatasÄ±: " + err.message);
            });
        }
    }

    function showMultiSelectTracking(snapshot) {
        document.getElementById('trackingMultiSelect').style.display = 'block';
        document.getElementById('trackingDetailsPanel').style.display = 'none';
        
        let listContainer = document.getElementById('trackingMultiList');
        listContainer.innerHTML = '';
        
        let localTypeNames = {
            gardÄ±rop: "GardÄ±rop",
            mutfak: "Mutfak DolabÄ±",
            vestiyer: "Vestiyer",
            banyo: "Banyo DolabÄ±",
            udolap: "U-Dolap",
            ozel: "Ã–zel TasarÄ±m"
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
            
            let mobType = localTypeNames[data.mobilyaTuru] || "Mobilya SipariÅŸi";
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
        document.getElementById('trackPersonelVal').innerText = data.personel || "Mustafa DoÄŸanÃ§ay";
        
        let localTypeNames = {
            gardÄ±rop: "GardÄ±rop",
            mutfak: "Mutfak DolabÄ±",
            vestiyer: "Vestiyer",
            banyo: "Banyo DolabÄ±",
            udolap: "U-Dolap",
            ozel: "Ã–zel TasarÄ±m"
        };
        document.getElementById('trackTurVal').innerText = localTypeNames[data.mobilyaTuru] || "Ã–zel Proje";
        
        let specsText = data.detaylar || `${data.m2} mÂ² / ${data.kapakAdet} Kapak (${data.kapak}) - Ray: ${data.ray}`;
        document.getElementById('trackSpecsVal').innerText = specsText;
        
        // Ã–demeler geÃ§miÅŸini topla
        let odemeler = data.odemeler || [];
        if (odemeler.length === 0 && (data.kaparoNum || 0) > 0) {
            odemeler = [{
                tutar: data.kaparoNum,
                aciklama: "Ä°lk Kaparo",
                tarih: data.tarih || new Date().toLocaleDateString('tr-TR')
            }];
        }
        
        let totalAlinan = odemeler.reduce((sum, item) => sum + parseFloat(item.tutar || 0), 0);
        let totalNum = data.toplamNum || 0;
        let kalan = totalNum - totalAlinan;
        
        document.getElementById('trackToplamVal').innerText = data.toplam || "0 â‚º";
        document.getElementById('trackKaparoVal').innerText = totalAlinan.toLocaleString('tr-TR') + " â‚º";
        document.getElementById('trackKalanVal').innerText = kalan.toLocaleString('tr-TR') + " â‚º";
        
        // MÃ¼ÅŸteri iÃ§in Ã¶deme geÃ§miÅŸi listesi Ã§iz
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
                            <span style="font-weight:600; color:var(--text-light);">${pay.tutar.toLocaleString('tr-TR')} â‚º</span>
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
        
        // --- Tahmini Teslimat Tarihi GÃ¶sterimi ---
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
        
        // --- Dinamik Teslimat Geri SayÄ±m SayacÄ± ---
        let countdownBadge = document.getElementById('trackCountdownBadge');
        if (countdownBadge) {
            if (data.durum === "TamamlandÄ±" || !data.tahminiTeslimat) {
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
                    countdownBadge.innerHTML = `ğŸšš Montaj ve Teslime Son <strong>${diffDays}</strong> GÃ¼n!`;
                    countdownBadge.style.background = 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.15))';
                    countdownBadge.style.color = 'var(--primary)';
                    countdownBadge.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                } else if (diffDays === 0) {
                    countdownBadge.innerHTML = `ğŸ‰ BugÃ¼n Montaj ve Teslimat GÃ¼nÃ¼!`;
                    countdownBadge.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))';
                    countdownBadge.style.color = 'var(--success)';
                    countdownBadge.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                } else {
                    countdownBadge.innerHTML = `ğŸ› ï¸ Montaj HazÄ±rlÄ±klarÄ± ve Son RÃ¶tuÅŸlar YapÄ±lÄ±yor`;
                    countdownBadge.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(29, 78, 216, 0.15))';
                    countdownBadge.style.color = 'var(--info)';
                    countdownBadge.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                }
            }
        }

        // --- Dinamik Mobilya KullanÄ±m & BakÄ±m Rehberi ---
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
                    <div class="care-guide-title">ğŸ¨ Lake Mobilya Temizlik & BakÄ±m Rehberi</div>
                    <ul class="care-guide-list">
                        <li><strong>YumuÅŸak Bez KullanÄ±n:</strong> Sadece nemlendirilmiÅŸ yumuÅŸak mikrofiber bezler tercih edin. AÅŸÄ±ndÄ±rÄ±cÄ± sÃ¼nger veya tel bez kullanmayÄ±n.</li>
                        <li><strong>Kimyasallardan KaÃ§Ä±nÄ±n:</strong> Tiner, Ã§amaÅŸÄ±r suyu, aseton, alkol bazlÄ± temizleyiciler lake cilasÄ±na kalÄ±cÄ± zarar verir. Hafif sabunlu Ä±lÄ±k su yeterlidir.</li>
                        <li><strong>Hemen KurulayÄ±n:</strong> Nemli bezle silindikten sonra yÃ¼zeyde su damlacÄ±ÄŸÄ± bÄ±rakÄ±lmamalÄ±, kuru bezle hafifÃ§e kurulanmalÄ±dÄ±r.</li>
                        <li><strong>GÃ¼neÅŸ IÅŸÄ±ÄŸÄ±ndan Koruyun:</strong> DoÄŸrudan ve yoÄŸun gÃ¼neÅŸ Ä±ÅŸÄ±ÄŸÄ± lake renginin zamanla sararmasÄ±na yol aÃ§abilir.</li>
                    </ul>
                `;
                careGuideList.appendChild(box);
            } else if (kapakLower.includes('mdf') || kapakLower.includes('suntalam') || kapakLower.includes('gÃ¶vde')) {
                hasGuide = true;
                let box = document.createElement('div');
                box.className = 'care-guide-box';
                box.innerHTML = `
                    <div class="care-guide-title">ğŸªµ MDF Lam & AhÅŸap YÃ¼zeyler BakÄ±m Rehberi</div>
                    <ul class="care-guide-list">
                        <li><strong>Neme KarÅŸÄ± Koruyun:</strong> YÃ¼zeyler neme dayanÄ±klÄ± olsa da birleÅŸim noktalarÄ±ndan su sÄ±zmasÄ± ÅŸiÅŸme yapabilir. DÃ¶kÃ¼len sÄ±vÄ±larÄ± hemen kurulayÄ±n.</li>
                        <li><strong>Hafif Temizlik:</strong> Nemli sabunlu bezle silinip hemen kurulanmasÄ± yeterlidir. Ã‡ok Ä±slak temizlikten kaÃ§Ä±nÄ±n.</li>
                        <li><strong>Ã‡izilmelere Dikkat:</strong> YÃ¼zey Ã¼zerinde sert veya keskin objeleri sÃ¼rÃ¼klemeyin, altlÄ±k kullanmaya Ã¶zen gÃ¶sterin.</li>
                    </ul>
                `;
                careGuideList.appendChild(box);
            } else if (kapakLower.includes('cam')) {
                hasGuide = true;
                let box = document.createElement('div');
                box.className = 'care-guide-box';
                box.innerHTML = `
                    <div class="care-guide-title">âœ¨ Cam & Metal Aksesuar BakÄ±m Rehberi</div>
                    <ul class="care-guide-list">
                        <li><strong>Cam Temizleyici:</strong> Standart cam temizleyiciler ve mikrofiber bez kullanÄ±labilir.</li>
                        <li><strong>Metal Ã‡erÃ§eveler:</strong> AlÃ¼minyum profilleri aÅŸÄ±ndÄ±rÄ±cÄ± asidik temizleyicilerle silmeyin.</li>
                        <li><strong>MenteÅŸe BakÄ±mÄ±:</strong> KapaklarÄ± sertÃ§e Ã§arpmayÄ±n, fren mekanizmalarÄ±nÄ±n saÄŸlÄ±klÄ± Ã§alÄ±ÅŸmasÄ± iÃ§in menteÅŸeleri zorlamayÄ±n.</li>
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
                        <div class="care-guide-title">ğŸŒ³ DoÄŸal Masif AhÅŸap Tezgah KullanÄ±m Rehberi</div>
                        <ul class="care-guide-list">
                            <li><strong>SÄ±cak ve IslaklÄ±k:</strong> Ãœzerinde doÄŸrudan sÄ±cak tencere bÄ±rakmayÄ±n. Su birikintilerini derhal kurulayÄ±n.</li>
                            <li><strong>Periyodik YaÄŸlama:</strong> TezgahÄ±nÄ±zÄ±n Ã¶mrÃ¼nÃ¼ uzatmak iÃ§in yÄ±lda 1-2 kez koruyucu doÄŸal yaÄŸ (Ã¶rneÄŸin keten tohumu yaÄŸÄ±) uygulayÄ±nÄ±z.</li>
                            <li><strong>Kesme TahtasÄ± KullanÄ±mÄ±:</strong> Tezgah Ã¼zerinde doÄŸrudan kesim yapmayÄ±n, bÄ±Ã§ak izleri ahÅŸabÄ± zedeleyebilir.</li>
                        </ul>
                    `;
                    careGuideList.appendChild(box);
                } else if (countertop === 'granit') {
                    hasGuide = true;
                    let box = document.createElement('div');
                    box.className = 'care-guide-box';
                    box.innerHTML = `
                        <div class="care-guide-title">ğŸ’ DoÄŸal Granit Tezgah KullanÄ±m Rehberi</div>
                        <ul class="care-guide-list">
                            <li><strong>Kimyasal Koruma:</strong> Por Ã§Ã¶zÃ¼cÃ¼, tuz ruhu veya gÃ¼Ã§lÃ¼ asidik temizlik kimyasallarÄ± granitin cilasÄ±nÄ± matlaÅŸtÄ±rÄ±r. NÃ¶tr sabunlu su kullanÄ±n.</li>
                            <li><strong>SÄ±caklÄ±k DayanÄ±mÄ±:</strong> Granit sÄ±caÄŸa oldukÃ§a dayanÄ±klÄ±dÄ±r ancak ani termal ÅŸoklarÄ± Ã¶nlemek iÃ§in sÄ±cak tencerelerin altÄ±na nihale koyulmasÄ± tavsiye edilir.</li>
                        </ul>
                    `;
                    careGuideList.appendChild(box);
                } else if (countertop === 'cimstone') {
                    hasGuide = true;
                    let box = document.createElement('div');
                    box.className = 'care-guide-box';
                    box.innerHTML = `
                        <div class="care-guide-title">ğŸ’  Ã‡imstone & Kuvars Tezgah KullanÄ±m Rehberi</div>
                        <ul class="care-guide-list">
                            <li><strong>Leke Direnci:</strong> GÃ¶zeneksiz yapÄ±sÄ± sayesinde leke tutmaz. Ancak Ã§ay, kahve veya limon gibi asidik gÄ±dalar dÃ¶kÃ¼ldÃ¼ÄŸÃ¼nde kurumadan silinmelidir.</li>
                            <li><strong>Kimyasal Hassasiyeti:</strong> Ã‡amaÅŸÄ±r suyu veya asidik temizleyiciler yerine pH nÃ¶tr genel temizleyiciler kullanÄ±n.</li>
                        </ul>
                    `;
                    careGuideList.appendChild(box);
                } else if (countertop === 'laminat') {
                    hasGuide = true;
                    let box = document.createElement('div');
                    box.className = 'care-guide-box';
                    box.innerHTML = `
                        <div class="care-guide-title">ğŸ›ï¸ Laminat Tezgah KullanÄ±m Rehberi</div>
                        <ul class="care-guide-list">
                            <li><strong>IsÄ± ve Kesme:</strong> DoÄŸrudan sÄ±cak tencere koymayÄ±n, laminat yÃ¼zeyi eriyebilir veya kabarcÄ±k yapabilir. DoÄŸrudan Ã¼zerinde kesim yapmayÄ±n.</li>
                            <li><strong>Su SÄ±zdÄ±rmazlÄ±ÄŸÄ±:</strong> Evye birleÅŸim yerlerinde ve kenar bantlarÄ±nda su birikmesini Ã¶nleyin, aksi takdirde MDF gÃ¶vde ÅŸiÅŸebilir.</li>
                        </ul>
                    `;
                    careGuideList.appendChild(box);
                }
            }
            
            if (!hasGuide) {
                let box = document.createElement('div');
                box.className = 'care-guide-box';
                box.innerHTML = `
                    <div class="care-guide-title">ğŸ›‹ï¸ Genel Mobilya KullanÄ±m Rehberi</div>
                    <ul class="care-guide-list">
                        <li><strong>Temizlik:</strong> Nemli yumuÅŸak mikrofiber bezle silip hemen kurulayÄ±nÄ±z. AÅŸÄ±ndÄ±rÄ±cÄ± sÃ¼nger ve sert kimyasal kullanmayÄ±nÄ±z.</li>
                        <li><strong>Nem ve IsÄ±:</strong> MobilyalarÄ± aÅŸÄ±rÄ± sÄ±cak, soÄŸuk veya nemli ortamlardan koruyunuz.</li>
                        <li><strong>KullanÄ±m:</strong> Kapak ve Ã§ekmeceleri sert kapatmayÄ±nÄ±z, aÅŸÄ±rÄ± yÃ¼klemeden kaÃ§Ä±nÄ±nÄ±z.</li>
                    </ul>
                `;
                careGuideList.appendChild(box);
            }
            
            careGuideCard.style.display = 'block';
        }
        
        if (data.inputState) {
            renderTrackingDesign(data.inputState);
        } else {
            document.getElementById('customerCanvasWrapper').innerHTML = '<div style="color:var(--text-muted); font-size:12px;">Bu sipariÅŸ iÃ§in 2D tasarÄ±m modeli bulunmamaktadÄ±r.</div>';
        }
        
        // --- SipariÅŸi DeÄŸerlendir Paneli (Yorum & Puanlama) ---
        let trackReviewCard = document.getElementById('trackReviewCard');
        if (trackReviewCard) {
            if (data.durum === "TamamlandÄ±") {
                trackReviewCard.style.display = 'block';
                // Check if a review already exists in database
                db.collection("reviews").doc(docId).get().then((reviewDoc) => {
                    if (reviewDoc.exists) {
                        let reviewData = reviewDoc.data();
                        let starsHtml = '';
                        for (let i = 1; i <= 5; i++) {
                            starsHtml += `<span style="color: ${i <= reviewData.rating ? '#fbbf24' : 'var(--border)'}; font-size: 20px; margin-right: 2px;">â˜…</span>`;
                        }
                        document.getElementById('trackReviewFormContainer').style.display = 'none';
                        let resultContainer = document.getElementById('trackReviewResultContainer');
                        resultContainer.innerHTML = `
                            <div style="background-color: var(--bg-dark); padding: 12px; border-radius: 8px; border: 1px solid var(--border);">
                                <span style="font-size: 11px; color: var(--success); font-weight: 600; display: block; margin-bottom: 5px;">âœ“ DeÄŸerlendirmeniz Kaydedildi</span>
                                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                                    <span style="font-size: 12px; font-weight: 700; color: var(--text-light);">PuanÄ±nÄ±z:</span>
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
                    console.error("Yorum kontrol hatasÄ±:", err);
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
            banner.innerText = "ğŸŸ¡ Teklif HazÄ±rlandÄ± - Onay Bekliyor";
            banner.style.backgroundColor = "rgba(217, 119, 6, 0.1)";
            banner.style.color = "#d97706";
        } else if (status === "OnaylandÄ± / Ä°malatta") {
            activeIndex = 1;
            banner.innerText = "ğŸ”µ SipariÅŸiniz AtÃ¶lyede Ä°malat AÅŸamasÄ±nda";
            banner.style.backgroundColor = "rgba(59, 130, 246, 0.15)";
            banner.style.color = "#3b82f6";
        } else if (status === "Montaj AÅŸamasÄ±nda") {
            activeIndex = 2;
            banner.innerText = "ğŸŸ£ ÃœrÃ¼nleriniz Adrese Nakliye ve Montaj AÅŸamasÄ±nda";
            banner.style.backgroundColor = "rgba(168, 85, 247, 0.15)";
            banner.style.color = "#a855f7";
        } else if (status === "TamamlandÄ±") {
            activeIndex = 3;
            banner.innerText = "ğŸŸ¢ SipariÅŸiniz TamamlandÄ± ve Teslim Edildi";
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
    // â­ MÃœÅTERÄ° DEÄERLENDÄ°RME & YORUM FONKSÄ°YONLARI
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
        
        if (!currentTrackingData || !currentTrackingData.id) {
            alert("SipariÅŸ bilgisi bulunamadÄ±!");
            return;
        }
        
        let comment = document.getElementById('trackReviewComment').value.trim();
        let orderId = currentTrackingData.id;
        
        let btn = document.getElementById('btnSubmitReview');
        if (btn) {
            btn.disabled = true;
            btn.innerText = "GÃ¶nderiliyor...";
        }
        
        let reviewObj = {
            orderId: orderId,
            rating: currentInteractiveRating,
            comment: comment,
            customerName: currentTrackingData.musteri || "Ä°simsiz MÃ¼ÅŸteri",
            mobilyaTuru: currentTrackingData.mobilyaTuru || "Ã–zel Proje",
            timestamp: new Date().toISOString()
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
                    <p style="font-size: 11.5px; color: var(--text-muted); margin-bottom: 10px;">Geri bildiriminiz baÅŸarÄ±yla iletildi.</p>
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
        
        db.collection("reviews").orderBy("timestamp", "desc").limit(3).get().then(snapshot => {
            if (snapshot.empty) return;
            
            container.innerHTML = '';
            snapshot.forEach(doc => {
                let r = doc.data();
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
        }).catch(err => {
            console.log("GiriÅŸ yorumlarÄ± yÃ¼kleme hatasÄ±:", err);
        });
    }

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
    // ğŸ’³ KISMÄ° Ã–DEME (TAHSÄ°LAT) TAKÄ°P KODLARI
    // ==========================================
    let activePaymentDocId = null;
    let activePaymentDocData = null;

    function openPaymentModal(docId) {
        activePaymentDocId = docId;
        
        db.collection("ortak_teklifler").doc(docId).get().then((doc) => {
            if (doc.exists) {
                let data = doc.data();
                activePaymentDocData = data;
                
                document.getElementById('payModalMusteri').innerText = data.musteri || "";
                document.getElementById('payModalToplam').innerText = data.toplam || "0 â‚º";
                
                // Ã–deme geÃ§miÅŸi dizisini al veya mevcut kaparo bilgisini ilk Ã¶deme olarak yÃ¼kle
                let odemeler = data.odemeler || [];
                if (odemeler.length === 0 && (data.kaparoNum || 0) > 0) {
                    odemeler = [{
                        tutar: data.kaparoNum,
                        aciklama: "Ä°lk Kaparo",
                        tarih: data.tarih || new Date().toLocaleDateString('tr-TR')
                    }];
                }
                
                // Toplam tahsilatÄ± ve kalan bakiyeyi hesapla
                let totalAlinan = odemeler.reduce((sum, item) => sum + parseFloat(item.tutar || 0), 0);
                let totalNum = data.toplamNum || 0;
                let kalan = totalNum - totalAlinan;
                
                document.getElementById('payModalAlinan').innerText = totalAlinan.toLocaleString('tr-TR') + " â‚º";
                document.getElementById('payModalKalan').innerText = kalan.toLocaleString('tr-TR') + " â‚º";
                
                // Ã–deme listesini modal arayÃ¼zÃ¼ne Ã§iz
                let historyContainer = document.getElementById('payModalHistoryList');
                historyContainer.innerHTML = '';
                
                if (odemeler.length === 0) {
                    historyContainer.innerHTML = '<div style="color:var(--text-muted); font-size:11px; text-align:center; padding:10px;">HenÃ¼z Ã¶deme kaydÄ± bulunmuyor.</div>';
                } else {
                    odemeler.forEach((pay, idx) => {
                        let item = document.createElement('div');
                        item.className = 'payment-history-item';
                        item.innerHTML = `
                            <div>
                                <span style="font-weight:600; color:var(--text-light);">${pay.tutar.toLocaleString('tr-TR')} â‚º</span>
                                <span style="color:var(--text-muted); margin-left:8px; font-size:11px;">(${pay.aciklama})</span>
                            </div>
                            <div style="color:var(--text-muted); font-size:11px; display:flex; gap:10px; align-items:center;">
                                <span>${pay.tarih}</span>
                                <button onclick="deletePayment(${idx})" style="background:transparent; border:none; color:var(--danger); cursor:pointer; font-size:16px; padding:0 4px; line-height:1;" title="Ã–demeyi Sil">Ã—</button>
                            </div>
                        `;
                        historyContainer.appendChild(item);
                    });
                }
                
                // GiriÅŸ alanlarÄ±nÄ± temizle ve bugÃ¼nÃ¼n tarihini at
                document.getElementById('payModalAmountInput').value = '';
                document.getElementById('payModalDescInput').value = '';
                
                let today = new Date();
                let year = today.getFullYear();
                let month = String(today.getMonth() + 1).padStart(2, '0');
                let day = String(today.getDate()).padStart(2, '0');
                document.getElementById('payModalDateInput').value = `${year}-${month}-${day}`;
                
                document.getElementById('paymentModalOverlay').style.display = 'flex';
            } else {
                alert("SipariÅŸ bulunamadÄ±!");
            }
        }).catch(err => {
            alert("Ã–deme geÃ§miÅŸi yÃ¼klenirken hata oluÅŸtu: " + err.message);
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
        let desc = document.getElementById('payModalDescInput').value.trim() || "Ara Ã–deme";
        let dateVal = document.getElementById('payModalDateInput').value;
        
        if (amount <= 0) {
            alert("LÃ¼tfen geÃ§erli bir Ã¶deme tutarÄ± girin!");
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
                aciklama: "Ä°lk Kaparo",
                tarih: activePaymentDocData.tarih || new Date().toLocaleDateString('tr-TR')
            }];
        }
        
        // Yeni Ã¶deme kaydÄ±nÄ± ekle
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
            kaparo: totalAlinan.toLocaleString('tr-TR') + " â‚º",
            kalan: kalan.toLocaleString('tr-TR') + " â‚º"
        }).then(() => {
            alert("Ã–deme kaydÄ± baÅŸarÄ±yla eklendi!");
            openPaymentModal(activePaymentDocId);
        }).catch(err => {
            alert("Ã–deme kaydedilirken hata oluÅŸtu: " + err.message);
        });
    }

    function deletePayment(idx) {
        if (!confirm("SeÃ§tiÄŸiniz Ã¶deme kaydÄ±nÄ± silmek istediÄŸinize emin misiniz?")) return;
        
        let odemeler = activePaymentDocData.odemeler || [];
        if (odemeler.length === 0 && (activePaymentDocData.kaparoNum || 0) > 0) {
            odemeler = [{
                tutar: activePaymentDocData.kaparoNum,
                aciklama: "Ä°lk Kaparo",
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
            kaparo: totalAlinan.toLocaleString('tr-TR') + " â‚º",
            kalan: kalan.toLocaleString('tr-TR') + " â‚º"
        }).then(() => {
            alert("Ã–deme kaydÄ± silindi!");
            openPaymentModal(activePaymentDocId);
        }).catch(err => {
            alert("Ã–deme silinirken hata oluÅŸtu: " + err.message);
        });
    }

    // =========================================================================
    // ğŸ¨ ETKÄ°LEÅÄ°MLÄ° MÃœÅTERÄ° DOLAP TASARIM SÄ°HÄ°RBAZI (KENDÄ°N TASARLA) MANTIÄI
    // =========================================================================
    
    // =========================================================================
    // ğŸ¨ ETKÄ°LEÅÄ°MLÄ° MÃœÅTERÄ° DOLAP TASARIM SÄ°HÄ°RBAZI (KENDÄ°N TASARLA) MANTIÄI
    // =========================================================================
    
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
            btnDoors.innerHTML = "ğŸšª";
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
        
        document.getElementById('lblTotalSections').innerText = requiredSections + " BÃ¶lme";
        
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
                
                btn.innerText = 'BÃ¶lme ' + (i + 1);
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
        
        document.getElementById('designTotalPrice').innerText = totalEstimatedPrice.toLocaleString('tr-TR') + " â‚º";
        
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
            ctx.fillText("Ä°nsan Boyu (1.75m)", 75, 368);
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