// âœ‚ï¸ PLAKA KESÄ°M VE OPTÄ°MÄ°ZASYON ALGORÄ°TMASI (GLOBAL SCOPE)
// ========================================================

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
                <input type="text" class="opt-part-name" value="${name}" placeholder="Örn: Yan Dikme" style="width:100%; border:1px solid var(--border); border-radius:4px; padding:4px 6px; font-size:12px; background:var(--bg-dark); color:var(--text-main); box-sizing:border-box;">
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
        if (type === 'gardırop' || type === 'vestiyer' || type === 'banyo') {
            let w = parseFloat(document.getElementById(type === 'gardırop' ? 'g_width' : (type === 'vestiyer' ? 'v_width' : 'b_width')).value) || 0;
            let h = parseFloat(document.getElementById(type === 'gardırop' ? 'g_height' : (type === 'vestiyer' ? 'v_height' : 'b_height')).value) || 0;
            if (w <= 0 || h <= 0) { alert("Lütfen teklif ekranında en ve boy değerlerini girin!"); return; }
        } else if (type === 'udolap') {
            let left = parseFloat(document.getElementById('u_left').value) || 0;
            let back = parseFloat(document.getElementById('u_back').value) || 0;
            let right = parseFloat(document.getElementById('u_right').value) || 0;
            let h = parseFloat(document.getElementById('u_height').value) || 0;
            if (left <= 0 || back <= 0 || right <= 0 || h <= 0) { alert("Lütfen teklif ekranında tüm duvar ölçülerini girin!"); return; }
        } else if (type === 'mutfak') {
            let ul = parseFloat(document.getElementById('k_upper_len').value) || 0;
            let ll = parseFloat(document.getElementById('k_lower_len').value) || 0;
            if (ul <= 0 && ll <= 0) { alert("Lütfen teklif ekranında mutfak uzunluklarını girin!"); return; }
        }

        let partsList = getPartsListFromCurrentOffer();
        
        // Clean and reload parts
        optYasarListeyiTemizle();
        partsList.forEach(p => {
            optYasarEkleSatirVeri(p.name, p.w, p.h, p.qty, !p.rotate);
        });
        
        alert("Teklif detaylarındaki ölçülere göre kesim parçaları oluşturulup tabloya eklendi!");
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
                let name = nameInput.value.trim() || "Parça";
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
            alert("Lütfen optimizasyon için en az bir geçerli parça girin!");
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
            alert("Kenar temizleme payı plaka boyutunu aşıyor!");
            return;
        }

        // Validate sizes
        for(let p of flatParts) {
            let fitsNormal = (p.w <= effStockW && p.h <= effStockH);
            let fitsRotated = p.rotate && (p.h <= effStockW && p.w <= effStockH);
            if(!fitsNormal && !fitsRotated) {
                alert(`Hata: "${p.name}" (${p.w}x${p.h} mm) plaka boyutundan (${effStockW}x${effStockH} mm) büyüktür!`);
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
            container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 50px 0;">Sığan parça bulunamadı.</div>`;
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
        document.getElementById('optResWaste').innerText = wasteArea.toFixed(2) + " m²";

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
                ctx.fillText(dims + (p.rotated ? " 🔄" : ""), px + pw / 2, py + ph / 2 + fontSize/2 + 1);
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
        document.getElementById('printOptCustomer').innerText = customer ? (customer + " Sipariş Kesim Planı") : "Atölye Kesim Listesi";
        
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
    // 📊 MÜŞTERİ SİPARİŞ TAKİP PORTALI KODLARI
    // ==========================================
    var currentTrackingData = null;
