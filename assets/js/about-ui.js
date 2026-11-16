/*
	About page: the UI kit behind the apps shown inside the 3D phone.
	Screens are drawn on a 2D canvas (logical size 540x1170). A screen
	registers "hot" areas with an action (go to a screen, open a link, hold a
	control...), so the phone can be used for real, and may return a live()
	painter that runs every frame on top of the static drawing.
	The apps themselves are in about-apps.js.
*/

(function () {
	'use strict';

	const W = 540, H = 1170;
	const SANS = '"Roboto Flex", Roboto, system-ui, sans-serif';
	const MONO = '"JetBrains Mono", ui-monospace, monospace';
	const SERIF = '"Instrument Serif", Georgia, serif';
	const EM = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
	const P = 'images/about/ui/';
	const MAIL = 'mailto:s.matrisciano@mail.com';

	/* ------------------------------------------------------------ assets */

	const store = {}, edge = {};
	let assetCb = null;

	function image(src) {
		let im = store[src];
		if (!im) {
			im = store[src] = new Image();
			im.onload = function () { if (assetCb) assetCb(src); };
			im.src = src;
		}
		return im;
	}
	const ready = im => im.complete && im.naturalWidth > 0;

	// Average colour of an image's border, so a logo crop can sit on a matching flat background.
	function edgeColor(src, fallback) {
		if (edge[src]) return edge[src];
		const im = image(src);
		if (!ready(im)) return fallback;
		try {
			const c = document.createElement('canvas'); c.width = c.height = 12;
			const x = c.getContext('2d'); x.drawImage(im, 0, 0, 12, 12);
			const d = x.getImageData(0, 0, 12, 12).data;
			let r = 0, g = 0, b = 0, n = 0;
			for (let i = 0; i < 12; i++) {
				[[i, 0], [i, 11], [0, i], [11, i]].forEach(p => { const o = (p[1] * 12 + p[0]) * 4; r += d[o]; g += d[o + 1]; b += d[o + 2]; n++; });
			}
			edge[src] = 'rgb(' + Math.round(r / n) + ',' + Math.round(g / n) + ',' + Math.round(b / n) + ')';
		} catch (err) { edge[src] = fallback; }
		return edge[src];
	}

	/* --------------------------------------------------------------- kit */

	function kit(x, hots, state, en) {
		const k = { x, state: state || {}, en: !!en, W, H };
		k.t = (it, eng) => (k.en ? eng : it);
		k.path = (X, Y, w, h, r) => {
			r = Math.max(0, Math.min(r || 0, w / 2, h / 2));
			x.beginPath();
			x.moveTo(X + r, Y); x.lineTo(X + w - r, Y); x.quadraticCurveTo(X + w, Y, X + w, Y + r);
			x.lineTo(X + w, Y + h - r); x.quadraticCurveTo(X + w, Y + h, X + w - r, Y + h);
			x.lineTo(X + r, Y + h); x.quadraticCurveTo(X, Y + h, X, Y + h - r);
			x.lineTo(X, Y + r); x.quadraticCurveTo(X, Y, X + r, Y); x.closePath();
		};
		k.rect = (X, Y, w, h, r, fill, stroke, lw) => {
			k.path(X, Y, w, h, r);
			if (fill) { x.fillStyle = fill; x.fill(); }
			if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw || 2; x.stroke(); }
		};
		k.fill = c => { x.fillStyle = c; x.fillRect(0, 0, W, H); };
		k.shadow = (c, blur, dy) => { x.shadowColor = c || 'transparent'; x.shadowBlur = blur || 0; x.shadowOffsetY = dy || 0; };
		k.circle = (cx, cy, r, fill, stroke, lw) => {
			x.beginPath(); x.arc(cx, cy, r, 0, 6.2832);
			if (fill) { x.fillStyle = fill; x.fill(); }
			if (stroke) { x.strokeStyle = stroke; x.lineWidth = lw || 2; x.stroke(); }
		};
		k.line = (pts, c, lw) => {
			x.beginPath(); pts.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])));
			x.strokeStyle = c; x.lineWidth = lw || 2; x.lineCap = 'round'; x.lineJoin = 'round'; x.stroke();
		};
		k.grad = (x0, y0, x1, y1, stops) => {
			const g = x.createLinearGradient(x0, y0, x1, y1);
			stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s));
			return g;
		};
		k.text = (s, X, Y, size, o) => {
			o = o || {};
			x.font = (o.i ? 'italic ' : '') + (o.w || 400) + ' ' + size + 'px ' + (o.f || SANS);
			x.fillStyle = o.c || '#111'; x.textAlign = o.a || 'left'; x.textBaseline = o.b || 'alphabetic';
			if ('letterSpacing' in x) x.letterSpacing = (o.ls || 0) + 'px';
			x.fillText(s, X, Y);
			const w = x.measureText(s).width;
			if ('letterSpacing' in x) x.letterSpacing = '0px';
			return w;
		};
		k.wrap = (s, X, Y, maxW, size, lh, o) => {
			o = o || {};
			x.font = (o.w || 400) + ' ' + size + 'px ' + (o.f || SANS);
			let line = '', y = Y, n = 0;
			for (const wd of s.split(' ')) {
				const test = line ? line + ' ' + wd : wd;
				if (line && x.measureText(test).width > maxW) {
					k.text(line, X, y, size, o); x.font = (o.w || 400) + ' ' + size + 'px ' + (o.f || SANS);
					line = wd; y += lh; n++;
					if (o.max && n >= o.max) return y;
				} else line = test;
			}
			if (line) { k.text(line, X, y, size, o); y += lh; }
			return y;
		};
		k.img = (src, X, Y, w, h, r, o) => {
			o = o || {};
			const im = image(src);
			x.save(); k.path(X, Y, w, h, r); x.clip();
			if (ready(im)) {
				const ir = im.naturalWidth / im.naturalHeight, cr = w / h;
				let dw, dh;
				if (ir > cr) { dh = h; dw = h * ir; } else { dw = w; dh = w / ir; }
				x.drawImage(im, X + (w - dw) * (o.px == null ? 0.5 : o.px), Y + (h - dh) * (o.py == null ? 0.5 : o.py), dw, dh);
			} else { x.fillStyle = o.ph || '#cfd6de'; x.fillRect(X, Y, w, h); }
			if (o.shade) { x.fillStyle = o.shade; x.fillRect(X, Y, w, h); }
			x.restore();
		};
		// An image whose edges melt into a flat colour, so a crop never shows as a box.
		k.soft = (src, X, Y, w, h, c, f, mode) => {
			const im = image(src);
			if (!ready(im)) return;
			if (mode) x.globalCompositeOperation = mode;
			x.drawImage(im, X, Y, w, h);
			x.globalCompositeOperation = 'source-over';
			const clear = c.replace('rgb(', 'rgba(').replace(')', ',0)');
			[[X, Y, X + f, Y, X - 1, Y - 1, f + 1, h + 2], [X + w, Y, X + w - f, Y, X + w - f, Y - 1, f + 1, h + 2],
				[X, Y, X, Y + f, X - 1, Y - 1, w + 2, f + 1], [X, Y + h, X, Y + h - f, X - 1, Y + h - f, w + 2, f + 1]].forEach(g => {
				const gr = x.createLinearGradient(g[0], g[1], g[2], g[3]);
				gr.addColorStop(0, c); gr.addColorStop(1, clear);
				x.fillStyle = gr; x.fillRect(g[4], g[5], g[6], g[7]);
			});
		};
		k.hot = (X, Y, w, h, act) => { hots.push({ x: X, y: Y, w, h, act }); };
		k.btn = (X, Y, w, h, label, o) => {
			o = o || {};
			if (o.sh) k.shadow('rgba(0,0,0,.24)', 12, 4);
			k.rect(X, Y, w, h, o.r == null ? h / 2 : o.r, o.fill, o.stroke, o.lw);
			k.shadow();
			k.text(label, X + w / 2, Y + h / 2 + 1, o.size || 22, { w: o.w || 600, c: o.c || '#fff', a: 'center', b: 'middle', ls: o.ls, f: o.f });
			if (o.act) k.hot(X, Y, w, h, o.act);
		};
		k.status = (c, bar) => {
			if (bar) { x.fillStyle = bar; x.fillRect(0, 0, W, 54); }
			k.text('9:41', 34, 38, 21, { w: 600, c });
			x.fillStyle = c;
			for (let i = 0; i < 4; i++) x.fillRect(418 + i * 8, 36 - i * 4, 5, 4 + i * 4);
			k.rect(462, 22, 34, 17, 5, null, c, 2); k.rect(465, 25, 24, 11, 2, c); x.fillRect(498, 27, 3, 7);
		};
		k.home = c => { k.rect(W / 2 - 68, H - 22, 136, 6, 3, c); };
		k.icon = makeIcon(x);
		return k;
	}

	function makeIcon(x) {
		return (name, cx, cy, s, c, lw) => {
			x.save(); x.translate(cx - s / 2, cy - s / 2); x.scale(s / 24, s / 24);
			x.strokeStyle = c; x.fillStyle = c; x.lineWidth = lw || 2.2; x.lineCap = 'round'; x.lineJoin = 'round';
			const L = pts => { x.beginPath(); pts.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]))); x.stroke(); };
			const F = pts => { x.beginPath(); pts.forEach((p, i) => (i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]))); x.closePath(); x.fill(); };
			const O = (a, b, r, fill) => { x.beginPath(); x.arc(a, b, r, 0, 6.2832); if (fill) x.fill(); else x.stroke(); };
			switch (name) {
			case 'back': L([[15, 5], [8, 12], [15, 19]]); break;
			case 'arrow': L([[20, 12], [4, 12]]); L([[10, 6], [4, 12], [10, 18]]); break;
			case 'chev': L([[9, 5], [16, 12], [9, 19]]); break;
			case 'close': L([[6, 6], [18, 18]]); L([[18, 6], [6, 18]]); break;
			case 'menu': L([[4, 7], [20, 7]]); L([[4, 12], [20, 12]]); L([[4, 17], [20, 17]]); break;
			case 'dots': O(12, 5, 2, 1); O(12, 12, 2, 1); O(12, 19, 2, 1); break;
			case 'search': O(10.5, 10.5, 6); L([[15, 15], [20, 20]]); break;
			case 'pin':
				x.beginPath(); x.arc(12, 9.5, 6.5, Math.PI * 0.82, Math.PI * 0.18); x.lineTo(12, 22.5); x.closePath(); x.fill();
				x.fillStyle = '#fff'; O(12, 9.5, 2.4, 1); break;
			case 'star':
				x.beginPath();
				for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 4.6 : 10.5; x.lineTo(12 + Math.cos(a) * r, 12 + Math.sin(a) * r); }
				x.closePath(); x.fill(); break;
			case 'play': F([[8, 5], [20, 12], [8, 19]]); break;
			case 'pause': x.fillRect(7, 5, 4, 14); x.fillRect(14, 5, 4, 14); break;
			case 'camera': x.beginPath(); x.rect(3, 7, 18, 13); x.stroke(); L([[8, 7], [9.5, 4], [14.5, 4], [16, 7]]); O(12, 13.5, 3.6); break;
			case 'heart': x.beginPath(); x.moveTo(12, 20); x.bezierCurveTo(1, 13, 4, 4, 12, 9); x.bezierCurveTo(20, 4, 23, 13, 12, 20); x.fill(); break;
			case 'user': O(12, 8.5, 4.2, 1); x.beginPath(); x.arc(12, 22, 8, Math.PI, 0); x.fill(); break;
			case 'home': F([[3, 12], [12, 4], [21, 12], [18, 12], [18, 20], [6, 20], [6, 12]]); break;
			case 'grid': [[4, 4], [13, 4], [4, 13], [13, 13]].forEach(p => x.fillRect(p[0], p[1], 7, 7)); break;
			case 'chat': x.beginPath(); x.rect(3, 4, 18, 13); x.fill(); F([[7, 17], [7, 21], [12, 17]]); break;
			case 'chart': x.beginPath(); x.rect(4, 12, 4, 8); x.rect(10, 5, 4, 15); x.rect(16, 9, 4, 11); x.stroke(); break;
			case 'clock': O(12, 12, 8.5); L([[12, 7], [12, 12], [15.5, 14]]); break;
			case 'check': L([[5, 12.5], [10, 17.5], [19, 7]]); break;
			case 'refresh': x.beginPath(); x.arc(12, 12, 7.5, -0.4, Math.PI * 1.5); x.stroke(); F([[13, 1.5], [18.5, 5], [12.5, 8]]); break;
			case 'lock': x.beginPath(); x.rect(5, 11, 14, 10); x.fill(); x.beginPath(); x.arc(12, 11, 4.5, Math.PI, 0); x.stroke(); break;
			case 'spark': F([[12, 2], [14, 10], [22, 12], [14, 14], [12, 22], [10, 14], [2, 12], [10, 10]]); break;
			case 'mail': x.beginPath(); x.rect(3, 5, 18, 14); x.stroke(); L([[3, 6], [12, 13], [21, 6]]); break;
			case 'up': F([[12, 3], [21, 14], [15.5, 14], [15.5, 21], [8.5, 21], [8.5, 14], [3, 14]]); break;
			case 'cal': x.beginPath(); x.rect(4, 6, 16, 14); x.stroke(); L([[4, 10], [20, 10]]); L([[8, 3], [8, 7]]); L([[16, 3], [16, 7]]); break;
			case 'eye': x.beginPath(); x.moveTo(2, 12); x.quadraticCurveTo(12, 3, 22, 12); x.quadraticCurveTo(12, 21, 2, 12); x.stroke(); O(12, 12, 3, 1); break;
			case 'at': O(12, 12, 4); x.beginPath(); x.arc(12, 12, 9, 0.5, Math.PI * 1.9); x.stroke(); break;
			}
			x.restore();
		};
	}

	/* ---------------------------------------------------- shared drawings */

	const accent = (k, x0, x1) => k.grad(x0, 0, x1, 0, ['#2dd4a7', '#4aa8ff', '#8b5cf6']);

	function blob(k, cx, cy, r, color) {
		const g = k.x.createRadialGradient(cx, cy, 0, cx, cy, r);
		g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
		k.x.fillStyle = g; k.x.fillRect(cx - r, cy - r, r * 2, r * 2);
	}
	function night(k) {
		k.fill(k.grad(0, 0, W, H, ['#0b1a33', '#0d1425', '#15112f']));
		blob(k, 60, 150, 330, 'rgba(45,212,167,0.42)');
		blob(k, 500, 930, 360, 'rgba(139,92,246,0.42)');
		k.status('rgba(238,242,249,.85)');
		k.home('rgba(238,242,249,.55)');
	}
	function arrowAt(k, cx, cy, deg, c, s) {
		k.x.save(); k.x.translate(cx, cy); k.x.rotate(deg * Math.PI / 180);
		k.icon('up', 0, 0, s || 62, c);
		k.x.restore();
	}
	function stars(k, X, Y, n, s, on, off) {
		for (let i = 0; i < 5; i++) k.icon('star', X + i * (s + 3), Y, s, i < n ? on : off);
	}
	function chipRow(k, items, X, Y, o) {
		let px = X;
		items.forEach(it => {
			k.x.font = (o.w || 500) + ' ' + o.size + 'px ' + (o.f || SANS);
			const w = k.x.measureText(it).width + o.pad * 2;
			if (px + w > W - 20) { px = X; Y += o.h + 10; }
			k.rect(px, Y, w, o.h, o.h / 2, o.fill, o.stroke, 1.5);
			k.text(it, px + w / 2, Y + o.h / 2 + 1, o.size, { w: o.w || 500, c: o.c, a: 'center', b: 'middle', f: o.f });
			px += w + (o.gap || 10);
		});
		return Y + o.h;
	}
	function chipRowCentered(k, items, Y, o) {
		k.x.font = (o.w || 500) + ' ' + o.size + 'px ' + SANS;
		const ws = items.map(it => k.x.measureText(it).width + o.pad * 2);
		const total = ws.reduce((a, b) => a + b, 0) + (items.length - 1) * 10;
		let px = (W - total) / 2;
		items.forEach((it, i) => {
			k.rect(px, Y, ws[i], o.h, o.h / 2, o.fill, o.stroke, 1.5);
			k.text(it, px + ws[i] / 2, Y + o.h / 2 + 1, o.size, { w: o.w || 500, c: o.c, a: 'center', b: 'middle' });
			px += ws[i] + 10;
		});
	}

	// A stylised street map: parks, an optional river, a few roads.
	function cityMap(k, X, Y, w, h, o) {
		const x = k.x; o = o || {};
		x.save(); x.beginPath(); x.rect(X, Y, w, h); x.clip();
		x.fillStyle = '#ecefe8'; x.fillRect(X, Y, w, h);
		const sx = w / 540, sy = h / 1020;
		[[40, 90, 170, 130], [330, 560, 190, 160], [30, 770, 180, 130], [360, 60, 150, 110]].forEach(p => k.rect(X + p[0] * sx, Y + p[1] * sy, p[2] * sx, p[3] * sy, 26 * sx, '#cfe6c8'));
		if (o.river) {
			x.beginPath(); x.moveTo(X - 20, Y + 430 * sy);
			x.bezierCurveTo(X + 120 * sx, Y + 330 * sy, X + 230 * sx, Y + 540 * sy, X + 340 * sx, Y + 440 * sy);
			x.bezierCurveTo(X + 420 * sx, Y + 370 * sy, X + 470 * sx, Y + 480 * sy, X + w + 20, Y + 400 * sy);
			x.strokeStyle = '#a9cdf0'; x.lineWidth = 50 * sx; x.lineCap = 'butt'; x.stroke();
		}
		[[[0, 240], [540, 270]], [[0, 660], [540, 620]], [[120, 0], [165, 1020]], [[400, 0], [355, 1020]], [[0, 880], [540, 920]], [[255, 0], [275, 1020]], [[0, 90], [540, 60]], [[60, 1020], [520, 520]]]
			.forEach((r, i) => k.line(r.map(p => [X + p[0] * sx, Y + p[1] * sy]), i % 3 === 0 ? '#f6dc8f' : '#ffffff', (i % 3 === 0 ? 13 : 9) * sx));
		(o.labels || []).forEach(l => k.text(l[0], X + l[1] * sx, Y + l[2] * sy, 15, { c: '#869198', w: 500, ls: 1 }));
		x.restore();
	}

	/* ------------------------------------------------------------------ API */

	// The apps themselves live in about-apps.js and register on `apps`.
	const apps = {};

	window.AboutUI = {
		W, H, apps,
		lib: { image, ready, edgeColor, accent, blob, night, arrowAt, stars, chipRow, chipRowCentered, cityMap, SANS, MONO, SERIF, EM, P, MAIL },
		kit: ctx => kit(ctx, [], {}, false),
		render(appId, name, ctx, state, en) {
			const hots = [], k = kit(ctx, hots, state, en);
			const out = apps[appId].screens[name](k) || {};
			return { hots, live: out.live || null };
		},
		onAsset(cb) { assetCb = cb; }
	};

})();
