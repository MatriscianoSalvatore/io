/*
	About page: an immersive, scroll-driven CV.
	1. Reveal on scroll, nav state, counters, timeline steps and city skylines.
	2. GSAP ScrollTrigger: horizontal work track, pinned tech stack, city marquee.
	3. Three.js: a 3D phone that follows the .slot placeholders laid out by CSS.
	   Its screen runs the apps of about-ui.js: tap to use them, drag to spin
	   the phone, hold the arrows of the remote to drive the toy car.
	Every part degrades to plain HTML when a library, WebGL or motion is missing.
*/

(function () {
	'use strict';

	const root = document.documentElement;
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const narrow = window.matchMedia('(max-width: 860px)');
	const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
	const UI = window.AboutUI, CITIES = window.AboutCities;
	const $ = (s, c) => (c || document).querySelector(s);
	const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
	const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
	const ramp = (x, a, b) => clamp((x - a) / (b - a));
	const smooth = t => t * t * (3 - 2 * t);
	const mix = (a, b, t) => a + (b - a) * t;
	const rad = d => (parseFloat(d) || 0) * Math.PI / 180;
	const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
	const isEn = () => root.getAttribute('data-lang') !== 'it';

	/* ----------------------------------------------------------- language */

	// English by default; Italian is kept in localStorage under the key the rest of the site uses.
	(function () {
		const b = document.createElement('button');
		b.className = 'lang-toggle'; b.type = 'button';
		b.setAttribute('role', 'switch'); b.setAttribute('aria-label', 'Italiano');
		b.setAttribute('aria-checked', isEn() ? 'false' : 'true');
		b.innerHTML = '<span class="lt lt-en" aria-hidden="true">EN</span><span class="lt lt-it" aria-hidden="true">IT</span><span class="lt-knob" aria-hidden="true"></span>';
		b.addEventListener('click', () => {
			const toIt = isEn();
			if (toIt) root.setAttribute('data-lang', 'it'); else root.removeAttribute('data-lang');
			root.lang = toIt ? 'it' : 'en';
			b.setAttribute('aria-checked', toIt ? 'true' : 'false');
			try { localStorage.setItem('sm-about-lang', toIt ? 'it' : 'en'); } catch (err) {}
		});
		document.body.appendChild(b);
	})();

	/* -------------------------------------------------------------- links */

	const toastEl = document.createElement('div');
	toastEl.className = 'toast'; toastEl.setAttribute('role', 'status');
	document.body.appendChild(toastEl);
	let toastTimer = 0;
	function toast(msg) {
		toastEl.textContent = msg;
		toastEl.classList.add('on');
		clearTimeout(toastTimer);
		toastTimer = setTimeout(() => toastEl.classList.remove('on'), 3200);
	}
	// Opens a link from inside the phone. E-mail: start the mail app and also copy the address,
	// so the tap is never a dead end where no mail client is set up.
	function openUrl(url) {
		if (url.indexOf('mailto:') === 0) {
			const addr = url.slice(7);
			if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(addr).catch(() => {});
			toast((isEn() ? 'Opening your mail app. Address copied: ' : 'Apro la tua app di posta. Indirizzo copiato: ') + addr);
		}
		// A link clicked by the script: mailto: hands over to the mail app, the rest opens in a new tab.
		const a = document.createElement('a');
		a.href = url;
		if (url.indexOf('mailto:') !== 0) { a.target = '_blank'; a.rel = 'noopener'; }
		a.style.display = 'none';
		document.body.appendChild(a);
		a.click();
		a.remove();
	}

	/* ------------------------------------------------------------ reveal */

	if ('IntersectionObserver' in window && !reduce) {
		root.classList.add('has-rv');
		const io = new IntersectionObserver(entries => {
			entries.forEach(en => {
				if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
			});
		}, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
		$$('.rv').forEach(el => io.observe(el));
	}

	/* --------------------------------------------- nav, progress, anchors */

	const nav = $('.nav'), bar = $('.progress i');
	function onScroll() {
		const y = window.scrollY, max = root.scrollHeight - window.innerHeight;
		nav.classList.toggle('scrolled', y > 24);
		bar.style.transform = 'scaleX(' + (max > 0 ? clamp(y / max) : 0).toFixed(4) + ')';
	}
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	function scrollToEl(target) {
		if (!target) return;
		if (lenis) lenis.scrollTo(target);
		else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
	}
	$$('a[href^="#"]').forEach(a => a.addEventListener('click', ev => {
		const target = $(a.getAttribute('href'));
		if (!target) return;
		ev.preventDefault();
		scrollToEl(target);
	}));

	/* ----------------------------------------------------------- counters */

	const stats = $('.stats');
	if (stats && 'IntersectionObserver' in window && !reduce) {
		const nums = $$('[data-count]', stats);
		const so = new IntersectionObserver(entries => {
			if (!entries[0].isIntersecting) return;
			so.disconnect();
			const t0 = performance.now();
			(function tick(now) {
				const q = 1 - Math.pow(1 - ramp(now - t0, 0, 1300), 3);
				nums.forEach(n => { n.textContent = Math.round(+n.dataset.count * q); });
				if (q < 1) requestAnimationFrame(tick);
			})(t0);
		}, { threshold: 0.4 });
		so.observe(stats);
	}

	/* ------------------------------------------------------- video modal */

	const modal = $('.modal'), modalVideo = modal && $('video', modal);
	function openModal() {
		if (!modal) return;
		if (!modalVideo.getAttribute('src')) modalVideo.setAttribute('src', modalVideo.dataset.src);
		modal.hidden = false;
		root.classList.add('modal-open');
		if (lenis) lenis.stop();
		const p = modalVideo.play();
		if (p && p.catch) p.catch(() => {});
	}
	function closeModal() {
		modalVideo.pause();
		modal.hidden = true;
		root.classList.remove('modal-open');
		if (lenis) lenis.start();
	}
	if (modal) {
		$$('[data-modal]').forEach(b => b.addEventListener('click', openModal));
		modal.addEventListener('click', ev => { if (ev.target === modal || ev.target.closest('.modal-x')) closeModal(); });
		window.addEventListener('keydown', ev => { if (ev.key === 'Escape' && !modal.hidden) closeModal(); });
	}

	/* ------------------------------------- city skylines behind the phone */

	function buildSky(slot) {
		if (!CITIES || !slot) return null;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const sky = document.createElement('div'), strip = document.createElement('div'), label = document.createElement('p');
		sky.className = 'sky'; strip.className = 'sky-strip'; label.className = 'sky-label';
		sky.setAttribute('aria-hidden', 'true'); label.setAttribute('aria-hidden', 'true');
		label.innerHTML = '<b></b><span></span>';
		const paint = (cv, w, h, draw) => {
			cv.width = w * dpr; cv.height = h * dpr;
			const x = cv.getContext('2d'); x.scale(dpr, dpr); draw(x);
		};
		CITIES.list.forEach(c => {
			const box = document.createElement('div'), art = document.createElement('div'), cv = document.createElement('canvas');
			box.className = 'city'; art.className = 'city-art';
			paint(cv, CITIES.W, CITIES.H, c.draw);
			art.appendChild(cv);
			(c.sprites || []).forEach(sprite => {
				const sp = document.createElement('canvas');
				sp.className = 'veh ' + sprite.cls;
				paint(sp, sprite.w, sprite.h, sprite.draw);
				sp.style.width = (sprite.w / CITIES.W * 100) + '%';
				sp.style.bottom = ((CITIES.H - sprite.y) / CITIES.H * 100) + '%';
				art.appendChild(sp);
			});
			box.appendChild(art); strip.appendChild(box);
		});
		sky.appendChild(strip); slot.appendChild(sky); slot.appendChild(label);
		let shown = null;
		return { set(id) {
			if (id === shown) return;
			shown = id;
			const i = Math.max(0, CITIES.list.findIndex(c => c.id === id)), c = CITIES.list[i];
			strip.style.setProperty('--c', i);
			label.firstChild.textContent = c.name; label.lastChild.textContent = c.at;
			label.classList.remove('pop'); void label.offsetWidth; label.classList.add('pop');
		} };
	}

	/* ------------------------------------------- steps (timeline, projects) */

	const groups = $$('[data-steps]').map(list => {
		const slot = $('.slot', list.parentElement), steps = $$('.step', list);
		return { list, steps, slot, fill: $('.rail i', list), cur: -1, sky: steps.some(s => s.dataset.city) ? buildSky(slot) : null };
	});
	groups.forEach(g => { if (g.sky) g.sky.set(g.steps[0].dataset.city); });

	function updateSteps() {
		const vh = window.innerHeight, line = vh * (narrow.matches ? 0.8 : 0.5);
		groups.forEach(g => {
			const r = g.list.getBoundingClientRect();
			if (r.bottom < 0 || r.top > vh) return;
			let best = 0, bd = Infinity;
			g.steps.forEach((s, i) => {
				const b = s.getBoundingClientRect(), d = Math.abs((b.top + b.bottom) / 2 - line);
				if (d < bd) { bd = d; best = i; }
			});
			if (best !== g.cur) {
				g.cur = best;
				g.steps.forEach((s, i) => s.classList.toggle('on', i === best));
				if (g.sky) g.sky.set(g.steps[best].dataset.city);
			}
			if (g.fill) g.fill.style.transform = 'scaleY(' + clamp((line - r.top) / r.height).toFixed(4) + ')';
		});
	}

	function screenFor(slot) {
		const g = groups.find(x => x.slot === slot);
		return g ? g.steps[Math.max(0, g.cur)].dataset.screen : slot.dataset.screen;
	}

	/* ------------------------------------------------- tech stack layers */

	const layersEl = $('.layers'), layerItems = $$('.layers > li');
	let layerCur = -2, layerHover = -1, stackP = 0, hasPin = false;

	function setLayer(i) {
		if (i === layerCur) return;
		layerCur = i;
		layersEl.classList.toggle('focus', i >= 0);
		layerItems.forEach((li, j) => li.classList.toggle('on', j === i));
	}
	if (fine) {
		layerItems.forEach((li, i) => {
			li.addEventListener('pointerenter', () => { layerHover = i; });
			li.addEventListener('pointerleave', () => { layerHover = -1; });
		});
	}

	// Explode amount (0..1) and layer in focus, from the pinned scroll progress.
	function stackState() {
		if (!hasPin) return { e: 1, layer: layerHover };
		return {
			e: smooth(ramp(stackP, 0.02, 0.15)),
			layer: layerHover >= 0 ? layerHover : Math.min(4, Math.floor(ramp(stackP, 0.1, 0.97) * 5))
		};
	}

	/* --------------------------------------------------------------- GSAP */

	if (window.gsap && window.ScrollTrigger) {
		gsap.registerPlugin(ScrollTrigger);
		ScrollTrigger.config({ ignoreMobileResize: true });
		const mm = gsap.matchMedia();

		// Work: on wide screens the cards travel sideways while the section is pinned.
		mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
			const pin = $('.work-pin'), track = $('.track');
			if (!pin || !track) return undefined;
			pin.classList.add('pinned');
			const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
			gsap.to(track, {
				x: () => -dist(),
				ease: 'none',
				scrollTrigger: { trigger: pin, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true }
			});
			return () => pin.classList.remove('pinned');
		});

		mm.add('(prefers-reduced-motion: no-preference)', () => {
			hasPin = true;
			ScrollTrigger.create({
				trigger: '.stack-pin', start: 'top top', end: '+=230%', pin: true,
				onUpdate: self => { stackP = self.progress; }
			});
			// The closing name rises letter by letter as it scrolls into view.
			gsap.from('.mega i', {
				yPercent: 110, opacity: 0, stagger: 0.035, ease: 'power3.out',
				// ends when the whole name is on screen: a point every window size can reach, so no letter stays hidden
				scrollTrigger: { trigger: '.mega', start: 'top 96%', end: 'bottom bottom', scrub: 0.5 }
			});
			return () => { hasPin = false; setLayer(-1); };
		});

		window.addEventListener('load', () => ScrollTrigger.refresh());
	}

	/* -------------------------------------------------------------- WebGL */

	const gl = initGL();

	function initGL() {
		if (!window.THREE || !UI) return null;
		const canvas = $('#gl');
		let renderer;
		try {
			renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
		} catch (err) { return null; }
		root.classList.add('gl');
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
		renderer.setClearColor(0x000000, 0);

		const FOV = 30, DIST = 9, VIEW_H = 2 * DIST * Math.tan(FOV * Math.PI / 360);
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);
		camera.position.z = DIST;

		scene.add(new THREE.AmbientLight(0xffffff, 0.6));
		const key = new THREE.DirectionalLight(0xffffff, 0.9); key.position.set(-2, 3, 5); scene.add(key);
		const lt = new THREE.PointLight(0x2dd4a7, 1.5, 24); lt.position.set(-3.2, 1.6, 2.6); scene.add(lt);
		const lv = new THREE.PointLight(0x8b5cf6, 1.7, 24); lv.position.set(3.2, -1.6, 2.2); scene.add(lv);
		const lb = new THREE.PointLight(0x4aa8ff, 1.2, 24); lb.position.set(0, 0.5, -4); scene.add(lb);

		/* --- geometry helpers --- */
		const PW = 0.923, PH = 2, R = 0.135, BODY_D = 0.07, GAP = 0.3, N = 5;
		const ZB = -(BODY_D + 0.012); // z of the back face

		function roundedShape(w, h, r) {
			const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
			s.moveTo(x + r, y);
			s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
			s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
			s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
			s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
			return s;
		}
		// UVs stretched over the plate's bounding box, so a texture fills its face.
		function fitUV(geo, w, h) {
			const p = geo.attributes.position, uv = geo.attributes.uv;
			for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, (p.getY(i) + h / 2) / h);
			return geo;
		}
		const flat = (w, h, r) => fitUV(new THREE.ShapeGeometry(roundedShape(w, h, r), 18), w, h);
		function texOf(cv) {
			const tex = new THREE.CanvasTexture(cv);
			tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false;
			if (renderer.capabilities.getMaxAnisotropy) tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
			return tex;
		}
		function canvasOf(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
		// White with a soft alpha, computed byte by byte and not painted as a canvas gradient: Safari on iPhone adds
		// noise to canvas gradients, and on the way into WebGL that noise came out as blue, green and black specks.
		// alphaAt(u, v) gets 0..1 from the left and from the top.
		function softTex(w, h, alphaAt) {
			const data = new Uint8Array(w * h * 4);
			for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
				const i = (y * w + x) * 4;
				data[i] = data[i + 1] = data[i + 2] = 255;
				data[i + 3] = Math.round(255 * clamp(alphaAt((x + 0.5) / w, 1 - (y + 0.5) / h)));
			}
			const tex = new THREE.DataTexture(data, w, h, THREE.RGBAFormat);
			tex.magFilter = tex.minFilter = THREE.LinearFilter; tex.needsUpdate = true;
			return tex;
		}
		// alpha a0 at 0, a1 at t = mid, nothing at 1: the two-step fade both soft textures use
		const fade = (t, a0, mid, a1) => t < mid ? a0 + (a1 - a0) * t / mid : a1 * (1 - (t - mid) / (1 - mid));

		/* --- the phone display: one canvas, fed by the app screens --- */
		const DW = 720, DH = 1560, DS = DW / UI.W;
		const disp = canvasOf(DW, DH), dctx = disp.getContext('2d'), dispTex = texOf(disp);
		const liveKit = UI.kit(dctx);
		const states = {}, cache = {};
		let curE = null, trans = null, ripple = null, dirty = true, assetDirty = false;
		let wantApp = null, flip = null, lastTouch = 0, lastAuto = 0, hintClock = 0, lastUse = 0, lastOver = 0, face = 0, hintFor = null;
		const lean = { x: 0, y: 0 };

		function entry(appId, name) {
			const keyName = appId + '/' + name;
			let en = cache[keyName];
			if (!en) {
				const cv = canvasOf(DW, DH), c = cv.getContext('2d');
				c.scale(DS, DS);
				const st = states[appId] || (states[appId] = {});
				const out = UI.render(appId, name, c, st, isEn());
				en = cache[keyName] = { cv, hots: out.hots, live: out.live, app: appId, name };
			}
			return en;
		}
		function dropApp(appId) {
			Object.keys(cache).forEach(kn => { if (!appId || kn.indexOf(appId + '/') === 0) delete cache[kn]; });
		}
		function invalidate() {
			dropApp(null);
			trans = null;
			if (curE) { curE = entry(curE.app, curE.name); dirty = true; }
		}
		UI.onAsset(() => { assetDirty = true; });
		if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { assetDirty = true; });
		new MutationObserver(() => { assetDirty = true; }).observe(root, { attributes: true, attributeFilter: ['data-lang'] });

		function show(appId, name, kind) {
			const to = entry(appId, name || UI.apps[appId].start);
			lastAuto = performance.now();
			if (!curE || kind === 'cut' || reduce) { curE = to; trans = null; dirty = true; return; }
			if (to === curE) return;
			trans = { from: curE, to, t: 0, dir: kind === 'pop' ? -1 : 1 };
			curE = to;
		}
		// A new app arrives with a full turn of the phone; the screen swaps while its back is showing.
		function setApp(id, calm) {
			if (!UI.apps[id] || id === wantApp) return;
			wantApp = id;
			lastTouch = performance.now() - 2000;
			if (!curE || reduce || calm) { show(id, null, 'cut'); return; }
			if (!flip) flip = { t: 0, done: false };
		}
		function hotAt(x, y) {
			if (!curE || trans) return null;
			for (let i = curE.hots.length - 1; i >= 0; i--) {
				const h = curE.hots[i];
				if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) return h;
			}
			return null;
		}
		function act(a) {
			const st = states[curE.app] || (states[curE.app] = {});
			if (a.set) { Object.assign(st, a.set); dropApp(curE.app); }
			if (a.toggle) { st[a.toggle] = !st[a.toggle]; st.t0 = performance.now(); }
			if (a.stamp) st.t0 = performance.now();
			if (a.go) show(curE.app, a.go, a.back ? 'pop' : 'push');
			else if (a.set) { curE = entry(curE.app, curE.name); dirty = true; }
			if (a.url) openUrl(a.url);
			if (a.scroll) scrollToEl($(a.scroll));
			if (a.modal) openModal();
		}
		function tap(x, y) {
			lastTouch = performance.now();
			ripple = { x, y, t: 0 };
			const h = hotAt(x, y);
			if (h && !h.act.hold && !h.act.slide) act(h.act);
		}
		// A slider on the screen: the finger position along it, 0..1, goes into the app state. The screen's
		// live painter reads it back, so the knob follows the finger without redrawing the whole screen.
		function slideTo(sl, x) {
			const st = states[curE.app] || (states[curE.app] = {});
			st[sl.key] = clamp((x - sl.x0) / (sl.x1 - sl.x0));
			lastTouch = lastUse = performance.now();
		}
		// Green beacons mark the spots that can be tapped on the current screen.
		function beacons(t) {
			const hs = curE.hots, app = UI.apps[curE.app];
			if (!hs.length || app.hints === false) return;
			const ph = (t * 0.85) % 1, max = hs.length > 5 ? 3 : 5;
			for (let i = 0; i < hs.length && i < max; i++) {
				const h = hs[i], big = h.w * h.h > UI.W * UI.H * 0.45;
				const cx = (big ? UI.W / 2 : (h.w > 170 ? h.x + h.w - 32 : h.x + h.w / 2)) * DS;
				const cy = (big ? (h.y + h.h > UI.H - 40 ? UI.H - 112 : h.y + h.h / 2) : (h.h > 150 ? h.y + 36 : h.y + h.h / 2)) * DS;
				dctx.beginPath(); dctx.arc(cx, cy, (12 + ph * 30) * DS, 0, 6.2832);
				dctx.strokeStyle = 'rgba(45,212,167,' + (0.95 * (1 - ph)).toFixed(3) + ')'; dctx.lineWidth = 4 * DS; dctx.stroke();
				dctx.beginPath(); dctx.arc(cx, cy, 9 * DS, 0, 6.2832);
				dctx.fillStyle = '#2dd4a7'; dctx.fill();
				dctx.strokeStyle = '#ffffff'; dctx.lineWidth = 3 * DS; dctx.stroke();
			}
		}
		function compose(dt, env) {
			if (!curE) return;
			if (trans) trans.t = Math.min(1, trans.t + dt / 0.36);
			// screens with tappable spots are repainted about 20 times a second, for the beacons
			hintClock += dt;
			const hinting = curE.hots.length > 0 && UI.apps[curE.app].hints !== false && hintClock > 0.05;
			if (hinting) hintClock = 0;
			if (!(dirty || trans || curE.live || ripple || hinting)) return;
			dctx.setTransform(1, 0, 0, 1, 0, 0);
			if (trans) {
				const q = 1 - Math.pow(1 - trans.t, 3);
				dctx.drawImage(trans.from.cv, -trans.dir * q * DW * 0.3, 0);
				dctx.fillStyle = 'rgba(0,0,0,' + (0.4 * q).toFixed(3) + ')'; dctx.fillRect(0, 0, DW, DH);
				dctx.drawImage(trans.to.cv, trans.dir * (1 - q) * DW, 0);
				if (trans.t >= 1) trans = null;
			} else {
				dctx.drawImage(curE.cv, 0, 0);
				if (curE.live) {
					env.state = states[curE.app] || {};
					liveKit.en = isEn();
					dctx.save(); dctx.scale(DS, DS); curE.live(liveKit, env); dctx.restore();
				}
				beacons(env.t);
			}
			if (ripple) {
				ripple.t += dt / 0.5;
				const q = Math.min(1, ripple.t);
				dctx.beginPath(); dctx.arc(ripple.x * DS, ripple.y * DS, (24 + q * 150) * DS, 0, 6.2832);
				dctx.fillStyle = 'rgba(255,255,255,' + (0.3 * (1 - q)).toFixed(3) + ')'; dctx.fill();
				dctx.strokeStyle = 'rgba(0,0,0,' + (0.12 * (1 - q)).toFixed(3) + ')'; dctx.lineWidth = 3; dctx.stroke();
				if (ripple.t >= 1) ripple = null;
			}
			dispTex.needsUpdate = true;
			dirty = false;
		}

		/* --- layer plates: one drawing per architecture layer --- */
		const SW = 540, SH = 1170, MONO = '"JetBrains Mono", ui-monospace, monospace', SANS = '"Roboto Flex", system-ui, sans-serif';
		function rr(x, X, Y, W2, H2, r) {
			x.beginPath();
			x.moveTo(X + r, Y); x.lineTo(X + W2 - r, Y); x.quadraticCurveTo(X + W2, Y, X + W2, Y + r);
			x.lineTo(X + W2, Y + H2 - r); x.quadraticCurveTo(X + W2, Y + H2, X + W2 - r, Y + H2);
			x.lineTo(X + r, Y + H2); x.quadraticCurveTo(X, Y + H2, X, Y + H2 - r);
			x.lineTo(X, Y + r); x.quadraticCurveTo(X, Y, X + r, Y); x.closePath();
		}
		const LAYERS = [
			{ name: 'UI', col: '#2dd4a7' }, { name: 'STATE', col: '#35c2d6' }, { name: 'DOMAIN', col: '#4aa8ff' },
			{ name: 'DATA', col: '#6b82fa' }, { name: 'PLATFORM', col: '#8b5cf6' }
		];
		const ART = [
			x => { // interface wireframe
				rr(x, 50, 150, 440, 76, 20); x.stroke();
				rr(x, 50, 262, 440, 250, 26); x.stroke();
				rr(x, 50, 548, 208, 208, 26); x.stroke(); rr(x, 282, 548, 208, 208, 26); x.stroke();
				[806, 862, 918].forEach((y, i) => { x.beginPath(); x.moveTo(50, y); x.lineTo(i === 2 ? 300 : 490, y); x.stroke(); });
				x.beginPath(); x.arc(432, 1020, 48, 0, Math.PI * 2); x.fill();
			},
			x => { // state machine
				x.beginPath(); x.moveTo(270, 330); x.lineTo(130, 640); x.lineTo(410, 640); x.closePath(); x.stroke();
				[[270, 330], [130, 640], [410, 640]].forEach(p => { x.beginPath(); x.arc(p[0], p[1], 62, 0, Math.PI * 2); x.fill(); });
				x.beginPath(); x.moveTo(270, 702); x.lineTo(270, 880); x.stroke();
				rr(x, 150, 880, 240, 96, 28); x.stroke();
			},
			x => { // clean architecture rings
				[230, 158, 86].forEach(r => { x.beginPath(); x.arc(270, 610, r, 0, Math.PI * 2); x.stroke(); });
				x.beginPath(); x.arc(270, 610, 30, 0, Math.PI * 2); x.fill();
				x.beginPath(); x.moveTo(270, 300); x.lineTo(270, 380); x.moveTo(270, 840); x.lineTo(270, 920); x.stroke();
			},
			x => { // database and sync
				const cyl = (cx, cy) => {
					x.beginPath(); x.ellipse(cx, cy, 120, 38, 0, 0, Math.PI * 2); x.stroke();
					x.beginPath(); x.moveTo(cx - 120, cy); x.lineTo(cx - 120, cy + 150); x.ellipse(cx, cy + 150, 120, 38, 0, Math.PI, 0, true); x.lineTo(cx + 120, cy); x.stroke();
					x.beginPath(); x.ellipse(cx, cy + 75, 120, 38, 0, 0, Math.PI); x.stroke();
				};
				cyl(270, 300);
				x.beginPath(); x.moveTo(210, 560); x.lineTo(210, 760); x.moveTo(184, 596); x.lineTo(210, 560); x.lineTo(236, 596);
				x.moveTo(330, 560); x.lineTo(330, 760); x.moveTo(304, 724); x.lineTo(330, 760); x.lineTo(356, 724); x.stroke();
				cyl(270, 820);
			},
			x => { // the device itself: chip, sensors and a native bridge
				rr(x, 150, 430, 240, 240, 30); x.stroke();
				rr(x, 212, 492, 116, 116, 18); x.fill();
				for (let i = 0; i < 4; i++) {
					const o = 186 + i * 56;
					x.beginPath();
					x.moveTo(o, 430); x.lineTo(o, 370); x.moveTo(o, 670); x.lineTo(o, 730);
					x.moveTo(150, o + 280); x.lineTo(90, o + 280); x.moveTo(390, o + 280); x.lineTo(450, o + 280);
					x.stroke();
				}
				[[150, 250], [270, 250], [390, 250]].forEach(p => { x.beginPath(); x.arc(p[0], p[1], 30, 0, Math.PI * 2); x.stroke(); });
				x.beginPath(); x.arc(270, 250, 12, 0, Math.PI * 2); x.fill();
				x.beginPath(); x.moveTo(110, 860); x.lineTo(430, 860); x.moveTo(110, 930); x.lineTo(330, 930); x.stroke();
			}
		];
		function layerTex(i) {
			const cv = canvasOf(SW, SH), x = cv.getContext('2d'), col = LAYERS[i].col;
			x.fillStyle = 'rgba(9,14,28,0.94)'; x.fillRect(0, 0, SW, SH);
			const g = x.createLinearGradient(0, 0, SW, SH);
			g.addColorStop(0, col + '55'); g.addColorStop(1, col + '0d');
			x.fillStyle = g; x.fillRect(0, 0, SW, SH);
			x.strokeStyle = col; x.lineWidth = 10; rr(x, 9, 9, SW - 18, SH - 18, 62); x.stroke();
			x.fillStyle = col; x.font = '700 36px ' + MONO; x.textAlign = 'left';
			x.fillText('0' + (i + 1) + '  ' + LAYERS[i].name, 52, 104);
			x.lineWidth = 6; x.lineCap = 'round'; x.lineJoin = 'round';
			ART[i](x);
			return texOf(cv);
		}

		/* --- the phone --- */
		const rig = new THREE.Group(), phone = new THREE.Group(), stackG = new THREE.Group(), screenG = new THREE.Group();
		scene.add(rig); rig.add(phone); phone.add(stackG); stackG.add(screenG);

		const bodyMat = new THREE.MeshStandardMaterial({ color: 0x141c30, metalness: 0.55, roughness: 0.32 });
		const body = new THREE.Mesh(
			new THREE.ExtrudeGeometry(roundedShape(PW, PH, R), { depth: BODY_D, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 4, curveSegments: 18 }),
			bodyMat
		);
		body.position.z = ZB;
		stackG.add(body);
		const btnMat = new THREE.MeshStandardMaterial({ color: 0x1b2540, metalness: 0.6, roughness: 0.35 });
		[[0.36, 0.2], [0.08, 0.12]].forEach(b => {
			const m = new THREE.Mesh(new THREE.BoxGeometry(0.014, b[1], 0.03), btnMat);
			m.position.set(PW / 2 + 0.014, b[0], -BODY_D / 2); stackG.add(m);
		});

		// back: a printed plate and a camera island, seen when the phone turns
		const backCv = canvasOf(SW, SH);
		(function () {
			const x = backCv.getContext('2d'), g = x.createLinearGradient(0, 0, SW, SH);
			g.addColorStop(0, '#182238'); g.addColorStop(0.5, '#0e1526'); g.addColorStop(1, '#151033');
			x.fillStyle = g; x.fillRect(0, 0, SW, SH);
			const s = x.createLinearGradient(0, 0, SW, SH * 0.7);
			s.addColorStop(0, 'rgba(255,255,255,.09)'); s.addColorStop(0.4, 'rgba(255,255,255,0)');
			x.fillStyle = s; x.fillRect(0, 0, SW, SH);
			const a = x.createLinearGradient(170, 0, 370, 0);
			a.addColorStop(0, '#2dd4a7'); a.addColorStop(0.55, '#4aa8ff'); a.addColorStop(1, '#8b5cf6');
			x.fillStyle = a; x.textAlign = 'center'; x.font = '800 150px ' + SANS; x.fillText('SM', SW / 2, 700);
			x.fillStyle = 'rgba(238,242,249,.6)'; x.font = '500 21px ' + MONO;
			x.fillText('Salvatore Matrisciano', SW / 2, 770);
			x.fillStyle = 'rgba(238,242,249,.34)'; x.font = '500 17px ' + MONO;
			x.fillText('Bologna  →  London  →  Milano', SW / 2, 1070);
		})();
		const backTex = texOf(backCv);
		const back = new THREE.Mesh(flat(PW * 0.985, PH * 0.992, R), new THREE.MeshBasicMaterial({ map: backTex }));
		back.rotation.y = Math.PI; back.position.z = ZB - 0.0125;
		stackG.add(back);
		const island = new THREE.Mesh(
			new THREE.ExtrudeGeometry(roundedShape(0.36, 0.38, 0.09), { depth: 0.022, bevelEnabled: false, curveSegments: 14 }),
			new THREE.MeshStandardMaterial({ color: 0x0c1322, metalness: 0.7, roughness: 0.28 })
		);
		island.position.set(0.2, 0.66, ZB - 0.036); stackG.add(island);
		const lensMat = new THREE.MeshStandardMaterial({ color: 0x05080f, metalness: 0.9, roughness: 0.15 });
		const glassMat = new THREE.MeshBasicMaterial({ color: 0x21406f });
		[[0.12, 0.74], [0.28, 0.74], [0.12, 0.58]].forEach(p => {
			const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.024, 28), lensMat);
			ring.rotation.x = Math.PI / 2; ring.position.set(p[0], p[1], ZB - 0.046); stackG.add(ring);
			const glass = new THREE.Mesh(new THREE.CircleGeometry(0.04, 24), glassMat);
			glass.rotation.y = Math.PI; glass.position.set(p[0], p[1], ZB - 0.0585); stackG.add(glass);
		});
		const flash = new THREE.Mesh(new THREE.CircleGeometry(0.026, 20), new THREE.MeshBasicMaterial({ color: 0xfff1c9 }));
		flash.rotation.y = Math.PI; flash.position.set(0.28, 0.58, ZB - 0.0365); stackG.add(flash);

		const SCW = PW - 0.07, SCH = PH - 0.07, SCR = R - 0.03;
		const bezel = new THREE.Mesh(flat(PW, PH, R), new THREE.MeshBasicMaterial({ color: 0x070b14 }));
		bezel.position.z = 0.001; screenG.add(bezel);
		const scr = new THREE.Mesh(flat(SCW, SCH, SCR), new THREE.MeshBasicMaterial({ map: dispTex }));
		scr.position.z = 0.003; screenG.add(scr);

		// a diagonal reflection, strongest in the top left corner
		const sheenTex = softTex(64, 128, (u, v) => fade(0.2 * u + 0.8 * v, 0.18, 0.38, 0.02));
		const sheen = new THREE.Mesh(flat(SCW, SCH, SCR), new THREE.MeshBasicMaterial({ map: sheenTex, transparent: true, depthWrite: false }));
		sheen.position.z = 0.006; sheen.renderOrder = 21; screenG.add(sheen);
		const hole = new THREE.Mesh(new THREE.CircleGeometry(0.022, 24), new THREE.MeshBasicMaterial({ color: 0x05070d }));
		hole.position.set(0, SCH / 2 - 0.075, 0.0075); hole.renderOrder = 22; screenG.add(hole);

		const LW = PW * 0.95, LH = PH * 0.965;
		const layers = LAYERS.map((L, i) => {
			const geo = fitUV(new THREE.ExtrudeGeometry(roundedShape(LW, LH, R * 0.92), { depth: 0.018, bevelEnabled: false, curveSegments: 18 }), LW, LH);
			const cap = new THREE.MeshBasicMaterial({ map: layerTex(i), transparent: true, opacity: 0 });
			const side = new THREE.MeshBasicMaterial({ color: new THREE.Color(L.col), transparent: true, opacity: 0 });
			const mesh = new THREE.Mesh(geo, [cap, side]);
			mesh.visible = false; mesh.renderOrder = N - i;
			stackG.add(mesh);
			return { mesh, cap, side, t: 0 };
		});

		const glowTex = softTex(128, 128, (u, v) => { const r = 2 * Math.hypot(u - 0.5, v - 0.5); return r < 1 ? fade(r, 0.75, 0.45, 0.22) : 0; });
		const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x2dd4a7, transparent: true, opacity: 0.5, depthWrite: false }));
		glow.scale.set(4.2, 4.2, 1); glow.position.z = -1.2; glow.renderOrder = -5;
		rig.add(glow);

		/* --- the toy car driven by the remote-control app --- */
		const car = new THREE.Group(); car.visible = false; scene.add(car);
		(function () {
			const blue = new THREE.MeshStandardMaterial({ color: 0x2f7de1, metalness: 0.3, roughness: 0.4 });
			const glass = new THREE.MeshStandardMaterial({ color: 0xa9d6ff, metalness: 0.2, roughness: 0.15 });
			const dark = new THREE.MeshStandardMaterial({ color: 0x0b0f17, roughness: 0.7 });
			const add = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); car.add(m); return m; };
			add(new THREE.BoxGeometry(0.42, 0.2, 0.07), blue, 0, 0, 0.055);
			add(new THREE.BoxGeometry(0.2, 0.165, 0.065), glass, -0.025, 0, 0.12);
			[[0.135, 0.108], [0.135, -0.108], [-0.135, 0.108], [-0.135, -0.108]].forEach(p => add(new THREE.BoxGeometry(0.1, 0.04, 0.08), dark, p[0], p[1], 0.04));
			[0.062, -0.062].forEach(y => {
				add(new THREE.BoxGeometry(0.02, 0.045, 0.03), new THREE.MeshBasicMaterial({ color: 0xffe082 }), 0.212, y, 0.06);
				add(new THREE.BoxGeometry(0.02, 0.045, 0.03), new THREE.MeshBasicMaterial({ color: 0xff5252 }), -0.212, y, 0.06);
			});
			const shadow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x000000, transparent: true, opacity: 0.55, depthWrite: false }));
			shadow.scale.set(0.9, 0.62, 1); shadow.position.z = -0.03; car.add(shadow);
			const beam = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffe9a8, transparent: true, opacity: 0.4, depthWrite: false }));
			beam.scale.set(0.7, 0.5, 1); beam.position.set(0.5, 0, 0.02); car.add(beam);
		})();
		const pressed = { up: false, down: false, left: false, right: false };
		const drive = { v: 0, heading: 0.5, x: 0, y: 0, on: 0, placed: false, manual: 0, pressed };

		/* --- the talk video shown on the phone --- */
		const video = document.createElement('video');
		video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'none';
		video.setAttribute('playsinline', ''); video.setAttribute('muted', '');
		video.src = 'videos/about/devfest-preview.mp4';

		/* --- state --- */
		const slots = $$('.slot');
		const KEYS = ['x', 'y', 's', 'rx', 'ry', 'rz'];
		const pose = { x: 0, y: 0, s: 0.001, rx: 0, ry: 0, rz: 0 };
		let from = null, off = null, tr = 1, dur = 0.95, cur = null, started = false;
		let e = 0, W = 0, H = 0;
		const glowTo = new THREE.Color(0x2dd4a7);
		const ptr = { x: 0, y: 0, tx: 0, ty: 0, cx: -1, cy: -1 };
		const spin = { x: 0, y: 0 };
		const env = { t: 0, now: 0, rot: 0, state: {}, car: drive, video };
		let vel = 0, lastY = window.scrollY, down = null, dragging = false, swallow = 0;

		/* --- input: tap the screen, hold a control, drag to spin --- */
		const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
		function hit(cx, cy) {
			if (!W || !cur) return null;
			ndc.set(cx / W * 2 - 1, -(cy / H) * 2 + 1);
			ray.setFromCamera(ndc, camera);
			const s = e < 0.05 ? ray.intersectObject(scr, false)[0] : null;
			if (s && s.uv) return { screen: true, x: s.uv.x * UI.W, y: (1 - s.uv.y) * UI.H };
			return ray.intersectObject(body, false).length ? { screen: false } : null;
		}
		window.addEventListener('pointermove', ev => {
			if (ev.pointerType === 'mouse') {
				ptr.tx = ev.clientX / window.innerWidth * 2 - 1;
				ptr.ty = ev.clientY / window.innerHeight * 2 - 1;
				ptr.cx = ev.clientX; ptr.cy = ev.clientY;
			}
			if (!down || ev.pointerId !== down.id) return;
			if (down.slide) { const at = hit(ev.clientX, ev.clientY); if (at && at.screen) slideTo(down.slide, at.x); return; }
			const dx = ev.clientX - down.lx, dy = ev.clientY - down.ly;
			down.lx = ev.clientX; down.ly = ev.clientY;
			down.moved = Math.max(down.moved, Math.hypot(ev.clientX - down.x, ev.clientY - down.y));
			if (dragging && down.moved > 6) {
				// a finger that scrolls the page must not tilt the phone: on touch only a clearly sideways drag spins it
				const touch = ev.pointerType === 'touch';
				if (!touch || Math.abs(ev.clientX - down.x) > Math.abs(ev.clientY - down.y) * 1.3) spin.y += dx * 0.011;
				if (!touch) spin.x = clamp(spin.x + dy * 0.006, -0.5, 0.5);
				root.classList.add('grabbing');
			}
		}, { passive: true });
		window.addEventListener('pointerdown', ev => {
			if (ev.button || (modal && !modal.hidden)) return;
			const h = hit(ev.clientX, ev.clientY);
			if (!h) { down = null; return; }
			down = { x: ev.clientX, y: ev.clientY, lx: ev.clientX, ly: ev.clientY, t: performance.now(), h, moved: 0, id: ev.pointerId, hold: null };
			lastTouch = lastUse = down.t;
			const hs = h.screen ? hotAt(h.x, h.y) : null;
			if (hs && hs.act.hold) { down.hold = hs.act.hold; pressed[down.hold] = true; ripple = { x: h.x, y: h.y, t: 0 }; }
			if (hs && hs.act.slide) { down.slide = hs.act.slide; slideTo(down.slide, h.x); }
			dragging = !down.hold && !down.slide;
		}, { passive: true });
		function release(ev, cancelled) {
			if (!down || (ev && ev.pointerId !== down.id)) return;
			const d = down;
			down = null; dragging = false;
			root.classList.remove('grabbing');
			if (d.hold) { pressed[d.hold] = false; swallow = performance.now(); return; }
			if (d.slide) { swallow = performance.now(); return; }
			if (cancelled || d.moved >= 8) { if (d.moved >= 8) swallow = performance.now(); return; }
			if (d.h.screen && performance.now() - d.t < 700) { swallow = performance.now(); tap(d.h.x, d.h.y); }
		}
		window.addEventListener('pointerup', ev => release(ev, false), { passive: true });
		window.addEventListener('pointercancel', ev => release(ev, true), { passive: true });
		// A tap on the phone must not also click whatever lies under the canvas.
		window.addEventListener('click', ev => {
			// Only real clicks: the links the phone opens by itself (ev.isTrusted false) must go through.
			if (ev.isTrusted && performance.now() - swallow < 450) { ev.preventDefault(); ev.stopPropagation(); }
		}, true);

		function resize() {
			const w = canvas.clientWidth, h = canvas.clientHeight;
			if (!w || !h || (w === W && h === H)) return;
			W = w; H = h;
			renderer.setSize(w, h, false);
			camera.aspect = w / h; camera.updateProjectionMatrix();
		}
		function vis(el) {
			const r = el.getBoundingClientRect();
			if (!r.height) return 0;
			return Math.max(0, Math.min(r.bottom, H) - Math.max(r.top, 0)) / Math.min(r.height, H);
		}
		function slotPose(el) {
			const r = el.getBoundingClientRect(), k = VIEW_H / H;
			// The phone leaves air around itself: the skyline behind it and the hint next to it stay in view.
			// On narrow screens the hint sits under the phone, so the phone is also lifted a little.
			const small = narrow.matches, fit = small ? 0.72 : 0.75;
			const hpx = Math.min(r.height * fit, r.width * fit * PH / PW);
			const lift = small && el.querySelector('.tap') ? r.height * 0.03 : 0;
			return {
				x: (r.left + r.width / 2 - W / 2) * k, y: -(r.top + r.height / 2 - lift - H / 2) * k, s: hpx * k / PH,
				rx: rad(el.dataset.rx), ry: rad(el.dataset.ry), rz: rad(el.dataset.rz)
			};
		}

		function update(dt, t) {
			resize();
			if (!W) return;
			const now = performance.now();
			if (assetDirty) { assetDirty = false; invalidate(); }

			// Which placeholder should hold the phone right now.
			let best = null, bv = 0;
			slots.forEach(el => { const v = vis(el); if (v > bv) { bv = v; best = el; } });
			if (bv < 0.28) best = null;
			if (cur && best !== cur) { const cv = vis(cur); if (cv > 0.28 && cv > bv - 0.18) best = cur; }
			if (best !== cur) {
				from = Object.assign({}, pose);
				cur = best; tr = 0; dur = 0.95;
				if (cur) {
					if (cur.dataset.glow) glowTo.set(cur.dataset.glow);
					if (!started) {
						started = true; dur = 1.5;
						const p = slotPose(cur);
						from = { x: p.x + 1.4, y: p.y - 4.6, s: p.s * 0.7, rx: -0.5, ry: p.ry - 2.4, rz: 0.5 };
					}
				} else {
					off = { x: (W / 2 + 280) * (VIEW_H / H), y: pose.y, s: pose.s * 0.8, rx: 0.2, ry: pose.ry + 1.4, rz: 0.4 };
				}
				if (reduce) tr = 1;
			}
			const target = cur ? slotPose(cur) : off;
			if (target) {
				if (tr < 1) {
					tr = Math.min(1, tr + dt / dur);
					const q = ease(tr);
					KEYS.forEach(k => { pose[k] = mix(from[k], target[k], q); });
				} else {
					KEYS.forEach(k => { pose[k] = target[k]; });
				}
			}

			// The app on screen follows the step in view.
			const stacked = !!(cur && cur.hasAttribute('data-stack'));
			if (cur) setApp(screenFor(cur), stacked || e > 0.05);
			let turn = 0;
			if (flip) {
				flip.t = Math.min(1, flip.t + dt / 0.85);
				if (!flip.done && flip.t >= 0.5) { flip.done = true; show(wantApp, null, 'cut'); }
				turn = ease(flip.t) * Math.PI * 2;
				if (flip.t >= 1) flip = curE && curE.app !== wantApp ? { t: 0, done: false } : null;
			}
			if (curE && cur && !trans && !flip && !down) {
				const app = UI.apps[curE.app];
				// a page you opened yourself (not one of the screens that cycle) stays up longer before the tour resumes
				const rest = app.order.indexOf(curE.name) < 0 ? 16000 : 5200;
				if (app.auto !== false && app.order.length > 1 && now - lastTouch > rest && now - lastAuto > 3600) {
					show(curE.app, app.order[(app.order.indexOf(curE.name) + 1) % app.order.length], 'push');
				}
			}
			const wantVideo = !!(cur && curE && curE.app === 'devfest');
			if (wantVideo && video.paused) { const p = video.play(); if (p && p.catch) p.catch(() => {}); }
			else if (!wantVideo && !video.paused) video.pause();

			// Exploded view for the tech stack.
			const st = stacked ? stackState() : null;
			const eTo = st ? st.e : 0, active = st ? st.layer : -1;
			e += (eTo - e) * (1 - Math.exp(-dt * 8));
			if (Math.abs(eTo - e) < 0.002) e = eTo;
			const span = GAP * (N + 1) * e;
			stackG.position.z = -span / 2;
			screenG.position.z = span;
			layers.forEach((L, i) => {
				L.t += ((i === active ? 1 : 0) - L.t) * (1 - Math.exp(-dt * 9));
				L.mesh.visible = e > 0.01;
				L.mesh.position.z = GAP * (N - i) * e - 0.01;
				L.mesh.position.x = L.t * 0.22 * e;
				L.cap.opacity = e * mix(active < 0 ? 0.94 : 0.34, 1, L.t);
				L.side.opacity = L.cap.opacity;
			});

			// The toy car: driven by the pad, or circling on its own until you take over.
			const driving = !!(cur && curE && curE.app === 'rccar' && wantApp === 'rccar');
			drive.on += ((driving ? 1 : 0) - drive.on) * (1 - Math.exp(-dt * 6));
			if (!driving && drive.on < 0.02) drive.placed = false;
			car.visible = drive.on > 0.02;
			if (car.visible) {
				const k = VIEW_H / H;
				if (!drive.placed) { drive.placed = true; drive.x = pose.x - PW * pose.s * 0.9; drive.y = pose.y - PH * pose.s * 0.34; drive.heading = 0.6; drive.v = 0; }
				if (pressed.up || pressed.down || pressed.left || pressed.right) drive.manual = now;
				let th = (pressed.up ? 1 : 0) - (pressed.down ? 1 : 0), sv = (pressed.left ? 1 : 0) - (pressed.right ? 1 : 0);
				if (sv && !th) th = 0.6; // a side arrow alone also moves the car forward while it turns
				if (now - drive.manual > 3200 && !reduce) { th = 0.5; sv = 0.5 + Math.sin(t * 0.6) * 0.25; }
				const VMAX = 1.5;
				drive.v += (th * VMAX - drive.v) * (1 - Math.exp(-dt * 3));
				drive.heading += sv * 2.6 * dt * clamp(drive.v / VMAX * 1.5, -1, 1);
				drive.x += Math.cos(drive.heading) * drive.v * dt;
				drive.y += Math.sin(drive.heading) * drive.v * dt;
				const bw = W * k / 2 + 0.35, bh = H * k / 2 + 0.35;
				if (drive.x > bw) drive.x = -bw; else if (drive.x < -bw) drive.x = bw;
				if (drive.y > bh) drive.y = -bh; else if (drive.y < -bh) drive.y = bh;
				car.position.set(drive.x, drive.y, 0.5);
				car.rotation.z = drive.heading;
				car.scale.setScalar((narrow.matches ? 1.05 : 1.3) * drive.on);
			}

			// Idle float, pointer parallax, a tilt from scroll speed, and the spin you give it.
			const k1 = 1 - Math.exp(-dt * 5);
			ptr.x += (ptr.tx - ptr.x) * k1; ptr.y += (ptr.ty - ptr.y) * k1;
			const y = window.scrollY;
			vel += ((y - lastY) / Math.max(dt, 0.001) - vel) * (1 - Math.exp(-dt * 6)); lastY = y;
			if (!dragging) {
				// the spin you gave it dies out, faster when the phone has to face you
				spin.y = Math.atan2(Math.sin(spin.y), Math.cos(spin.y));
				spin.y -= spin.y * (1 - Math.exp(-dt * (3.2 + face * 7)));
				spin.x -= spin.x * (1 - Math.exp(-dt * (4 + face * 7)));
			}
			// The phone faces you, dead straight and still, whenever it sits in its place; it also does while
			// you point at it or have just used it. It only tilts on the way from one place to the next.
			// That goes for every screen, tappable or not, and for the tech-stack phone too: it stands straight
			// until it opens into its layers, and `calm` hands over to that view.
			const usable = !!(cur && curE);
			// (the full turn it makes when the app changes does not undo this: it spins and lands straight)
			const facing = down || (usable && tr >= 1) || now - lastOver < 900 || now - lastUse < 2800 ? 1 : 0;
			face += (facing - face) * (1 - Math.exp(-dt * 10));
			const calm = 1 - e, loose = 1 - face, idle = (reduce ? 0 : 1) * (1 - face * calm);
			let rx = pose.rx * loose + idle * Math.cos(t * 0.5) * 0.03 + ptr.y * 0.05 * calm * (1 - face) + clamp(vel * 0.00009, -0.2, 0.2) * calm * idle + spin.x * calm;
			let ry = pose.ry * loose + idle * Math.sin(t * 0.6) * 0.06 + ptr.x * 0.08 * calm * (1 - face) + (spin.y + turn) * calm;
			let rz = pose.rz * loose;
			// Away from the middle of the window the camera sees the phone a little from the side: when it
			// faces you it turns part of the way towards the camera, so no edge of the body shows.
			const turnIn = 0.4 * face * calm;
			ry += Math.atan2(-pose.x, DIST) * turnIn;
			rx += Math.atan2(pose.y, DIST) * turnIn;
			// Straight, but not dead: under the pointer it gives a little (about seven degrees at its edges), leaning
			// away from the spot you point at (as if pressed there). Where the pointer is, in half-phones
			// from the phone's centre, eased so it never jumps.
			const px = VIEW_H / H, hw = Math.max(1, pose.s * PW / 2 / px), hh = Math.max(1, pose.s * PH / 2 / px);
			const ox = (ptr.cx - (W / 2 + pose.x / px)) / hw, oy = (ptr.cy - (H / 2 - pose.y / px)) / hh;
			const over = fine && ptr.cx >= 0 && Math.abs(ox) < 1.5 && Math.abs(oy) < 1.25;
			const ease9 = 1 - Math.exp(-dt * 9);
			lean.x += ((over ? clamp(ox, -1, 1) : 0) - lean.x) * ease9;
			lean.y += ((over ? clamp(oy, -1, 1) : 0) - lean.y) * ease9;
			ry += lean.x * 0.12 * face * calm;
			rx += lean.y * 0.08 * face * calm;
			rx = mix(rx, -1.02 + ptr.y * 0.06, e);
			ry = mix(ry, idle * Math.sin(t * 0.4) * 0.05, e);
			rz = mix(rz, 0.62 + idle * Math.sin(t * 0.3) * 0.05 + ptr.x * 0.1 + spin.y * 0.5, e);

			rig.position.set(pose.x, pose.y, 0);
			rig.scale.setScalar(Math.max(0.0001, pose.s * mix(1, 0.6, e) * (1 + 0.03 * face * calm)));
			phone.rotation.set(rx, ry, rz);
			glow.material.color.lerp(glowTo, 1 - Math.exp(-dt * 3));

			env.t = t; env.now = now;
			env.rot = spin.y + ptr.x * 0.3 + idle * Math.sin(t * 0.6) * 0.12;
			compose(dt, env);

			renderer.render(scene, camera);

			// Cursor hint for mouse users: a hand over the screen, a grab over the body.
			if (fine && ptr.cx >= 0 && !down) {
				const h = hit(ptr.cx, ptr.cy), spot = h && h.screen ? hotAt(h.x, h.y) : null;
				if (h) lastOver = now;
				root.classList.toggle('over-screen', !!spot);
				root.classList.toggle('over-phone', !!(h && !spot));
			}

			// The hint next to the phone says what the current screen lets you do.
			if (cur && curE) {
				const app = UI.apps[curE.app];
				const kind = app.hints === false ? (app.hold ? 'hold' : 'none') : (curE.hots.length ? 'tap' : 'none');
				if (hintFor !== cur || cur.dataset.hint !== kind) { cur.dataset.hint = kind; hintFor = cur; }
			}
		}

		return { update };
	}

	/* ------------------------------------------------- motion and pointer */

	// Smooth wheel scrolling on desktop; touch keeps the native scroll.
	let lenis = null;
	if (window.Lenis && fine && !reduce) {
		lenis = new Lenis({ lerp: 0.12 });
		if (window.gsap && window.ScrollTrigger) {
			lenis.on('scroll', ScrollTrigger.update);
			gsap.ticker.add(time => lenis.raf(time * 1000));
			gsap.ticker.lagSmoothing(0);
		} else {
			const loop = time => { lenis.raf(time); requestAnimationFrame(loop); };
			requestAnimationFrame(loop);
		}
	}

	// The name enters one letter at a time.
	const display = $('.display');
	if (display && !reduce) {
		const lines = $$('span', display);
		display.setAttribute('aria-label', lines.map(l => l.textContent).join(' '));
		let i = 0;
		lines.forEach(line => {
			const txt = line.textContent;
			line.textContent = ''; line.setAttribute('aria-hidden', 'true');
			Array.from(txt).forEach(ch => { const el = document.createElement('i'); el.textContent = ch; el.style.setProperty('--i', i++); line.appendChild(el); });
		});
		display.classList.add('split');
	}

	// The closing name always fits the width of the page, on two lines, so it reads in full.
	const mega = $('.mega');
	if (mega) {
		const megaLines = $$('span', mega);
		const fit = () => {
			mega.style.fontSize = '100px';
			const widest = Math.max.apply(null, megaLines.map(l => l.getBoundingClientRect().width));
			// the room between the side paddings, not the whole box: otherwise the last letter is cut
			const cs = getComputedStyle(mega);
			const room = mega.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - 4;
			if (widest > 0 && room > 0) mega.style.fontSize = (100 * room / widest).toFixed(2) + 'px';
		};
		fit();
		window.addEventListener('resize', fit);
		// once the real font is in, fit again and let the scroll animations measure the new height
		if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fit(); if (window.ScrollTrigger) ScrollTrigger.refresh(); });
	}

	const mouse = { x: -1, y: -1, moved: false };
	const peek = document.createElement('div'), pk = { x: 0, y: 0, seen: false };
	if (fine) {
		window.addEventListener('pointermove', ev => {
			if (ev.pointerType !== 'mouse') return;
			mouse.x = ev.clientX; mouse.y = ev.clientY; mouse.moved = true;
		}, { passive: true });

		// A photo of the event follows the pointer over its row.
		peek.className = 'peek'; peek.setAttribute('aria-hidden', 'true'); peek.innerHTML = '<img alt="">';
		document.body.appendChild(peek);
		$$('[data-peek]').forEach(li => {
			li.addEventListener('pointerenter', () => {
				peek.firstChild.src = li.dataset.peek;
				peek.classList.toggle('wide', li.hasAttribute('data-peek-wide'));
				if (!pk.seen) { pk.seen = true; pk.x = mouse.x + 28; pk.y = mouse.y - peek.offsetHeight / 2; }
				peek.classList.add('on');
			});
			li.addEventListener('pointerleave', () => peek.classList.remove('on'));
		});
	}
	if (fine && !reduce) {
		// Cards lean towards the pointer and catch a glare; buttons pull slightly.
		$$('.card, .tiles a').forEach(el => {
			el.addEventListener('pointermove', ev => {
				const r = el.getBoundingClientRect(), px = (ev.clientX - r.left) / r.width, py = (ev.clientY - r.top) / r.height;
				el.style.setProperty('--ry', ((px - 0.5) * 10).toFixed(2) + 'deg');
				el.style.setProperty('--rx', ((0.5 - py) * 8).toFixed(2) + 'deg');
				el.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
				el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
			});
			el.addEventListener('pointerleave', () => { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); });
		});
		$$('.btn').forEach(el => {
			el.addEventListener('pointermove', ev => {
				const r = el.getBoundingClientRect();
				el.style.setProperty('--bx', ((ev.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + 'px');
				el.style.setProperty('--by', ((ev.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px');
			});
			el.addEventListener('pointerleave', () => { el.style.setProperty('--bx', '0px'); el.style.setProperty('--by', '0px'); });
		});
	}

	const heroCopy = $('.hero-copy'), citiesEl = $('.cities');
	let fxY = window.scrollY, fxVel = 0;
	function updateMotion(dt) {
		const y = window.scrollY, vh = window.innerHeight;
		fxVel += ((y - fxY) / Math.max(dt, 0.001) - fxVel) * (1 - Math.exp(-dt * 8));
		fxY = y;
		if (mouse.moved) {
			mouse.moved = false;
			root.style.setProperty('--mx', mouse.x + 'px');
			root.style.setProperty('--my', mouse.y + 'px');
		}
		if (pk.seen) {
			// beside the pointer, centred on it, and kept inside the window (left of the pointer when the right side has no room)
			const pw = peek.offsetWidth, ph = peek.offsetHeight;
			const k = 1 - Math.exp(-dt * 10), tx = mouse.x + 28 + pw > window.innerWidth - 12 ? mouse.x - 28 - pw : mouse.x + 28;
			const ty = clamp(mouse.y - ph / 2, 72, Math.max(72, window.innerHeight - ph - 12));
			pk.x += (tx - pk.x) * k; pk.y += (ty - pk.y) * k;
			peek.style.transform = 'translate3d(' + pk.x.toFixed(1) + 'px,' + pk.y.toFixed(1) + 'px,0) rotate(' + clamp((tx - pk.x) * 0.08, -8, 8).toFixed(2) + 'deg)';
		}
		if (reduce) return;
		if (heroCopy && y < vh * 1.3) {
			heroCopy.style.transform = 'translate3d(0,' + (y * -0.16).toFixed(1) + 'px,0)';
			heroCopy.style.opacity = clamp(1 - y / (vh * 0.8)).toFixed(3);
		}
		if (citiesEl) citiesEl.style.transform = 'skewX(' + clamp(-fxVel * 0.004, -9, 9).toFixed(2) + 'deg)';
	}

	/* --------------------------------------------------------------- loop */

	let last = performance.now();
	function frame(now) {
		const dt = Math.min(0.1, (now - last) / 1000);
		last = now;
		updateSteps();
		updateMotion(dt);
		if (hasPin || layerHover >= 0) setLayer(stackState().layer);
		else if (layerCur >= 0) setLayer(-1);
		if (gl) gl.update(dt, now / 1000);
		requestAnimationFrame(frame);
	}
	requestAnimationFrame(frame);

})();
